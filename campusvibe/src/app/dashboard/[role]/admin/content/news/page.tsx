import AdminShell from "../../AdminShell"
import { requireAdministrator } from "../../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createNews, updateNews, deleteNews } from "../../actions"
import { NewsClient } from "@/components/news/NewsClient"

type Props = { params: Promise<{ role: string }> }

export default async function AdminContentNewsPage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: news } = await supabase
    .from("news_articles")
    .select("id, title, slug, excerpt, category, author_name, image_url, is_published, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100)

  // Convert null values to undefined for client component compatibility
  const normalizedNews = (news ?? []).map(item => ({
    ...item,
    excerpt: item.excerpt || undefined,
    author_name: item.author_name || undefined,
    image_url: item.image_url || undefined,
    published_at: item.published_at || undefined,
  }))

  return (
    <AdminShell role={role} section="content-news" user={user} breadcrumb={["Home", "Admin", "Content", "News"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <NewsClient
          initialNews={normalizedNews}
          role={role}
          onCreateNews={createNews.bind(null, role)}
          onUpdateNews={updateNews.bind(null, role)}
          onDeleteNews={deleteNews.bind(null, role)}
        />
      </section>
    </AdminShell>
  )
}
