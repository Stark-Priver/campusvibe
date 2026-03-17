import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, ArrowRight, Archive, Camera, Clapperboard, Film, ShieldCheck } from "lucide-react"
import { dashboardRoles, getDashboardByRole } from "@/lib/dashboardData"
import { getCurrentMockUser } from "@/lib/auth/session"
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
    <>
      <section className="pt-16 bg-surface border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-7 sm:pt-10 sm:pb-9">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors"
          >
            <ArrowLeft size={14} />
            All Dashboards
          </Link>
          <p className="mt-4 text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
            {dashboard.roleName} Workspace
          </p>
          <h1 className="mt-2 font-heading font-black text-3xl sm:text-4xl text-dark leading-tight max-w-4xl">
            {dashboard.headline}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-muted font-body leading-relaxed max-w-3xl">
            {dashboard.description}
          </p>
        </div>
      </section>

      <section className="bg-[#ECECEC] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            {rolePanelMap[dashboard.slug]}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {dashboard.metrics.map((metric) => (
              <article key={metric.label} className="card-pro p-4 sm:p-5">
                <p className="text-[11px] text-muted font-body">{metric.label}</p>
                <p className="mt-1.5 font-heading font-black text-xl sm:text-2xl text-dark">{metric.value}</p>
                {metric.trend ? <p className="mt-1 text-[11px] text-brand font-body">{metric.trend}</p> : null}
              </article>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
            <article className="card-pro p-5 xl:col-span-1">
              <h2 className="font-section font-bold text-lg text-dark">Quick Actions</h2>
              <p className="mt-1.5 text-sm text-muted font-body">Immediate commands for this role.</p>
              <div className="mt-4 space-y-2.5">
                {dashboard.quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-semibold text-dark hover:border-brand hover:text-brand transition-colors"
                  >
                    <span>{action.label}</span>
                    <ArrowRight size={13} />
                  </a>
                ))}
              </div>
            </article>

            <article className="card-pro p-5 xl:col-span-1">
              <h2 className="font-section font-bold text-lg text-dark">{dashboard.operations.title}</h2>
              <p className="mt-1.5 text-sm text-muted font-body">{dashboard.operations.description}</p>
              <ul className="mt-4 space-y-2.5">
                {dashboard.operations.items.map((item) => (
                  <li key={item} className="text-sm text-dark font-body leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card-pro p-5 xl:col-span-1">
              <h2 className="font-section font-bold text-lg text-dark">{dashboard.compliance.title}</h2>
              <p className="mt-1.5 text-sm text-muted font-body">{dashboard.compliance.description}</p>
              <ul className="mt-4 space-y-2.5">
                {dashboard.compliance.items.map((item) => (
                  <li key={item} className="text-sm text-dark font-body leading-relaxed flex items-start gap-2">
                    <ShieldCheck size={14} className="text-success mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {dashboard.campusMemory ? (
        <section className="bg-white py-8 sm:py-10 border-t border-gray-100 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              Student Memory Vault
            </p>
            <h2 className="mt-1.5 font-section font-bold text-2xl text-dark">
              Campus Memory and Graduation Archive
            </h2>
            <p className="mt-2 text-sm text-muted font-body max-w-3xl leading-relaxed">
              Photos, short clips, and videos are securely stored across your student years. At graduation,
              Campus Vibe prepares a personal flash-drive archive package with your complete memory collection.
            </p>

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <article className="card-pro p-4">
                <p className="text-[11px] text-muted">Albums</p>
                <p className="mt-1 text-xl font-heading font-black text-dark">{dashboard.campusMemory.albums}</p>
              </article>
              <article className="card-pro p-4">
                <p className="text-[11px] text-muted">Short Clips</p>
                <p className="mt-1 text-xl font-heading font-black text-dark">{dashboard.campusMemory.shortClips}</p>
              </article>
              <article className="card-pro p-4">
                <p className="text-[11px] text-muted">Videos</p>
                <p className="mt-1 text-xl font-heading font-black text-dark">{dashboard.campusMemory.videos}</p>
              </article>
              <article className="card-pro p-4">
                <p className="text-[11px] text-muted">Storage Usage</p>
                <p className="mt-1 text-xl font-heading font-black text-dark">{dashboard.campusMemory.storageUsed}</p>
              </article>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              <article className="card-pro p-5">
                <h3 className="font-section font-bold text-lg text-dark">Recent Memory Moments</h3>
                <ul className="mt-4 space-y-3">
                  {dashboard.campusMemory.moments.map((moment) => (
                    <li
                      key={`${moment.title}-${moment.createdAt}`}
                      className="rounded-xl border border-gray-200 px-3.5 py-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-dark">{moment.title}</p>
                        <p className="text-xs text-muted font-body mt-0.5">{moment.createdAt}</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-xs font-semibold text-dark">
                        {moment.mediaType === "Photo" ? <Camera size={12} /> : null}
                        {moment.mediaType === "Short Clip" ? <Clapperboard size={12} /> : null}
                        {moment.mediaType === "Video" ? <Film size={12} /> : null}
                        {moment.mediaType}
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="card-pro p-5 bg-brand/5 border-brand/25">
                <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Archive size={20} />
                </div>
                <h3 className="mt-4 font-section font-bold text-lg text-dark">Graduation Flash-Drive Package</h3>
                <p className="mt-2 text-sm text-muted font-body leading-relaxed">
                  Your complete Campus Memory archive will be exported for physical delivery upon graduation.
                  This includes validated photos, short clips, and long-form videos from your full student journey.
                </p>
                <div className="mt-4 space-y-2 text-sm font-body text-dark">
                  <p>
                    <span className="text-muted">Graduation Class:</span> {dashboard.campusMemory.graduationClass}
                  </p>
                  <p>
                    <span className="text-muted">Archive Status:</span> {dashboard.campusMemory.flashDriveStatus}
                  </p>
                  <p>
                    <span className="text-muted">Next Archive Date:</span> {dashboard.campusMemory.nextArchiveDate}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-interactive transition-colors"
                  >
                    Generate Archive Preview
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-dark hover:border-brand hover:text-brand transition-colors"
                  >
                    Request Support
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-surface py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="card-pro p-5">
            <h2 className="font-section font-bold text-xl text-dark">Recent Activity</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {dashboard.recentActivity.map((activity) => (
                <div key={activity} className="rounded-xl border border-gray-200 bg-white px-3.5 py-3">
                  <p className="text-sm text-dark font-body leading-relaxed">{activity}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}