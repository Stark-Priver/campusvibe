"use client"

interface DashboardSectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export default function DashboardSection({
  title,
  subtitle,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="font-section font-bold text-lg text-dark">{title}</h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-muted font-body">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  )
}
