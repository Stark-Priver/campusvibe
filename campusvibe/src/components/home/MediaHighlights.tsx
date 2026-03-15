import Link from "next/link"
import Image from "next/image"
import { Play, Headphones, ArrowRight, Eye } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { mediaItems } from "@/lib/data"

export default function MediaHighlights() {
  const [featured, ...rest] = mediaItems

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <AnimatedSection className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              CampusVibe Media
            </span>
            <h2 className="mt-1.5 font-section font-bold text-2xl sm:text-3xl text-dark">
              Watch & Listen
            </h2>
          </div>
          <Link
            href="/media"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-[#5a52e0] transition-colors shrink-0"
          >
            Media hub <ArrowRight size={14} />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Featured large card */}
          <AnimatedSection className="lg:col-span-3" delay={0.05}>
            <Link
              href={`/media/${featured.slug}`}
              className="group relative block aspect-video rounded-2xl overflow-hidden card-hover"
            >
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              {/* Channel label */}
              <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-section font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                {featured.channel}
              </span>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Play size={22} className="text-dark fill-dark ml-0.5" />
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 inset-x-0 p-5"
                style={{ background: "linear-gradient(to top, rgba(13,13,20,0.85) 0%, transparent 100%)" }}>
                <h3 className="font-section font-bold text-white text-lg leading-snug">
                  {featured.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-white/60 text-xs font-body">
                  <span>{featured.duration}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {featured.views} views
                  </span>
                  <span>·</span>
                  <span>{featured.date}</span>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          {/* Side cards */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((item, i) => (
              <AnimatedSection key={item.id} delay={0.1 + i * 0.08}>
                <Link
                  href={`/media/${item.slug}`}
                  className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 card-hover"
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-24 h-16 rounded-xl bg-surface overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-black/75 flex items-center justify-center">
                        {item.type === "video" ? (
                          <Play size={11} className="text-white fill-white ml-0.5" />
                        ) : (
                          <Headphones size={11} className="text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-section font-semibold">
                      {item.type === "video" ? "Video" : "Podcast"} · {item.channel}
                    </span>
                    <h4 className="font-section font-semibold text-sm text-dark group-hover:text-brand transition-colors mt-0.5 leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted font-body">
                      <span>{item.duration}</span>
                      <span>·</span>
                      <span>{item.views} views</span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
