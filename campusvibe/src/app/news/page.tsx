import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/server"
import { NewsPageClient } from "@/components/news/NewsPageClient"

export const metadata: Metadata = {
  title: "Campus News",
  description: "Verified campus news from universities across Tanzania — education, politics, sports, culture, and student opportunities.",
  openGraph: {
    title: "Campus News — CampusVibe",
    description: "Verified campus news from universities across Tanzania.",
    url: "https://campusvibe.co.tz/news",
  },
  alternates: { canonical: "/news" },
}

export const revalidate = 60

export default async function NewsPage() {
  const supabase = await createAdminClient()
  const { data: articles, error } = await supabase
    .from("news_articles")
    .select("id, title, slug, excerpt, category, author_name, image_url, is_trending, read_time, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(100)
  
  if (error) {
    console.error("NewsPage query error:", error)
  }

  // Convert null values to undefined for client component compatibility
  const normalizedArticles = (articles ?? []).map(item => ({
    ...item,
    excerpt: item.excerpt || undefined,
    author_name: item.author_name || undefined,
    image_url: item.image_url || undefined,
    read_time: item.read_time || undefined,
    published_at: item.published_at || undefined,
  }))

  return <NewsPageClient articles={normalizedArticles} />
}
