import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createManagedUser, updateManagedUser, deleteManagedUser } from "../actions"
import type { Database } from "@/types/database"

type Props = { params: Promise<{ role: string }> }

export default async function AdminUsersPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: users } = await supabase.from("users").select("id, email, full_name, university, roles, email_verified, created_at").order("created_at", { ascending: false })

  return (
    <AdminShell role={role} section="users" user={user}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-3">User Registration Management</h2>
        <form action={createManagedUser.bind(null, role)} className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input name="full_name" placeholder="Full Name" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="email" type="email" placeholder="Email" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="password" type="password" placeholder="Password" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <select name="role" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="student">student</option>
            <option value="administrator">administrator</option>
            <option value="ambassador">ambassador</option>
            <option value="driver">driver</option>
            <option value="restaurant-owner">restaurant-owner</option>
            <option value="delivery">delivery</option>
          </select>
          <input name="university" placeholder="University" className="md:col-span-3 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="email_verified" /> Email verified</label>
          <button className="md:col-span-2 rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create User</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">User</th><th className="py-2 pr-3">Role</th><th className="py-2 pr-3">University</th><th className="py-2 pr-3">Verified</th><th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((item: Database["public"]["Tables"]["users"]["Row"]) => (
              <tr key={item.id} className="border-b border-slate-50 last:border-0 align-top">
                <td className="py-2.5 pr-3">
                  <p className="font-semibold text-slate-900">{item.full_name}</p>
                  <p className="text-xs text-slate-500">{item.email}</p>
                </td>
                <td className="py-2.5 pr-3">{item.roles?.[0] ?? "student"}</td>
                <td className="py-2.5 pr-3">{item.university ?? "-"}</td>
                <td className="py-2.5 pr-3">{item.email_verified ? "Yes" : "No"}</td>
                <td className="py-2.5">
                  <form action={updateManagedUser.bind(null, role)} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                    <input type="hidden" name="id" value={item.id} />
                    <input name="full_name" defaultValue={item.full_name} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="email" defaultValue={item.email} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="university" defaultValue={item.university ?? ""} className="rounded border border-slate-300 px-2 py-1" />
                    <select name="role" defaultValue={item.roles?.[0] ?? "student"} className="rounded border border-slate-300 px-2 py-1">
                      <option value="student">student</option><option value="administrator">administrator</option><option value="ambassador">ambassador</option><option value="driver">driver</option><option value="restaurant-owner">restaurant-owner</option><option value="delivery">delivery</option>
                    </select>
                    <button className="rounded bg-slate-800 text-white px-2 py-1">Update</button>
                  </form>
                  <form action={deleteManagedUser.bind(null, role)}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded bg-red-600 text-white px-2 py-1">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  )
}
