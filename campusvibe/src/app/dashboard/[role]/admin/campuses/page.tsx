import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createCampus, updateCampus, deleteCampus } from "../actions"

type Props = {
  params: Promise<{ role: string }>
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function AdminCampusesPage({ params, searchParams }: Props) {
  const { role } = await params
  const { q = "", status = "all" } = await searchParams
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()
  const { data: campuses } = await supabase.from("campuses").select("*").order("created_at", { ascending: false })

  const filtered = (campuses ?? []).filter((campus) => {
    const matchesQ = !q || [campus.name, campus.short_name ?? "", campus.city ?? "", campus.country].join(" ").toLowerCase().includes(q.toLowerCase())
    const matchesStatus = status === "all" || campus.status === status
    return matchesQ && matchesStatus
  })

  return (
    <AdminShell role={role} section="campuses" user={user} breadcrumb={["Home", "Admin", "Campuses"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-1">Campus Verification & Registration</h2>
        <p className="text-sm text-slate-600 mb-4">Register institutions and manage verification workflow from one place.</p>
        <form action={createCampus.bind(null, role)} className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <label className="md:col-span-2 text-xs text-slate-600">Campus name
            <input name="name" placeholder="Campus Name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="text-xs text-slate-600">Short name
            <input name="short_name" placeholder="Short Name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">City
            <input name="city" placeholder="City" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Country
            <input name="country" defaultValue="Tanzania" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Initial status
            <select name="status" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"><option>pending</option><option>verified</option><option>rejected</option></select>
          </label>
          <label className="md:col-span-2 text-xs text-slate-600">Contact email
            <input name="contact_email" placeholder="Contact Email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="md:col-span-2 text-xs text-slate-600">Contact phone
            <input name="contact_phone" placeholder="Contact Phone" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="md:col-span-2 text-xs text-slate-600">Verification notes
            <input name="verification_notes" placeholder="Verification Notes" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <button className="md:col-span-2 rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create Campus</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
          <div>
            <h3 className="font-section font-bold text-slate-900">Campus Registry</h3>
            <p className="text-xs text-slate-500">{filtered.length} of {(campuses ?? []).length} campuses shown</p>
          </div>
          <form className="flex flex-wrap gap-2" method="get">
            <input name="q" defaultValue={q} placeholder="Search campus, city, country" className="w-[240px] rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm">Apply</button>
          </form>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No campuses found for the selected filters.
          </div>
        ) : (
          <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-3">Campus</th>
                  <th className="py-2 pr-3">Location</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Updated</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((campus) => (
                  <tr key={campus.id} className="border-b border-slate-50 align-top last:border-0">
                    <td className="py-2.5 pr-3">
                      <p className="font-semibold text-slate-900">{campus.name}</p>
                      <p className="text-xs text-slate-500">{campus.short_name ?? "-"}</p>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-700">{campus.city ?? "-"}, {campus.country}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${campus.status === "verified" ? "bg-emerald-50 text-emerald-700" : campus.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                        {campus.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{new Date(campus.updated_at).toLocaleString()}</td>
                    <td className="py-2.5">
                      <form action={updateCampus.bind(null, role)} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
                        <input type="hidden" name="id" value={campus.id} />
                        <input name="name" defaultValue={campus.name} className="rounded border border-slate-300 px-2 py-1" />
                        <input name="city" defaultValue={campus.city ?? ""} className="rounded border border-slate-300 px-2 py-1" />
                        <input name="country" defaultValue={campus.country} className="rounded border border-slate-300 px-2 py-1" />
                        <select name="status" defaultValue={campus.status} className="rounded border border-slate-300 px-2 py-1"><option>pending</option><option>verified</option><option>rejected</option></select>
                        <input name="verification_notes" defaultValue={campus.verification_notes ?? ""} className="rounded border border-slate-300 px-2 py-1" />
                        <button className="rounded bg-slate-800 text-white px-2 py-1">Update</button>
                      </form>
                      <form action={deleteCampus.bind(null, role)}>
                        <input type="hidden" name="id" value={campus.id} />
                        <button className="rounded bg-red-600 text-white px-2 py-1 text-sm">Delete Campus</button>
                      </form>
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
