"use client"
// MediaHighlights.tsx
import Link from "next/link"
import Image from "next/image"
import { Play, Mic, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import type { MediaItem } from "@/types/database"

export function MediaHighlights({ items }: { items: MediaItem[] }) {
  if (!items || items.length === 0) return null
  return (
    <section className="bg-surface section-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">CampusVibe TV & Podcasts</span>
            <h2 className="mt-1.5 font-heading font-black text-2xl sm:text-3xl text-dark">Media Highlights</h2>
          </div>
          <Link href="/media" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
            All media <ArrowRight size={14} />
          </Link>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <AnimatedSection key={item.id} delay={0.07 * i}>
              <Link href={`/media/${item.slug}`} className="group flex flex-col card-pro card-hover h-full">
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                  {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" sizes="25vw" />}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center group-hover:bg-brand/80 transition-colors">
                      {item.type === "podcast" ? <Mic size={16} className="text-white" /> : <Play size={16} className="text-white ml-0.5" />}
                    </div>
                  </div>
                  {item.duration && <span className="absolute bottom-2 right-2 text-white text-[10px] font-body bg-black/60 px-1.5 py-0.5 rounded">{item.duration}</span>}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-section font-semibold capitalize">{item.type}</span>
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
    </section>
  )
}
