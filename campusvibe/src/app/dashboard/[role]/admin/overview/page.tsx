import Link from "next/link"
import { Mail, AlertTriangle, Users, Building2, Shield } from "lucide-react"
import AdminShell from "../AdminShell"
import { StatCard } from "@/components/admin/StatCard"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { DashboardSection } from "@/components/admin/DashboardSection"
import { GridCard } from "@/components/admin/GridCard"
import { getAdminSnapshot } from "../data"
import { requireAdministrator } from "../guard"

type Props = { params: Promise<{ role: string }> }

export default async function AdminOverviewPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const snapshot = await getAdminSnapshot()

  const moderationBacklog =
    snapshot.pendingNews + snapshot.pendingEvents + snapshot.pendingMedia + snapshot.pendingListings

  const breadcrumbItems = [
    { label: "Admin", href: `/dashboard/${role}/admin` },
    { label: "Overview" },
  ]

  return (
    <AdminShell role={role} section="overview" user={user} breadcrumb={["Home", "Admin", "Overview"]}>
      <AdminHeader title="Dashboard Overview" breadcrumbItems={breadcrumbItems} />

      {/* Key Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={snapshot.totalUsers}
          subtitle={`${snapshot.adminUsers} admins`}
          gradient="indigo"
          trend={{ value: 12, direction: "up" }}
        />
        <StatCard
          title="Live Content"
          value={snapshot.publishedNews + snapshot.publishedEvents + snapshot.publishedMedia + snapshot.publishedListings}
          subtitle="Across all modules"
          gradient="cyan"
          trend={{ value: 8, direction: "up" }}
        />
        <StatCard
          title="Pending Moderation"
          value={moderationBacklog}
          subtitle="Awaiting approval"
          gradient="amber"
          trend={{ value: 5, direction: "down" }}
        />
        <StatCard
          title="Support Inbox"
          value={snapshot.unreadContacts}
          subtitle="Unread messages"
          gradient="emerald"
          trend={{ value: 3, direction: "down" }}
        />
      </section>

      {/* Content Coverage */}
      <DashboardSection
        title="Content Coverage"
        description="Publishing statistics across all content modules"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <GridCard
            title="News Articles"
            href={`/dashboard/${role}/admin/content/news`}
            description={`${snapshot.publishedNews} published`}
            icon="news"
            badge={{ label: `${snapshot.totalNews} total`, variant: "primary" }}
          >
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">Publication Rate</span>
                <span className="font-semibold">{Math.round((snapshot.publishedNews / Math.max(snapshot.totalNews, 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.round((snapshot.publishedNews / Math.max(snapshot.totalNews, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </GridCard>

          <GridCard
            title="Events"
            href={`/dashboard/${role}/admin/content/events`}
            description={`${snapshot.publishedEvents} published`}
            icon="events"
            badge={{ label: `${snapshot.totalEvents} total`, variant: "primary" }}
          >
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">Publication Rate</span>
                <span className="font-semibold">{Math.round((snapshot.publishedEvents / Math.max(snapshot.totalEvents, 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.round((snapshot.publishedEvents / Math.max(snapshot.totalEvents, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </GridCard>

          <GridCard
            title="Media Files"
            href={`/dashboard/${role}/admin/content/media`}
            description={`${snapshot.publishedMedia} published`}
            icon="media"
            badge={{ label: `${snapshot.totalMedia} total`, variant: "primary" }}
          >
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">Publication Rate</span>
                <span className="font-semibold">{Math.round((snapshot.publishedMedia / Math.max(snapshot.totalMedia, 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-violet-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.round((snapshot.publishedMedia / Math.max(snapshot.totalMedia, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </GridCard>

          <GridCard
            title="Marketplace"
            href={`/dashboard/${role}/admin/content/marketplace`}
            description={`${snapshot.publishedListings} published`}
            icon="marketplace"
            badge={{ label: `${snapshot.totalListings} total`, variant: "primary" }}
          >
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">Publication Rate</span>
                <span className="font-semibold">{Math.round((snapshot.publishedListings / Math.max(snapshot.totalListings, 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-rose-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.round((snapshot.publishedListings / Math.max(snapshot.totalListings, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </GridCard>
        </div>
      </DashboardSection>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardSection title="Priority Actions" description="Items requiring immediate attention">
            <div className="space-y-2">
              <Link
                href={`/dashboard/${role}/admin/moderation`}
                className="flex items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors group"
              >
                <span className="inline-flex items-center gap-3 text-sm font-medium text-amber-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-200 text-amber-900">
                    <AlertTriangle size={16} />
                  </div>
                  Moderation Queue
                </span>
                <span className="font-bold text-amber-900 group-hover:scale-105 transition-transform">{moderationBacklog}</span>
              </Link>

              <Link
                href={`/dashboard/${role}/admin/inbox`}
                className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors group"
              >
                <span className="inline-flex items-center gap-3 text-sm font-medium text-blue-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-200 text-blue-900">
                    <Mail size={16} />
                  </div>
                  Support Inbox
                </span>
                <span className="font-bold text-blue-900 group-hover:scale-105 transition-transform">{snapshot.unreadContacts}</span>
              </Link>
            </div>
          </DashboardSection>
        </div>

        <DashboardSection title="Management" description="Core admin functions">
          <div className="space-y-2">
            <Link
              href={`/dashboard/${role}/admin/users`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <Users size={16} className="text-blue-600" />
              <span className="font-medium text-slate-900">Users</span>
            </Link>
            <Link
              href={`/dashboard/${role}/admin/campuses`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <Building2 size={16} className="text-emerald-600" />
              <span className="font-medium text-slate-900">Campuses</span>
            </Link>
            <Link
              href={`/dashboard/${role}/admin/company`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <Shield size={16} className="text-violet-600" />
              <span className="font-medium text-slate-900">Company</span>
            </Link>
            <Link
              href={`/dashboard/${role}/admin/analytics`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <AlertTriangle size={16} className="text-amber-600" />
              <span className="font-medium text-slate-900">Analytics</span>
            </Link>
            <Link
              href={`/dashboard/${role}/admin/audit`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <Shield size={16} className="text-rose-600" />
              <span className="font-medium text-slate-900">Audit Log</span>
            </Link>
          </div>
        </DashboardSection>
      </div>
    </AdminShell>
  )
}
