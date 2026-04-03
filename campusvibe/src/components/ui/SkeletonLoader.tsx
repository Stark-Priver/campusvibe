"use client"

export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 ${className}`} />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 border border-slate-200 bg-white">
      <SkeletonLoader className="h-4 w-24 rounded mb-2" />
      <SkeletonLoader className="h-10 w-32 rounded mb-2" />
      <SkeletonLoader className="h-3 w-28 rounded" />
      <SkeletonLoader className="h-8 w-full rounded mt-3" />
    </div>
  )
}

export function ContentRowSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 p-4 bg-white">
      <div className="space-y-2">
        <SkeletonLoader className="h-4 w-48 rounded" />
        <SkeletonLoader className="h-3 w-32 rounded" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <SkeletonLoader className="h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  )
}

export function SectionSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <SkeletonLoader className="h-6 w-40 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContentRowSkeleton />
        <ContentRowSkeleton />
        <ContentRowSkeleton />
        <ContentRowSkeleton />
      </div>
    </div>
  )
}
