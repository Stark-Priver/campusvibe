import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, TrendingUp, Search } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { newsArticles, newsCategories } from "@/lib/data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "News — CampusVibe",
  description: "Campus news from universities across Tanzania. Arts, politics, sports, scholarships, and student life.",
}

const categoryColors: Record<string, string> = {
  "Habari za Elimu": "bg-brand/10 text-brand",
  "Fursa na Masomo": "bg-interactive/10 text-interactive",
  "Siasa za Chuo": "bg-accent/20 text-dark",
  "Michezo na Utamaduni": "bg-success/10 text-green-700",
  "Maisha ya Chuo": "bg-gray-100 text-gray-600",
}

export default function NewsPage() {
  return (
    <>
      {/* Page hero */}
      <div className="pt-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              CampusVibe Media
            </span>
            <h1 className="mt-2 font-heading font-black text-4xl sm:text-5xl text-dark">
              Campus News
            </h1>
            <p className="mt-3 text-muted text-base font-body max-w-lg">
              Verified stories from universities across Tanzania — education, politics,
              sports, culture, and student opportunity.
            </p>
          </AnimatedSection>

          {/* Search + Filter row */}
          <AnimatedSection delay={0.1} className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-body text-dark placeholder-muted focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {newsCategories.map((cat) => (
                <button
                  key={cat}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-section font-semibold border transition-colors ${
                    cat === "All"
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-muted border-gray-200 hover:border-brand hover:text-brand"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Article grid */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article, i) => {
              const catClass = categoryColors[article.category] ?? "bg-gray-100 text-gray-600"
              return (
                <AnimatedSection key={article.id} delay={0.06 * i}>
                  <Link
                    href={`/news/${article.slug}`}
                    className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover h-full"
                  >
                    <div className="aspect-video bg-surface relative">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-section font-semibold uppercase tracking-wide ${catClass}`}>
                        {article.category}
                      </span>
                      {article.trending && (
                        <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-dark text-[10px] font-section font-semibold">
                          <TrendingUp size={9} strokeWidth={2.5} /> Trending
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-center gap-2 text-[11px] text-muted font-body mb-2.5">
                        <span>{article.date}</span>
                        <span className="text-gray-200">·</span>
                        <Clock size={10} />
                        <span>{article.readTime} read</span>
                      </div>
                      <h2 className="font-section font-semibold text-dark group-hover:text-brand transition-colors text-base leading-snug">
                        {article.title}
                      </h2>
                      <p className="text-muted text-sm mt-2 font-body line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="text-xs text-subtle font-body">By {article.author}</span>
                        <ArrowRight size={14} className="text-brand opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              )
            })}
          </div>

          {/* Load more placeholder */}
          <AnimatedSection delay={0.3} className="mt-12 text-center">
            <button className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-muted hover:border-brand hover:text-brand transition-colors font-section">
              Load More Stories
            </button>
          </AnimatedSection>
        </div>
      </div>
    </>
  )
}
