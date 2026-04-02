import { ReactNode } from 'react'
import { Search } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title = 'No results',
  description = 'Try adjusting your search or filters.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
      <div className="flex justify-center mb-4">
        {icon || <Search className="w-8 h-8 text-slate-400" />}
      </div>
      <h3 className="font-medium text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  )
}
