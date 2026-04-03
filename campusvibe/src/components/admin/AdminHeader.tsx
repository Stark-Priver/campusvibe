"use client"

import { useEffect, useMemo, useState } from "react"
import { Activity, Clock3, ShieldCheck } from "lucide-react"
import { Breadcrumb } from "./Breadcrumb"

interface AdminHeaderProps {
  title: string
  breadcrumbItems: Array<{ label: string; href?: string }>
}

export function AdminHeader({ title, breadcrumbItems }: AdminHeaderProps) {
  const [lastTick, setLastTick] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setLastTick(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const updatedLabel = useMemo(() => {
    return `Updated ${lastTick.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }, [lastTick])

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">Administrator Workspace</p>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">{title}</h1>
          <div className="mt-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 font-medium">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Live Sync
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-700 font-medium">
            <Clock3 size={12} /> {updatedLabel}
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs text-violet-700 font-medium">
            <ShieldCheck size={12} /> SLA 99.9%
          </div>
        </div>
      </div>
    </div>
  )
}
