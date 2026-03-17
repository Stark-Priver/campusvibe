import Link from "next/link"
import Image from "next/image"
import { Tag, UserCircle, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { marketplaceItems } from "@/lib/data"

const conditionColor: Record<string, string> = {
  "Like New": "text-green-600 bg-green-50",
  "Very Good": "text-blue-600 bg-blue-50",
  Good: "text-amber-600 bg-amber-50",
  New: "text-purple-600 bg-purple-50",
}

export default function MarketplacePreview() {
  return (
    <section className="section-space bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <AnimatedSection className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              Student Marketplace
            </span>
            <h2 className="mt-1.5 font-section font-bold text-2xl sm:text-3xl text-dark">
              Buy, Sell &amp; Trade
            </h2>
            <p className="text-muted text-sm mt-2 font-body max-w-sm">
              Browse listings from students across all campuses. Full marketplace available in the app.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-[#5a52e0] transition-colors shrink-0"
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </AnimatedSection>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {marketplaceItems.map((item, i) => (
            <AnimatedSection key={item.id} delay={0.07 * i}>
              <div className="group flex flex-col card-pro card-hover h-full">

                {/* Thumbnail placeholder */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative flex items-center justify-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-section font-semibold uppercase tracking-wide ${
                      conditionColor[item.condition] ?? "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {item.condition}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4">
                  {/* Category */}
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-section font-semibold text-muted mb-2">
                    <Tag size={9} /> {item.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-section font-semibold text-sm text-dark group-hover:text-brand transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Price */}
                  <div className="mt-3 font-heading font-bold text-lg text-dark">
                    {item.price}
                  </div>

                  {/* Seller */}
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-2">
                    <UserCircle size={14} className="text-muted shrink-0" />
                    <span className="text-xs text-muted font-body truncate">
                      {item.seller} · {item.university}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* App CTA */}
        <AnimatedSection delay={0.25} className="mt-10 text-center">
          <p className="text-sm text-muted font-body mb-3">
            Full marketplace experience — including chat, offers, and delivery — available in the app.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-[#5a52e0] transition-colors"
          >
            Open in CampusVibe App
          </a>
        </AnimatedSection>

      </div>
    </section>
  )
}
