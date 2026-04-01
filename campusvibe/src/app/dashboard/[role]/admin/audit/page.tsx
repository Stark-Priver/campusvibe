import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type Props = { params: Promise<{ role: string }> }

export default async function AdminAuditPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id, actor_email, action, entity_type, entity_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <AdminShell role={role} section="audit" user={user}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <h2 className="font-section font-bold text-slate-900 mb-3">Audit Trail</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">When</th><th className="py-2 pr-3">Actor</th><th className="py-2 pr-3">Action</th><th className="py-2 pr-3">Entity</th><th className="py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {(logs ?? []).map((log: Database["public"]["Tables"]["audit_logs"]["Row"]) => (
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
      </section>
    </AdminShell>
  )
}
