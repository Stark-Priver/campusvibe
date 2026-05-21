import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { AwardsManager } from "@/components/awards/AwardsManager"
import { NomineesManager } from "@/components/awards/NomineesManager"

type Props = {
  params: Promise<{ role: string }>
}

export default async function AdminAwardsPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("awards_events")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <AdminShell
      role={role}
      section="awards"
      user={user}
      breadcrumbItems={[
        { label: "Awards Management" }
      ]}
    >
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur p-6 shadow-sm">
          <h2 className="font-heading font-bold text-xl text-slate-900">Create New Awards Event</h2>
          <p className="text-sm text-slate-600 mt-1">Set up a new awards event with categories and nominees.</p>
        </div>

        <AwardsManager />

        {events && events.length > 0 && (
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-6">Manage Event Details</h3>
            <div className="space-y-8">
              {events.map((event) => (
              <details
                key={event.id}
                className="border rounded-lg p-4 open:bg-blue-50"
              >
                <summary className="cursor-pointer font-semibold flex items-center justify-between">
                  <span>{event.title}</span>
                  <span className="text-sm text-gray-600">{event.status}</span>
                </summary>

                <div className="mt-6 pt-6 border-t">
                  <NomineesManager
                    eventId={event.id}
                    eventStatus={event.status}
                  />
                </div>
              </details>
            ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
