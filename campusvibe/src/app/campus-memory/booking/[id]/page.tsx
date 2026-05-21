"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Calendar, DollarSign, CheckCircle2, AlertCircle, Loader } from "lucide-react"
import Link from "next/link"

interface BookingDetail {
  id: string
  package_type: string
  event_type: string
  event_date: string
  additional_notes: string
  total_price: number
  status: string
  payment_status: string
  payment_plan: string
  created_at: string
}

interface Installment {
  id: string
  amount: number
  installment_number: number
  status: string
  due_date: string
}

export default function BookingDetailPage() {
  const params = useParams()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/campus-memory?id=${bookingId}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.error)

        if (data.bookings?.length) {
          setBooking(data.bookings[0])

          // Fetch installments if applicable
          if (data.bookings[0].payment_plan === "installment") {
            const instRes = await fetch(`/api/campus-memory/installments?booking=${bookingId}`)
            const instData = await instRes.json()
            setInstallments(instData.installments || [])
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking")
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) fetchBooking()
  }, [bookingId])

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

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <AlertCircle className="text-danger mx-auto mb-4" size={48} />
          <h1 className="font-heading font-black text-dark text-xl mb-2 text-center">Error</h1>
          <p className="text-muted font-body text-sm text-center mb-6">{error || "Booking not found"}</p>
          <Link href="/campus-memory/my-bookings" className="block text-center px-4 py-2 bg-brand text-white rounded-lg font-section font-bold text-sm hover:bg-brand-dark">
            Back to Bookings
          </Link>
        </div>
      </div>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success"
      case "pending":
        return "bg-yellow-50 text-yellow-700"
      case "completed":
        return "bg-blue-50 text-blue-700"
      default:
        return "bg-gray-100 text-muted"
    }
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/campus-memory/my-bookings" className="text-brand font-section font-bold text-sm hover:underline mb-4 inline-block">
            ← Back to Bookings
          </Link>
          <h1 className="font-heading font-black text-dark text-3xl">Booking Details</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-brand to-brand-dark p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-section font-bold text-white capitalize text-xl">{booking.package_type} Package</h2>
                <p className="text-white/80 text-sm mt-2 capitalize">{booking.event_type}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg ${getStatusBadgeColor(booking.status)}`}>
                <span className="font-section font-bold text-sm capitalize">{booking.status}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Booking Information */}
            <div>
              <h3 className="font-section font-bold text-dark text-lg mb-4">Booking Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <Calendar className="text-brand flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="text-muted text-xs font-body">Event Date</div>
                    <div className="text-dark font-section font-bold text-sm mt-1">
                      {new Date(booking.event_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <DollarSign className="text-brand flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="text-muted text-xs font-body">Total Amount</div>
                    <div className="text-dark font-heading font-black text-lg mt-1">
                      {booking.total_price.toLocaleString()} TSH
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="text-brand flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="text-muted text-xs font-body">Payment Status</div>
                    <div className="text-dark font-section font-bold text-sm mt-1 capitalize">{booking.payment_status}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Calendar className="text-brand flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="text-muted text-xs font-body">Booking Date</div>
                    <div className="text-dark font-section font-bold text-sm mt-1">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {booking.additional_notes && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-section font-bold text-dark text-lg mb-4">Special Requests</h3>
                <p className="text-muted font-body text-sm bg-gray-50 p-4 rounded-lg">{booking.additional_notes}</p>
              </div>
            )}

            {/* Installments */}
            {booking.payment_plan === "installment" && installments.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-section font-bold text-dark text-lg mb-4">Payment Installments</h3>
                <div className="space-y-3">
                  {installments.map(inst => (
                    <div key={inst.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-brand/50">
                      <div>
                        <div className="font-section font-bold text-dark text-sm">
                          Installment {inst.installment_number}
                        </div>
                        <div className="text-muted text-xs font-body mt-1">
                          Due: {new Date(inst.due_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-heading font-black text-brand text-lg">
                          {inst.amount.toLocaleString()} TSH
                        </div>
                        <div className={`text-xs font-section font-bold mt-1 capitalize ${
                          inst.status === "paid" ? "text-success" : "text-muted"
                        }`}>
                          {inst.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {booking.payment_status !== "paid" && (
              <div className="border-t border-gray-200 pt-8">
                <Link
                  href={`/campus-memory/checkout?booking=${booking.id}`}
                  className="block w-full px-6 py-3 bg-brand text-white rounded-lg font-section font-bold text-sm hover:bg-brand-dark transition-colors text-center"
                >
                  Complete Payment
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
