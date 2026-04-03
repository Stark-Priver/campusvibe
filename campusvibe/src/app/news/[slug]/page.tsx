import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar, TrendingUp } from "lucide-react"
import { CopyLinkButton } from "@/components/ui/CopyLinkButton"
import { createAdminClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const supabase = await createAdminClient()
    const { data: article } = await supabase
      .from("news_articles")
      .select("title, excerpt, image_url, author_name, published_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (!article) return { title: "News — CampusVibe" }

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    authors: article.author_name ? [{ name: article.author_name }] : undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      images: article.image_url ? [{ url: article.image_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.image_url ? [article.image_url] : [],
    },
    alternates: { canonical: `/news/${slug}` },
    }
  } catch {
    return { title: "News — CampusVibe" }
  }
}

// Increment Static Regeneration - revalidate every 5 minutes
export const revalidate = 300

// Force fully dynamic rendering (don't pre-build static pages)
// This is necessary because article content changes in real-time via admin
export const dynamic = 'force-dynamic'

export const revalidate = 300

const categoryColors: Record<string, string> = {
  "Habari za Elimu": "bg-brand/10 text-brand",
  "Fursa na Masomo": "bg-interactive/10 text-interactive",
  "Siasa za Chuo": "bg-accent/20 text-dark",
  "Michezo na Utamaduni": "bg-success/10 text-green-700",
  "Maisha ya Chuo": "bg-gray-100 text-gray-600",
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createAdminClient()

  const { data: article, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    console.error(`Article not found for slug: ${slug}`, error)
    notFound()
  }

  if (!article) notFound()

  // Related articles
  const { data: related, error: relatedError } = await supabase
    .from("news_articles")
    .select("id, title, slug, image_url, category, published_at")
    .eq("is_published", true)
    .eq("category", article.category)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(3)
  
  if (relatedError) {
    console.error("Failed to fetch related articles:", relatedError)
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-TZ", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : ""

  const catClass = categoryColors[article.category] ?? "bg-gray-100 text-gray-600"

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: article.author_name ? [{ "@type": "Person", name: article.author_name }] : undefined,
    publisher: {
      "@type": "Organization",
      name: "CampusVibe Media",
      url: "https://campusvibe.co.tz",
    },
    url: `https://campusvibe.co.tz/news/${article.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-20 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <Link href="/news" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors font-body">
            <ArrowLeft size={14} /> Back to News
          </Link>

          {/* Header */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-section font-semibold uppercase tracking-wide ${catClass}`}>
                {article.category}
              </span>
              {article.is_trending && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-dark text-xs font-section font-semibold">
                  <TrendingUp size={10} /> Trending
                </span>
              )}
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-dark leading-tight">
              {article.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 font-body">
              {article.author_name && <span className="font-semibold text-dark">By {article.author_name}</span>}
              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> {formattedDate}
                </span>
              )}
              {article.read_time && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {article.read_time} read
                </span>
              )}
            </div>
          </div>

          {/* Cover image */}
          {article.image_url && (
            <div className="relative mt-8 aspect-[16/9] rounded-2xl overflow-hidden border border-gray-100">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          {/* Content */}
          <div className="mt-8 prose prose-gray max-w-none">
            {article.excerpt && (
              <p className="text-lg font-semibold leading-relaxed text-gray-700 border-l-4 border-brand pl-4 font-body">
                {article.excerpt}
              </p>
            )}
            {article.content ? (
              <div
                className="mt-6 text-gray-700 font-body leading-8 text-base whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p className="mt-6 text-base leading-8 text-gray-600 font-body">
                CampusVibe Media continues to spotlight impactful stories across Tanzanian universities.
                Full article content will be displayed here once the content is published through the CampusVibe admin dashboard.
              </p>
            )}
          </div>

          {/* Share */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500 font-body">Share this story</span>
            <div className="flex gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check this out: ${article.title}\nhttps://campusvibe.co.tz/news/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 text-sm font-semibold text-green-700 hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.015-4.724 5.75-3.756 9.118.961 3.369 4.019 5.753 7.518 5.753.955 0 1.888-.18 2.823-.533l6.487 1.694-.86-6.49c.784-1.694 1.156-3.528 1.156-5.423 0-5.537-4.506-10.037-10.009-10.037" /></svg>
                WhatsApp
              </a>
              <CopyLinkButton url={`https://campusvibe.co.tz/news/${article.slug}`} />
            </div>
          </div>

          {/* Related articles */}
          {related && related.length > 0 && (
            <div className="mt-14">
              <h2 className="font-section font-bold text-xl text-dark mb-6">More in {article.category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.id} href={`/news/${r.slug}`} className="group card-pro card-hover p-4">
                    {r.image_url && (
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <Image src={r.image_url} alt={r.title} fill className="object-cover" sizes="300px" />
                      </div>
                    )}
                    <h3 className="font-section font-semibold text-sm text-dark group-hover:text-brand transition-colors leading-snug">
                      {r.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  )
}
