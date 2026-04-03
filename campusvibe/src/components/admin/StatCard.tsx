"use client"

import { StatCardSkeleton } from "../ui/SkeletonLoader"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  gradient: "indigo" | "cyan" | "amber" | "emerald" | "rose" | "violet"
  trend?: {
    value: number
    direction: "up" | "down"
  }
  isLoading?: boolean
}

const gradients = {
  indigo: "from-indigo-500 to-indigo-600 border-indigo-200",
  cyan: "from-sky-500 to-cyan-500 border-cyan-200",
  amber: "from-amber-500 to-orange-500 border-amber-200",
  emerald: "from-emerald-500 to-teal-500 border-emerald-200",
  rose: "from-rose-500 to-pink-500 border-rose-200",
  violet: "from-violet-500 to-purple-600 border-violet-200",
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
  isLoading,
}: StatCardProps) {
  if (isLoading) return <StatCardSkeleton />

  return (
    <div className={`rounded-2xl p-4 border bg-gradient-to-br ${gradients[gradient]} text-white shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-white/80 font-medium">{title}</p>
          <p className="font-heading font-black text-3xl mt-2">{value}</p>
          {subtitle && <p className="text-xs text-white/85 mt-1">{subtitle}</p>}
        </div>
        {Icon && <Icon className="text-white/40" size={24} />}
      </div>
      {trend && (
        <div className={`mt-3 text-xs font-semibold ${trend.direction === "up" ? "text-emerald-100" : "text-rose-100"}`}>
          {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.direction === "up" ? "increase" : "decrease"}
        </div>
      )}
    </div>
  )
}
