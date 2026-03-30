import { createClient } from "@/lib/supabase/server"
import { Zap } from "lucide-react"

export default async function BreakingNewsTicker() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("breaking_news")
    .select("text")
    .eq("is_active", true)
    .order("order_index", { ascending: true })

  const items = data?.map((r) => r.text) ?? [
    "Welcome to CampusVibe — Tanzania's #1 university super-app",
    "CampusVibe Awards 2026 nominations now open",
  ]

  const doubled = [...items, ...items]

  return (
    <div className="bg-brand text-white py-2 overflow-hidden relative z-10">
      <div className="flex items-center">
        <div className="shrink-0 px-4 flex items-center gap-2 bg-brand-dark z-10 border-r border-white/20">
          <Zap size={13} strokeWidth={2.5} />
          <span className="text-[10px] font-section font-bold uppercase tracking-widest whitespace-nowrap">
            Breaking
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex whitespace-nowrap">
            {doubled.map((text, i) => (
              <span key={i} className="inline-flex items-center text-sm font-body px-8">
                <span className="w-1 h-1 rounded-full bg-white/50 mr-8" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
