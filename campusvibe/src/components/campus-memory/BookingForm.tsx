"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, FileText, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"

export default function CampusMemoryBookingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    package_type: searchParams.get("package") || "standard",
    event_type: "graduation",
    event_date: "",
    additional_notes: "",
    payment_plan: "full",
  })

  const packagePrices: Record<string, number> = {
    basic: 50000,
    standard: 80000,
    premium: 150000,
  }

  const eventTypes = [
    "Birthday Bash",
    "Squad Memories",
    "Graduation",
    "Welcome Freshers",
    "Campus Event",
    "Other",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/campus-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setSuccess("Booking created successfully! Proceeding to payment...")
      setTimeout(() => {
        router.push(`/campus-memory/checkout?booking=${data.booking.id}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed")
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = packagePrices[formData.package_type as keyof typeof packagePrices] || 0

  return (
    <div className="min-h-screen bg-[#ECECEC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand to-brand-dark p-8">
            <h1 className="font-heading font-black text-white text-2xl">Book Campus Memory Service</h1>
            <p className="text-white/80 text-sm mt-1">Fill in your booking details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Package Selection */}
              <div>
                <label className="font-section font-bold text-dark text-sm mb-3 block">Select Package</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(packagePrices).map(([type, price]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, package_type: type }))}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        formData.package_type === type
                          ? "border-brand bg-brand/5"
                          : "border-gray-200 hover:border-brand/50"
                      }`}
                    >
                      <div className="font-section font-bold text-dark capitalize">{type}</div>
                      <div className="text-brand font-heading font-black text-lg mt-1">{price.toLocaleString()}</div>
                      <div className="text-muted text-xs mt-1">TSH</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label htmlFor="event_type" className="font-section font-bold text-dark text-sm mb-3 block">
                  Type of Event
                </label>
                <select
                  id="event_type"
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-body text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type.toLowerCase().replace(" ", "-")}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Date */}
              <div>
                <label htmlFor="event_date" className="font-section font-bold text-dark text-sm mb-3 block flex items-center gap-2">
                  <Calendar size={16} /> Event Date
                </label>
                <input
                  id="event_date"
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-body text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="additional_notes" className="font-section font-bold text-dark text-sm mb-3 block flex items-center gap-2">
                  <FileText size={16} /> Special Requests
                </label>
                <textarea
                  id="additional_notes"
                  name="additional_notes"
                  value={formData.additional_notes}
                  onChange={handleChange}
                  placeholder="Any special requests or details..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-body text-sm focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Payment Plan */}
              <div>
                <label className="font-section font-bold text-dark text-sm mb-3 block flex items-center gap-2">
                  <DollarSign size={16} /> Payment Plan
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["full", "installment"].map(plan => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, payment_plan: plan }))}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        formData.payment_plan === plan
                          ? "border-brand bg-brand/5"
                          : "border-gray-200 hover:border-brand/50"
                      }`}
                    >
                      <div className="font-section font-bold text-dark capitalize">{plan === "full" ? "Full Payment" : "3 Installments"}</div>
                      {plan === "installment" && (
                        <div className="text-muted text-xs mt-2">{Math.ceil(totalPrice / 3).toLocaleString()} TSH × 3</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-brand/5 border border-brand/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted font-body text-sm">Total Amount:</span>
                  <span className="text-brand font-heading font-black text-xl">{totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-muted text-xs">
                  {formData.payment_plan === "installment"
                    ? `3 payments of ${Math.ceil(totalPrice / 3).toLocaleString()} TSH`
                    : "Full payment on checkout"}
                </p>
              </div>

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
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-2.5 bg-gray-100 text-dark rounded-lg font-section font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-2.5 bg-brand text-white rounded-lg font-section font-bold text-sm hover:bg-brand-dark transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
