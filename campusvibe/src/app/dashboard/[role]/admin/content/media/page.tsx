import AdminShell from "../../AdminShell"
import { requireAdministrator } from "../../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createMedia, updateMedia, deleteMedia } from "../../actions"

type Props = { params: Promise<{ role: string }> }

export default async function AdminContentMediaPage({ params, searchParams }: Props & { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { role } = await params
  const { q = "", status = "all" } = await searchParams
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: media } = await supabase
    .from("media_items")
    .select("id, title, slug, type, channel, media_url, is_published, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100)

  const filtered = (media ?? []).filter((item) => {
    const matchesQ = !q || [item.title, item.slug, item.type, item.channel ?? ""].join(" ").toLowerCase().includes(q.toLowerCase())
    const matchesStatus = status === "all" || (status === "published" ? item.is_published : !item.is_published)
    return matchesQ && matchesStatus
  })

  return (
    <AdminShell role={role} section="content-media" user={user} breadcrumb={["Home", "Admin", "Content", "Media"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-1">Create Media Item</h2>
        <p className="text-sm text-slate-600 mb-4">Manage videos, podcasts, and media assets with channel metadata.</p>
        <form action={createMedia.bind(null, role)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="md:col-span-2 text-xs text-slate-600">Title
            <input name="title" placeholder="Title" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="text-xs text-slate-600">Slug
            <input name="slug" placeholder="Slug" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Media type
            <select name="type" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="video">video</option>
            <option value="podcast">podcast</option>
            <option value="photo">photo</option>
            </select>
          </label>
          <label className="text-xs text-slate-600">Channel
            <input name="channel" placeholder="Channel" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Duration
            <input name="duration" placeholder="Duration" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="md:col-span-2 text-xs text-slate-600">Media URL
            <input name="media_url" placeholder="Media URL" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="is_published" /> Published</label>
          <button className="rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create Media</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-3">
          <div>
            <h2 className="font-section font-bold text-slate-900">Media Listing</h2>
            <p className="text-xs text-slate-500">{filtered.length} of {(media ?? []).length} media items shown</p>
          </div>
          <form method="get" className="flex flex-wrap gap-2">
            <input name="q" defaultValue={q} placeholder="Search title, slug, channel" className="w-[250px] rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm">Apply</button>
          </form>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No media items matched your filters.</div>
        ) : (
          <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">Title</th><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Channel</th><th className="py-2 pr-3">Status</th><th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
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
          </div>
        )}
      </section>
    </AdminShell>
  )
}
