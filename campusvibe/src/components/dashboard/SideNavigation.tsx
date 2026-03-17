"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Home,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Truck,
  Store,
  Bike,
  GraduationCap,
  Bell,
  Search,
} from "lucide-react"
import type { DashboardRoleSlug, DashboardAction } from "@/lib/dashboardData"
import { signOut } from "@/app/login/actions"

interface SideNavigationProps {
  roleName: string
  roleSlug: DashboardRoleSlug
  userName: string
  userEmail: string
  isDarkMode?: boolean
  quickActions: DashboardAction[]
}

const roleIcons: Record<DashboardRoleSlug, React.ComponentType<{ size: number }>> = {
  administrator: ShieldCheck,
  ambassador: Users,
  student: GraduationCap,
  driver: Truck,
  "restaurant-owner": Store,
  delivery: Bike,
}

const mainMenuItems = [
  {
    icon: Home,
    label: "Dashboard",
    href: "#",
    badge: null,
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "#",
    badge: null,
  },
  {
    icon: Users,
    label: "Management",
    href: "#",
    badge: "Soon",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    badge: null,
  },
]

export default function SideNavigation({
  roleName,
  roleSlug,
  userName,
  userEmail,
  isDarkMode = false,
  quickActions,
}: SideNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const RoleIcon = roleIcons[roleSlug]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-gray-200 hover:border-brand text-dark transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-gray-100">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-interactive flex items-center justify-center">
              <Image
                src="/media/logo.jpeg"
                alt="Campus Vibe"
                width={40}
                height={40}
                className="w-8 h-8 rounded-md"
              />
            </div>
            <div className="flex-1">
              <p className="font-section font-bold text-sm text-dark">Campus</p>
              <p className="font-section font-bold text-sm text-brand">Vibe</p>
            </div>
          </Link>
        </div>

        {/* Current Role Badge */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-start gap-3 p-3.5 bg-gradient-to-br from-brand/5 to-interactive/5 rounded-lg border border-brand/10">
            <div className="w-9 h-9 rounded-lg bg-brand/20 text-brand flex items-center justify-center shrink-0">
              <RoleIcon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-widest font-section font-semibold text-muted">
                Current Role
              </p>
              <p className="mt-1 font-section font-bold text-sm text-dark line-clamp-2">{roleName}</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 text-[10px] uppercase tracking-widest font-section font-semibold text-muted mb-3">
            Menu
          </p>
          <ul className="space-y-1.5">
            {mainMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname?.includes(item.label.toLowerCase())
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "text-dark hover:bg-gray-50 hover:text-brand"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Quick Actions Section */}
          {quickActions && quickActions.length > 0 && (
            <>
              <p className="px-3 text-[10px] uppercase tracking-widest font-section font-semibold text-muted mt-6 mb-3">
                Quick Actions
              </p>
              <ul className="space-y-1.5">
                {quickActions.map((action) => (
                  <li key={action.label}>
                    <Link
                      href={action.href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-dark hover:bg-gray-50 hover:text-brand transition-colors duration-150"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center gap-2.5">
                        <ChevronRight size={16} />
                        <span>{action.label}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          {/* Notifications & Search (Optional) */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-dark">
              <Bell size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-dark">
              <Search size={18} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-[11px] uppercase tracking-widest font-section font-semibold text-muted">
              Logged in as
            </p>
            <p className="mt-1 font-section font-bold text-sm text-dark truncate">{userName}</p>
            <p className="text-[11px] text-muted truncate">{userEmail}</p>
          </div>

          {/* Sign Out */}
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-sm font-semibold transition-colors duration-150"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
