"use client"

import Link from "next/link"
import { ArrowLeft, Bell, Settings } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{
    label: string
    href: string
  }>
  actions?: React.ReactNode
}

export default function DashboardHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-5">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <Link
                  href={crumb.href}
                  className="text-sm text-muted hover:text-brand transition-colors"
                >
                  {crumb.label}
                </Link>
                {idx < breadcrumbs.length - 1 && (
                  <span className="text-muted">/</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Title Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-dark">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-muted font-body">{subtitle}</p>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-dark">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-dark">
              <Settings size={20} />
            </button>
            {actions}
          </div>
        </div>
      </div>
    </header>
  )
}
