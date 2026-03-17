import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Users, Truck, Store, Bike, GraduationCap } from "lucide-react"
import { dashboardRoles } from "@/lib/dashboardData"

export const metadata: Metadata = {
  title: "Role Dashboards | CampusVibe",
  description:
    "Explore professional role-based dashboard previews for administrators, ambassadors, students, drivers, restaurant owners, and delivery teams.",
}

const roleIconMap = {
  administrator: ShieldCheck,
  ambassador: Users,
  student: GraduationCap,
  driver: Truck,
  "restaurant-owner": Store,
  delivery: Bike,
} as const

export default function DashboardLandingPage() {
  return (
    <>
      <section className="pt-16 bg-surface border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 pb-8 sm:pt-11 sm:pb-10">
          <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
            Campus Vibe Command Center
          </p>
          <h1 className="mt-2 font-heading font-black text-3xl sm:text-4xl text-dark leading-tight max-w-3xl">
            Professional Role Dashboards
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-muted font-body max-w-3xl leading-relaxed">
            Select a dashboard role to preview complete system interfaces with mock operational data.
            Each role is structured for real workflow execution and production readiness.
          </p>
        </div>
      </section>

      <section className="bg-[#ECECEC] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {dashboardRoles.map((role) => {
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