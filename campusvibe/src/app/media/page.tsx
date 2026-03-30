import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Play, Mic, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

export const metadata: Metadata = {
  title: "Media — CampusVibe TV & Podcasts",
  description: "Watch videos and listen to podcasts from CampusVibe. Student stories, interviews, campus highlights, and more.",
  alternates: { canonical: "/media" },
}

export const revalidate = 60

export default async function MediaPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("media_items")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(20)

  const featured = items?.find((i) => i.is_featured)
  const rest = items?.filter((i) => !i.is_featured) ?? []
  const videos = rest.filter((i) => i.type === "video")
  const podcasts = rest.filter((i) => i.type === "podcast")

  return (
    <>
      <div className="pt-16 bg-surface border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-7 sm:pt-12 sm:pb-10">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">CampusVibe TV &amp; Podcasts</span>
            <h1 className="mt-2 font-heading font-black text-4xl sm:text-5xl text-dark">Media Hub</h1>
            <p className="mt-3 text-muted text-base font-body max-w-lg leading-relaxed">
              Campus stories, student voices, and university highlights through video and audio.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {featured && (
        <div className="bg-surface pb-10 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <Link href={`/media/${featured.slug}`} className="group relative block card-pro card-hover overflow-hidden">
                <div className="relative aspect-[16/6] min-h-[240px] bg-gray-100">
                  {featured.image_url && <Image src={featured.image_url} alt={featured.title} fill className="object-cover opacity-80 group-hover:opacity-90 transition-opacity" sizes="100vw" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10" />
                  <div className="absolute inset-0 flex items-center p-6 sm:p-10">
                    <div>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-white text-xs font-section font-semibold uppercase tracking-wide mb-4">
                        {featured.type === "podcast" ? <Mic size={11} /> : <Play size={11} />}
                        Featured · {featured.type}
                      </span>
                      <h2 className="font-heading font-black text-2xl sm:text-4xl text-white leading-tight max-w-2xl">{featured.title}</h2>
                      <p className="mt-2 text-white/70 font-body text-sm">{featured.channel} · {featured.views_count.toLocaleString()} views{featured.duration && ` · ${featured.duration}`}</p>
                      <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-dark text-sm font-semibold group-hover:bg-brand group-hover:text-white transition-colors">
                        {featured.type === "podcast" ? <Mic size={14} /> : <Play size={14} />}
                        {featured.type === "podcast" ? "Listen Now" : "Watch Now"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      )}

      <div className="bg-[#ECECEC] section-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {videos.length > 0 && (
            <div>
              <AnimatedSection className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center"><Play size={14} className="text-brand" /></div>
                  <h2 className="font-section font-bold text-xl text-dark">Videos</h2>
                </div>
              </AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {videos.map((item, i) => (
                  <AnimatedSection key={item.id} delay={0.07 * i}>
                    <Link href={`/media/${item.slug}`} className="group flex flex-col card-pro card-hover h-full">
                      <div className="relative aspect-video bg-gray-900">
                        {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" sizes="25vw" />}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center group-hover:bg-brand/80 transition-colors">
                            <Play size={16} className="text-white ml-0.5" />
                          </div>
                        </div>
                        {item.duration && <span className="absolute bottom-2 right-2 text-white text-[10px] font-body bg-black/60 px-1.5 py-0.5 rounded">{item.duration}</span>}
                      </div>
                      <div className="flex flex-col flex-1 p-4">
                        <p className="text-[10px] text-muted font-body mb-1.5">{item.channel} · {item.views_count.toLocaleString()} views</p>
                        <h3 className="font-section font-semibold text-sm text-dark group-hover:text-brand transition-colors leading-snug line-clamp-2">{item.title}</h3>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {podcasts.length > 0 && (
            <div>
              <AnimatedSection className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-interactive/10 flex items-center justify-center"><Mic size={14} className="text-interactive" /></div>
                  <h2 className="font-section font-bold text-xl text-dark">Podcasts</h2>
                </div>
              </AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {podcasts.map((item, i) => (
                  <AnimatedSection key={item.id} delay={0.07 * i}>
                    <Link href={`/media/${item.slug}`} className="group flex card-pro card-hover p-4 gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-interactive/20 to-brand/20">
                        {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="80px" />}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Mic size={20} className="text-white/80" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted font-body mb-1">{item.channel}{item.duration && ` · ${item.duration}`}</p>
                        <h3 className="font-section font-semibold text-sm text-dark group-hover:text-brand transition-colors leading-snug line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-muted font-body mt-1.5">{item.views_count.toLocaleString()} listens</p>
                        <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                          Listen <ArrowRight size={10} />
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {(!items || items.length === 0) && (
            <div className="text-center py-20">
              <p className="text-muted font-body">No media published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
