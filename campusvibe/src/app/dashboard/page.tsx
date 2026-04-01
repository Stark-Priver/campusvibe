import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight, ShieldCheck, Users, Truck, Store,
  Bike, GraduationCap, LogOut, AlertCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/lib/auth/actions"

export const metadata: Metadata = {
  title: "Dashboard — CampusVibe",
  description: "Your CampusVibe role dashboard.",
}

const roleIconMap: Record<string, React.ElementType> = {
  administrator: ShieldCheck,
  ambassador:    Users,
  student:       GraduationCap,
  driver:        Truck,
  "restaurant-owner": Store,
  delivery:      Bike,
}

const roleDescriptions: Record<string, string> = {
  administrator:      "System governance, platform health, user management, and content moderation.",
  ambassador:         "Campus activation campaigns, student recruitment, and community engagement.",
  student:            "Marketplace listings, events, rides, media, and your campus memory vault.",
  driver:             "Trip management, route optimization, earnings, and compliance tracking.",
  "restaurant-owner": "Menu management, order queue, kitchen operations, and revenue reporting.",
  delivery:           "Delivery queue, route optimization, on-time performance, and payout tracking.",
}

const roleNames: Record<string, string> = {
  administrator:      "Administrator",
  ambassador:         "Campus Ambassador",
  student:            "Student",
  driver:             "Driver",
  "restaurant-owner": "Restaurant Owner",
  delivery:           "Delivery Rider",
}

// All valid role slugs — used to filter out any junk values from the DB
const VALID_ROLES = new Set([
  "administrator", "ambassador", "student",
  "driver", "restaurant-owner", "delivery",
])

export default async function DashboardPage() {
  let user = null
  let profile = null

  try {
    const supabase = await createClient()
    const { data: { user: authUser }, error } = await supabase.auth.getUser()

    if (error || !authUser) {
      redirect("/login")
    }

    user = authUser

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single()

    profile = profileData
  } catch {
    redirect("/login")
  }

  if (!user || !profile) redirect("/login")

  // Normalise roles — filter only known valid roles, default to student
  const rawRoles: string[] = Array.isArray(profile.roles) ? profile.roles : []
  const roles = rawRoles.filter((r) => VALID_ROLES.has(r))
  // If no valid roles found, fallback so the user at least sees Student
  const displayRoles = roles.length > 0 ? roles : ["student"]

  const isAdmin = displayRoles.includes("administrator")

  return (
    <div className="min-h-screen bg-[#ECECEC]">
      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-black text-xl text-dark">
            Campus <span className="text-brand">Vibe</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted font-body truncate max-w-[200px]">{user.email}</p>
              <p className="text-sm font-section font-semibold text-dark">{profile.full_name}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body text-muted hover:text-dark hover:bg-gray-100 transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="font-heading font-black text-3xl text-dark">
            Welcome back, {profile.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-muted font-body mt-1">Select a role dashboard to get started.</p>
        </div>

        {/* User info banner */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-dark font-section font-semibold">{profile.full_name}</p>
              <p className="text-xs text-muted font-body">
                {user.email}
                {profile.university && ` · ${profile.university}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayRoles.map((role) => (
                <span
                  key={role}
                  className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full bg-brand/10 text-brand font-section font-semibold"
                >
                  {roleNames[role] ?? role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Role cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {displayRoles.map((role) => {
            const Icon = roleIconMap[role] ?? GraduationCap
            return (
              <Link
                key={role}
                href={`/dashboard/${role}`}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors duration-300 mb-4">
                    <Icon size={22} />
                  </div>
                  <h2 className="font-section font-bold text-lg text-dark group-hover:text-brand transition-colors">
                    {roleNames[role] ?? role}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted font-body leading-relaxed line-clamp-2">
                    {roleDescriptions[role] ?? "Access your role dashboard."}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand">
                    Open Dashboard
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-brand to-interactive scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            )
          })}
        </div>

        {/* Admin notice — only shown to non-admins, tells them how to get admin access */}
        {!isAdmin && (
          <div className="mb-8 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-section font-semibold text-amber-800">Need administrator access?</p>
              <p className="text-xs text-amber-700 font-body mt-0.5">
                Run this SQL in your Supabase dashboard to assign admin roles:{" "}
                <code className="bg-amber-100 px-1.5 py-0.5 rounded text-[11px] font-mono">
                  UPDATE profiles SET roles = ARRAY[&apos;administrator&apos;,&apos;student&apos;] WHERE email = &apos;your@email.com&apos;;
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Bottom cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-section font-bold text-dark mb-3">Quick Links</h3>
            <div className="space-y-0.5">
              {[
                { href: "/news",        label: "Browse Campus News" },
                { href: "/events",      label: "View Upcoming Events" },
                { href: "/marketplace", label: "Open Marketplace" },
                { href: "/media",       label: "Media Hub" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-muted hover:text-brand hover:bg-brand/5 transition-colors font-body"
                >
                  {link.label}
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-section font-bold text-dark mb-2">Your Account</h3>
            <p className="text-sm text-muted font-body mb-1">
              <span className="font-semibold text-dark">{displayRoles.length}</span> role
              {displayRoles.length !== 1 ? "s" : ""} assigned
            </p>
            <p className="text-xs text-muted font-body mb-4">
              Roles are assigned by administrators via the Supabase dashboard.
              Contact us to request additional roles.
            </p>
            <a
              href="mailto:support@campusvibe.co.tz"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              support@campusvibe.co.tz <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
