"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdminShell from "../../AdminShell"

type Props = { params: Promise<{ role: string }> }

export default function CreateAwardPage({ params: paramsPromise }: Props) {
  const router = useRouter()
  const [params, setParams] = useState<{ role: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general",
    status: "active",
    start_date: "",
    end_date: "",
    rules: "",
  })

  useState(() => {
    paramsPromise.then(setParams)
  }, [paramsPromise])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/admin/awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to create award")
      }

      const data = await res.json()
      router.push(`/dashboard/${params?.role}/admin/awards-management`)
    } catch (error) {
      console.error("Error creating award:", error)
      alert("Failed to create award. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!params) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  const content = (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/${params.role}/admin/awards-management`}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} className="text-dark" />
        </Link>
        <div>
          <h1 className="font-heading font-black text-2xl text-dark">Create New Award</h1>
          <p className="text-muted text-sm mt-1">Add a new award to your system</p>
        </div>
      </div>

      {/* Form */}
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
                placeholder="e.g., Best Campus Leader"
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
                placeholder="Describe what this award recognizes..."
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
                required
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
                required
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
            placeholder="Enter eligibility criteria and voting rules..."
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
          <Link
            href={`/dashboard/${params.role}/admin/awards-management`}
            className="flex-1 px-4 py-2 border border-gray-300 text-dark font-section font-bold rounded-lg hover:bg-gray-50 transition text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-brand text-white font-section font-bold rounded-lg hover:bg-brand-dark transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Award"}
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <AdminShell role={params.role} section="awards" user={{ full_name: "Admin", email: "admin@campusvibe.tz" }}>
      {content}
    </AdminShell>
  )
}
