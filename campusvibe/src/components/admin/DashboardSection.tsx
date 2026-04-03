"use client"

interface DashboardSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function DashboardSection({
  title,
  description,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={`rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-slate-900">{title}</h2>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
