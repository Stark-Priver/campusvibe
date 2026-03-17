import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, ShieldCheck, Users, Truck, Store, Bike, GraduationCap } from "lucide-react"
import { getCurrentMockUser } from "@/lib/auth/session"
import { getDashboardByRole } from "@/lib/dashboardData"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

export const metadata: Metadata = {
  title: "Role Dashboards | CampusVibe",
  description:
    "Professional role-based dashboards for administrators, ambassadors, students, drivers, restaurant owners, and delivery teams.",
}

const roleIconMap = {
  administrator: ShieldCheck,
  ambassador: Users,
  student: GraduationCap,
  driver: Truck,
  "restaurant-owner": Store,
  delivery: Bike,
} as const

export default async function DashboardLandingPage() {
  const currentUser = await getCurrentMockUser()
  if (!currentUser) redirect("/login")

  const availableRoles = currentUser.roles
    .map((role) => getDashboardByRole(role))
    .filter((role): role is NonNullable<ReturnType<typeof getDashboardByRole>> => Boolean(role))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      {/* Header */}
      <DashboardHeader
        title={`Welcome, ${currentUser.fullName}`}
        subtitle="Select a role to access your professional dashboard workspace"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
        ]}
      />

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Signed in as */}
        <div className="mb-8 p-4 bg-brand/5 border border-brand/20 rounded-lg">
          <p className="text-sm text-brand font-semibold">
            Signed in as <span className="font-bold text-dark">{currentUser.email}</span>
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRoles.length > 0 ? (
            availableRoles.map((role) => {
              const Icon = roleIconMap[role.slug]
              return (
                <Link
                  key={role.slug}
                  href={`/dashboard/${role.slug}`}
                  className="group bg-white rounded-lg border border-gray-200 hover:border-brand hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Icon Badge */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand/10 to-interactive/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} />
                    </div>

                    {/* Title */}
                    <h2 className="mt-4 font-section font-bold text-lg text-dark">
                      {role.roleName}
                    </h2>

                    {/* Description */}
                    <p className="mt-2 text-sm text-muted font-body leading-relaxed line-clamp-2">
                      {role.description}
                    </p>

                    {/* CTA */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand group-hover:text-interactive transition-colors">
                      <span>Access Dashboard</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div className="h-1 bg-gradient-to-r from-brand to-interactive scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted font-body">No roles assigned yet.</p>
            </div>
          )}
        </div>

        {/* Help Section */}
        {availableRoles.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-section font-bold text-dark mb-2">Need Help?</h3>
              <p className="text-sm text-muted font-body mb-4">
                Each dashboard is tailored to your specific role with relevant metrics, actions, and compliance information.
              </p>
              <Link
                href="#"
                className="text-sm font-semibold text-brand hover:text-interactive transition-colors"
              >
                View Documentation →
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-section font-bold text-dark mb-2">Multiple Roles</h3>
              <p className="text-sm text-muted font-body mb-4">
                You have {currentUser.roles.length} role{currentUser.roles.length !== 1 ? 's' : ''} assigned. Switch between them anytime.
              </p>
              <Link
                href="#"
                className="text-sm font-semibold text-brand hover:text-interactive transition-colors"
              >
                Manage Roles →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
