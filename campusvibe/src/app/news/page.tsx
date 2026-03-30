import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

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

const categoryColors: Record<string, string> = {
  "Habari za Elimu": "bg-brand/10 text-brand",
  "Fursa na Masomo": "bg-interactive/10 text-interactive",
  "Siasa za Chuo": "bg-accent/20 text-dark",
  "Michezo na Utamaduni": "bg-success/10 text-green-700",
  "Maisha ya Chuo": "bg-gray-100 text-gray-600",
}

const newsCategories = ["All", "Habari za Elimu", "Siasa za Chuo", "Maisha ya Chuo", "Michezo na Utamaduni", "Fursa na Masomo"]

export default async function NewsPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from("news_articles")
    .select("id, title, slug, excerpt, category, author_name, image_url, is_trending, read_time, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(24)

  return (
    <>
      <div className="pt-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-space-tight">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">CampusVibe Media</span>
            <h1 className="mt-2 font-heading font-black text-4xl sm:text-5xl text-dark">Campus News</h1>
            <p className="mt-3 text-muted text-base font-body max-w-lg">
              Verified stories from universities across Tanzania — education, politics, sports, culture, and student opportunity.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="mt-8 flex flex-wrap gap-2">
            {newsCategories.map((cat) => (
              <button key={cat} className={`px-3.5 py-1.5 rounded-full text-xs font-section font-semibold border transition-colors ${cat === "All" ? "bg-brand text-white border-brand" : "bg-white text-muted border-gray-200 hover:border-brand hover:text-brand"}`}>
                {cat}
              </button>
            ))}
          </AnimatedSection>
        </div>
      </div>

      <div className="bg-[#ECECEC] section-space-tight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => {
                const catClass = categoryColors[article.category] ?? "bg-gray-100 text-gray-600"
                const formattedDate = article.published_at
                  ? new Date(article.published_at).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric" })
                  : ""
                return (
                  <AnimatedSection key={article.id} delay={0.05 * i}>
                    <Link href={`/news/${article.slug}`} className="group flex flex-col card-pro card-hover h-full">
                      <div className="aspect-video bg-surface relative">
                        {article.image_url ? (
                          <Image src={article.image_url} alt={article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="33vw" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-interactive/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-section font-semibold uppercase tracking-wide ${catClass}`}>{article.category}</span>
                        {article.is_trending && (
                          <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-dark text-[10px] font-section font-semibold">
                            <TrendingUp size={9} strokeWidth={2.5} /> Trending
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center gap-2 text-[11px] text-muted font-body mb-2.5">
                          <span>{formattedDate}</span>
                          {article.read_time && <><span className="text-gray-200">·</span><Clock size={10} /><span>{article.read_time} read</span></>}
                        </div>
                        <h2 className="font-section font-semibold text-dark group-hover:text-brand transition-colors text-base leading-snug">{article.title}</h2>
                        <p className="text-muted text-sm mt-2 font-body line-clamp-2 leading-relaxed">{article.excerpt}</p>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <span className="text-xs text-subtle font-body">{article.author_name && `By ${article.author_name}`}</span>
                          <ArrowRight size={14} className="text-brand opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted font-body text-base">No articles published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
