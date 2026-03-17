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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <SideNavigation
        roleName={roleName}
        roleSlug={roleSlug}
        userName={userName}
        userEmail={userEmail}
        quickActions={quickActions}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:ml-0">
        {children}
      </main>
    </div>
  )
}
