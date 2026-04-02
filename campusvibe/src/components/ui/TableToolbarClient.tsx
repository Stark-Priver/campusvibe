'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface TableToolbarClientProps {
  searchValue?: string
  statusValue?: string
  searchPlaceholder?: string
  resultCount?: number
  totalCount?: number
  debounceMs?: number
}

export function TableToolbarClient({
  searchValue = '',
  statusValue = 'all',
  searchPlaceholder = 'Search...',
  resultCount,
  totalCount,
  debounceMs = 400,
}: TableToolbarClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchValue)
  const [status, setStatus] = useState(statusValue)

  useEffect(() => {
    setQuery(searchValue)
  }, [searchValue])

  useEffect(() => {
    setStatus(statusValue)
  }, [statusValue])

  const updateUrl = useCallback((nextQuery: string, nextStatus: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (nextQuery.trim()) {
      params.set('q', nextQuery.trim())
    } else {
      params.delete('q')
    }

    if (nextStatus && nextStatus !== 'all') {
      params.set('status', nextStatus)
    } else {
      params.delete('status')
    }

    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname)
  }, [pathname, router, searchParams])

  useEffect(() => {
    const handle = setTimeout(() => {
      updateUrl(query, status)
    }, debounceMs)

    return () => clearTimeout(handle)
  }, [debounceMs, query, status, updateUrl])

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
      <div className="flex flex-wrap gap-2 items-center">
        <input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-[250px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value
            setStatus(nextStatus)
            updateUrl(query, nextStatus)
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button
          type="button"
          onClick={() => updateUrl(query, status)}
          className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm hover:bg-slate-700"
        >
          Apply
        </button>
        <a
          href={pathname}
          className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4"
        >
          Clear
        </a>
      </div>
    </div>
  )
}
