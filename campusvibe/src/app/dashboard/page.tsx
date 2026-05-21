import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, ShieldCheck, Users, Truck, Store, Bike, GraduationCap, LogOut } from "lucide-react"
import { logout, getCurrentUser } from "@/lib/auth/actions"

export const metadata: Metadata = {
  title: "Dashboard — CampusVibe",
  description: "Your CampusVibe role dashboard.",
}

const roleIconMap: Record<string, React.ElementType> = {
  administrator: ShieldCheck,
  ambassador: Users,
  student: GraduationCap,
  driver: Truck,
  "restaurant-owner": Store,
  delivery: Bike,
}

const roleDescriptions: Record<string, string> = {
  administrator: "System governance, platform health, user management, and content moderation.",
  ambassador: "Campus activation campaigns, student recruitment, and community engagement.",
  student: "Marketplace listings, events, rides, media, and your campus memory vault.",
  driver: "Trip management, route optimization, earnings, and compliance tracking.",
  "restaurant-owner": "Menu management, order queue, kitchen operations, and revenue reporting.",
  delivery: "Delivery queue, route optimization, on-time performance, and payout tracking.",
}

const roleNames: Record<string, string> = {
  administrator: "Administrator",
  ambassador: "Campus Ambassador",
  student: "Student",
  driver: "Driver",
  "restaurant-owner": "Restaurant Owner",
  delivery: "Delivery Rider",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const roles: string[] = user.roles ?? ["student"]
  
  console.log("Dashboard - User:", { email: user.email, roles, rolesLength: roles.length })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-heading font-black text-xl text-dark">
              Campus <span className="text-brand">Vibe</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm font-body">
              <Link href="/" className="text-muted hover:text-dark transition-colors">Home</Link>
              <Link href="/about" className="text-muted hover:text-dark transition-colors">About</Link>
              <Link href="/news" className="text-muted hover:text-dark transition-colors">News</Link>
              <Link href="/events" className="text-muted hover:text-dark transition-colors">Events</Link>
              <Link href="/marketplace" className="text-muted hover:text-dark transition-colors">Marketplace</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
<p className="text-xs text-muted font-body">{user.email}</p>
              <p className="text-sm font-section font-semibold text-dark">{user.full_name}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body text-muted hover:text-dark hover:bg-gray-50 transition-colors">
                <LogOut size={14} /> Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-heading font-black text-3xl text-dark">
            Welcome back, {user.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-muted font-body mt-1">Select a role dashboard to get started.</p>
        </div>

        {/* User info banner */}
        <div className="mb-8 p-4 bg-brand/5 border border-brand/20 rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-dark font-section font-semibold">{user.full_name}</p>
              <p className="text-xs text-muted font-body">{user.email}{user.university && ` · ${user.university}`}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roles.map((role) => (
                <span key={role} className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full bg-brand/10 text-brand font-section font-semibold">
                  {roleNames[role] ?? role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = roleIconMap[role] ?? GraduationCap
            return (
              <Link key={role} href={`/dashboard/${role}`}
                className="group bg-white rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand/10 to-interactive/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                  </div>
                  <h2 className="mt-4 font-section font-bold text-lg text-dark">{roleNames[role] ?? role}</h2>
                  <p className="mt-2 text-sm text-muted font-body leading-relaxed line-clamp-2">
                    {roleDescriptions[role] ?? "Access your role dashboard."}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand group-hover:text-interactive transition-colors">
                    <span>Open Dashboard</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-brand to-interactive scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            )
          })}
        </div>

        {/* Quick links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-section font-bold text-dark mb-2">Quick Links</h3>
            <div className="space-y-2 mt-3">
              {[
                { href: "/news", label: "Browse Campus News" },
                { href: "/events", label: "View Upcoming Events" },
                { href: "/marketplace", label: "Open Marketplace" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="flex items-center justify-between py-2 text-sm text-muted hover:text-brand transition-colors font-body border-b border-gray-50 last:border-0">
                  {link.label}
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-section font-bold text-dark mb-2">Account</h3>
            <p className="text-sm text-muted font-body mb-3">
              {roles.length} role{roles.length !== 1 ? "s" : ""} assigned to your account. Contact support to request additional roles.
            </p>
            <a href="mailto:support@campusvibe.co.tz"
              className="text-sm font-semibold text-brand hover:text-interactive transition-colors">
              support@campusvibe.co.tz →
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
