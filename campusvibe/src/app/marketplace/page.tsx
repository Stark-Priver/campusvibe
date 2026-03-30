import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Tag, UserCircle, Search, ArrowRight, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

export const metadata: Metadata = {
  title: "Student Marketplace",
  description: "Browse student marketplace listings across Tanzanian universities. Buy, sell, and trade books, electronics, clothing, and more.",
  alternates: { canonical: "/marketplace" },
}

export const revalidate = 60

const conditionColor: Record<string, string> = {
  "Like New": "text-green-600 bg-green-50",
  "Very Good": "text-blue-600 bg-blue-50",
  Good: "text-amber-600 bg-amber-50",
  New: "text-purple-600 bg-purple-50",
  Fair: "text-gray-600 bg-gray-100",
}

const categories = ["All", "Books", "Electronics", "Clothing", "Stationery", "Services", "Other"]

export default async function MarketplacePage() {
  const supabase = await createClient()
  const { data: listings, count } = await supabase
    .from("marketplace_listings")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .eq("is_sold", false)
    .order("created_at", { ascending: false })
    .limit(24)

  return (
    <>
      {/* Hero */}
      <div className="pt-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-7 sm:pt-10 sm:pb-8">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">Student Marketplace</span>
            <h1 className="mt-2 font-heading font-black text-4xl sm:text-5xl text-dark">Buy, Sell &amp; Trade</h1>
            <p className="mt-3 text-muted text-base font-body max-w-lg">
              A trusted marketplace for Tanzanian university students. Browse listings from campuses across the country.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="mt-6 space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="search" placeholder="Search listings..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-body placeholder-muted focus:outline-none focus:border-brand transition-colors" />
              </div>
              <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors shrink-0">
                <Plus size={15} /> Post a Listing
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} className={`px-3.5 py-1.5 rounded-full text-xs font-section font-semibold border transition-colors ${cat === "All" ? "bg-brand text-white border-brand" : "bg-white text-muted border-gray-200 hover:border-brand hover:text-brand"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Listings */}
      <section className="bg-[#ECECEC] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {listings && listings.length > 0 ? (
            <>
              <AnimatedSection className="mb-5 flex items-center justify-between">
                <p className="text-sm text-muted font-body">
                  Showing <span className="text-dark font-semibold">{listings.length}</span>
                  {count && count > listings.length ? ` of ${count.toLocaleString()}` : ""} listings
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {listings.map((item, i) => (
                  <AnimatedSection key={item.id} delay={0.05 * i}>
                    <Link href={`/marketplace/${item.slug}`} className="group flex flex-col card-pro card-hover h-full">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" sizes="25vw" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Tag size={32} className="text-gray-200" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/5" />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-section font-semibold ${conditionColor[item.condition] ?? "text-gray-600 bg-gray-100"}`}>
                          {item.condition}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 p-3.5">
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-section font-semibold text-muted mb-1.5">
                          <Tag size={9} /> {item.category}
                        </span>
                        <h3 className="font-section font-semibold text-sm text-dark group-hover:text-brand transition-colors leading-snug line-clamp-2">{item.title}</h3>
                        <div className="mt-1.5 font-heading font-bold text-base text-dark">
                          {item.currency} {Number(item.price).toLocaleString()}
                        </div>
                        <div className="mt-auto pt-2.5 border-t border-gray-50 flex items-center gap-1.5">
                          <UserCircle size={12} className="text-muted shrink-0" />
                          <span className="text-xs text-muted font-body truncate">
                            {item.seller_name}{item.university ? ` · ${item.university}` : ""}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Tag size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="text-muted font-body text-base mb-3">No listings yet.</p>
              <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors">
                <Plus size={15} /> Post the First Listing
              </Link>
            </div>
          )}

          {/* App CTA */}
          <AnimatedSection delay={0.3} className="mt-12 bg-surface rounded-2xl p-7 sm:p-8 text-center border border-gray-100">
            <h3 className="font-section font-bold text-xl text-dark mb-2">Get the full marketplace experience</h3>
            <p className="text-muted text-sm font-body max-w-md mx-auto mb-6">
              The CampusVibe app unlocks messaging sellers, offers, delivery tracking, and escrow-protected payments.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors">
                Download the App <ArrowRight size={14} />
              </a>
              <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-dark text-sm font-semibold hover:border-brand hover:text-brand transition-colors">
                <Plus size={14} /> List Your Item
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
