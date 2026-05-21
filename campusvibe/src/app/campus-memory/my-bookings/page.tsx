"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface Booking {
  id: string
  package_type: string
  event_type: string
  event_date: string
  total_price: number
  status: string
  payment_status: string
  created_at: string
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/campus-memory")
        const data = await res.json()

        if (!res.ok) throw new Error(data.error)

        setBookings(data.bookings || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 border-green-200 text-green-700"
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-700"
      case "completed":
        return "bg-blue-50 border-blue-200 text-blue-700"
      default:
        return "bg-gray-50 border-gray-200 text-gray-700"
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="text-success" size={20} />
      case "partial":
        return <Clock className="text-brand" size={20} />
      default:
        return <AlertCircle className="text-danger" size={20} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECECEC] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading font-black text-dark text-3xl mb-8">My Bookings</h1>
          <div className="text-center py-12">
            <div className="text-muted font-body">Loading your bookings...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading font-black text-dark text-3xl">My Bookings</h1>
          <p className="text-muted font-body text-sm mt-2">Track and manage your campus memory bookings</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <div className="font-section font-bold text-red-700 text-sm">Error</div>
              <p className="text-red-600 text-xs mt-1 font-body">{error}</p>
            </div>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <h2 className="font-section font-bold text-dark text-lg mb-2">No Bookings Yet</h2>
            <p className="text-muted font-body text-sm mb-6">Start by creating a new campus memory booking</p>
            <Link
              href="/campus-memory/book"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg font-section font-bold text-sm hover:bg-brand-dark transition-colors"
            >
              Create Booking
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className={`px-6 py-4 border-b ${getStatusColor(booking.status)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-section font-bold text-sm capitalize">{booking.package_type} Package</div>
                      <div className="text-xs mt-1 opacity-75 capitalize">{booking.event_type}</div>
                    </div>
                    <div className="px-3 py-1 bg-white/50 rounded-full">
                      <span className="text-xs font-section font-bold capitalize">{booking.status}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="text-brand flex-shrink-0" size={18} />
                    <div>
                      <div className="text-muted text-xs font-body">Event Date</div>
                      <div className="text-dark font-section font-semibold text-sm">
                        {new Date(booking.event_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-brand flex-shrink-0" size={18} />
                    <div>
                      <div className="text-muted text-xs font-body">Total Amount</div>
                      <div className="text-dark font-heading font-black text-lg">
                        {booking.total_price.toLocaleString()} TSH
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                    {getPaymentStatusIcon(booking.payment_status)}
                    <div>
                      <div className="text-muted text-xs font-body">Payment Status</div>
                      <div className="text-dark font-section font-semibold text-sm capitalize">
                        {booking.payment_status}
                      </div>
                    </div>
                  </div>

                  {/* Booking Date */}
                  <div className="text-muted text-xs font-body pt-2">
                    Booked on {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                  {booking.payment_status !== "paid" && (
                    <Link
                      href={`/campus-memory/checkout?booking=${booking.id}`}
                      className="flex-1 px-4 py-2 bg-brand text-white rounded-lg font-section font-bold text-xs hover:bg-brand-dark transition-colors text-center"
                    >
                      Complete Payment
                    </Link>
                  )}
                  <Link
                    href={`/campus-memory/booking/${booking.id}`}
                    className="flex-1 px-4 py-2 bg-gray-100 text-dark rounded-lg font-section font-bold text-xs hover:bg-gray-200 transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Booking Button */}
        <div className="mt-12 text-center">
          <Link
            href="/campus-memory/book"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg font-section font-bold hover:shadow-lg transition-shadow"
          >
            Create New Booking
          </Link>
        </div>
      </div>
    </div>
  )
}
