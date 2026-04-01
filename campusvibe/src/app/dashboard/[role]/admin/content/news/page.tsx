import AdminShell from "../../AdminShell"
import { requireAdministrator } from "../../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createNews, updateNews, deleteNews } from "../../actions"
import type { Database } from "@/types/database"

type Props = { params: Promise<{ role: string }> }

export default async function AdminContentNewsPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: news } = await supabase
    .from("news_articles")
    .select("id, title, slug, category, author_name, is_published, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100)

  return (
    <AdminShell role={role} section="content-news" user={user} breadcrumb={["Home", "Admin", "Content", "News"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-3">Create News Article</h2>
        <form action={createNews.bind(null, role)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input name="title" placeholder="Title" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="slug" placeholder="Slug (optional)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="category" defaultValue="general" placeholder="Category" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="author_name" defaultValue="Admin" placeholder="Author" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="is_published" /> Published</label>
          <input name="excerpt" placeholder="Excerpt" className="md:col-span-3 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <textarea name="content" placeholder="Content" className="md:col-span-3 rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-28" />
          <button className="md:col-span-1 rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create Article</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <h2 className="font-section font-bold text-slate-900 mb-3">News Listing</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">Title</th><th className="py-2 pr-3">Category</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Updated</th><th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(news ?? []).map((item: Database["public"]["Tables"]["news_articles"]["Row"]) => (
              <tr key={item.id} className="border-b border-slate-50 align-top last:border-0">
                <td className="py-2.5 pr-3">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">/{item.slug}</p>
                </td>
                <td className="py-2.5 pr-3">{item.category}</td>
                <td className="py-2.5 pr-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-2.5 pr-3 text-slate-600">{new Date(item.updated_at).toLocaleString()}</td>
                <td className="py-2.5">
                  <form action={updateNews.bind(null, role)} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                    <input type="hidden" name="id" value={item.id} />
                    <input name="title" defaultValue={item.title} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="slug" defaultValue={item.slug} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="category" defaultValue={item.category} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="author_name" defaultValue={item.author_name ?? "Admin"} className="rounded border border-slate-300 px-2 py-1" />
                    <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_published" defaultChecked={item.is_published} /> Published</label>
                    <button className="rounded bg-slate-800 text-white px-2 py-1">Update</button>
                  </form>
                  <form action={deleteNews.bind(null, role)}>
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
