"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

interface AwardsFiltersProps {
  universities: string[]
  currentSearch?: string
  currentUniversity?: string
  currentStatus?: string
}

export function AwardsFilters({
  universities,
  currentSearch = "",
  currentUniversity = "",
  currentStatus = "",
}: AwardsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set(filterType, value)
    } else {
      params.delete(filterType)
    }

    router.push(`/awards?${params.toString()}`)
  }

  const hasActiveFilters =
    currentSearch || currentUniversity || currentStatus

  const statuses = [
    { value: "nominations_open", label: "Nominations Open" },
    { value: "voting_open", label: "Voting Open" },
    { value: "voting_closed", label: "Voting Closed" },
    { value: "completed", label: "Completed" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Search size={20} />
        Filter Awards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const search = formData.get("search") as string
              handleFilterChange("search", search)
            }}
            className="relative"
          >
            <input
              type="text"
              name="search"
              placeholder="Search awards..."
              defaultValue={currentSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </form>
        </div>

        {/* University Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University
          </label>
          <select
            value={currentUniversity}
            onChange={(e) => handleFilterChange("university", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Universities</option>
            {universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={currentStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={() => router.push("/awards")}
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          <X size={18} />
          Clear Filters
        </button>
      )}
    </div>
  )
}
