export type DashboardRoleSlug =
  | "administrator"
  | "ambassador"
  | "student"
  | "driver"
  | "restaurant-owner"
  | "delivery"

export interface DashboardMetric {
  label: string
  value: string
  trend?: string
}

export interface DashboardAction {
  label: string
  href: string
}

export interface DashboardPanel {
  title: string
  description: string
  items: string[]
}

export interface CampusMemoryData {
  albums: number
  shortClips: number
  videos: number
  storageUsed: string
  graduationClass: string
  flashDriveStatus: string
  nextArchiveDate: string
  moments: Array<{
    title: string
    mediaType: "Photo" | "Short Clip" | "Video"
    createdAt: string
  }>
}

export interface RoleDashboard {
  slug: DashboardRoleSlug
  roleName: string
  headline: string
  description: string
  metrics: DashboardMetric[]
  quickActions: DashboardAction[]
  operations: DashboardPanel
  compliance: DashboardPanel
  recentActivity: string[]
  campusMemory?: CampusMemoryData
}

export const roleDashboards: RoleDashboard[] = [
  {
    slug: "administrator",
    roleName: "Administrator",
    headline: "System Governance and Platform Control",
    description:
      "Monitor platform health, user growth, marketplace activity, and policy enforcement across all Campus Vibe services.",
    metrics: [
      { label: "Total Active Users", value: "12,842", trend: "+8.2% this month" },
      { label: "Open Moderation Cases", value: "26", trend: "-14% vs last week" },
      { label: "Live Campuses", value: "18", trend: "+3 launched this quarter" },
      { label: "Platform Uptime", value: "99.96%", trend: "SLA target met" },
    ],
    quickActions: [
      { label: "Approve New Campus", href: "#" },
      { label: "Review Reported Content", href: "#" },
      { label: "Publish System Notice", href: "#" },
      { label: "Export Executive Report", href: "#" },
    ],
    operations: {
      title: "Operational Priorities",
      description: "Critical tasks requiring administrator action in the next 24 hours.",
      items: [
        "Approve 7 pending partner onboarding requests.",
        "Resolve 4 high-priority listing dispute tickets.",
        "Review event safety compliance checklist for two flagship events.",
        "Validate payout reconciliation report before 6:00 PM.",
      ],
    },
    compliance: {
      title: "Governance and Compliance",
      description: "Audit posture and policy adherence across all modules.",
      items: [
        "Content moderation response time: 1h 12m average.",
        "Driver verification completion rate: 98.4%.",
        "Restaurant KYC verification rate: 96.8%.",
        "Security incident backlog: 0 unresolved critical items.",
      ],
    },
    recentActivity: [
      "New campus partnership approved: Mbeya University hub.",
      "Marketplace trust score engine updated to v2.1.",
      "24-hour traffic peak reached at 4,112 concurrent users.",
      "Automated fraud alert prevented suspicious bulk listing upload.",
    ],
  },
  {
    slug: "ambassador",
    roleName: "Campus Ambassador",
    headline: "Campus Growth and Community Activation",
    description:
      "Run activation campaigns, recruit student users, and drive engagement for events, media, and app usage on your campus.",
    metrics: [
      { label: "New Signups This Week", value: "214", trend: "+21 vs target" },
      { label: "Campaign Reach", value: "8,430", trend: "Across 5 channels" },
      { label: "Event RSVPs Driven", value: "326", trend: "+17% growth" },
      { label: "Ambassador Score", value: "92/100", trend: "Top 10 nationally" },
    ],
    quickActions: [
      { label: "Create Campus Campaign", href: "#" },
      { label: "Submit Weekly Report", href: "#" },
      { label: "Request Promo Assets", href: "#" },
      { label: "Open Student Leads", href: "#" },
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
    recentActivity: [
      "Completed week 3 activation report and KPI summary.",
      "Secured partnership with two campus clubs for app adoption.",
      "Uploaded 18 approved campaign photos for media team use.",
      "Resolved three onboarding support requests for new students.",
    ],
  },
  {
    slug: "student",
    roleName: "Student",
    headline: "Your Campus Life Hub",
    description:
      "Manage marketplace activity, events, rides, and your personal Campus Memory collection in one student dashboard.",
    metrics: [
      { label: "Saved Listings", value: "19", trend: "4 new this week" },
      { label: "Upcoming Events", value: "6", trend: "2 with confirmed RSVP" },
      { label: "Ride Trips", value: "34", trend: "TZS 118,000 total spend" },
      { label: "Memory Storage", value: "8.4 GB", trend: "72% utilized" },
    ],
    quickActions: [
      { label: "Post New Listing", href: "#" },
      { label: "Book Campus Ride", href: "#" },
      { label: "Upload Memory Clip", href: "#" },
      { label: "Generate Graduation Archive", href: "#" },
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
      title: "Account and Safety",
      description: "Status of account trust, security, and privacy controls.",
      items: [
        "Student verification: completed.",
        "Marketplace trust badge: active.",
        "Privacy settings: memory vault set to private.",
        "Two-factor authentication: enabled.",
      ],
    },
    recentActivity: [
      "Uploaded short clip: Engineering Expo 2026 highlights.",
      "Sold one textbook bundle via campus marketplace.",
      "Booked two rides for internship commute this week.",
      "Added 42 new photos to Semester 2 memory album.",
    ],
    campusMemory: {
      albums: 24,
      shortClips: 138,
      videos: 47,
      storageUsed: "8.4 GB / 12 GB",
      graduationClass: "Class of 2027",
      flashDriveStatus: "Archive package pre-validated",
      nextArchiveDate: "Jun 15, 2027",
      moments: [
        { title: "Freshers Week Opening", mediaType: "Video", createdAt: "Oct 10, 2023" },
        { title: "Hackathon Finals", mediaType: "Short Clip", createdAt: "Apr 06, 2025" },
        { title: "Department Farewell Night", mediaType: "Photo", createdAt: "Nov 21, 2026" },
      ],
    },
  },
  {
    slug: "driver",
    roleName: "Driver",
    headline: "Trip Performance and Earnings",
    description:
      "Track trips, optimize routes, manage availability, and monitor payouts with full visibility.",
    metrics: [
      { label: "Trips Today", value: "22", trend: "+5 vs yesterday" },
      { label: "Completion Rate", value: "97.8%", trend: "SLA healthy" },
      { label: "Average Rating", value: "4.9", trend: "From 312 reviews" },
      { label: "Weekly Earnings", value: "TZS 412,000", trend: "Pending payout: TZS 80,000" },
    ],
    quickActions: [
      { label: "Go Online", href: "#" },
      { label: "View Peak Zones", href: "#" },
      { label: "Request Payout", href: "#" },
      { label: "Report Trip Issue", href: "#" },
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
      title: "Safety and Service Compliance",
      description: "Quality and policy standards for ride operations.",
      items: [
        "All mandatory driver documents valid and up to date.",
        "Customer complaint count this week: 1 (resolved).",
        "Safety checklist completion: 100%.",
        "Background re-verification due in 58 days.",
      ],
    },
    recentActivity: [
      "Completed 9 consecutive five-star trips this afternoon.",
      "Accepted priority airport run with student safety escort enabled.",
      "Updated availability schedule for weekend exam season.",
      "Route optimization suggested 11% fuel savings.",
    ],
  },
  {
    slug: "restaurant-owner",
    roleName: "Restaurant Owner",
    headline: "Kitchen Operations and Campus Orders",
    description:
      "Manage menus, monitor order flow, and improve delivery performance for student customers.",
    metrics: [
      { label: "Orders Today", value: "147", trend: "+18% vs last Tuesday" },
      { label: "Prep Time", value: "14 min", trend: "Target: under 15 min" },
      { label: "Average Rating", value: "4.7", trend: "From 1,028 reviews" },
      { label: "Revenue (7d)", value: "TZS 2.9M", trend: "Net margin 24%" },
    ],
    quickActions: [
      { label: "Add Menu Item", href: "#" },
      { label: "Launch Lunch Promo", href: "#" },
      { label: "Pause Busy Kitchen", href: "#" },
      { label: "Download Revenue Report", href: "#" },
    ],
    operations: {
      title: "Kitchen and Service Queue",
      description: "Immediate priorities for smooth restaurant operations.",
      items: [
        "Restock top-selling meals before 1:00 PM rush.",
        "Confirm allergy tags for all menu updates.",
        "Coordinate with delivery fleet for batch pickups.",
        "Review cancelled order reasons and apply fixes.",
      ],
    },
    compliance: {
      title: "Quality and Food Safety",
      description: "Operational compliance and trust indicators.",
      items: [
        "Food safety certification: valid through 2027.",
        "Late order ratio: 4.1% (within platform target).",
        "Packaging quality score: 95/100.",
        "Customer refund cases this week: 3 (all closed).",
      ],
    },
    recentActivity: [
      "Introduced student budget combo meal with 320 orders in 24h.",
      "Completed weekend promotion with 2.1x conversion lift.",
      "Updated menu photos and descriptions for 12 products.",
      "Responded to customer feedback and improved prep workflow.",
    ],
  },
  {
    slug: "delivery",
    roleName: "Delivery Rider",
    headline: "Fulfillment Speed and Delivery Reliability",
    description:
      "Handle active deliveries, optimize drop routes, and track performance metrics in real time.",
    metrics: [
      { label: "Deliveries Today", value: "31", trend: "+6 vs average" },
      { label: "On-Time Rate", value: "96.4%", trend: "Target: above 95%" },
      { label: "Average Drop Time", value: "18 min", trend: "-2 min improvement" },
      { label: "Weekly Payout", value: "TZS 286,000", trend: "Pending: TZS 54,000" },
    ],
    quickActions: [
      { label: "Start Delivery Shift", href: "#" },
      { label: "Open Active Route", href: "#" },
      { label: "Report Delay", href: "#" },
      { label: "Request Support", href: "#" },
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
    recentActivity: [
      "Completed rush-hour run with 100% on-time handoff.",
      "Resolved route blockage via alternate campus gate path.",
      "Earned delivery quality badge for zero-miss week.",
      "Submitted service feedback for map pin correction.",
    ],
  },
]

export const dashboardRoles = roleDashboards.map((role) => ({
  slug: role.slug,
  roleName: role.roleName,
  headline: role.headline,
  description: role.description,
}))

export function getDashboardByRole(slug: string) {
  return roleDashboards.find((role) => role.slug === slug)
}