import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"

type Props = {
  params: Promise<{ role: string }>
  searchParams: Promise<{ q?: string; action?: string }>
}

export default async function AdminAuditPage({ params, searchParams }: Props) {
  const { role } = await params
  const { q = "", action = "all" } = await searchParams
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id, actor_email, action, entity_type, entity_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  const filtered = (logs ?? []).filter((log) => {
    const matchesQ =
      !q ||
      [log.actor_email ?? "", log.entity_type, log.entity_id ?? "", JSON.stringify(log.details ?? {})]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase())
    const matchesAction = action === "all" || log.action === action
    return matchesQ && matchesAction
  })

  return (
    <AdminShell role={role} section="audit" user={user} breadcrumb={["Home", "Admin", "Audit"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
          <div>
            <h2 className="font-section font-bold text-slate-900">Audit Trail</h2>
            <p className="text-xs text-slate-500">{filtered.length} of {(logs ?? []).length} log entries shown</p>
          </div>
          <form className="flex flex-wrap gap-2" method="get">
            <input name="q" defaultValue={q} placeholder="Search actor, entity, details" className="w-[250px] rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select name="action" defaultValue={action} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
            <button className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm">Apply</button>
          </form>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No audit events matched the filters.
          </div>
        ) : (
          <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">When</th><th className="py-2 pr-3">Actor</th><th className="py-2 pr-3">Action</th><th className="py-2 pr-3">Entity</th><th className="py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 pr-3 text-slate-600">{new Date(log.created_at).toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-slate-900">{log.actor_email ?? "system"}</td>
                <td className="py-2.5 pr-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{log.action}</span></td>
                <td className="py-2.5 pr-3 text-slate-700">{log.entity_type}{log.entity_id ? ` (${log.entity_id})` : ""}</td>
                <td className="py-2.5 text-slate-600"><pre className="whitespace-pre-wrap text-xs">{JSON.stringify(log.details ?? {}, null, 2)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        )}
      </section>
    </AdminShell>
  )
}
