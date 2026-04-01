import Link from "next/link"
import { AlertTriangle, Newspaper, CalendarDays, Clapperboard, Store } from "lucide-react"
import AdminShell from "../AdminShell"
import { getAdminSnapshot } from "../data"
import { requireAdministrator } from "../guard"

type Props = { params: Promise<{ role: string }> }

export default async function AdminModerationPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const snapshot = await getAdminSnapshot()

  const queue = [
    { name: "News", pending: snapshot.pendingNews, href: "/news", icon: Newspaper },
    { name: "Events", pending: snapshot.pendingEvents, href: "/events", icon: CalendarDays },
    { name: "Media", pending: snapshot.pendingMedia, href: "/media", icon: Clapperboard },
    { name: "Marketplace", pending: snapshot.pendingListings, href: "/marketplace", icon: Store },
  ]

  return (
    <AdminShell role={role} section="moderation" user={user}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-2">Moderation Workbench</h2>
        <p className="text-sm text-slate-600">Prioritize pending approvals and maintain trust/safety standards across modules.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {queue.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.name} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-2 text-slate-900 font-semibold"><Icon size={15} /> {item.name}</p>
                <span className="text-xs rounded-full px-2.5 py-1 bg-amber-100 text-amber-700">Pending {item.pending}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Review unpublished items and compliance before publication.</p>
              <Link href={item.href} className="mt-4 inline-flex items-center gap-1 text-sm text-[#3A22A3] hover:underline">Open Module</Link>
            </div>
          )
        })}
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h3 className="font-section font-semibold text-slate-900 mb-3">Policy SLA</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-slate-200 p-3 text-slate-700"><AlertTriangle size={14} className="inline mr-1 text-red-600" /> High severity: under 1 hour</div>
          <div className="rounded-xl border border-slate-200 p-3 text-slate-700">Medium severity: under 6 hours</div>
          <div className="rounded-xl border border-slate-200 p-3 text-slate-700">Low severity: under 24 hours</div>
        </div>
      </section>
    </AdminShell>
  )
}
