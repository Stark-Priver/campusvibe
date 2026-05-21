"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Phone, AlertCircle, CheckCircle2, Loader } from "lucide-react"

interface Booking {
  id: string
  package_type: string
  event_date: string
  total_price: number
  payment_plan: string
}

interface Installment {
  id: string
  amount: number
  installment_number: number
  status: string
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("booking")

  const [booking, setBooking] = useState<Booking | null>(null)
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedInstallment, setSelectedInstallment] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")

  useEffect(() => {
    if (!bookingId) return

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/campus-memory?id=${bookingId}`)
        const data = await res.json()
        if (data.bookings?.length) {
          setBooking(data.bookings[0])
          if (data.bookings[0].payment_plan === "installment") {
            // Fetch installments
            const installRes = await fetch(`/api/campus-memory/installments?booking=${bookingId}`)
            const installData = await installRes.json()
            setInstallments(installData.installments || [])
          }
        }
      } catch (err) {
        setError("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking || !phoneNumber) {
      setError("Please enter phone number")
      return
    }

    setProcessing(true)
    setError("")

    try {
      const amount =
        booking.payment_plan === "installment" && selectedInstallment
          ? installments.find(i => i.id === selectedInstallment)?.amount || booking.total_price
          : booking.total_price

      const res = await fetch("/api/campus-memory/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: booking.id,
          amount,
          payment_method: "mpesa",
          phone_number: phoneNumber,
          installment_id: selectedInstallment || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setSuccess(
        `Payment successful! Transaction ID: ${data.transactionId}\nYour booking has been confirmed.`
      )
      setTimeout(() => {
        router.push("/campus-memory/my-bookings")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-brand mx-auto mb-4" size={32} />
          <p className="text-muted font-body">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h1 className="font-heading font-black text-dark text-xl mb-2">Booking Not Found</h1>
          <p className="text-muted font-body text-sm">Unable to load your booking.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand to-brand-dark p-8">
            <h1 className="font-heading font-black text-white text-2xl">Checkout</h1>
            <p className="text-white/80 text-sm mt-1">Complete your payment</p>
          </div>

          <div className="p-8">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-section font-bold text-dark text-sm mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted font-body">Package:</span>
                  <span className="text-dark font-section font-semibold capitalize">{booking.package_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-body">Event Date:</span>
                  <span className="text-dark font-section font-semibold">
                    {new Date(booking.event_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                  <span className="text-dark font-section font-bold">Total Amount:</span>
                  <span className="text-brand font-heading font-black text-lg">
                    {booking.total_price.toLocaleString()} TSH
                  </span>
                </div>
              </div>
            </div>

            {/* Installment Selection */}
            {booking.payment_plan === "installment" && installments.length > 0 && (
              <div className="mb-8">
                <h3 className="font-section font-bold text-dark text-sm mb-4">Select Installment</h3>
                <div className="space-y-3">
                  {installments.map(inst => (
                    <label key={inst.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-brand/50 cursor-pointer">
                      <input
                        type="radio"
                        name="installment"
                        value={inst.id}
                        checked={selectedInstallment === inst.id}
                        onChange={() => setSelectedInstallment(inst.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-section font-bold text-dark text-sm">
                          Installment {inst.installment_number}
                        </div>
                        <div className="text-muted text-xs mt-1">
                          {inst.amount.toLocaleString()} TSH
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-section font-bold ${
                        inst.status === "paid" ? "bg-success/10 text-success" : "bg-gray-100 text-muted"
                      }`}>
                        {inst.status === "paid" ? "Paid" : "Pending"}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Form */}
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="font-section font-bold text-dark text-sm mb-3 block flex items-center gap-2">
                  <Phone size={16} /> M-Pesa Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="255712345678"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-body text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <p className="text-muted text-xs mt-2 font-body">You&apos;ll receive a prompt on your phone to enter your M-Pesa PIN</p>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Phone className="text-brand flex-shrink-0" size={20} />
                  <div>
                    <div className="font-section font-bold text-dark text-sm">Payment via M-Pesa Lipa</div>
                    <div className="text-muted text-xs mt-1 font-body">
                      Account: <span className="text-dark font-semibold">353332037</span> (Campus Vibe Media)
                    </div>
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                  <span className="text-red-700 text-sm font-body">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                  <span className="text-green-700 text-sm font-body">{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || (booking.payment_plan === "installment" && !selectedInstallment)}
                className={`w-full px-6 py-3 bg-brand text-white rounded-lg font-section font-bold text-sm hover:bg-brand-dark transition-colors ${
                  processing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {processing ? "Processing Payment..." : `Pay ${booking.total_price.toLocaleString()} TSH`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
