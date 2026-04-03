"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const validItems = items.filter(item => item.label)

  return (
    <nav className="flex items-center gap-1 text-xs text-slate-600">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-100"
      >
        <Home size={14} />
      </Link>
      {validItems.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-slate-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ) : (
            <span className="p-1 font-medium text-slate-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
