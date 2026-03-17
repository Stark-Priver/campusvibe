"use client"

interface StatWidget {
  label: string
  value: string | number
  unit?: string
}

interface StatGridProps {
  stats: StatWidget[]
  columns?: 1 | 2 | 3 | 4
}

export default function StatGrid({ stats, columns = 4 }: StatGridProps) {
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={`grid ${gridColsClass[columns]} gap-4`}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <p className="text-[11px] uppercase tracking-widest font-section font-semibold text-muted">
            {stat.label}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <p className="font-heading font-black text-2xl text-dark">{stat.value}</p>
            {stat.unit && (
              <span className="text-sm text-muted font-body">{stat.unit}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
