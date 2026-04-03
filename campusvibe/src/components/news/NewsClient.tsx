"use client"

import { useState, useCallback, useTransition } from "react"
import { Plus, Search } from "lucide-react"
import { NewsCard } from "@/components/news/NewsCard"
import { NewsFormModal } from "@/components/news/NewsFormModal"
import { EmptyState } from "@/components/ui/EmptyState"

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: string
  author_name?: string
  image_url?: string
  is_published: boolean
  published_at?: string
  updated_at: string
}

interface NewsClientProps {
  initialNews: NewsItem[]
  role: string
  onCreateNews: (formData: FormData) => Promise<void>
  onUpdateNews: (formData: FormData) => Promise<void>
  onDeleteNews: (formData: FormData) => Promise<void>
}

export function NewsClient({
  initialNews,
  role,
  onCreateNews,
  onUpdateNews,
  onDeleteNews,
}: NewsClientProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsItem | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
  const [isPending, startTransition] = useTransition()

  const filtered = news.filter((item) => {
    const matchesQuery = !searchQuery || [item.title, item.slug, item.category, item.author_name || ""]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" ? item.is_published : !item.is_published)
    return matchesQuery && matchesStatus
  })

  const handleEdit = (id: string) => {
    const item = news.find((n) => n.id === id)
    if (item) {
      setEditingItem(item)
      setIsFormOpen(true)
    }
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("id", id)
      await onDeleteNews(formData)
      setNews(news.filter((n) => n.id !== id))
    })
  }

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      startTransition(async () => {
        try {
          if (editingItem) {
            await onUpdateNews(formData)
            // Update local state with new data
            const updatedNews = news.map(n => n.id === editingItem.id ? {
              ...n,
              title: String(formData.get("title")),
              slug: String(formData.get("slug")),
              excerpt: String(formData.get("excerpt")) || undefined,
              category: String(formData.get("category")),
              author_name: String(formData.get("author_name")) || undefined,
              is_published: formData.get("is_published") === "on",
              updated_at: new Date().toISOString(),
            } : n)
            setNews(updatedNews)
          } else {
            await onCreateNews(formData)
            // Optimistically add new article to display list
            const newArticle: NewsItem = {
              id: `temp-${Date.now()}`,
              title: String(formData.get("title")),
              slug: String(formData.get("slug") || String(formData.get("title")).toLowerCase().replace(/\s+/g, "-")),
              excerpt: String(formData.get("excerpt")) || undefined,
              category: String(formData.get("category") || "general"),
              author_name: String(formData.get("author_name") || "Admin"),
              image_url: undefined,
              is_published: formData.get("is_published") === "on",
              published_at: formData.get("is_published") === "on" ? new Date().toISOString() : undefined,
              updated_at: new Date().toISOString(),
            }
            setNews([newArticle, ...news])
          }
          setEditingItem(undefined)
          setIsFormOpen(false)
        } catch (error) {
          console.error("Form submission error:", error)
          alert("Failed to save article. Please try again.")
        }
      })
    },
    [editingItem, news, onCreateNews, onUpdateNews]
  )

  const handleOpenCreate = () => {
    setEditingItem(undefined)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">News Articles</h1>
          <p className="text-slate-600 mt-1">Manage and publish your news content</p>
        </div>
        <button
          onClick={handleOpenCreate}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-3 font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} /> Create Article
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, slug, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {status === "all" && "All"}
              {status === "published" && "Published"}
              {status === "draft" && "Drafts"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="text-sm text-slate-600 mb-4">
          Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of{" "}
          <span className="font-semibold text-slate-900">{news.length}</span> articles
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No articles found" : "No articles yet"}
            description={
              searchQuery
                ? "Try adjusting your search or filters."
                : "Create your first news article to get started."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <NewsCard
                key={item.id}
                {...item}
                role={role}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <NewsFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingItem(undefined)
        }}
        onSubmit={handleSubmit}
        initialData={editingItem}
        isLoading={isPending}
      />
    </div>
  )
}
