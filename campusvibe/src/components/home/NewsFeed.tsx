import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, TrendingUp } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

const categoryColors: Record<string, string> = {
  "Habari za Elimu": "bg-brand/10 text-brand",
  "Fursa na Masomo": "bg-interactive/10 text-interactive",
  "Siasa za Chuo": "bg-accent/20 text-dark",
  "Michezo na Utamaduni": "bg-success/10 text-green-700",
  "Maisha ya Chuo": "bg-gray-100 text-gray-600",
}

export default async function NewsFeed() {
  const supabase = await createAdminClient()
  const { data: articles, error } = await supabase
    .from("news_articles")
    .select("id, title, slug, excerpt, category, author_name, image_url, is_trending, read_time, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(6)
  
  if (error) {
    console.error("NewsFeed query error:", error)
  }

  if (!articles || articles.length === 0) return null

  return (
    <section className="bg-[#ECECEC] section-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              Latest Stories
            </span>
            <h2 className="mt-1.5 font-heading font-black text-2xl sm:text-3xl text-dark">
              Campus News
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            All news <ArrowRight size={14} />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {articles.map((article, i) => {
            const catClass = categoryColors[article.category] ?? "bg-gray-100 text-gray-600"
            const formattedDate = article.published_at
              ? new Date(article.published_at).toLocaleDateString("en-TZ", {
                  day: "numeric", month: "short", year: "numeric",
                })
              : ""
            return (
              <AnimatedSection key={article.id} delay={0.06 * i}>
                <Link
                  href={`/news/${article.slug}`}
                  className="group flex flex-col card-pro card-hover h-full"
                >
                  <div className="bg-surface relative overflow-hidden rounded-t-lg aspect-[3/4]">
                    {article.image_url ? (
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-interactive/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-section font-semibold uppercase tracking-wide ${catClass}`}>
                      {article.category}
                    </span>
                    {article.is_trending && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-dark text-[10px] font-section font-semibold">
                        <TrendingUp size={9} strokeWidth={2.5} /> Trending
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-2 text-[11px] text-muted font-body mb-2.5">
                      <span>{formattedDate}</span>
                      {article.read_time && (
                        <>
                          <span className="text-gray-200">·</span>
                          <Clock size={10} />
                          <span>{article.read_time} read</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-section font-semibold text-dark group-hover:text-brand transition-colors text-base leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-muted text-sm mt-2 font-body line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-xs text-subtle font-body">
                        {article.author_name && `By ${article.author_name}`}
                      </span>
                      <ArrowRight size={14} className="text-brand opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>

        <AnimatedSection delay={0.3} className="mt-8 text-center sm:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-muted hover:border-brand hover:text-brand transition-colors"
          >
            View All News <ArrowRight size={14} />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
