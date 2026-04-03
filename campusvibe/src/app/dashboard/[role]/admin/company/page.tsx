import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { upsertCompanyProfile, createSocialHandle, updateSocialHandle, deleteSocialHandle } from "../actions"

type Props = {
  params: Promise<{ role: string }>
  searchParams: Promise<{ q?: string; active?: string }>
}

export default async function AdminCompanyPage({ params, searchParams }: Props) {
  const { role } = await params
  const { q = "", active = "all" } = await searchParams
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const [{ data: profile }, { data: handles }] = await Promise.all([
    supabase.from("company_profile").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("company_social_handles").select("*").order("display_order", { ascending: true }),
  ])

  const filteredHandles = (handles ?? []).filter((h) => {
    const matchesQ = !q || [h.platform, h.handle, h.url].join(" ").toLowerCase().includes(q.toLowerCase())
    const matchesActive = active === "all" || (active === "active" ? h.is_active : !h.is_active)
    return matchesQ && matchesActive
  })

  return (
    <AdminShell role={role} section="company" user={user} breadcrumb={["Home", "Admin", "Company"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-1">Company Registration & Profile</h2>
        <p className="text-sm text-slate-600 mb-4">Manage corporate identity, legal references, and support touchpoints.</p>
        <form action={upsertCompanyProfile.bind(null, role)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="hidden" name="id" value={profile?.id ?? ""} />
          <label className="text-xs text-slate-600">Company name
            <input name="company_name" defaultValue={profile?.company_name ?? "Campus Vibe"} placeholder="Company Name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="text-xs text-slate-600">Tagline
            <input name="tagline" defaultValue={profile?.tagline ?? ""} placeholder="Tagline" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Website URL
            <input name="website_url" defaultValue={profile?.website_url ?? ""} placeholder="Website URL" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Support email
            <input name="support_email" defaultValue={profile?.support_email ?? ""} placeholder="Support Email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Contact phone
            <input name="contact_phone" defaultValue={profile?.contact_phone ?? ""} placeholder="Phone" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Headquarters
            <input name="headquarters" defaultValue={profile?.headquarters ?? ""} placeholder="Headquarters" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Registration number
            <input name="registration_number" defaultValue={profile?.registration_number ?? ""} placeholder="Registration Number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Tax number
            <input name="tax_number" defaultValue={profile?.tax_number ?? ""} placeholder="Tax Number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <button className="rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Save Company Profile</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-3">Social Media Handles</h2>
        <form action={createSocialHandle.bind(null, role)} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
          <select name="platform" className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option>x</option><option>instagram</option><option>youtube</option><option>linkedin</option><option>facebook</option><option>tiktok</option><option>whatsapp</option><option>telegram</option></select>
          <input name="handle" placeholder="@campusvibe" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="url" placeholder="https://..." className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="display_order" type="number" defaultValue={0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked /> Active</label>
          <button className="md:col-span-2 rounded-lg bg-slate-800 text-white px-3 py-2 text-sm">Add Handle</button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <form className="flex flex-wrap items-center gap-2" method="get">
            <input name="q" defaultValue={q} placeholder="Search platform, handle, URL" className="w-[260px] rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select name="active" defaultValue={active} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
            <button className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm">Apply</button>
          </form>
          <p className="text-xs text-slate-500">{filteredHandles.length} of {(handles ?? []).length} handles shown</p>
        </div>

        {filteredHandles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No social handles match your filters.
          </div>
        ) : (
          <div className="max-h-[520px] overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-3">Platform</th>
                  <th className="py-2 pr-3">Handle</th>
                  <th className="py-2 pr-3">URL</th>
                  <th className="py-2 pr-3">Active</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHandles.map((h) => (
                  <tr key={h.id} className="border-b border-slate-50 align-top last:border-0">
                    <td className="py-2.5 pr-3 text-slate-700">{h.platform}</td>
                    <td className="py-2.5 pr-3 text-slate-900 font-medium">{h.handle}</td>
                    <td className="py-2.5 pr-3 text-slate-600 max-w-[260px] truncate">{h.url}</td>
                    <td className="py-2.5 pr-3">{h.is_active ? "Yes" : "No"}</td>
                    <td className="py-2.5">
                      <form action={updateSocialHandle.bind(null, role)} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
                        <input type="hidden" name="id" value={h.id} />
                        <input name="platform" defaultValue={h.platform} className="rounded border border-slate-300 px-2 py-1" />
                        <input name="handle" defaultValue={h.handle} className="rounded border border-slate-300 px-2 py-1" />
                        <input name="url" defaultValue={h.url} className="rounded border border-slate-300 px-2 py-1" />
                        <input name="display_order" type="number" defaultValue={h.display_order} className="rounded border border-slate-300 px-2 py-1" />
                        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={h.is_active} /> Active</label>
                        <button className="rounded bg-slate-800 text-white px-2 py-1">Update</button>
                      </form>
                      <form action={deleteSocialHandle.bind(null, role)}>
                        <input type="hidden" name="id" value={h.id} />
                        <button className="rounded bg-red-600 text-white px-2 py-1 text-sm">Delete Handle</button>
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
