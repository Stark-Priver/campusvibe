"use client"

import { useEffect, useState } from "react"
import { BarChart3, DollarSign, Users, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"

interface AdminStats {
  totalBookings: number
  totalRevenue: number
  confirmedBookings: number
  pendingPayments: number
  completedPayments: number
}

interface Booking {
  id: string
  package_type: string
  event_type: string
  total_price: number
  status: string
  payment_status: string
  profiles: {
    full_name: string
    email: string
    phone: string
    university: string
  }
  created_at: string
}

interface Payment {
  id: string
  amount: number
  status: string
  payment_method: string
  mpesa_reference: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "payments">("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/campus-memory")
        const data = await res.json()

        if (!res.ok) throw new Error(data.error)

        setStats(data.stats)
        setBookings(data.bookings || [])
        setPayments(data.payments || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-brand border-r-transparent rounded-full mb-4"></div>
          <p className="text-muted font-body">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ECECEC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand to-brand-dark py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading font-black text-white text-3xl">Campus Memory Admin</h1>
          <p className="text-white/80 text-sm mt-2">Manage bookings and payments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <span className="text-red-700 text-sm font-body">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          {["overview", "bookings", "payments"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 font-section font-bold text-sm capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-brand text-brand"
                  : "border-transparent text-muted hover:text-dark"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: BarChart3, label: "Total Bookings", value: stats.totalBookings, color: "brand" },
              { icon: DollarSign, label: "Total Revenue", value: `${stats.totalRevenue.toLocaleString()} TSH`, color: "success" },
              { icon: CheckCircle2, label: "Confirmed", value: stats.confirmedBookings, color: "brand" },
              { icon: AlertCircle, label: "Pending Payments", value: stats.pendingPayments, color: "danger" },
              { icon: TrendingUp, label: "Completed Payments", value: stats.completedPayments, color: "success" },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-muted text-xs font-body mb-2">{stat.label}</div>
                      <div className={`font-heading font-black text-2xl ${
                        stat.color === "brand" ? "text-brand" :
                        stat.color === "success" ? "text-success" :
                        "text-danger"
                      }`}>
                        {stat.value}
                      </div>
                    </div>
                    <Icon className={`flex-shrink-0 ${
                      stat.color === "brand" ? "text-brand" :
                      stat.color === "success" ? "text-success" :
                      "text-danger"
                    }`} size={24} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <div className="font-section font-bold text-dark">{booking.profiles?.full_name}</div>
                          <div className="text-muted text-xs font-body">{booking.profiles?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="capitalize font-body text-dark">{booking.package_type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-section font-bold text-dark">
                          {booking.total_price.toLocaleString()} TSH
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-section font-bold capitalize ${
                          booking.status === "confirmed"
                            ? "bg-success/10 text-success"
                            : booking.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-gray-100 text-muted"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-section font-bold capitalize ${
                          booking.payment_status === "paid"
                            ? "bg-success/10 text-success"
                            : booking.payment_status === "partial"
                            ? "bg-brand/10 text-brand"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {booking.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted font-body">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-dark">{payment.mpesa_reference}</td>
                      <td className="px-6 py-4 text-sm font-section font-bold text-dark">
                        {payment.amount.toLocaleString()} TSH
                      </td>
                      <td className="px-6 py-4 text-sm capitalize font-body text-dark">{payment.payment_method}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-section font-bold capitalize ${
                          payment.status === "completed"
                            ? "bg-success/10 text-success"
                            : payment.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted font-body">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
