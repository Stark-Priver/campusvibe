"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  ShieldAlert,
  Inbox,
  FolderKanban,
  Home,
  Settings,
  Menu,
  X,
  LogOut,
  Activity,
  Clock3,
  ShieldCheck,
  Newspaper,
  CalendarDays,
  PlayCircle,
  Store,
  ChevronRight,
} from "lucide-react"
import { logout } from "@/lib/auth/actions"

type Props = {
  role: string
  section:
    | "overview"
    | "moderation"
    | "inbox"
    | "content"
    | "users"
    | "campuses"
    | "company"
    | "audit"
    | "analytics"
    | "content-news"
    | "content-events"
    | "content-media"
    | "content-marketplace"
  user: {
    full_name: string
    email: string
  }
  breadcrumb?: string[]
  children: React.ReactNode
}

export default function AdminShell({ role, section, user, breadcrumb, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastTick, setLastTick] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setLastTick(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const updatedLabel = useMemo(() => {
    return `Updated ${lastTick.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }, [lastTick])

  const nav = [
    { key: "overview", label: "Overview", href: `/dashboard/${role}/admin/overview`, icon: LayoutDashboard },
    { key: "moderation", label: "Moderation", href: `/dashboard/${role}/admin/moderation`, icon: ShieldAlert },
    { key: "inbox", label: "Inbox", href: `/dashboard/${role}/admin/inbox`, icon: Inbox },
    { key: "content", label: "Content", href: `/dashboard/${role}/admin/content`, icon: FolderKanban },
    { key: "users", label: "Users", href: `/dashboard/${role}/admin/users`, icon: Home },
    { key: "campuses", label: "Campuses", href: `/dashboard/${role}/admin/campuses`, icon: LayoutDashboard },
    { key: "company", label: "Company", href: `/dashboard/${role}/admin/company`, icon: Settings },
    { key: "audit", label: "Audit", href: `/dashboard/${role}/admin/audit`, icon: ShieldCheck },
    { key: "analytics", label: "Analytics", href: `/dashboard/${role}/admin/analytics`, icon: Activity },
  ] as const

  const contentNav = [
    { key: "content-news", label: "News", href: `/dashboard/${role}/admin/content/news`, icon: Newspaper },
    { key: "content-events", label: "Events", href: `/dashboard/${role}/admin/content/events`, icon: CalendarDays },
    { key: "content-media", label: "Media", href: `/dashboard/${role}/admin/content/media`, icon: PlayCircle },
    { key: "content-marketplace", label: "Marketplace", href: `/dashboard/${role}/admin/content/marketplace`, icon: Store },
  ] as const

  const contentSections = new Set(["content-news", "content-events", "content-media", "content-marketplace"])
  const isContentChild = contentSections.has(section)
  const activeRoot = isContentChild ? "content" : section

  const sectionLabel =
    nav.find((item) => item.key === activeRoot)?.label ??
    contentNav.find((item) => item.key === section)?.label ??
    "Overview"

  const breadcrumbItems =
    breadcrumb ?? ["Home", "Admin", isContentChild ? "Content" : sectionLabel, isContentChild ? sectionLabel : ""]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef1f8_45%,#e6ebf5_100%)]">
      <div className="lg:hidden px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <Menu size={16} /> Menu
          </button>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Main Site</Link>
        </div>

      <div className="lg:pl-[300px]">
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[300px] bg-gradient-to-b from-[#321A8D] to-[#4822B2] text-white p-5 shadow-xl shadow-indigo-900/20 overflow-y-auto">
            <p className="font-heading font-black text-xl">CampusVibe Admin</p>
            <p className="text-xs text-white/70 mt-1 font-body">System Control Center</p>
            <nav className="mt-6 space-y-1.5">
              {nav.map((item) => {
                const Icon = item.icon
                const active = item.key === section
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-white text-[#321A8D] font-semibold" : "text-white/85 hover:bg-white/10"}`}
                  >
                    <Icon size={15} /> {item.label}
                  </Link>
                )
              })}
              <div className="mt-3 rounded-xl border border-white/15 bg-white/5 p-2">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.18em] text-white/70">Content Modules</p>
                <div className="space-y-1">
                  {contentNav.map((item) => {
                    const Icon = item.icon
                    const active = item.key === section
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${active ? "bg-white text-[#321A8D] font-semibold" : "text-white/80 hover:bg-white/10"}`}
                      >
                        <Icon size={13} /> {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
              <Link href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/85 hover:bg-white/10">
                <Home size={15} /> Main Site
              </Link>
            </nav>

            <div className="mt-8 pt-4 border-t border-white/20">
              <p className="text-xs text-white/70">Signed in as</p>
              <p className="text-sm font-semibold truncate mt-1">{user.full_name}</p>
              <p className="text-xs text-white/75 truncate">{user.email}</p>
              <form action={logout} className="mt-3">
                <button type="submit" className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-sm hover:bg-white/25">
                  <LogOut size={14} /> Sign Out
                </button>
              </form>
            </div>
          </aside>

        {drawerOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <button className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} aria-label="Close sidebar" />
              <div className="absolute left-0 top-0 h-full w-[300px] bg-gradient-to-b from-[#321A8D] to-[#4822B2] text-white p-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <p className="font-heading font-black text-xl">CampusVibe Admin</p>
                  <button onClick={() => setDrawerOpen(false)} className="rounded-lg p-2 hover:bg-white/15"><X size={16} /></button>
                </div>
                <nav className="mt-6 space-y-1.5">
                  {nav.map((item) => {
                    const Icon = item.icon
                    const active = item.key === activeRoot
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-white text-[#321A8D] font-semibold" : "text-white/85 hover:bg-white/10"}`}
                      >
                        <Icon size={15} /> {item.label}
                      </Link>
                    )
                  })}
                  <div className="mt-2 rounded-xl border border-white/15 bg-white/5 p-2">
                    <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.18em] text-white/70">Content Modules</p>
                    <div className="space-y-1">
                      {contentNav.map((item) => {
                        const Icon = item.icon
                        const active = item.key === section
                        return (
                          <Link
                            key={item.key}
                            href={item.href}
                            onClick={() => setDrawerOpen(false)}
                            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${active ? "bg-white text-[#321A8D] font-semibold" : "text-white/80 hover:bg-white/10"}`}
                          >
                            <Icon size={13} /> {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
        )}

        <main className="px-4 sm:px-6 lg:px-8 py-3 lg:py-4 space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Administrator Workspace</p>
                  <h1 className="font-heading font-black text-2xl text-slate-900">System Governance Dashboard</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    {breadcrumbItems.filter(Boolean).map((item, index) => (
                      <span key={`${item}-${index}`} className="inline-flex items-center gap-1">
                        {index > 0 ? <ChevronRight size={12} className="text-slate-400" /> : null}
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                    <Activity size={12} /> Live Sync
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
                    <Clock3 size={12} /> {updatedLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs text-violet-700">
                    <ShieldCheck size={12} /> SLA 99.9%
                  </span>
                </div>
              </div>
            </div>
            {children}
          </main>
      </div>
    </div>
  )
}
