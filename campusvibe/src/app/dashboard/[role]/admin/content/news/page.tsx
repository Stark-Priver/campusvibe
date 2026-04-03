import AdminShell from "../../AdminShell"
import { requireAdministrator } from "../../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createNews, updateNews, deleteNews } from "../../actions"
import { EmptyState } from "@/components/ui/EmptyState"
import { TableToolbarClient } from "@/components/ui/TableToolbarClient"
import NewsItemRow from "./NewsItemRow"

type Props = { params: Promise<{ role: string }> }

export default async function AdminContentNewsPage({ params, searchParams }: Props & { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { role } = await params
  const { q = "", status = "all" } = await searchParams
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: news } = await supabase
    .from("news_articles")
    .select("id, title, slug, category, author_name, is_published, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100)

  const filtered = (news ?? []).filter((item) => {
    const matchesQ = !q || [item.title, item.slug, item.category, item.author_name ?? ""].join(" ").toLowerCase().includes(q.toLowerCase())
    const matchesStatus = status === "all" || (status === "published" ? item.is_published : !item.is_published)
    return matchesQ && matchesStatus
  })

  return (
    <AdminShell role={role} section="content-news" user={user} breadcrumb={["Home", "Admin", "Content", "News"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-1">Create News Article</h2>
        <p className="text-sm text-slate-600 mb-4">Publish editorial updates with proper metadata and publishing controls.</p>
        <form action={createNews.bind(null, role)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="md:col-span-2 text-xs text-slate-600">Headline
            <input name="title" placeholder="Title" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="text-xs text-slate-600">Slug
            <input name="slug" placeholder="Slug (optional)" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Category
            <input name="category" defaultValue="general" placeholder="Category" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Author
            <input name="author_name" defaultValue="Admin" placeholder="Author" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="is_published" /> Published</label>
          <label className="md:col-span-3 text-xs text-slate-600">Excerpt
            <input name="excerpt" placeholder="Excerpt" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="md:col-span-3 text-xs text-slate-600">Body content
            <textarea name="content" placeholder="Content" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-32" />
          </label>
          <button className="md:col-span-1 rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm hover:bg-[#2E1A7F]">Create Article</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <TableToolbarClient
          searchValue={q}
          statusValue={status}
          searchPlaceholder="Search title, slug, category"
          resultCount={filtered.length}
          totalCount={(news ?? []).length}
        />

        {filtered.length === 0 ? (
          <EmptyState title="No articles" description="No news articles matched your filters. Try adjusting your search or filters." />
        ) : (
          <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-3">Title</th><th className="py-2 pr-3">Category</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Updated</th><th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <NewsItemRow key={item.id} item={item} role={role} onUpdate={updateNews} onDelete={deleteNews} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  )
}
