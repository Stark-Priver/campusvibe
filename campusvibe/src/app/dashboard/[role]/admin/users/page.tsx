import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createManagedUser, updateManagedUser, deleteManagedUser } from "../actions"

type Props = {
  params: Promise<{ role: string }>
  searchParams: Promise<{ q?: string; roleFilter?: string }>
}

export default async function AdminUsersPage({ params, searchParams }: Props) {
  const { role } = await params
  const { q = "", roleFilter = "all" } = await searchParams
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: users } = await supabase.from("users").select("id, email, full_name, university, roles, email_verified, created_at").order("created_at", { ascending: false })

  const filtered = (users ?? []).filter((item) => {
    const matchesQ = !q || [item.full_name, item.email, item.university ?? ""].join(" ").toLowerCase().includes(q.toLowerCase())
    const primaryRole = item.roles?.[0] ?? "student"
    const matchesRole = roleFilter === "all" || primaryRole === roleFilter
    return matchesQ && matchesRole
  })

  return (
    <AdminShell role={role} section="users" user={user} breadcrumb={["Home", "Admin", "Users"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-1">User Registration Management</h2>
        <p className="text-sm text-slate-600 mb-4">Create and govern platform users with role-aware access control.</p>
        <form action={createManagedUser.bind(null, role)} className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <label className="md:col-span-2 text-xs text-slate-600">Full name
            <input name="full_name" placeholder="Full Name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="md:col-span-2 text-xs text-slate-600">Email address
            <input name="email" type="email" placeholder="Email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="text-xs text-slate-600">Temporary password
            <input name="password" type="password" placeholder="Password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="text-xs text-slate-600">Role
            <select name="role" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="student">student</option>
            <option value="administrator">administrator</option>
            <option value="ambassador">ambassador</option>
            <option value="driver">driver</option>
            <option value="restaurant-owner">restaurant-owner</option>
            <option value="delivery">delivery</option>
            </select>
          </label>
          <label className="md:col-span-3 text-xs text-slate-600">University
            <input name="university" placeholder="University" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="email_verified" /> Email verified</label>
          <button className="md:col-span-2 rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create User</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
          <div>
            <h3 className="font-section font-bold text-slate-900">User Directory</h3>
            <p className="text-xs text-slate-500">{filtered.length} of {(users ?? []).length} users shown</p>
          </div>
          <form className="flex flex-wrap items-center gap-2" method="get">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, university"
              className="w-[250px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <select name="roleFilter" defaultValue={roleFilter} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All roles</option>
              <option value="administrator">Administrator</option>
              <option value="student">Student</option>
              <option value="ambassador">Ambassador</option>
              <option value="driver">Driver</option>
              <option value="restaurant-owner">Restaurant Owner</option>
              <option value="delivery">Delivery</option>
            </select>
            <button className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm">Apply</button>
          </form>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No users matched your filters. Try a different search or role filter.
          </div>
        ) : (
          <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">User</th><th className="py-2 pr-3">Role</th><th className="py-2 pr-3">University</th><th className="py-2 pr-3">Verified</th><th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
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
                    <button className="rounded bg-red-600 text-white px-2 py-1">Delete User</button>
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
