import Link from "next/link"
import Image from "next/image"
import { Play, Headphones, Eye, ArrowRight, Tv } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { mediaItems } from "@/lib/data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Media — CampusVibe",
  description:
    "CampusVibe TV and Podcasts — video and audio content for and by Tanzanian university students.",
}

export default function MediaPage() {
  const videos = mediaItems.filter((m) => m.type === "video")
  const podcasts = mediaItems.filter((m) => m.type === "podcast")

  return (
    <>
      {/* Hero */}
      <div className="pt-16 bg-[#ECECEC] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-7 sm:pt-10 sm:pb-9">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-section font-semibold text-gray-400 mb-3">
              <Tv size={12} className="text-brand" />
              CampusVibe Media Hub
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark leading-tight">
              Watch. Listen.{" "}
              <span className="text-brand block">Stay Informed.</span>
            </h1>
            <p className="mt-2.5 text-gray-600 text-sm sm:text-base font-body max-w-xl leading-relaxed">
              Original videos, podcasts, and student creator content produced for and by Tanzania&apos;s
              university community.
            </p>
          </AnimatedSection>

          {/* Platform pills */}
          <AnimatedSection delay={0.1} className="mt-5 flex flex-wrap gap-2.5">
            {["CampusVibe TV", "Podcasts", "Student Creators"].map((platform) => (
              <button
                key={platform}
                className="px-3.5 py-1.5 rounded-full text-xs font-section font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-dark transition-colors first:bg-brand first:text-white first:border-brand"
              >
                {platform}
              </button>
            ))}
          </AnimatedSection>
        </div>
      </div>

      {/* Videos */}
      <section className="bg-[#ECECEC] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
                CampusVibe TV
              </span>
              <h2 className="mt-1 font-section font-bold text-xl text-dark">Latest Videos</h2>
            </div>
            <Link href="/media" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand">
              All videos <ArrowRight size={13} />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {videos.map((item, i) => (
              <AnimatedSection key={item.id} delay={0.07 * i}>
                <Link
                  href={`/media/${item.slug}`}
                  className="group relative block aspect-video card-pro card-hover"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-[11px] font-section font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                    {item.channel}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/50 text-white text-[11px] font-body">
                    {item.duration}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <Play size={18} className="text-dark fill-dark ml-0.5" />
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4"
                    style={{ background: "linear-gradient(to top, rgba(13,13,20,0.9) 0%, transparent 100%)" }}
                  >
                    <h3 className="font-section font-semibold text-white text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-white/50 text-[11px] font-body">
                      <Eye size={10} /> {item.views} views
                      <span>·</span>
                      {item.date}
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Podcasts */}
      <section className="bg-surface py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
                CampusVibe Podcasts
              </span>
              <h2 className="mt-1 font-section font-bold text-xl text-dark">Latest Episodes</h2>
            </div>
          </AnimatedSection>

          <div className="space-y-3.5">
            {podcasts.map((item, i) => (
              <AnimatedSection key={item.id} delay={0.07 * i}>
                <Link
                  href={`/media/${item.slug}`}
                  className="group flex items-center gap-4 card-pro p-4 card-hover"
                >
                  <div className="w-16 h-16 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                    <Headphones size={22} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-section font-semibold">
                      {item.channel}
                    </span>
                    <h3 className="font-section font-semibold text-dark group-hover:text-brand transition-colors text-base leading-snug mt-0.5">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted font-body">
                      <span>{item.duration}</span>
                      <span>·</span>
                      <span>{item.views} plays</span>
                      <span>·</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-colors">
                      <Play size={14} className="text-muted group-hover:text-white fill-current ml-0.5 transition-colors" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Creator CTA */}
      <section className="bg-[#ECECEC] py-8 sm:py-10 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="font-section font-bold text-2xl text-dark">Are you a student creator?</h2>
            <p className="text-muted text-base font-body mt-3 leading-relaxed">
              Submit your videos, podcast episodes, or written pieces to be featured on CampusVibe Media.
              Reach 12,000+ students across Tanzania.
            </p>
            <Link
              href="/get-involved#contributor"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-[#5a52e0] transition-colors"
            >
              Become a Creator <ArrowRight size={14} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
