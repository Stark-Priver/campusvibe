import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type Props = { params: Promise<{ role: string }> }

export default async function AdminAnalyticsPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const [{ data: visits }, { data: topPaths }] = await Promise.all([
    supabase.from("site_visits").select("id, path, referrer, ip_address, user_agent, created_at").order("created_at", { ascending: false }).limit(200),
    supabase.from("site_visits").select("path").limit(500),
  ])

  const counts = new Map<string, number>()
  for (const v of topPaths ?? []) {
    const p = v.path || "/"
    counts.set(p, (counts.get(p) ?? 0) + 1)
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <AdminShell role={role} section="analytics" user={user}>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm lg:col-span-1">
          <h2 className="font-section font-bold text-slate-900 mb-3">Top Visited Paths</h2>
          <ul className="space-y-2 text-sm">
            {top.map(([path, total]) => (
              <li key={path} className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                <span className="truncate text-slate-700">{path}</span>
                <span className="font-semibold text-slate-900">{total}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm lg:col-span-2 overflow-x-auto">
          <h2 className="font-section font-bold text-slate-900 mb-3">Recent Visits</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
                <th className="py-2 pr-3">When</th><th className="py-2 pr-3">Path</th><th className="py-2 pr-3">Referrer</th><th className="py-2 pr-3">IP</th><th className="py-2">User Agent</th>
              </tr>
            </thead>
            <tbody>
              {(visits ?? []).map((v: Database["public"]["Tables"]["site_visits"]["Row"]) => (
                <tr key={v.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-3 text-slate-600">{new Date(v.created_at).toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-slate-900">{v.path}</td>
                  <td className="py-2.5 pr-3 text-slate-600 max-w-[180px] truncate">{v.referrer ?? "direct"}</td>
                  <td className="py-2.5 pr-3 text-slate-600">{v.ip_address ?? "-"}</td>
                  <td className="py-2.5 text-slate-600 max-w-[320px] truncate">{v.user_agent ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  )
}
