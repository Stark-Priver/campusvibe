"use client"

import Link from "next/link"
import {
  Newspaper,
  CalendarDays,
  Clapperboard,
  Store,
  Users,
  Building2,
  Shield,
  Mail,
  AlertTriangle,
} from "lucide-react"

type IconName = "news" | "events" | "media" | "marketplace" | "users" | "campuses" | "company" | "inbox" | "audit"

const iconMap: Record<IconName, React.ComponentType<{ size?: number; className?: string }>> = {
  news: Newspaper,
  events: CalendarDays,
  media: Clapperboard,
  marketplace: Store,
  users: Users,
  campuses: Building2,
  company: Shield,
  inbox: Mail,
  audit: AlertTriangle,
}

interface GridCardProps {
  title: string
  description?: string
  icon?: IconName
  href?: string
  badge?: { label: string; variant: "primary" | "success" | "warning" | "danger" }
  isLoading?: boolean
  children?: React.ReactNode
}

const badgeVariants = {
  primary: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
}

export function GridCard({
  title,
  description,
  icon,
  href,
  badge,
  isLoading,
  children,
}: GridCardProps) {
  const Icon = icon ? iconMap[icon] : undefined

  const content = (
    <div className="h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="font-semibold text-slate-900 text-sm">{title}</p>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        {Icon && <Icon className="text-slate-400" size={18} />}
      </div>
      {badge && (
        <div className={`inline-block text-[11px] font-medium px-2 py-1 rounded-full border ${badgeVariants[badge.variant]} mt-3`}>
          {badge.label}
        </div>
      )}
      {children}
    </div>
  )

  const className =
    "rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md"

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
