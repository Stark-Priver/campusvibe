"use client"

import SideNavigation from "@/components/dashboard/SideNavigation"
import type { DashboardRoleSlug, DashboardAction } from "@/lib/dashboardData"

interface DashboardLayoutProps {
  children: React.ReactNode
  roleName: string
  roleSlug: DashboardRoleSlug
  userName: string
  userEmail: string
  quickActions: DashboardAction[]
}

export default function DashboardLayout({
  children,
  roleName,
  roleSlug,
  userName,
  userEmail,
  quickActions,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <SideNavigation
          roleName={roleName}
          roleSlug={roleSlug}
          userName={userName}
          userEmail={userEmail}
          quickActions={quickActions}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
