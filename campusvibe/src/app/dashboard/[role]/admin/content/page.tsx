import Link from "next/link"
import { Newspaper, CalendarDays, PlayCircle, Store, ArrowRight } from "lucide-react"
import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ role: string }> }

export default async function AdminContentPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const [{ count: newsCount }, { count: eventsCount }, { count: mediaCount }, { count: listingsCount }] = await Promise.all([
    supabase.from("news_articles").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("media_items").select("id", { count: "exact", head: true }),
    supabase.from("marketplace_listings").select("id", { count: "exact", head: true }),
  ])

  const modules = [
    {
      label: "News",
      description: "Announcements, updates, and editorial publishing.",
      href: `/dashboard/${role}/admin/content/news`,
      total: newsCount ?? 0,
      icon: Newspaper,
      tone: "from-blue-500 to-cyan-500",
    },
    {
      label: "Events",
      description: "Campus event pipeline and publishing calendar.",
      href: `/dashboard/${role}/admin/content/events`,
      total: eventsCount ?? 0,
      icon: CalendarDays,
      tone: "from-indigo-500 to-violet-500",
    },
    {
      label: "Media",
      description: "Video, podcast and creative media inventory.",
      href: `/dashboard/${role}/admin/content/media`,
      total: mediaCount ?? 0,
      icon: PlayCircle,
      tone: "from-fuchsia-500 to-pink-500",
    },
    {
      label: "Marketplace",
      description: "Listings catalog and moderation workflow.",
      href: `/dashboard/${role}/admin/content/marketplace`,
      total: listingsCount ?? 0,
      icon: Store,
      tone: "from-emerald-500 to-teal-500",
    },
  ]

  return (
    <AdminShell role={role} section="content" user={user} breadcrumb={["Home", "Admin", "Content"]}>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link
              key={module.label}
              href={module.href}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`inline-flex rounded-xl p-2.5 bg-gradient-to-br ${module.tone} text-white`}>
                <Icon size={18} />
              </div>
              <h3 className="mt-3 font-section font-bold text-slate-900">{module.label}</h3>
              <p className="mt-1 text-xs text-slate-500">{module.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-700">{module.total} records</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3A22A3] group-hover:translate-x-0.5 transition-transform">
                  Open <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          )
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900">Content Operations Guidance</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <p className="font-semibold text-slate-900">Workflow Split</p>
            <p className="mt-1">Each module now has its own page to reduce scroll fatigue and improve focus for editors and moderators.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <p className="font-semibold text-slate-900">List + Action Pattern</p>
            <p className="mt-1">Each page includes creation forms and a structured listing table for quick edits, publishing, and deletion.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <p className="font-semibold text-slate-900">Navigation Clarity</p>
            <p className="mt-1">Sidebar now includes direct module links and breadcrumb context to keep orientation clear while operating.</p>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}
