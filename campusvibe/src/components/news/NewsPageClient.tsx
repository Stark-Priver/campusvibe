"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, TrendingUp, MessageCircle } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: string
  author_name?: string
  image_url?: string
  is_trending: boolean
  read_time?: string
  published_at?: string
}

interface NewsPageClientProps {
  articles: Article[]
}

const categoryColors: Record<string, string> = {
  "Habari za Elimu": "bg-brand/10 text-brand",
  "Fursa na Masomo": "bg-interactive/10 text-interactive",
  "Siasa za Chuo": "bg-accent/20 text-dark",
  "Michezo na Utamaduni": "bg-success/10 text-green-700",
  "Maisha ya Chuo": "bg-gray-100 text-gray-600",
}

export function NewsPageClient({ articles }: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Get unique categories from articles
  const categories = useMemo(() => {
    const unique = new Set<string>(articles.map(a => a.category))
    return ["All", ...Array.from(unique).sort()]
  }, [articles])

  // Filter articles by category
  const filtered = useMemo(() => {
    if (selectedCategory === "All") return articles
    return articles.filter(a => a.category === selectedCategory)
  }, [articles, selectedCategory])

  if (!articles || articles.length === 0) {
    return (
      <div className="pt-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-space-tight text-center">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">CampusVibe Media</span>
            <h1 className="mt-2 font-heading font-black text-4xl sm:text-5xl text-dark">Campus News</h1>
            <p className="mt-3 text-muted text-base font-body max-w-lg mx-auto">
              Verified stories from universities across Tanzania — education, politics, sports, culture, and student opportunity.
            </p>
            <p className="mt-8 text-lg text-muted font-body">No articles published yet. Check back soon!</p>
          </AnimatedSection>
        </div>
      </div>
    )
  }

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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-section font-semibold border transition-colors ${
                  cat === selectedCategory
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-muted border-gray-200 hover:border-brand hover:text-brand"
                }`}
              >
                {cat}
              </button>
            ))}
          </AnimatedSection>
        </div>
      </div>

      <div className="bg-[#ECECEC] section-space-tight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => {
                const catClass = categoryColors[article.category] ?? "bg-gray-100 text-gray-600"
                const formattedDate = article.published_at 
                  ? new Date(article.published_at).toLocaleDateString("en-TZ", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Not published"
                
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check this out: ${article.title}\nhttps://campusvibe.co.tz/news/${article.slug}`)}`
                
                return (
                  <AnimatedSection key={article.id} delay={0.05 * i}>
                    <div className="group flex flex-col card-pro card-hover h-full">
                      <Link href={`/news/${article.slug}`} className="block flex-1">
                        <div className="bg-surface relative overflow-hidden rounded-t-lg aspect-[3/4]">
                          {article.image_url ? (
                            <Image
                              src={article.image_url}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                              sizes="33vw"
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
                          <h2 className="font-section font-semibold text-dark group-hover:text-brand transition-colors text-base leading-snug">
                            {article.title}
                          </h2>
                          <p className="text-muted text-sm mt-2 font-body line-clamp-2 leading-relaxed">{article.excerpt}</p>
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <span className="text-xs text-subtle font-body">{article.author_name && `By ${article.author_name}`}</span>
                            <ArrowRight size={14} className="text-brand opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </Link>
                      
                      {/* Share Button */}
                      <div className="px-5 pb-4 pt-0 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(whatsappUrl, "_blank")
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          title="Share on WhatsApp"
                        >
                          <MessageCircle size={14} /> Share
                        </button>
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted font-body">No articles found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
