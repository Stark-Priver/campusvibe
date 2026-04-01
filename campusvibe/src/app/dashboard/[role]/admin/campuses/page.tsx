import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createCampus, updateCampus, deleteCampus } from "../actions"
import type { Database } from "@/types/database"

type Props = { params: Promise<{ role: string }> }

export default async function AdminCampusesPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()
  const { data: campuses } = await supabase.from("campuses").select("*").order("created_at", { ascending: false })

  return (
    <AdminShell role={role} section="campuses" user={user}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-3">Campus Verification & Registration</h2>
        <form action={createCampus.bind(null, role)} className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input name="name" placeholder="Campus Name" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="short_name" placeholder="Short Name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="city" placeholder="City" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="country" defaultValue="Tanzania" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <select name="status" className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option>pending</option><option>verified</option><option>rejected</option></select>
          <input name="contact_email" placeholder="Contact Email" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="contact_phone" placeholder="Contact Phone" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="verification_notes" placeholder="Verification Notes" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button className="md:col-span-2 rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create Campus</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
        {(campuses ?? []).map((campus: Database["public"]["Tables"]["campuses"]["Row"]) => (
          <div key={campus.id} className="rounded-xl border border-slate-200 p-3">
            <form action={updateCampus.bind(null, role)} className="grid grid-cols-1 md:grid-cols-7 gap-2">
              <input type="hidden" name="id" value={campus.id} />
              <input name="name" defaultValue={campus.name} className="rounded border border-slate-300 px-2 py-1" />
              <input name="short_name" defaultValue={campus.short_name ?? ""} className="rounded border border-slate-300 px-2 py-1" />
              <input name="city" defaultValue={campus.city ?? ""} className="rounded border border-slate-300 px-2 py-1" />
              <input name="country" defaultValue={campus.country} className="rounded border border-slate-300 px-2 py-1" />
              <select name="status" defaultValue={campus.status} className="rounded border border-slate-300 px-2 py-1"><option>pending</option><option>verified</option><option>rejected</option></select>
              <input name="verification_notes" defaultValue={campus.verification_notes ?? ""} className="rounded border border-slate-300 px-2 py-1" />
              <button className="rounded bg-slate-800 text-white px-2 py-1">Update</button>
            </form>
            <form action={deleteCampus.bind(null, role)} className="mt-2">
              <input type="hidden" name="id" value={campus.id} />
              <button className="rounded bg-red-600 text-white px-2 py-1 text-sm">Delete</button>
            </form>
          </div>
        ))}
      </section>
    </AdminShell>
  )
}
