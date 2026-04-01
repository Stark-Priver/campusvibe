import AdminShell from "../../AdminShell"
import { requireAdministrator } from "../../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createMedia, updateMedia, deleteMedia } from "../../actions"
import type { Database } from "@/types/database"

type Props = { params: Promise<{ role: string }> }

export default async function AdminContentMediaPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: media } = await supabase
    .from("media_items")
    .select("id, title, slug, type, channel, media_url, is_published, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100)

  return (
    <AdminShell role={role} section="content-media" user={user} breadcrumb={["Home", "Admin", "Content", "Media"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-3">Create Media Item</h2>
        <form action={createMedia.bind(null, role)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input name="title" placeholder="Title" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="slug" placeholder="Slug" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <select name="type" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="video">video</option>
            <option value="podcast">podcast</option>
            <option value="photo">photo</option>
          </select>
          <input name="channel" placeholder="Channel" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="duration" placeholder="Duration" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="media_url" placeholder="Media URL" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="is_published" /> Published</label>
          <button className="rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create Media</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <h2 className="font-section font-bold text-slate-900 mb-3">Media Listing</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">Title</th><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Channel</th><th className="py-2 pr-3">Status</th><th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(media ?? []).map((item: Database["public"]["Tables"]["media_items"]["Row"]) => (
              <tr key={item.id} className="border-b border-slate-50 align-top last:border-0">
                <td className="py-2.5 pr-3">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">/{item.slug}</p>
                </td>
                <td className="py-2.5 pr-3 text-slate-700">{item.type}</td>
                <td className="py-2.5 pr-3 text-slate-700">{item.channel ?? "-"}</td>
                <td className="py-2.5 pr-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-2.5">
                  <form action={updateMedia.bind(null, role)} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                    <input type="hidden" name="id" value={item.id} />
                    <input name="title" defaultValue={item.title} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="slug" defaultValue={item.slug} className="rounded border border-slate-300 px-2 py-1" />
                    <select name="type" defaultValue={item.type} className="rounded border border-slate-300 px-2 py-1"><option value="video">video</option><option value="podcast">podcast</option><option value="photo">photo</option></select>
                    <input name="channel" defaultValue={item.channel ?? ""} className="rounded border border-slate-300 px-2 py-1" />
                    <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_published" defaultChecked={item.is_published} /> Published</label>
                    <button className="rounded bg-slate-800 text-white px-2 py-1">Update</button>
                  </form>
                  <form action={deleteMedia.bind(null, role)}>
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
