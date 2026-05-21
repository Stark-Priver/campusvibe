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
  ChevronDown,
  Trophy,
} from "lucide-react"
import { logout } from "@/lib/auth/actions"
import { NavigationLoader } from "@/components/layout/NavigationLoader"

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
    | "awards"
    | "content-news"
    | "content-events"
    | "content-media"
    | "content-marketplace"
    | "content-analytics"
  user: {
    full_name: string
    email: string
  }
  breadcrumb?: string[]
  breadcrumbItems?: { label: string; href?: string }[]
  children: React.ReactNode
}

export default function AdminShell({ role, section, user, breadcrumb, breadcrumbItems: passedBreadcrumbItems, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [contentOpen, setContentOpen] = useState(false)
  const [mobileContentOpen, setMobileContentOpen] = useState(false)
  const [lastTick, setLastTick] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setLastTick(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  // Open content dropdown if we're in a content section
  useEffect(() => {
    const contentSections = new Set(["content-news", "content-events", "content-media", "content-marketplace", "content-analytics"])
    if (contentSections.has(section)) {
      setContentOpen(true)
      setMobileContentOpen(true)
    }
  }, [section])

  const updatedLabel = useMemo(() => {
    return `Updated ${lastTick.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }, [lastTick])

  const nav = [
    { key: "overview", label: "Overview", href: `/dashboard/${role}/admin/overview`, icon: LayoutDashboard },
    { key: "moderation", label: "Moderation", href: `/dashboard/${role}/admin/moderation`, icon: ShieldAlert },
    { key: "inbox", label: "Inbox", href: `/dashboard/${role}/admin/inbox`, icon: Inbox },
    { key: "awards", label: "Awards", href: `/dashboard/${role}/admin/awards`, icon: Trophy },
    { key: "users", label: "Users", href: `/dashboard/${role}/admin/users`, icon: Home },
    { key: "campuses", label: "Campuses", href: `/dashboard/${role}/admin/campuses`, icon: LayoutDashboard },
    { key: "company", label: "Company", href: `/dashboard/${role}/admin/company`, icon: Settings },
    { key: "audit", label: "Audit", href: `/dashboard/${role}/admin/audit`, icon: ShieldCheck },
  ] as const

  const contentNav = [
    { key: "content-news", label: "News", href: `/dashboard/${role}/admin/content/news`, icon: Newspaper },
    { key: "content-events", label: "Events", href: `/dashboard/${role}/admin/content/events`, icon: CalendarDays },
    { key: "content-media", label: "Media", href: `/dashboard/${role}/admin/content/media`, icon: PlayCircle },
    { key: "content-marketplace", label: "Marketplace", href: `/dashboard/${role}/admin/content/marketplace`, icon: Store },
    { key: "content-analytics", label: "Analytics", href: `/dashboard/${role}/admin/content/analytics`, icon: Activity },
  ] as const

  const contentSections = new Set(["content-news", "content-events", "content-media", "content-marketplace", "content-analytics"])
  const isContentChild = contentSections.has(section)
  const activeRoot = isContentChild ? "content" : section

  const sectionLabel =
    nav.find((item) => item.key === activeRoot)?.label ??
    contentNav.find((item) => item.key === section)?.label ??
    "Overview"

  const breadcrumbItems =
    breadcrumb ?? ["Home", "Admin", isContentChild ? "Content" : sectionLabel, isContentChild ? sectionLabel : ""]

  return (
    <>
      <NavigationLoader />
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

        <div className="lg:pl-[320px]">
          <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[320px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-2xl overflow-y-auto border-r border-slate-700">
          {/* Header */}
          <div className="mb-8">
            <p className="font-heading font-black text-lg mb-1">CampusVibe Admin</p>
            <p className="text-xs text-slate-400 font-body">System Control Center</p>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1 mb-8">
            {nav.map((item) => {
              const Icon = item.icon
              const active = item.key === section
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Content Modules Dropdown */}
          <div className="mb-8">
            <button
              onClick={() => setContentOpen(!contentOpen)}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isContentChild || contentOpen
                  ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                  : "text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              <span className="flex items-center gap-3">
                <FolderKanban size={16} />
                Content Modules
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${contentOpen ? "rotate-180" : ""}`}
              />
            </button>

            {contentOpen && (
              <div className="mt-2 space-y-1 ml-2 border-l-2 border-slate-600 pl-3">
                {contentNav.map((item) => {
                  const Icon = item.icon
                  const active = item.key === section
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                        active
                          ? "bg-indigo-500/30 text-white"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon size={14} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mb-4 border-t border-slate-700" />

          {/* User Section */}
          <div className="mt-auto pt-4">
            <div className="mb-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate mt-1">{user.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <form action={logout} className="mt-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-red-600/20"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </form>
            <Link href="/" className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-3 py-2.5 text-sm font-medium transition-all duration-200">
              <Home size={14} />
              Main Site
            </Link>
          </div>
        </aside>

        {drawerOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <button className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} aria-label="Close sidebar" />
              <div className="absolute left-0 top-0 h-full w-[320px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="font-heading font-black text-lg">CampusVibe Admin</p>
                    <p className="text-xs text-slate-400">System Control</p>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="rounded-lg p-2 hover:bg-slate-700"><X size={16} /></button>
                </div>

                <nav className="space-y-1 mb-8">
                  {nav.map((item) => {
                    const Icon = item.icon
                    const active = item.key === section
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                            : "text-slate-300 hover:bg-slate-700/50"
                        }`}
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                <div className="mb-8">
                  <button
                    onClick={() => setMobileContentOpen(!mobileContentOpen)}
                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isContentChild || mobileContentOpen
                        ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                        : "text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <FolderKanban size={16} />
                      Content Modules
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${mobileContentOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {mobileContentOpen && (
                    <div className="mt-2 space-y-1 ml-2 border-l-2 border-slate-600 pl-3">
                      {contentNav.map((item) => {
                        const Icon = item.icon
                        const active = item.key === section
                        return (
                          <Link
                            key={item.key}
                            href={item.href}
                            onClick={() => setDrawerOpen(false)}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                              active
                                ? "bg-indigo-500/30 text-white"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                            }`}
                          >
                            <Icon size={14} />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
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
                    {(passedBreadcrumbItems || []).filter(Boolean).map((item, index) => (
                      <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                        {index > 0 ? <ChevronRight size={12} className="text-slate-400" /> : null}
                        <span>{item.label}</span>
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
    </>
  )
}
