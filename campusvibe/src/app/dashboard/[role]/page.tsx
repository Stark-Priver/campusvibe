import type { Metadata } from "next"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { ArrowLeft, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/lib/auth/actions"

type Props = { params: Promise<{ role: string }> }

const VALID_ROLES = [
  "administrator", "ambassador", "student",
  "driver", "restaurant-owner", "delivery",
] as const

type RoleSlug = (typeof VALID_ROLES)[number]

const roleConfig: Record<RoleSlug, {
  name: string
  headline: string
  description: string
  accentFrom: string
  accentTo: string
  metrics: { label: string; value: string; trend: string }[]
  operations: { title: string; description: string; items: string[] }
  compliance: { title: string; description: string; items: string[] }
  quickActions: { label: string; href: string }[]
}> = {
  administrator: {
    name: "Administrator",
    headline: "System Governance & Platform Control",
    description: "Monitor platform health, user growth, marketplace activity, and policy enforcement across all CampusVibe services.",
    accentFrom: "from-brand", accentTo: "to-interactive",
    metrics: [
      { label: "Total Active Users",     value: "12,842", trend: "+8.2% this month" },
      { label: "Open Moderation Cases",  value: "26",     trend: "-14% vs last week" },
      { label: "Live Campuses",          value: "18",     trend: "+3 this quarter" },
      { label: "Platform Uptime",        value: "99.96%", trend: "SLA met" },
    ],
    operations: {
      title: "Operational Priorities",
      description: "Critical tasks requiring administrator action in the next 24 hours.",
      items: [
        "Approve 7 pending partner onboarding requests.",
        "Resolve 4 high-priority listing dispute tickets.",
        "Review event safety compliance for two flagship events.",
        "Validate payout reconciliation report before 6:00 PM.",
      ],
    },
    compliance: {
      title: "Governance & Compliance",
      description: "Audit posture and policy adherence across all modules.",
      items: [
        "Content moderation response time: 1h 12m average.",
        "Driver verification completion rate: 98.4%.",
        "Restaurant KYC verification rate: 96.8%.",
        "Security incident backlog: 0 unresolved critical items.",
      ],
    },
    quickActions: [
      { label: "Approve New Campus",     href: "#" },
      { label: "Review Reported Content",href: "#" },
      { label: "Publish System Notice",  href: "#" },
      { label: "Export Executive Report",href: "#" },
    ],
  },
  ambassador: {
    name: "Campus Ambassador",
    headline: "Campus Growth & Community Activation",
    description: "Run activation campaigns, recruit student users, and drive engagement for events, media, and app usage on your campus.",
    accentFrom: "from-interactive", accentTo: "to-brand",
    metrics: [
      { label: "New Signups This Week", value: "214",    trend: "+21 vs target" },
      { label: "Campaign Reach",        value: "8,430",  trend: "Across 5 channels" },
      { label: "Event RSVPs Driven",    value: "326",    trend: "+17% growth" },
      { label: "Ambassador Score",      value: "92/100", trend: "Top 10 nationally" },
    ],
    operations: {
      title: "Field Activities",
      description: "Current tasks and upcoming community programs.",
      items: [
        "Schedule orientation stand activation for first-year students.",
        "Coordinate media team for Friday campus spotlight coverage.",
        "Launch referral sprint with departmental representatives.",
        "Host feedback circle with student association leaders.",
      ],
    },
    compliance: {
      title: "Program Standards",
      description: "Execution quality and campaign policy checks.",
      items: [
        "All campaign posters compliant with branding guidelines.",
        "Consent logs submitted for all student media captures.",
        "Lead quality score: 4.6/5 this cycle.",
        "Response time to campus tickets: 35 minutes average.",
      ],
    },
    quickActions: [
      { label: "Create Campus Campaign", href: "#" },
      { label: "Submit Weekly Report",   href: "#" },
      { label: "Request Promo Assets",   href: "#" },
      { label: "Open Student Leads",     href: "#" },
    ],
  },
  student: {
    name: "Student",
    headline: "Your Campus Life Hub",
    description: "Manage marketplace activity, events, rides, and your personal Campus Memory collection in one student dashboard.",
    accentFrom: "from-amber-400", accentTo: "to-accent",
    metrics: [
      { label: "Saved Listings",   value: "19",    trend: "4 new this week" },
      { label: "Upcoming Events",  value: "6",     trend: "2 with RSVP confirmed" },
      { label: "Ride Trips",       value: "34",    trend: "TZS 118,000 total spend" },
      { label: "Memory Storage",   value: "8.4 GB",trend: "72% utilized" },
    ],
    operations: {
      title: "Student Priorities",
      description: "Important upcoming tasks and reminders.",
      items: [
        "Confirm attendance for CampusVibe Awards 2026.",
        "Complete profile verification for trusted marketplace badge.",
        "Backup latest semester memory uploads to cloud vault.",
        "Review roommate ride-share request for morning commute.",
      ],
    },
    compliance: {
      title: "Account & Safety",
      description: "Status of account trust, security, and privacy controls.",
      items: [
        "Student verification: completed.",
        "Marketplace trust badge: active.",
        "Privacy settings: memory vault set to private.",
        "Two-factor authentication: enabled.",
      ],
    },
    quickActions: [
      { label: "Post New Listing",      href: "/marketplace" },
      { label: "Browse Events",         href: "/events" },
      { label: "Upload Memory Clip",    href: "#" },
      { label: "Book Campus Ride",      href: "#" },
    ],
  },
  driver: {
    name: "Driver",
    headline: "Trip Performance & Earnings",
    description: "Track trips, optimise routes, manage availability, and monitor payouts with full visibility.",
    accentFrom: "from-green-500", accentTo: "to-teal-500",
    metrics: [
      { label: "Trips Today",      value: "22",           trend: "+5 vs yesterday" },
      { label: "Completion Rate",  value: "97.8%",        trend: "SLA healthy" },
      { label: "Average Rating",   value: "4.9",          trend: "From 312 reviews" },
      { label: "Weekly Earnings",  value: "TZS 412,000",  trend: "Pending: TZS 80,000" },
    ],
    operations: {
      title: "Dispatch Operations",
      description: "Current route and fleet optimisation tasks.",
      items: [
        "Maintain response time below 2 minutes in evening peak.",
        "Complete vehicle inspection checklist by 8:00 PM.",
        "Confirm campus gate pickup compliance for UDSM routes.",
        "Review fuel-efficiency report and route optimisation tips.",
      ],
    },
    compliance: {
      title: "Safety & Service Compliance",
      description: "Quality and policy standards for ride operations.",
      items: [
        "All mandatory driver documents valid and up to date.",
        "Customer complaint count this week: 1 (resolved).",
        "Safety checklist completion: 100%.",
        "Background re-verification due in 58 days.",
      ],
    },
    quickActions: [
      { label: "Go Online",         href: "#" },
      { label: "View Peak Zones",   href: "#" },
      { label: "Request Payout",    href: "#" },
      { label: "Report Trip Issue", href: "#" },
    ],
  },
  "restaurant-owner": {
    name: "Restaurant Owner",
    headline: "Kitchen Operations & Campus Orders",
    description: "Manage menus, monitor order flow, and improve delivery performance for student customers.",
    accentFrom: "from-orange-500", accentTo: "to-red-500",
    metrics: [
      { label: "Orders Today",   value: "147",        trend: "+18% vs last Tuesday" },
      { label: "Prep Time",      value: "14 min",     trend: "Target: under 15 min" },
      { label: "Average Rating", value: "4.7",        trend: "From 1,028 reviews" },
      { label: "Revenue (7d)",   value: "TZS 2.9M",   trend: "Net margin 24%" },
    ],
    operations: {
      title: "Kitchen & Service Queue",
      description: "Immediate priorities for smooth restaurant operations.",
      items: [
        "Restock top-selling meals before 1:00 PM rush.",
        "Confirm allergy tags for all menu updates.",
        "Coordinate with delivery fleet for batch pickups.",
        "Review cancelled order reasons and apply fixes.",
      ],
    },
    compliance: {
      title: "Quality & Food Safety",
      description: "Operational compliance and trust indicators.",
      items: [
        "Food safety certification: valid through 2027.",
        "Late order ratio: 4.1% (within platform target).",
        "Packaging quality score: 95/100.",
        "Customer refund cases this week: 3 (all closed).",
      ],
    },
    quickActions: [
      { label: "Add Menu Item",           href: "#" },
      { label: "Launch Lunch Promo",      href: "#" },
      { label: "Pause Busy Kitchen",      href: "#" },
      { label: "Download Revenue Report", href: "#" },
    ],
  },
  delivery: {
    name: "Delivery Rider",
    headline: "Fulfillment Speed & Delivery Reliability",
    description: "Handle active deliveries, optimise drop routes, and track performance metrics in real time.",
    accentFrom: "from-sky-500", accentTo: "to-blue-600",
    metrics: [
      { label: "Deliveries Today", value: "31",          trend: "+6 vs average" },
      { label: "On-Time Rate",     value: "96.4%",       trend: "Target: above 95%" },
      { label: "Avg Drop Time",    value: "18 min",      trend: "-2 min improvement" },
      { label: "Weekly Payout",    value: "TZS 286,000", trend: "Pending: TZS 54,000" },
    ],
    operations: {
      title: "Delivery Queue",
      description: "Assignments and service priorities.",
      items: [
        "Complete 4 stacked deliveries in Mlimani route cluster.",
        "Prioritise one high-value order with live tracking alerts.",
        "Confirm pickup scan accuracy at partner kitchens.",
        "Run battery and bike condition check before evening shift.",
      ],
    },
    compliance: {
      title: "Service Compliance",
      description: "Performance and safety standards in delivery operations.",
      items: [
        "Proof-of-delivery capture: 100% completion.",
        "Customer dispute ratio: 0.8% (excellent range).",
        "Helmet and safety gear compliance confirmed.",
        "Escalation response time: 7 minutes average.",
      ],
    },
    quickActions: [
      { label: "Start Delivery Shift", href: "#" },
      { label: "Open Active Route",    href: "#" },
      { label: "Report Delay",         href: "#" },
      { label: "Request Support",      href: "#" },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params
  const config = roleConfig[role as RoleSlug]
  return {
    title: config ? `${config.name} Dashboard — CampusVibe` : "Dashboard — CampusVibe",
  }
}

export default async function RoleDashboardPage({ params }: Props) {
  const { role } = await params

  if (!VALID_ROLES.includes(role as RoleSlug)) notFound()

  let user = null
  let profile = null

  try {
    const supabase = await createClient()
    const { data: { user: authUser }, error } = await supabase.auth.getUser()

    if (error || !authUser) redirect("/login")
    user = authUser

    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, roles, university")
      .eq("id", authUser.id)
      .single()

    profile = profileData
  } catch {
    redirect("/login")
  }

  if (!user || !profile) redirect("/login")

  // Normalise roles — same logic as dashboard index
  const rawRoles: string[] = Array.isArray(profile.roles) ? profile.roles : []
  const userRoles = rawRoles.filter((r) => VALID_ROLES.includes(r as RoleSlug))
  const effectiveRoles = userRoles.length > 0 ? userRoles : ["student"]

  // Allow access if user has the role, OR if we're in development without env vars
  const hasRole = effectiveRoles.includes(role)
  const isMissingEnv = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")

  if (!hasRole && !isMissingEnv) {
    redirect("/dashboard")
  }

  const config = roleConfig[role as RoleSlug]

  return (
    <div className="min-h-screen bg-[#ECECEC]">
      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-dark transition-colors font-body"
            >
              <ArrowLeft size={14} /> Dashboards
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-section font-semibold text-dark">{config.name}</span>
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

      {/* ── Role banner ── */}
      <div className={`bg-gradient-to-r ${config.accentFrom} ${config.accentTo} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-white/70 text-xs font-section uppercase tracking-widest mb-1">
            {config.name}
          </p>
          <h1 className="font-heading font-black text-2xl sm:text-3xl">{config.headline}</h1>
          <p className="mt-1.5 text-white/80 font-body text-sm max-w-2xl">{config.description}</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Metrics ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {config.metrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <p className="text-xs text-muted font-body mb-1.5">{metric.label}</p>
              <p className="font-heading font-black text-2xl text-dark leading-none">{metric.value}</p>
              <p className="text-xs text-muted font-body mt-2">{metric.trend}</p>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h2 className="font-section font-bold text-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {config.quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="text-center py-3 px-3 rounded-xl border border-gray-200 hover:border-brand hover:bg-brand/5 text-sm font-section font-semibold text-dark hover:text-brand transition-all duration-150"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Operations + Compliance ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-section font-bold text-dark">{config.operations.title}</h2>
            <p className="text-xs text-muted font-body mt-0.5 mb-4">{config.operations.description}</p>
            <ul className="space-y-3">
              {config.operations.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-dark font-body">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand text-xs font-section font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-section font-bold text-dark">{config.compliance.title}</h2>
            <p className="text-xs text-muted font-body mt-0.5 mb-4">{config.compliance.description}</p>
            <ul className="space-y-3">
              {config.compliance.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-dark font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Switch role / Back ── */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            <ArrowLeft size={14} /> Switch Role
          </Link>
          <Link
            href="/"
            className="text-sm text-muted font-body hover:text-dark transition-colors"
          >
            Back to website →
          </Link>
        </div>
      </main>
    </div>
  )
}
