import Link from "next/link"
import {
  Home,
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Clapperboard,
  Store,
  Settings,
  LogOut,
  Mail,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Trophy,
} from "lucide-react"
import type { User } from "@/lib/auth/custom"
import { logout } from "@/lib/auth/actions"
import { getAdminSnapshot } from "./data"
import AdminSparkline from "./AdminSparkline"

type Props = {
  user: User
}

export default async function AdminWorkspace({ user }: Props) {
  const snapshot = await getAdminSnapshot()
  const moderationBacklog =
    snapshot.pendingNews + snapshot.pendingEvents + snapshot.pendingMedia + snapshot.pendingListings

  const contentModules = [
    {
      label: "News",
      href: "/news",
      total: snapshot.totalNews,
      published: snapshot.publishedNews,
      pending: snapshot.pendingNews,
      spark: [15, 26, 19, 28, 24, 30, 35],
      icon: Newspaper,
    },
    {
      label: "Events",
      href: "/events",
      total: snapshot.totalEvents,
      published: snapshot.publishedEvents,
      pending: snapshot.pendingEvents,
      spark: [10, 14, 13, 22, 20, 24, 29],
      icon: CalendarDays,
    },
    {
      label: "Media",
      href: "/media",
      total: snapshot.totalMedia,
      published: snapshot.publishedMedia,
      pending: snapshot.pendingMedia,
      spark: [12, 18, 16, 21, 19, 25, 27],
      icon: Clapperboard,
    },
    {
      label: "Marketplace",
      href: "/marketplace",
      total: snapshot.totalListings,
      published: snapshot.publishedListings,
      pending: snapshot.pendingListings,
      spark: [8, 12, 11, 18, 17, 19, 22],
      icon: Store,
    },
  ]

  const sidebarLinks = [
    { label: "Overview", href: "/dashboard/administrator", icon: LayoutDashboard },
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/about", icon: Settings },
    { label: "News", href: "/news", icon: Newspaper },
    { label: "Events", href: "/events", icon: CalendarDays },
    { label: "Media", href: "/media", icon: Clapperboard },
    { label: "Marketplace", href: "/marketplace", icon: Store },
    { label: "Awards", href: "/dashboard/administrator/awards", icon: Trophy },
    { label: "Get Involved", href: "/get-involved", icon: ArrowRight },
  ]

  return (
    <div className="min-h-screen bg-[#EEF1F8]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] gap-6">
          <aside className="lg:sticky lg:top-6 h-fit rounded-2xl bg-gradient-to-b from-[#321A8D] to-[#4822B2] text-white p-5 shadow-xl shadow-indigo-900/20">
            <div className="mb-6">
              <p className="font-heading font-black text-xl">CampusVibe Admin</p>
              <p className="text-xs text-white/70 mt-1 font-body">System Control Center</p>
            </div>

            <nav className="space-y-1.5">
              {sidebarLinks.map((item) => {
                const Icon = item.icon
                const isActive = item.href === "/dashboard/administrator"
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-body transition-colors ${
                      isActive
                        ? "bg-white text-[#321A8D] font-semibold"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={15} /> {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8 pt-5 border-t border-white/20">
              <p className="text-xs text-white/70 font-body mb-2">Signed in as</p>
              <p className="text-sm font-section font-semibold truncate">{user.full_name}</p>
              <p className="text-xs text-white/70 truncate">{user.email}</p>
              <form action={logout} className="mt-3">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body bg-white/15 hover:bg-white/25 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </form>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-section">Administrator Workspace</p>
                  <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">System Governance Dashboard</h1>
                  <p className="text-sm text-slate-600 mt-1 max-w-3xl font-body">
                    Unified operational view for users, content publishing, moderation, events, media, marketplace, and support channels.
                  </p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-2xl p-4 border border-indigo-200 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <p className="text-xs text-white/80 font-body">Total Users</p>
                <p className="font-heading font-black text-3xl mt-1">{snapshot.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-white/85 mt-1 font-body">{snapshot.adminUsers} admins</p>
                <AdminSparkline points={[12, 14, 13, 16, 17, 20, 22]} />
              </div>
              <div className="rounded-2xl p-4 border border-cyan-200 bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <p className="text-xs text-white/80 font-body">Published Content</p>
                <p className="font-heading font-black text-3xl mt-1">
                  {(snapshot.publishedNews + snapshot.publishedEvents + snapshot.publishedMedia + snapshot.publishedListings).toLocaleString()}
                </p>
                <p className="text-xs text-white/85 mt-1 font-body">Live across all modules</p>
                <AdminSparkline points={[9, 11, 10, 13, 15, 14, 17]} />
              </div>
              <div className="rounded-2xl p-4 border border-amber-200 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <p className="text-xs text-white/80 font-body">Moderation Queue</p>
                <p className="font-heading font-black text-3xl mt-1">{moderationBacklog.toLocaleString()}</p>
                <p className="text-xs text-white/85 mt-1 font-body">Pending approvals</p>
                <AdminSparkline points={[20, 18, 17, 15, 14, 12, 10]} />
              </div>
              <div className="rounded-2xl p-4 border border-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                <p className="text-xs text-white/80 font-body">Unread Inbox</p>
                <p className="font-heading font-black text-3xl mt-1">{snapshot.unreadContacts.toLocaleString()}</p>
                <p className="text-xs text-white/85 mt-1 font-body">Support messages</p>
                <AdminSparkline points={[6, 8, 7, 9, 7, 6, 5]} />
              </div>
            </section>

            <section className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
              <div className="2xl:col-span-2 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-section font-bold text-slate-900">Content Operations Matrix</h2>
                  <span className="text-xs text-slate-500 font-body">Coverage: all website modules</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentModules.map((module) => {
                    const Icon = module.icon
                    return (
                      <Link
                        key={module.label}
                        href={module.href}
                        className="rounded-xl border border-slate-200 p-4 hover:border-[#3A22A3] hover:bg-indigo-50/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-section font-semibold text-slate-900">{module.label}</p>
                            <p className="text-xs text-slate-500 mt-1 font-body">Total {module.total.toLocaleString()} records</p>
                          </div>
                          <span className="w-9 h-9 rounded-lg bg-[#3A22A3]/10 text-[#3A22A3] flex items-center justify-center">
                            <Icon size={16} />
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs font-body">
                          <span className="text-emerald-700">Published {module.published.toLocaleString()}</span>
                          <span className="text-amber-700">Pending {module.pending.toLocaleString()}</span>
                        </div>
                        <div className="mt-3 h-10 rounded-lg bg-slate-50 px-2 py-1">
                          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
                            <polyline
                              fill="none"
                              stroke="#3A22A3"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={module.spark.map((p, i) => `${(i / 6) * 100},${100 - p * 3}`).join(" ")}
                            />
                          </svg>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <h2 className="font-section font-bold text-slate-900 mb-4">Platform Health</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-body">
                    <span className="inline-flex items-center gap-2 text-slate-700"><ShieldCheck size={14} className="text-emerald-600" /> Security posture</span>
                    <span className="text-emerald-700 font-semibold">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-body">
                    <span className="inline-flex items-center gap-2 text-slate-700"><Activity size={14} className="text-blue-600" /> Active headlines</span>
                    <span className="text-slate-900 font-semibold">{snapshot.activeBreakingNews}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-body">
                    <span className="inline-flex items-center gap-2 text-slate-700"><Mail size={14} className="text-amber-600" /> Unread contacts</span>
                    <span className="text-slate-900 font-semibold">{snapshot.unreadContacts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-body">
                    <span className="inline-flex items-center gap-2 text-slate-700"><AlertTriangle size={14} className="text-red-600" /> Queue load</span>
                    <span className="text-slate-900 font-semibold">{moderationBacklog}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <Link href="/news" className="flex items-center justify-between text-sm text-slate-600 hover:text-[#3A22A3] font-body transition-colors">Review news pipeline <ArrowRight size={14} /></Link>
                  <Link href="/events" className="flex items-center justify-between text-sm text-slate-600 hover:text-[#3A22A3] font-body transition-colors">Approve event publishing <ArrowRight size={14} /></Link>
                  <Link href="/marketplace" className="flex items-center justify-between text-sm text-slate-600 hover:text-[#3A22A3] font-body transition-colors">Moderate marketplace <ArrowRight size={14} /></Link>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
              <div className="2xl:col-span-2 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-section font-bold text-slate-900">Recent Contact Submissions</h2>
                  <span className="text-xs text-slate-500 font-body">Operational inbox</span>
                </div>
                {snapshot.recentContacts.length === 0 ? (
                  <p className="text-sm text-slate-500 font-body">No contact submissions found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                          <th className="py-2 pr-3 font-section">Name</th>
                          <th className="py-2 pr-3 font-section">Email</th>
                          <th className="py-2 pr-3 font-section">Interest</th>
                          <th className="py-2 pr-3 font-section">Status</th>
                          <th className="py-2 font-section">Received</th>
                        </tr>
                      </thead>
                      <tbody>
                        {snapshot.recentContacts.map((submission) => (
                          <tr key={submission.id} className="border-b border-slate-50 last:border-0">
                            <td className="py-2.5 pr-3 text-slate-900 font-body">{submission.full_name}</td>
                            <td className="py-2.5 pr-3 text-slate-600 font-body">{submission.email}</td>
                            <td className="py-2.5 pr-3 text-slate-600 font-body">{submission.interest}</td>
                            <td className="py-2.5 pr-3">
                              {submission.is_read ? (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 size={12} /> Read</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-700"><Clock3 size={12} /> Unread</span>
                              )}
                            </td>
                            <td className="py-2.5 text-slate-600 font-body">{new Date(submission.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <h2 className="font-section font-bold text-slate-900 mb-4">Governance Snapshot</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-slate-700 font-body"><LayoutDashboard size={14} className="text-[#3A22A3]" /> User accounts</span>
                    <span className="font-semibold text-slate-900">{snapshot.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-slate-700 font-body"><Newspaper size={14} className="text-[#3A22A3]" /> Pending news</span>
                    <span className="font-semibold text-slate-900">{snapshot.pendingNews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-slate-700 font-body"><CalendarDays size={14} className="text-[#3A22A3]" /> Pending events</span>
                    <span className="font-semibold text-slate-900">{snapshot.pendingEvents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-slate-700 font-body"><Clapperboard size={14} className="text-[#3A22A3]" /> Pending media</span>
                    <span className="font-semibold text-slate-900">{snapshot.pendingMedia}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-slate-700 font-body"><Store size={14} className="text-[#3A22A3]" /> Pending listings</span>
                    <span className="font-semibold text-slate-900">{snapshot.pendingListings}</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
