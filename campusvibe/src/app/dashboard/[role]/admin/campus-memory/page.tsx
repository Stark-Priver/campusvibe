"use client"

import { useState, useEffect } from "react"
import { DollarSign, Calendar, User, Phone, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import AdminShell from "../AdminShell"

interface CampusMemoryStats {
  totalBookings: number
  totalRevenue: number
  confirmedBookings: number
  pendingPayments: number
  completedPayments: number
}

interface Booking {
  id: string
  clientName: string
  package_type: string
  amount: number
  status: string
  payment_status: string
  created_at: string
}

interface Payment {
  id: string
  reference: string
  amount: number
  method: string
  status: string
  created_at: string
}

type Props = { params: Promise<{ role: string }> }

export default function CampusMemoryAdminPage({ params: paramsPromise }: Props) {
  const [params, setParams] = useState<{ role: string } | null>(null)
  const [stats, setStats] = useState<CampusMemoryStats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tab, setTab] = useState<"overview" | "bookings" | "payments">("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paramsPromise.then(setParams)
  }, [paramsPromise])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/campus-memory")
        const data = await res.json()
        setStats(data.stats)
        setBookings(data.bookings || [])
        setPayments(data.payments || [])
      } catch (error) {
        console.error("Failed to load Campus Memory data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!params || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl text-dark">Campus Memory Management</h1>
          <p className="text-muted text-sm mt-1">Event booking system & payment tracking</p>
        </div>
        <Link
          href={`/dashboard/${params.role}/admin/campus-memory/settings`}
          className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-section font-bold hover:bg-brand-dark transition"
        >
          Settings
        </Link>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Total Bookings</p>
            <Calendar size={16} className="text-brand" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{stats?.totalBookings || 0}</p>
          <p className="text-xs text-muted mt-2">All time</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Total Revenue</p>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{(stats?.totalRevenue || 0).toLocaleString()}</p>
          <p className="text-xs text-muted mt-2">TSH</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Confirmed</p>
            <TrendingUp size={16} className="text-blue-500" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{stats?.confirmedBookings || 0}</p>
          <p className="text-xs text-muted mt-2">Bookings confirmed</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Pending Payment</p>
            <AlertCircle size={16} className="text-amber-500" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{stats?.pendingPayments || 0}</p>
          <p className="text-xs text-muted mt-2">Awaiting payment</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Completed</p>
            <DollarSign size={16} className="text-emerald-600" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{stats?.completedPayments || 0}</p>
          <p className="text-xs text-muted mt-2">Payments done</p>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          {["overview", "bookings", "payments"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-3 font-section font-bold text-sm transition-colors border-b-2 ${
                tab === t
                  ? "border-brand text-dark"
                  : "border-transparent text-muted hover:text-dark"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted">
                        No bookings yet
                      </td>
                    </tr>
                  ) : (
                    bookings.map(booking => (
                      <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-body text-sm text-dark">{booking.clientName}</td>
                        <td className="px-6 py-4 font-body text-sm text-dark capitalize">{booking.package_type}</td>
                        <td className="px-6 py-4 font-body text-sm font-bold text-dark">{booking.amount.toLocaleString()} TSH</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              booking.payment_status === "paid"
                                ? "bg-green-100 text-green-700"
                                : booking.payment_status === "partial"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted">{new Date(booking.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {tab === "payments" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted">
                        No payments yet
                      </td>
                    </tr>
                  ) : (
                    payments.map(payment => (
                      <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-mono text-sm text-dark">{payment.reference}</td>
                        <td className="px-6 py-4 font-body text-sm font-bold text-dark">{payment.amount.toLocaleString()} TSH</td>
                        <td className="px-6 py-4 font-body text-sm text-dark uppercase">{payment.method}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              payment.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted">{new Date(payment.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <AdminShell role={params.role} section="campus-memory" user={{ full_name: "Admin", email: "admin@campusvibe.tz" }}>
      {content}
    </AdminShell>
  )
}
