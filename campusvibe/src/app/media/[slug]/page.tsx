import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Play, Headphones, Eye, Clock3 } from "lucide-react"
import { mediaItems } from "@/lib/data"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return mediaItems.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = mediaItems.find((entry) => entry.slug === slug)

  if (!item) return { title: "Media — CampusVibe" }

  return {
    title: `${item.title} — CampusVibe`,
    description: `${item.channel} · ${item.duration} · ${item.views}`,
  }
}

export default async function MediaDetailsPage({ params }: Props) {
  const { slug } = await params
  const item = mediaItems.find((entry) => entry.slug === slug)

  if (!item) notFound()

  return (
    <section className="pt-20 pb-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/media" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors">
          <ArrowLeft size={14} /> Back to Media
        </Link>

        <div className="mt-6">
          <span className="inline-flex px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-section font-semibold uppercase tracking-wide">
            {item.type === "video" ? "Video" : "Podcast"}
          </span>
          <h1 className="mt-4 font-heading font-black text-3xl sm:text-4xl text-dark leading-tight">{item.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 font-body">
            <span>{item.channel}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock3 size={12} /> {item.duration}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Eye size={12} /> {item.views}</span>
            <span>·</span>
            <span>{item.date}</span>
          </div>
        </div>

        <div className="relative mt-8 aspect-video rounded-2xl overflow-hidden border border-gray-100">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 rounded-full bg-white/90 text-dark flex items-center justify-center shadow-lg">
              {item.type === "video" ? <Play size={26} className="fill-current ml-0.5" /> : <Headphones size={24} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
