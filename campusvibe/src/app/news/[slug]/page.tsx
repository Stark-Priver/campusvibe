import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Share2 } from "lucide-react"
import { newsArticles } from "@/lib/data"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = newsArticles.find((item) => item.slug === slug)

  if (!article) {
    return { title: "News — CampusVibe" }
  }

  return {
    title: `${article.title} — CampusVibe`,
    description: article.excerpt,
  }
}

export default async function NewsDetailsPage({ params }: Props) {
  const { slug } = await params
  const article = newsArticles.find((item) => item.slug === slug)

  if (!article) notFound()

  return (
    <article className="pt-20 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
        >
          <ArrowLeft size={14} /> Back to News
        </Link>

        <div className="mt-6">
          <span className="inline-flex px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-section font-semibold uppercase tracking-wide">
            {article.category}
          </span>
          <h1 className="mt-4 font-heading font-black text-3xl sm:text-4xl text-dark leading-tight">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 font-body">
            <span>By {article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock size={12} /> {article.readTime} read</span>
          </div>
        </div>

        <div className="relative mt-8 aspect-[16/9] rounded-2xl overflow-hidden border border-gray-100">
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority sizes="100vw" />
        </div>

        <div className="mt-8 prose prose-gray max-w-none">
          <p className="text-base leading-8 text-gray-700 font-body">{article.excerpt}</p>
          <p className="text-base leading-8 text-gray-700 font-body">
            CampusVibe Media continues to spotlight impactful stories across Tanzanian universities.
            This article is part of our student-first editorial coverage focused on opportunity,
            innovation, and community progress.
          </p>
          <p className="text-base leading-8 text-gray-700 font-body">
            For updates, events, and student opportunities, follow CampusVibe and explore more
            stories in the News section.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-body">Share this story</span>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand transition-colors">
            <Share2 size={14} /> Copy Link
          </button>
        </div>
      </div>
    </article>
  )
}
