import { CheckCircle2, Clock3, Mail } from "lucide-react"
import AdminShell from "../AdminShell"
import { getAdminSnapshot } from "../data"
import { requireAdministrator } from "../guard"

type Props = {
  params: Promise<{ role: string }>
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function AdminInboxPage({ params, searchParams }: Props) {
  const { role } = await params
  const { q = "", status = "all" } = await searchParams
  const user = await requireAdministrator(role)
  const snapshot = await getAdminSnapshot()

  const filtered = snapshot.recentContacts.filter((submission) => {
    const matchesQ =
      !q ||
      [submission.full_name, submission.email, submission.interest]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase())
    const matchesStatus = status === "all" || (status === "read" ? submission.is_read : !submission.is_read)
    return matchesQ && matchesStatus
  })

  return (
    <AdminShell role={role} section="inbox" user={user} breadcrumb={["Home", "Admin", "Inbox"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-1">Support Inbox</h2>
        <p className="text-sm text-slate-600 inline-flex items-center gap-2"><Mail size={14} /> {snapshot.unreadContacts} unread messages</p>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
          <div>
            <h3 className="font-section font-bold text-slate-900">Message Queue</h3>
            <p className="text-xs text-slate-500">{filtered.length} of {snapshot.recentContacts.length} messages shown</p>
          </div>
          <form method="get" className="flex flex-wrap items-center gap-2">
            <input name="q" defaultValue={q} placeholder="Search sender, email, interest" className="w-[260px] rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <button className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm">Apply</button>
          </form>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No contact submissions found for this filter.</div>
        ) : (
          <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Interest</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Received</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((submission) => (
                <tr key={submission.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-3 text-slate-900">{submission.full_name}</td>
                  <td className="py-2.5 pr-3 text-slate-600">{submission.email}</td>
                  <td className="py-2.5 pr-3 text-slate-600">{submission.interest}</td>
                  <td className="py-2.5 pr-3">
                    {submission.is_read ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 size={12} /> Read</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700"><Clock3 size={12} /> Unread</span>
                    )}
                  </td>
                  <td className="py-2.5 text-slate-600">{new Date(submission.created_at).toLocaleString()}</td>
                  <td className="py-2.5">
                    <a href={`mailto:${submission.email}`} className="rounded bg-slate-800 text-white px-2 py-1 text-xs">Reply</a>
                  </td>
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
