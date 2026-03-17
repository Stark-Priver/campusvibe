import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, ShieldCheck, Users, Truck, Store, Bike, GraduationCap } from "lucide-react"
import { getCurrentMockUser } from "@/lib/auth/session"
import { getDashboardByRole } from "@/lib/dashboardData"
import { signOut } from "@/app/login/actions"

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
    <>
      <section className="pt-16 bg-surface border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 pb-8 sm:pt-11 sm:pb-10">
          <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
            Campus Vibe Command Center
          </p>
          <h1 className="mt-2 font-heading font-black text-3xl sm:text-4xl text-dark leading-tight max-w-3xl">
            Welcome, {currentUser.fullName}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-muted font-body max-w-3xl leading-relaxed">
            Signed in as {currentUser.email}. Select one of your assigned roles to open the
            corresponding professional dashboard workspace.
          </p>
        </div>
      </section>

      <section className="bg-[#ECECEC] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <p className="text-sm text-muted font-body">Assigned roles: {currentUser.roles.length}</p>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-dark hover:border-brand hover:text-brand transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {availableRoles.map((role) => {
              const Icon = roleIconMap[role.slug]
              return (
                <article key={role.slug} className="card-pro card-hover p-5 flex flex-col">
                  <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-4 font-section font-bold text-lg text-dark">{role.roleName}</h2>
                  <p className="mt-2 text-sm text-muted font-body leading-relaxed flex-1">{role.description}</p>
                  <Link
                    href={`/dashboard/${role.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-interactive transition-colors"
                  >
                    Open Dashboard
                    <ArrowRight size={14} />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
