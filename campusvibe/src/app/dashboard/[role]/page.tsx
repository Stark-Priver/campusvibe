import type { Metadata } from "next"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { ArrowLeft, LogOut } from "lucide-react"
import { logout, getCurrentUser } from "@/lib/auth/actions"

type Props = { params: Promise<{ role: string }> }

const validRoles = ["administrator", "ambassador", "student", "driver", "restaurant-owner", "delivery"]

const roleConfig: Record<string, {
  name: string
  headline: string
  description: string
  metrics: { label: string; getValue: () => string; trend: string }[]
  operations: { title: string; description: string; items: string[] }
  compliance: { title: string; description: string; items: string[] }
  quickActions: { label: string; href: string }[]
  accentColor: string
}> = {
  administrator: {
    name: "Administrator",
    headline: "System Governance & Platform Control",
    description: "Monitor platform health, user growth, marketplace activity, and policy enforcement across all CampusVibe services.",
    accentColor: "from-brand to-interactive",
    metrics: [
      { label: "Total Active Users", getValue: () => "12,842", trend: "+8.2% this month" },
      { label: "Open Moderation Cases", getValue: () => "26", trend: "-14% vs last week" },
      { label: "Live Campuses", getValue: () => "18", trend: "+3 this quarter" },
      { label: "Platform Uptime", getValue: () => "99.96%", trend: "SLA met" },
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
      { label: "Approve New Campus", href: "#" },
      { label: "Review Reported Content", href: "#" },
      { label: "Publish System Notice", href: "#" },
      { label: "Export Executive Report", href: "#" },
    ],
  },
  ambassador: {
    name: "Campus Ambassador",
    headline: "Campus Growth & Community Activation",
    description: "Run activation campaigns, recruit student users, and drive engagement for events, media, and app usage on your campus.",
    accentColor: "from-interactive to-brand",
    metrics: [
      { label: "New Signups This Week", getValue: () => "214", trend: "+21 vs target" },
      { label: "Campaign Reach", getValue: () => "8,430", trend: "Across 5 channels" },
      { label: "Event RSVPs Driven", getValue: () => "326", trend: "+17% growth" },
      { label: "Ambassador Score", getValue: () => "92/100", trend: "Top 10 nationally" },
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
      { label: "Submit Weekly Report", href: "#" },
      { label: "Request Promo Assets", href: "#" },
      { label: "Open Student Leads", href: "#" },
    ],
  },
  student: {
    name: "Student",
    headline: "Your Campus Life Hub",
    description: "Manage marketplace activity, events, rides, and your personal Campus Memory collection in one student dashboard.",
    accentColor: "from-accent to-orange-400",
    metrics: [
      { label: "Saved Listings", getValue: () => "19", trend: "4 new this week" },
      { label: "Upcoming Events", getValue: () => "6", trend: "2 with RSVP" },
      { label: "Ride Trips", getValue: () => "34", trend: "TZS 118,000 total" },
      { label: "Memory Storage", getValue: () => "8.4 GB", trend: "72% utilized" },
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
      { label: "Post New Listing", href: "/marketplace" },
      { label: "Browse Events", href: "/events" },
      { label: "Upload Memory Clip", href: "#" },
      { label: "Book Campus Ride", href: "#" },
    ],
  },
  driver: {
    name: "Driver",
    headline: "Trip Performance & Earnings",
    description: "Track trips, optimize routes, manage availability, and monitor payouts with full visibility.",
    accentColor: "from-green-500 to-teal-500",
    metrics: [
      { label: "Trips Today", getValue: () => "22", trend: "+5 vs yesterday" },
      { label: "Completion Rate", getValue: () => "97.8%", trend: "SLA healthy" },
      { label: "Average Rating", getValue: () => "4.9", trend: "From 312 reviews" },
      { label: "Weekly Earnings", getValue: () => "TZS 412,000", trend: "Pending: TZS 80,000" },
    ],
    operations: {
      title: "Dispatch Operations",
      description: "Current route and fleet optimization tasks.",
      items: [
        "Maintain response time below 2 minutes in evening peak.",
        "Complete vehicle inspection checklist by 8:00 PM.",
        "Confirm campus gate pickup compliance for UDSM routes.",
        "Review fuel-efficiency report and route optimization tips.",
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
      { label: "Go Online", href: "#" },
      { label: "View Peak Zones", href: "#" },
      { label: "Request Payout", href: "#" },
      { label: "Report Trip Issue", href: "#" },
    ],
  },
  "restaurant-owner": {
    name: "Restaurant Owner",
    headline: "Kitchen Operations & Campus Orders",
    description: "Manage menus, monitor order flow, and improve delivery performance for student customers.",
    accentColor: "from-orange-500 to-red-500",
    metrics: [
      { label: "Orders Today", getValue: () => "147", trend: "+18% vs last Tuesday" },
      { label: "Prep Time", getValue: () => "14 min", trend: "Target: under 15 min" },
      { label: "Average Rating", getValue: () => "4.7", trend: "From 1,028 reviews" },
      { label: "Revenue (7d)", getValue: () => "TZS 2.9M", trend: "Net margin 24%" },
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
      { label: "Add Menu Item", href: "#" },
      { label: "Launch Lunch Promo", href: "#" },
      { label: "Pause Busy Kitchen", href: "#" },
      { label: "Download Revenue Report", href: "#" },
    ],
  },
  delivery: {
    name: "Delivery Rider",
    headline: "Fulfillment Speed & Delivery Reliability",
    description: "Handle active deliveries, optimize drop routes, and track performance metrics in real time.",
    accentColor: "from-sky-500 to-blue-600",
    metrics: [
      { label: "Deliveries Today", getValue: () => "31", trend: "+6 vs average" },
      { label: "On-Time Rate", getValue: () => "96.4%", trend: "Target: above 95%" },
      { label: "Avg Drop Time", getValue: () => "18 min", trend: "-2 min improvement" },
      { label: "Weekly Payout", getValue: () => "TZS 286,000", trend: "Pending: TZS 54,000" },
    ],
    operations: {
      title: "Delivery Queue",
      description: "Assignments and service priorities.",
      items: [
        "Complete 4 stacked deliveries in Mlimani route cluster.",
        "Prioritize one high-value order with live tracking alerts.",
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
      { label: "Open Active Route", href: "#" },
      { label: "Report Delay", href: "#" },
      { label: "Request Support", href: "#" },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params
  const config = roleConfig[role]
  return {
    title: config ? `${config.name} Dashboard — CampusVibe` : "Dashboard — CampusVibe",
  }
}

export default async function RoleDashboardPage({ params }: Props) {
  const { role } = await params

  if (!validRoles.includes(role)) notFound()

  const user = await getCurrentUser()
  if (!user) redirect("/login")

  if (!user.roles.includes(role)) {
    redirect("/dashboard")
  }

  if (role === "administrator") {
    redirect(`/dashboard/${role}/admin/overview`)
  }

  const config = roleConfig[role]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-body text-muted hover:text-dark transition-colors">
              Home
            </Link>
            <span className="text-gray-200">/</span>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-dark transition-colors font-body">
              <ArrowLeft size={14} /> Dashboards
            </Link>
            <span className="text-gray-200">/</span>
            <span className="text-sm font-section font-semibold text-dark">{config.name}</span>
          </div>
          <form action={logout}>
            <button type="submit" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body text-muted hover:text-dark hover:bg-gray-50 transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </form>
        </div>
      </div>

      <div className={`bg-gradient-to-r ${config.accentColor} text-white py-8 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <p className="text-white/70 text-xs font-section uppercase tracking-widest mb-1">{config.name}</p>
          <h1 className="font-heading font-black text-2xl sm:text-3xl">{config.headline}</h1>
          <p className="mt-1.5 text-white/80 font-body text-sm max-w-2xl">{config.description}</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {config.metrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-muted font-body mb-1">{metric.label}</p>
              <p className="font-heading font-black text-2xl text-dark">{metric.getValue()}</p>
              <p className="text-xs text-muted font-body mt-1">{metric.trend}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-section font-bold text-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {config.quickActions.map((action) => (
              <Link key={action.label} href={action.href}
                className="text-center py-3 px-3 rounded-xl border border-gray-200 hover:border-brand hover:bg-brand/5 text-sm font-section font-semibold text-dark hover:text-brand transition-all">
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-section font-bold text-dark mb-1">{config.operations.title}</h2>
            <p className="text-xs text-muted font-body mb-4">{config.operations.description}</p>
            <ul className="space-y-3">
              {config.operations.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-dark font-body">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand text-xs font-section font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-section font-bold text-dark mb-1">{config.compliance.title}</h2>
            <p className="text-xs text-muted font-body mb-4">{config.compliance.description}</p>
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
      </main>
    </div>
  )
}
