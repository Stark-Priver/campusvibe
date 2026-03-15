import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, TrendingUp } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { newsArticles } from "@/lib/data"

const categoryColors: Record<string, string> = {
  "Habari za Elimu": "bg-brand/10 text-brand",
  "Fursa na Masomo": "bg-interactive/10 text-interactive",
  "Siasa za Chuo": "bg-accent/20 text-dark",
  "Michezo na Utamaduni": "bg-success/10 text-green-700",
  "Maisha ya Chuo": "bg-gray-100 text-gray-600",
}

function NewsCard({
  article,
  delay = 0,
  large = false,
}: {
  article: (typeof newsArticles)[0]
  delay?: number
  large?: boolean
}) {
  const catClass = categoryColors[article.category] ?? "bg-gray-100 text-gray-600"

  return (
    <AnimatedSection delay={delay}>
      <Link
        href={`/news/${article.slug}`}
        className={`group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover ${
          large ? "h-full" : ""
        }`}
      >
        {/* Image placeholder */}
        <div
          className={`bg-surface relative overflow-hidden ${large ? "aspect-[16/9]" : "aspect-video"}`}
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
          {/* Category badge */}
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-section font-semibold uppercase tracking-wide ${catClass}`}
          >
            {article.category}
          </span>
          {article.trending && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-dark text-[10px] font-section font-semibold uppercase tracking-wide">
              <TrendingUp size={10} strokeWidth={2.5} />
              Trending
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center gap-2 text-[11px] text-muted font-body mb-2.5">
            <span>{article.date}</span>
            <span className="text-gray-200">·</span>
            <Clock size={10} className="shrink-0" />
            <span>{article.readTime} read</span>
          </div>

          <h3
            className={`font-section font-semibold text-dark group-hover:text-brand transition-colors leading-snug ${
              large ? "text-xl sm:text-2xl" : "text-base"
            }`}
          >
            {article.title}
          </h3>

          <p
            className={`text-muted text-sm leading-relaxed mt-2 font-body ${
              large ? "line-clamp-3" : "line-clamp-2"
            }`}
          >
            {article.excerpt}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-xs text-subtle font-body">By {article.author}</span>
            <ArrowRight
              size={15}
              className="text-brand opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
            />
          </div>
        </div>
      </Link>
    </AnimatedSection>
  )
}

export default function NewsFeed() {
  const [featured, ...rest] = newsArticles

  return (
    <section className="py-20 bg-[#ECECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <AnimatedSection className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              Campus News
            </span>
            <h2 className="mt-1.5 font-section font-bold text-2xl sm:text-3xl text-dark">
              Latest Stories
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-[#5a52e0] transition-colors shrink-0"
          >
            View all news
            <ArrowRight size={14} />
          </Link>
        </AnimatedSection>

        {/* Grid: 1 featured + 5 regular */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured — spans 1 column on large */}
          <div className="lg:col-span-1">
            <NewsCard article={featured} large delay={0.05} />
          </div>

          {/* Regular grid — 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map((article, i) => (
              <NewsCard key={article.id} article={article} delay={0.1 + i * 0.07} />
            ))}
          </div>
        </div>

        {/* Mobile view all */}
        <div className="mt-8 flex sm:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
          >
            View all news <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  )
}
