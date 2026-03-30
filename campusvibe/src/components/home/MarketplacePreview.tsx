import Link from "next/link"
import Image from "next/image"
import { Tag, UserCircle, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

const conditionColor: Record<string, string> = {
  "Like New": "text-green-600 bg-green-50",
  "Very Good": "text-blue-600 bg-blue-50",
  Good: "text-amber-600 bg-amber-50",
  New: "text-purple-600 bg-purple-50",
  Fair: "text-gray-600 bg-gray-100",
}

export default async function MarketplacePreview() {
  const supabase = await createClient()
  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("id, title, slug, price, currency, category, condition, seller_name, university, image_url")
    .eq("is_published", true)
    .eq("is_sold", false)
    .order("created_at", { ascending: false })
    .limit(4)

  if (!listings || listings.length === 0) return null

  return (
    <section className="bg-[#ECECEC] section-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              Student Marketplace
            </span>
            <h2 className="mt-1.5 font-heading font-black text-2xl sm:text-3xl text-dark">
              Buy, Sell & Trade
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {listings.map((item, i) => (
            <AnimatedSection key={item.id} delay={0.07 * i}>
              <Link href={`/marketplace/${item.slug}`} className="group flex flex-col card-pro card-hover h-full">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="25vw" />
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
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-section font-semibold text-muted mb-1">
                    <Tag size={9} /> {item.category}
                  </span>
                  <h3 className="font-section font-semibold text-sm text-dark group-hover:text-brand transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>
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

        <AnimatedSection delay={0.3} className="mt-10 bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-200">
          <h3 className="font-section font-bold text-xl text-dark mb-2">
            Got something to sell?
          </h3>
          <p className="text-muted text-sm font-body max-w-md mx-auto mb-5">
            List your books, electronics, clothes, and more. Reach thousands of students across Tanzania.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors">
              Post a Listing <ArrowRight size={14} />
            </Link>
            <Link href="/marketplace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-dark text-sm font-semibold hover:border-brand hover:text-brand transition-colors">
              Browse All
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
