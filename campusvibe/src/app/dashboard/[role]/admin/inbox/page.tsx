import { CheckCircle2, Clock3, Mail } from "lucide-react"
import AdminShell from "../AdminShell"
import { getAdminSnapshot } from "../data"
import { requireAdministrator } from "../guard"

type Props = { params: Promise<{ role: string }> }

export default async function AdminInboxPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const snapshot = await getAdminSnapshot()

  return (
    <AdminShell role={role} section="inbox" user={user}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-1">Support Inbox</h2>
        <p className="text-sm text-slate-600 inline-flex items-center gap-2"><Mail size={14} /> {snapshot.unreadContacts} unread messages</p>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        {snapshot.recentContacts.length === 0 ? (
          <p className="text-sm text-slate-500">No contact submissions found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Interest</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Received</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.recentContacts.map((submission) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AdminShell>
  )
}
