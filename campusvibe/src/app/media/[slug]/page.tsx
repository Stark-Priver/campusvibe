import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Play, Mic, Eye } from "lucide-react"
import { CopyLinkButton } from "@/components/ui/CopyLinkButton"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("media_items")
    .select("title, image_url, channel, type")
    .eq("slug", slug)
    .single()
  if (!data) return { title: "Media — CampusVibe" }
  return {
    title: data.title,
    description: `${data.type === "podcast" ? "Listen to" : "Watch"} ${data.title} on CampusVibe — ${data.channel}`,
    openGraph: {
      title: data.title,
      images: data.image_url ? [{ url: data.image_url }] : [],
      type: "website",
    },
    alternates: { canonical: `/media/${slug}` },
  }
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("media_items").select("slug").eq("is_published", true)
    return (data ?? []).map((m) => ({ slug: m.slug }))
  } catch {
    return []
  }
}

export const revalidate = 300

export default async function MediaDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from("media_items")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!item) notFound()

  // Increment views (non-blocking)
  void supabase
    .from("media_items")
    .update({ views_count: item.views_count + 1 })
    .eq("id", item.id)

  const isVideo = item.type === "video"
  const isPodcast = item.type === "podcast"

  return (
    <div className="pt-20 pb-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/media" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors font-body">
          <ArrowLeft size={14} /> Back to Media
        </Link>

        <div className="mt-6">
          {/* Media player area */}
          {item.media_url ? (
            isVideo ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black">
                <video
                  src={item.media_url}
                  poster={item.image_url ?? undefined}
                  controls
                  className="w-full h-full"
                  preload="metadata"
                />
              </div>
            ) : isPodcast ? (
              <div className="rounded-2xl border border-gray-100 overflow-hidden bg-gradient-to-br from-interactive/10 to-brand/10 p-6 sm:p-8">
                {item.image_url && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden mx-auto mb-6 shadow-xl">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="128px" />
                  </div>
                )}
                <audio src={item.media_url} controls className="w-full" preload="metadata" />
              </div>
            ) : null
          ) : (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-900">
              {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover opacity-70" sizes="896px" />}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                  {isPodcast ? <Mic size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                </div>
                <p className="text-white/70 text-sm font-body">Media available in the CampusVibe app</p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-section font-semibold ${isPodcast ? "bg-interactive/10 text-interactive" : "bg-brand/10 text-brand"}`}>
                {isPodcast ? <Mic size={10} /> : <Play size={10} />}
                {item.type}
              </span>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-3xl text-dark leading-tight">{item.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 font-body">
              {item.channel && <span className="font-semibold text-dark">{item.channel}</span>}
              <span className="flex items-center gap-1.5"><Eye size={13} /> {item.views_count.toLocaleString()} views</span>
              {item.duration && <span>{item.duration}</span>}
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500 font-body">Share this</span>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(`https://campusvibe.co.tz/media/${item.slug}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand transition-colors"
                >
                  Share on X
                </a>
                <CopyLinkButton url={`https://campusvibe.co.tz/media/${item.slug}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
