import { ReactNode } from 'react'

interface TableToolbarProps {
  searchValue?: string
  searchPlaceholder?: string
  filterControls?: ReactNode
  resultCount?: number
  totalCount?: number
  showApplyButton?: boolean
}

export function TableToolbar({
  searchValue = '',
  searchPlaceholder = 'Search...',
  filterControls,
  resultCount,
  totalCount,
  showApplyButton = true,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
      <div>
        <h3 className="font-section font-bold text-slate-900">Listing</h3>
        {resultCount !== undefined && totalCount !== undefined && (
          <p className="text-xs text-slate-500">
            {resultCount} of {totalCount} items shown
          </p>
        )}
      </div>
      <form method="get" className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={searchValue}
          placeholder={searchPlaceholder}
          className="w-[250px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        {filterControls}
        {showApplyButton && (
          <button
            type="submit"
            className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm hover:bg-slate-700"
          >
            Apply
          </button>
        )}
      </form>
    </div>
  )
}
