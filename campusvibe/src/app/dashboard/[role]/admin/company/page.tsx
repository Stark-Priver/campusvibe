import AdminShell from "../AdminShell"
import { requireAdministrator } from "../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { upsertCompanyProfile, createSocialHandle, updateSocialHandle, deleteSocialHandle } from "../actions"
import type { Database } from "@/types/database"

type Props = { params: Promise<{ role: string }> }

export default async function AdminCompanyPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const [{ data: profile }, { data: handles }] = await Promise.all([
    supabase.from("company_profile").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("company_social_handles").select("*").order("display_order", { ascending: true }),
  ])

  return (
    <AdminShell role={role} section="company" user={user}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-3">Company Registration & Profile</h2>
        <form action={upsertCompanyProfile.bind(null, role)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="hidden" name="id" value={profile?.id ?? ""} />
          <input name="company_name" defaultValue={profile?.company_name ?? "Campus Vibe"} placeholder="Company Name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="tagline" defaultValue={profile?.tagline ?? ""} placeholder="Tagline" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="website_url" defaultValue={profile?.website_url ?? ""} placeholder="Website URL" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="support_email" defaultValue={profile?.support_email ?? ""} placeholder="Support Email" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="contact_phone" defaultValue={profile?.contact_phone ?? ""} placeholder="Phone" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="headquarters" defaultValue={profile?.headquarters ?? ""} placeholder="Headquarters" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="registration_number" defaultValue={profile?.registration_number ?? ""} placeholder="Registration Number" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="tax_number" defaultValue={profile?.tax_number ?? ""} placeholder="Tax Number" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
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

        <div className="space-y-2">
          {(handles ?? []).map((h: Database["public"]["Tables"]["company_social_handles"]["Row"]) => (
            <div key={h.id} className="rounded-xl border border-slate-200 p-3">
              <form action={updateSocialHandle.bind(null, role)} className="grid grid-cols-1 md:grid-cols-7 gap-2">
                <input type="hidden" name="id" value={h.id} />
                <input name="platform" defaultValue={h.platform} className="rounded border border-slate-300 px-2 py-1" />
                <input name="handle" defaultValue={h.handle} className="rounded border border-slate-300 px-2 py-1" />
                <input name="url" defaultValue={h.url} className="md:col-span-2 rounded border border-slate-300 px-2 py-1" />
                <input name="display_order" type="number" defaultValue={h.display_order} className="rounded border border-slate-300 px-2 py-1" />
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={h.is_active} /> Active</label>
                <button className="rounded bg-slate-800 text-white px-2 py-1">Update</button>
              </form>
              <form action={deleteSocialHandle.bind(null, role)} className="mt-2">
                <input type="hidden" name="id" value={h.id} />
                <button className="rounded bg-red-600 text-white px-2 py-1 text-sm">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  )
}
