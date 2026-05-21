import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Trophy, Calendar, Building2 } from "lucide-react"
import { AwardsFilters } from "@/components/awards/AwardsFilters"

type SearchParams = Promise<{
  university?: string
  status?: string
  search?: string
}>

export default async function AwardsPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase
    .from("awards_events")
    .select("*")
    .neq("status", "draft")
    .order("created_at", { ascending: false })

  if (params.university) {
    query = query.eq("university", params.university)
  }

  if (params.status) {
    query = query.eq("status", params.status)
  }

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`)
  }

  const { data: events } = await query

  // Get list of universities with active awards
  const { data: universitiesData } = await supabase
    .from("awards_events")
    .select("university")
    .neq("status", "draft")
    .neq("university", null)

  const universities = Array.from(
    new Map((universitiesData || []).map((e) => [e.university, e.university])).values()
  ) as string[]

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-yellow-500" size={36} />
            <h1 className="text-4xl font-bold">Campus Awards</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Celebrate excellence in our university community. Vote for your favorite nominees!
          </p>
        </div>

        {/* Filters */}
        <AwardsFilters
          universities={universities}
          currentSearch={params.search}
          currentUniversity={params.university}
          currentStatus={params.status}
        />

        {/* Events Grid */}
        {!events || events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Trophy className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {params.university || params.status || params.search
                ? "No awards found matching your filters."
                : "No awards events available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const statusColors = {
                nominations_open: "bg-blue-100 text-blue-800",
                voting_open: "bg-green-100 text-green-800",
                voting_closed: "bg-orange-100 text-orange-800",
                completed: "bg-purple-100 text-purple-800",
              }

              return (
                <Link
                  key={event.id}
                  href={`/awards/${event.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full flex flex-col">
                    {event.banner_url && (
                      <div className="h-40 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500">
                        <img
                          src={event.banner_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <h3 className="text-xl font-bold flex-1">{event.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                            statusColors[event.status as keyof typeof statusColors] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm text-gray-600 mb-6 mt-auto">
                        {event.university && (
                          <p className="flex items-center gap-2">
                            <Building2 size={16} className="text-gray-500 flex-shrink-0" />
                            <strong>{event.university}</strong>
                          </p>
                        )}
                        {event.voting_start_at && (
                          <p className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                            {new Date(event.voting_start_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition group-hover:shadow-lg">
                        {event.status === "voting_open"
                          ? "Vote Now →"
                          : "View Event →"}
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
