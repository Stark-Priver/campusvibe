"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import AdminShell from "../../AdminShell"

type Props = { params: Promise<{ role: string; awardId: string }> }

export default function AwardDetailPage({ params: paramsPromise }: Props) {
  const router = useRouter()
  const [params, setParams] = useState<{ role: string; awardId: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general",
    status: "active",
    start_date: "",
    end_date: "",
    rules: "",
  })

  useEffect(() => {
    paramsPromise.then(setParams)
  }, [paramsPromise])

  useEffect(() => {
    if (!params) return

    const fetchAward = async () => {
      try {
        const res = await fetch(`/api/admin/awards/${params.awardId}`)
        if (!res.ok) {
          router.push(`/dashboard/${params.role}/admin/awards-management`)
          return
        }
        const data = await res.json()
        setFormData({
          name: data.award.name || "",
          description: data.award.description || "",
          category: data.award.category || "general",
          status: data.award.status || "active",
          start_date: data.award.start_date ? new Date(data.award.start_date).toISOString().slice(0, 16) : "",
          end_date: data.award.end_date ? new Date(data.award.end_date).toISOString().slice(0, 16) : "",
          rules: data.award.rules || "",
        })
      } catch (error) {
        console.error("Error fetching award:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAward()
  }, [params, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/awards/${params?.awardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to update award")
      }

      setEditing(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating award:", error)
      alert("Failed to update award. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this award?")) return

    try {
      const res = await fetch(`/api/admin/awards/${params?.awardId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete award")
      }

      router.push(`/dashboard/${params?.role}/admin/awards-management`)
    } catch (error) {
      console.error("Error deleting award:", error)
      alert("Failed to delete award. Please try again.")
    }
  }

  if (!params || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  const content = (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${params.role}/admin/awards-management`}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={20} className="text-dark" />
          </Link>
          <div>
            <h1 className="font-heading font-black text-2xl text-dark">{formData.name || "Award"}</h1>
            <p className="text-muted text-sm mt-1">Manage award details and settings</p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-brand text-white font-section font-bold rounded-lg hover:bg-brand-dark transition"
          >
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="font-section font-bold text-dark mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-section font-bold text-dark mb-2">Award Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Award name"
                />
              </div>

              <div>
                <label className="block text-sm font-section font-bold text-dark mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Award description"
                />
              </div>

              <div>
                <label className="block text-sm font-section font-bold text-dark mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="leadership">Leadership</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts & Culture</option>
                  <option value="service">Community Service</option>
                  <option value="innovation">Innovation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="font-section font-bold text-dark mb-4">Voting Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-section font-bold text-dark mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-section font-bold text-dark mb-2">End Date</label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Rules */}
          <div>
            <h2 className="font-section font-bold text-dark mb-4">Eligibility & Rules</h2>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Eligibility criteria and voting rules"
            />
          </div>

          {/* Status */}
          <div>
            <h2 className="font-section font-bold text-dark mb-4">Status</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm font-section text-dark">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm font-section text-dark">Inactive</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-dark font-section font-bold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-brand text-white font-section font-bold rounded-lg hover:bg-brand-dark transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
          <div>
            <p className="text-muted text-sm font-section font-bold mb-1">DESCRIPTION</p>
            <p className="text-dark">{formData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted text-sm font-section font-bold mb-1">CATEGORY</p>
              <p className="text-dark capitalize">{formData.category}</p>
            </div>
            <div>
              <p className="text-muted text-sm font-section font-bold mb-1">STATUS</p>
              <p className={`text-sm font-bold ${formData.status === "active" ? "text-emerald-600" : "text-gray-500"}`}>
                {formData.status === "active" ? "✓ Active" : "Inactive"}
              </p>
            </div>
          </div>

          {formData.start_date && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted text-sm font-section font-bold mb-1">START DATE</p>
                <p className="text-dark">{new Date(formData.start_date).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted text-sm font-section font-bold mb-1">END DATE</p>
                <p className="text-dark">{new Date(formData.end_date).toLocaleString()}</p>
              </div>
            </div>
          )}

          {formData.rules && (
            <div>
              <p className="text-muted text-sm font-section font-bold mb-1">ELIGIBILITY & RULES</p>
              <p className="text-dark whitespace-pre-wrap">{formData.rules}</p>
            </div>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-section font-bold text-sm"
          >
            <Trash2 size={16} />
            Delete Award
          </button>
        </div>
      )}
    </div>
  )

  return (
    <AdminShell role={params.role} section="awards" user={{ full_name: "Admin", email: "admin@campusvibe.tz" }}>
      {content}
    </AdminShell>
  )
}
