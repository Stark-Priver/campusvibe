import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VotingInterface } from "@/components/awards/VotingInterface"
import { AwardsLeaderboard } from "@/components/awards/AwardsLeaderboard"
import Link from "next/link"
import { ArrowLeft, Medal, Building2, Calendar } from "lucide-react"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function AwardsEventPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("awards_events")
    .select("*")
    .eq("slug", slug)
    .neq("status", "draft")
    .single()

  if (!event) {
    redirect("/awards")
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {event.banner_url && (
        <div className="h-64 w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500">
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/awards"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Awards
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-600 text-lg">{event.description}</p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Medal className="text-yellow-500" size={28} />
              <div>
                <strong className="text-gray-700">Status</strong>
                <p className="text-blue-600 font-medium">{event.status.replace(/_/g, " ")}</p>
              </div>
            </div>
            {event.university && (
              <div className="flex items-center gap-2">
                <Building2 className="text-blue-600" size={28} />
                <div>
                  <strong className="text-gray-700">University</strong>
                  <p className="text-gray-600">{event.university}</p>
                </div>
              </div>
            )}
            {event.voting_start_at && (
              <div className="flex items-center gap-2">
                <Calendar className="text-green-600" size={28} />
                <div>
                  <strong className="text-gray-700">Voting Period</strong>
                  <p className="text-gray-600">
                    {new Date(event.voting_start_at).toLocaleDateString()} {event.voting_end_at && `- ${new Date(event.voting_end_at).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {event.status === "voting_open" && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <VotingInterface
                eventId={event.id}
                eventTitle={event.title}
                eventStatus={event.status}
              />
            </div>
          )}

          {(event.status === "voting_closed" ||
            event.status === "completed" ||
            event.status === "voting_open") && (
            <div className="bg-white rounded-lg shadow-md p-8 mt-12">
              <AwardsLeaderboard eventId={event.id} eventTitle={event.title} />
            </div>
          )}

          {event.status === "nominations_open" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-800">
                <strong>Nominations are currently open!</strong> Check back when voting begins.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
