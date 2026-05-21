"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, TrendingUp, BarChart3, Sparkles } from "lucide-react"
import Toast from "@/components/ui/Toast"

interface Nominee {
  id: string
  full_name: string
  image_url?: string
  bio?: string
  votes_count: number
  award_categories?: {
    id: string
    name: string
    icon?: string
  }
}

interface Category {
  id: string
  name: string
  icon?: string
}

interface AwardsLeaderboardProps {
  eventId: string
  eventTitle: string
}

export function AwardsLeaderboard({ eventId, eventTitle }: AwardsLeaderboardProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [eventId])

  useEffect(() => {
    if (selectedCategory) {
      fetchResults()
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

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/awards/events/${eventId}/results?categoryId=${selectedCategory}`
      )
      if (!response.ok) throw new Error("Failed to fetch results")
      const data = await response.json()
      setNominees(data.nominees || [])
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to fetch results",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="text-yellow-500 drop-shadow-lg" size={28} />
      case 1:
        return <Medal className="text-gray-400 drop-shadow-lg" size={28} />
      case 2:
        return <Medal className="text-orange-600 drop-shadow-lg" size={28} />
      default:
        return (
          <span className="text-xl font-bold text-gray-500 w-7 text-center">
            {position + 1}
          </span>
        )
    }
  }

  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500"
      case 1:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400"
      case 2:
        return "bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-600"
      default:
        return "bg-white border-l-4 border-gray-200 hover:bg-gray-50"
    }
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
          <Trophy className="text-yellow-500" size={36} />
          Live Results & Leaderboard
        </h2>
        <p className="text-gray-600">See who's winning in real-time</p>
      </div>

      {/* Category Filter */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-blue-600" />
          <label className="text-lg font-semibold text-gray-800">Filter by Category</label>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-medium transition duration-200 ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <span className="mr-2">{cat.icon || "🏆"}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={28} />
          {categories.find((c) => c.id === selectedCategory)?.name || "Leaderboard"}
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading results...</p>
          </div>
        ) : nominees.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <Trophy className="mx-auto text-gray-400 mb-3" size={40} />
            <p className="text-gray-500 text-lg">No votes yet in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {nominees.map((nominee, index) => {
              const position = index + 1
              const isTopThree = position <= 3

              return (
                <div
                  key={nominee.id}
                  className={`rounded-lg p-5 flex items-center gap-5 transition duration-200 ${getMedalColor(
                    index
                  )} ${
                    isTopThree ? "shadow-md hover:shadow-lg scale-100" : "hover:shadow-md"
                  }`}
                >
                  {/* Rank Icon */}
                  <div className="flex-shrink-0 w-10 flex items-center justify-center">
                    {getMedalIcon(index)}
                  </div>

                  {/* Nominee Image */}
                  {nominee.image_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={nominee.image_url}
                        alt={nominee.full_name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    </div>
                  )}

                  {/* Nominee Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-bold text-lg text-gray-900">{nominee.full_name}</h4>
                      {isTopThree && (
                        <span className="text-xs px-2 py-1 bg-white rounded-full font-semibold text-gray-700">
                          {position === 1 ? "1st Place" : position === 2 ? "2nd Place" : "3rd Place"}
                        </span>
                      )}
                    </div>
                    {nominee.bio && (
                      <p className="text-sm text-gray-600 truncate">{nominee.bio}</p>
                    )}
                  </div>

                  {/* Vote Count */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-3xl font-black text-blue-600">
                      {nominee.votes_count}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {nominee.votes_count === 1 ? "vote" : "votes"}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Total Votes Summary */}
        {nominees.length > 0 && (
          <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Total Votes Cast</p>
                <p className="text-3xl font-black text-blue-600">
                  {nominees.reduce((sum, n) => sum + n.votes_count, 0)}
                </p>
              </div>
              <Sparkles className="text-yellow-400" size={40} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
