"use client"

import { AlertCircle } from "lucide-react"
import { breakingNews } from "@/lib/data"

export default function BreakingNewsTicker() {
  const doubled = [...breakingNews, ...breakingNews]

  return (
    <div className="bg-[#ECECEC] border-y border-gray-100 overflow-hidden">
      <div className="flex items-stretch h-11">

        {/* Label */}
        <div className="shrink-0 flex items-center gap-2 px-5 bg-accent z-10">
          <AlertCircle size={13} className="text-dark" strokeWidth={2.5} />
          <span className="font-section font-bold text-[10px] uppercase tracking-widest text-dark whitespace-nowrap">
            Breaking
          </span>
        </div>

        {/* Ticker */}
        <div className="relative flex-1 overflow-hidden">
          {/* Left fade */}
          <div className="absolute left-0 inset-y-0 w-10 pointer-events-none z-10"
            style={{ background: "linear-gradient(to right, white, transparent)" }} />
          {/* Right fade */}
          <div className="absolute right-0 inset-y-0 w-10 pointer-events-none z-10"
            style={{ background: "linear-gradient(to left, white, transparent)" }} />

          <div className="flex items-center h-full animate-ticker whitespace-nowrap">
            {doubled.map((item, i) => (
              <span key={i} className="inline-flex items-center shrink-0">
                <span className="text-sm text-dark font-body px-6">{item}</span>
                <span className="text-gray-300 shrink-0">&#8226;</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
