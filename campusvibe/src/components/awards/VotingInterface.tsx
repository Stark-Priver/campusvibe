"use client"

import { useState, useEffect } from "react"
import { Heart, Filter, Award, MapPin, CheckCircle2, BarChart3 } from "lucide-react"
import Toast from "@/components/ui/Toast"

interface Nominee {
  id: string
  full_name: string
  bio?: string
  image_url?: string
  achievement?: string
  university?: string
  votes_count: number
}

interface Category {
  id: string
  name: string
  description?: string
  icon?: string
}

interface VotingInterfaceProps {
  eventId: string
  eventTitle: string
  eventStatus: string
}

export function VotingInterface({
  eventId,
  eventTitle,
  eventStatus,
}: VotingInterfaceProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [voted, setVoted] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [voting, setVoting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const isVotingOpen = eventStatus === "voting_open"

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

  const handleVote = async (nomineeId: string) => {
    if (!isVotingOpen) {
      setToast({
        message: "Voting is not currently open for this event",
        type: "error",
      })
      return
    }

    if (voted.has(nomineeId)) {
      setToast({
        message: "You have already voted for this nominee",
        type: "error",
      })
      return
    }

    try {
      setVoting(true)
      const response = await fetch("/api/awards/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          awards_event_id: eventId,
          nominee_id: nomineeId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit vote")
      }

      // Update local state
      setVoted(new Set([...voted, nomineeId]))
      setNominees(
        nominees.map((n) =>
          n.id === nomineeId ? { ...n, votes_count: n.votes_count + 1 } : n
        )
      )

      setToast({ message: "Vote submitted successfully!", type: "success" })
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to submit vote",
        type: "error",
      })
    } finally {
      setVoting(false)
    }
  }

  if (!isVotingOpen) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">
          <strong>Voting is not currently open</strong> for this awards event. Please check back later!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={36} />
          Cast Your Vote
        </h2>
        <p className="text-gray-600">Vote for your favorite nominees across different categories</p>
      </div>

      {/* Category Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-blue-600" />
          <label className="block text-lg font-semibold text-gray-800">Select Award Category</label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-lg text-center transition duration-200 ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
              title={cat.description}
            >
              <div className="text-3xl mb-2">
                {cat.icon === "trophy" && <Award size={32} />}
                {cat.icon === "star" && <Award size={32} className="text-yellow-500" />}
                {!cat.icon && <Award size={32} />}
              </div>
              <div className="text-sm font-semibold">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Nominees Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {categories.find((c) => c.id === selectedCategory)?.name || "Nominees"}
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading nominees...</p>
          </div>
        ) : nominees.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-500 text-lg">No nominees for this category</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {nominees.map((nominee) => (
              <div
                key={nominee.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105 duration-200"
              >
                {nominee.image_url && (
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    <img
                      src={nominee.image_url}
                      alt={nominee.full_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-5">
                  <h4 className="font-bold text-lg text-gray-900">{nominee.full_name}</h4>

                  {nominee.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{nominee.bio}</p>
                  )}

                  {nominee.achievement && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-blue-600">Why they deserve this:</strong>
                        <br />
                        {nominee.achievement}
                      </p>
                    </div>
                  )}

                  {nominee.university && (
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                      <MapPin size={14} />
                      {nominee.university}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{nominee.votes_count}</p>
                      <p className="text-xs text-gray-500">
                        {nominee.votes_count === 1 ? "vote" : "votes"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleVote(nominee.id)}
                      disabled={voting || voted.has(nominee.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition duration-200 ${
                        voted.has(nominee.id)
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                      } disabled:opacity-75`}
                      title={voted.has(nominee.id) ? "Already voted" : "Vote for this nominee"}
                    >
                      <Heart
                        size={18}
                        fill={voted.has(nominee.id) ? "currentColor" : "none"}
                      />
                      {voted.has(nominee.id) ? "Voted" : "Vote"}
                    </button>
                  </div>

                  {voted.has(nominee.id) && (
                    <div className="mt-2 text-xs text-red-600 font-medium text-center flex items-center justify-center gap-1">
                      <CheckCircle2 size={14} />
                      Your vote counts!
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
