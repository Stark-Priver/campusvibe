"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  trend?: {
    direction: "up" | "down" | "neutral"
    percentage: number
    period: string
  }
  icon?: React.ReactNode
  color?: "brand" | "success" | "warning" | "danger"
}

const colorClasses = {
  brand: "bg-brand/10 text-brand",
  success: "bg-success/10 text-success",
  warning: "bg-yellow-100 text-yellow-600",
  danger: "bg-red-100 text-red-600",
}

export default function MetricCard({
  label,
  value,
  trend,
  icon,
  color = "brand",
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
      {/* Icon */}
      {icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      )}

      {/* Label */}
      <p className="text-[11px] uppercase tracking-widest font-section font-semibold text-muted mt-3">
        {label}
      </p>

      {/* Value */}
      <p className="mt-2 font-heading font-black text-3xl text-dark">{value}</p>

      {/* Trend */}
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend.direction === "up" && (
            <>
              <TrendingUp size={14} className="text-success" />
              <span className="text-xs font-semibold text-success">
                {trend.percentage}% {trend.period}
              </span>
            </>
          )}
          {trend.direction === "down" && (
            <>
              <TrendingDown size={14} className="text-danger" />
              <span className="text-xs font-semibold text-danger">
                {trend.percentage}% {trend.period}
              </span>
            </>
          )}
          {trend.direction === "neutral" && (
            <>
              <Minus size={14} className="text-muted" />
              <span className="text-xs font-semibold text-muted">
                No change {trend.period}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
