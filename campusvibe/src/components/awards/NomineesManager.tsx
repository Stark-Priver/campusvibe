"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus, Upload } from "lucide-react"

interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  display_order: number
}

interface Nominee {
  id: string
  full_name: string
  bio?: string
  image_url?: string
  achievement?: string
  university?: string
  email?: string
  phone?: string
  votes_count: number
  created_at: string
}

interface NomineesManagerProps {
  eventId: string
  eventStatus: string
}

export function NomineesManager({ eventId, eventStatus }: NomineesManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isAddingNominee, setIsAddingNominee] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [eventId])

  useEffect(() => {
    if (selectedCategory) {
      fetchNominees()
    }
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/awards/events/${eventId}/categories`)
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id)
      }
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to fetch categories",
        type: "error",
      })
    }
  }

  const fetchNominees = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/awards/events/${eventId}/nominees?categoryId=${selectedCategory}`
      )
      if (!response.ok) throw new Error("Failed to fetch nominees")
      const data = await response.json()
      setNominees(data)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to fetch nominees",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (formData: FormData) => {
    try {
      const payload = {
        name: formData.get("name"),
        description: formData.get("description"),
        icon: formData.get("icon"),
        display_order: 0,
      }

      const response = await fetch(`/api/awards/events/${eventId}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to create category")
      const category = await response.json()

      setCategories([...categories, category])
      setToast({ message: "Category added successfully!", type: "success" })
      setIsAddingCategory(false)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to create category",
        type: "error",
      })
    }
  }

  const handleAddNominee = async (formData: FormData) => {
    try {
      const payload = {
        category_id: selectedCategory,
        full_name: formData.get("full_name"),
        bio: formData.get("bio"),
        image_url: formData.get("image_url"),
        achievement: formData.get("achievement"),
        university: formData.get("university"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      }

      const response = await fetch(`/api/awards/events/${eventId}/nominees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to add nominee")
      const nominee = await response.json()

      setNominees([...nominees, nominee])
      setToast({ message: "Nominee added successfully!", type: "success" })
      setIsAddingNominee(false)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to add nominee",
        type: "error",
      })
    }
  }

  const handleDeleteNominee = async (nomineeId: string) => {
    if (!confirm("Are you sure you want to delete this nominee?")) return

    try {
      const response = await fetch(`/api/awards/events/${eventId}/nominees/${nomineeId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete nominee")

      setNominees(nominees.filter((n) => n.id !== nomineeId))
      setToast({ message: "Nominee deleted successfully!", type: "success" })
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to delete nominee",
        type: "error",
      })
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Nominees</h2>
        <div className="flex gap-2">
          {eventStatus === "draft" && (
            <button
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {isAddingCategory ? "Cancel" : "Add Category"}
            </button>
          )}
          <button
            onClick={() => setIsAddingNominee(!isAddingNominee)}
            disabled={!selectedCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isAddingNominee ? "Cancel" : "Add Nominee"}
          </button>
        </div>
      </div>

      {isAddingCategory && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Add Award Category</h3>
          <form action={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category Name*</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Best Leader, Most Innovative"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Describe this award category..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Icon (Emoji or URL)</label>
              <input
                type="text"
                name="icon"
                placeholder="e.g., 🏆 or https://..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Category
            </button>
          </form>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Select Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {isAddingNominee && selectedCategory && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Add Nominee</h3>
          <form action={handleAddNominee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name*</label>
              <input
                type="text"
                name="full_name"
                placeholder="Nominee's full name"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                placeholder="Brief biography of the nominee..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Achievement/Why they deserve this award</label>
              <textarea
                name="achievement"
                placeholder="What makes them deserving of this award?"
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Photo URL</label>
              <input
                type="url"
                name="image_url"
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">University</label>
                <input
                  type="text"
                  name="university"
                  placeholder="e.g., University of Dar es Salaam"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="nominee@example.com"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="+255..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Nominee
            </button>
          </form>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">
          {categories.find((c) => c.id === selectedCategory)?.name || "Nominees"}
        </h3>
        {loading ? (
          <div className="text-center py-8">Loading nominees...</div>
        ) : nominees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No nominees for this category yet
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {nominees.map((nominee) => (
              <div
                key={nominee.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  {nominee.image_url && (
                    <img
                      src={nominee.image_url}
                      alt={nominee.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{nominee.full_name}</h4>
                    <p className="text-sm text-gray-600">{nominee.bio}</p>
                    {nominee.achievement && (
                      <p className="text-sm text-gray-500 mt-1">
                        <strong>Achievement:</strong> {nominee.achievement}
                      </p>
                    )}
                    {nominee.university && (
                      <p className="text-xs text-gray-500">📍 {nominee.university}</p>
                    )}
                    <p className="mt-2 text-sm">
                      <strong className="text-blue-600">{nominee.votes_count}</strong> votes
                    </p>
                  </div>
                  {eventStatus === "draft" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteNominee(nominee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete nominee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
