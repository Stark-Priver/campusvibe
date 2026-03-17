import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { dashboardRoles, getDashboardByRole } from "@/lib/dashboardData"
import { getCurrentMockUser } from "@/lib/auth/session"
import DashboardLayout from "@/components/dashboard/DashboardLayoutWrapper"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import AdminRolePanel from "@/components/dashboard/roles/admin/AdminRolePanel"
import AmbassadorRolePanel from "@/components/dashboard/roles/ambassador/AmbassadorRolePanel"
import StudentRolePanel from "@/components/dashboard/roles/student/StudentRolePanel"
import DriverRolePanel from "@/components/dashboard/roles/driver/DriverRolePanel"
import RestaurantRolePanel from "@/components/dashboard/roles/restaurant/RestaurantRolePanel"
import DeliveryRolePanel from "@/components/dashboard/roles/delivery/DeliveryRolePanel"

type Props = { params: Promise<{ role: string }> }

export function generateStaticParams() {
  return dashboardRoles.map((role) => ({ role: role.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params
  const dashboard = getDashboardByRole(role)

  if (!dashboard) {
    return { title: "Dashboard | CampusVibe" }
  }

  return {
    title: `${dashboard.roleName} Dashboard | CampusVibe`,
    description: dashboard.description,
    alternates: {
      canonical: `/dashboard/${dashboard.slug}`,
    },
  }
}

export default async function RoleDashboardPage({ params }: Props) {
  const { role } = await params
  const currentUser = await getCurrentMockUser()
  if (!currentUser) redirect("/login")

  if (!currentUser.roles.includes(role as (typeof currentUser.roles)[number])) {
    redirect("/dashboard")
  }

  const dashboard = getDashboardByRole(role)

  if (!dashboard) notFound()

  const rolePanelMap = {
    administrator: <AdminRolePanel />,
    ambassador: <AmbassadorRolePanel />,
    student: <StudentRolePanel />,
    driver: <DriverRolePanel />,
    "restaurant-owner": <RestaurantRolePanel />,
    delivery: <DeliveryRolePanel />,
  } as const

  return (
    <DashboardLayout
      roleName={dashboard.roleName}
      roleSlug={dashboard.slug}
      userName={currentUser.fullName}
      userEmail={currentUser.email}
      quickActions={[
        { label: "Back to Role Selector", href: "/dashboard" },
        ...dashboard.quickActions,
      ]}
    >
      {/* Header */}
      <DashboardHeader
        title={dashboard.headline}
        subtitle={dashboard.description}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: dashboard.roleName, href: "#" },
        ]}
      />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Role Panel */}
        {rolePanelMap[dashboard.slug]}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboard.metrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <p className="text-[11px] uppercase tracking-widest font-section font-semibold text-muted">
                {metric.label}
              </p>
              <p className="mt-2 font-heading font-black text-2xl text-dark">{metric.value}</p>
              {metric.trend && (
                <p className="mt-1.5 text-[12px] font-semibold text-brand">{metric.trend}</p>
              )}
            </div>
          ))}
        </div>

        {/* Operations & Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-section font-bold text-lg text-dark">{dashboard.operations.title}</h2>
            <p className="mt-2 text-sm text-muted font-body">{dashboard.operations.description}</p>
            <ul className="mt-4 space-y-3">
              {dashboard.operations.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                  <span className="text-sm text-dark font-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-section font-bold text-lg text-dark">{dashboard.compliance.title}</h2>
            <p className="mt-2 text-sm text-muted font-body">{dashboard.compliance.description}</p>
            <ul className="mt-4 space-y-3">
              {dashboard.compliance.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-success mt-0 shrink-0" />
                  <span className="text-sm text-dark font-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Activity */}
        {dashboard.recentActivity && dashboard.recentActivity.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-section font-bold text-lg text-dark">Recent Activity</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {dashboard.recentActivity.map((activity) => (
                <div key={activity} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-dark font-body leading-relaxed">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}