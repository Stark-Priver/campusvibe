import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | CampusVibe",
  description: "Professional dashboard for CampusVibe users",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
