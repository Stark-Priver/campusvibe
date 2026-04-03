import Link from "next/link"
import { Newspaper, CalendarDays, Clapperboard, Store, Mail, AlertTriangle } from "lucide-react"
import AdminShell from "../AdminShell"
import AdminSparkline from "../AdminSparkline"
import { getAdminSnapshot } from "../data"
import { requireAdministrator } from "../guard"

type Props = { params: Promise<{ role: string }> }

export default async function AdminOverviewPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const snapshot = await getAdminSnapshot()

  const moderationBacklog =
    snapshot.pendingNews + snapshot.pendingEvents + snapshot.pendingMedia + snapshot.pendingListings

  return (
    <AdminShell role={role} section="overview" user={user} breadcrumb={["Home", "Admin", "Overview"]}>
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 border border-indigo-200 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <p className="text-xs text-white/80">Total Users</p>
          <p className="font-heading font-black text-3xl mt-1">{snapshot.totalUsers}</p>
          <p className="text-xs text-white/85 mt-1">{snapshot.adminUsers} admins</p>
          <AdminSparkline points={[10, 13, 12, 15, 16, 18, 20]} />
        </div>
        <div className="rounded-2xl p-4 border border-cyan-200 bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
          <p className="text-xs text-white/80">Published Content</p>
          <p className="font-heading font-black text-3xl mt-1">{snapshot.publishedNews + snapshot.publishedEvents + snapshot.publishedMedia + snapshot.publishedListings}</p>
          <p className="text-xs text-white/85 mt-1">Live across modules</p>
          <AdminSparkline points={[8, 10, 9, 12, 13, 15, 17]} />
        </div>
        <div className="rounded-2xl p-4 border border-amber-200 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <p className="text-xs text-white/80">Moderation Queue</p>
          <p className="font-heading font-black text-3xl mt-1">{moderationBacklog}</p>
          <p className="text-xs text-white/85 mt-1">Pending approvals</p>
          <AdminSparkline points={[18, 17, 16, 14, 13, 12, 10]} />
        </div>
        <div className="rounded-2xl p-4 border border-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
          <p className="text-xs text-white/80">Unread Inbox</p>
          <p className="font-heading font-black text-3xl mt-1">{snapshot.unreadContacts}</p>
          <p className="text-xs text-white/85 mt-1">Support messages</p>
          <AdminSparkline points={[6, 7, 6, 8, 7, 5, 4]} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <h2 className="font-section font-bold text-slate-900 mb-4">Coverage Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href={`/dashboard/${role}/admin/content/news`} className="rounded-xl border border-slate-200 p-4 hover:border-[#3A22A3]">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><Newspaper size={14} /> News</p>
              <p className="text-xs text-slate-500 mt-2">Published {snapshot.publishedNews} / Total {snapshot.totalNews}</p>
            </Link>
            <Link href={`/dashboard/${role}/admin/content/events`} className="rounded-xl border border-slate-200 p-4 hover:border-[#3A22A3]">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><CalendarDays size={14} /> Events</p>
              <p className="text-xs text-slate-500 mt-2">Published {snapshot.publishedEvents} / Total {snapshot.totalEvents}</p>
            </Link>
            <Link href={`/dashboard/${role}/admin/content/media`} className="rounded-xl border border-slate-200 p-4 hover:border-[#3A22A3]">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><Clapperboard size={14} /> Media</p>
              <p className="text-xs text-slate-500 mt-2">Published {snapshot.publishedMedia} / Total {snapshot.totalMedia}</p>
            </Link>
            <Link href={`/dashboard/${role}/admin/content/marketplace`} className="rounded-xl border border-slate-200 p-4 hover:border-[#3A22A3]">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><Store size={14} /> Marketplace</p>
              <p className="text-xs text-slate-500 mt-2">Published {snapshot.publishedListings} / Total {snapshot.totalListings}</p>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <h2 className="font-section font-bold text-slate-900 mb-4">Action Center</h2>
          <div className="space-y-2 text-sm">
            <Link href={`/dashboard/${role}/admin/moderation`} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50 text-slate-700">
              <span className="inline-flex items-center gap-2"><AlertTriangle size={14} /> Moderation Queue</span>
              <span className="font-semibold">{moderationBacklog}</span>
            </Link>
            <Link href={`/dashboard/${role}/admin/inbox`} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50 text-slate-700">
              <span className="inline-flex items-center gap-2"><Mail size={14} /> Support Inbox</span>
              <span className="font-semibold">{snapshot.unreadContacts}</span>
            </Link>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}
