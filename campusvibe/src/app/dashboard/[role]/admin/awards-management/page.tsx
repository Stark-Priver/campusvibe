"use client"

import { useState, useEffect } from "react"
import { Trophy, Users, Vote, TrendingUp } from "lucide-react"
import Link from "next/link"
import AdminShell from "../AdminShell"

interface AwardsStats {
  totalAwards: number
  activeAwards: number
  totalVotes: number
  totalNominees: number
}

interface Award {
  id: string
  name: string
  description: string
  votes: number
  nominees: number
  status: string
}

type Props = { params: Promise<{ role: string }> }

export default function AwardsAdminPage({ params: paramsPromise }: Props) {
  const [params, setParams] = useState<{ role: string } | null>(null)
  const [stats, setStats] = useState<AwardsStats | null>(null)
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paramsPromise.then(setParams)
  }, [paramsPromise])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/awards")
        const data = await res.json()
        setStats(data.stats)
        setAwards(data.awards || [])
      } catch (error) {
        console.error("Failed to load awards data:", error)
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
          <h1 className="font-heading font-black text-2xl text-dark">Awards & Voting System</h1>
          <p className="text-muted text-sm mt-1">Manage awards, nominees, and voting campaigns</p>
        </div>
        <Link
          href={`/dashboard/${params.role}/admin/awards-management/create`}
          className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-section font-bold hover:bg-brand-dark transition"
        >
          Create Award
        </Link>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Total Awards</p>
            <Trophy size={16} className="text-brand" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{stats?.totalAwards || 0}</p>
          <p className="text-xs text-muted mt-2">All awards</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Active Awards</p>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{stats?.activeAwards || 0}</p>
          <p className="text-xs text-muted mt-2">Currently running</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Total Votes</p>
            <Vote size={16} className="text-blue-500" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{(stats?.totalVotes || 0).toLocaleString()}</p>
          <p className="text-xs text-muted mt-2">Cast votes</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs font-section font-bold uppercase">Nominees</p>
            <Users size={16} className="text-violet-500" />
          </div>
          <p className="font-heading font-black text-2xl text-dark">{stats?.totalNominees || 0}</p>
          <p className="text-xs text-muted mt-2">Total nominees</p>
        </div>
      </div>

      {/* Awards List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="font-section font-bold text-dark">All Awards</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Award Name</th>
                <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Nominees</th>
                <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Votes</th>
                <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-section font-bold text-dark uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {awards.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">
                    No awards created yet
                  </td>
                </tr>
              ) : (
                awards.map(award => (
                  <tr key={award.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-body font-bold text-dark">{award.name}</p>
                        <p className="text-xs text-muted mt-1">{award.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm font-bold text-dark">{award.nominees}</td>
                    <td className="px-6 py-4 font-body text-sm font-bold text-dark">{award.votes.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          award.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {award.status.charAt(0).toUpperCase() + award.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/${params.role}/admin/awards-management/${award.id}`}
                        className="text-brand hover:text-brand-dark text-sm font-bold transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <AdminShell role={params.role} section="awards" user={{ full_name: "Admin", email: "admin@campusvibe.tz" }}>
      {content}
    </AdminShell>
  )
}
