import Link from "next/link"
import Image from "next/image"
import { Tag, UserCircle, Search, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { marketplaceItems } from "@/lib/data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Marketplace — CampusVibe",
  description: "Browse student marketplace listings across Tanzanian universities. Buy, sell, and trade books, electronics, clothing, and more.",
}

const conditionColor: Record<string, string> = {
  "Like New": "text-green-600 bg-green-50",
  "Very Good": "text-blue-600 bg-blue-50",
  Good: "text-amber-600 bg-amber-50",
  New: "text-purple-600 bg-purple-50",
}

const categories = ["All", "Books", "Electronics", "Clothing", "Stationery", "Services"]

export default function MarketplacePage() {
  return (
    <>
      {/* Hero */}
      <div className="pt-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              Student Marketplace
            </span>
            <h1 className="mt-2 font-heading font-black text-4xl sm:text-5xl text-dark">
              Buy, Sell &amp; Trade
            </h1>
            <p className="mt-3 text-muted text-base font-body max-w-lg">
              A trusted marketplace for Tanzanian university students. Browse thousands of listings
              from campuses across the country.
            </p>
          </AnimatedSection>

          {/* Search + Categories */}
          <AnimatedSection delay={0.1} className="mt-8 space-y-4">
            <div className="relative max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                placeholder="Search listings..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-body placeholder-muted focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-section font-semibold border transition-colors ${
                    cat === "All"
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-muted border-gray-200 hover:border-brand hover:text-brand"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Listings */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-8 flex items-center justify-between">
            <p className="text-sm text-muted font-body">
              Showing <span className="text-dark font-semibold">{marketplaceItems.length}</span> listings (demo preview)
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {marketplaceItems.map((item, i) => (
              <AnimatedSection key={item.id} delay={0.07 * i}>
                <div className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover h-full">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative flex items-center justify-center">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-section font-semibold ${
                        conditionColor[item.condition] ?? "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {item.condition}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-section font-semibold text-muted mb-1.5">
                      <Tag size={9} /> {item.category}
                    </span>
                    <h3 className="font-section font-semibold text-sm text-dark group-hover:text-brand transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="mt-2 font-heading font-bold text-lg text-dark">{item.price}</div>
                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-1.5">
                      <UserCircle size={13} className="text-muted shrink-0" />
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
          <AnimatedSection delay={0.3} className="mt-16 bg-surface rounded-2xl p-8 text-center">
            <h3 className="font-section font-bold text-xl text-dark mb-2">
              Get the full marketplace experience
            </h3>
            <p className="text-muted text-sm font-body max-w-md mx-auto mb-6">
              The CampusVibe app unlocks full marketplace functionality including messaging sellers,
              making offers, delivery tracking, and escrow-protected payments.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-[#5a52e0] transition-colors"
              >
                Download the App <ArrowRight size={14} />
              </a>
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-dark text-sm font-semibold hover:border-brand hover:text-brand transition-colors"
              >
                List Your Item
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
