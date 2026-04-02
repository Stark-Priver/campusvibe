import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Tag, UserCircle, MapPin, MessageCircle } from "lucide-react"
import { CopyLinkButton } from "@/components/ui/CopyLinkButton"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("marketplace_listings")
    .select("title, description, image_url, price, currency, category")
    .eq("slug", slug)
    .single()

  if (!data) return { title: "Marketplace — CampusVibe" }
  return {
    title: `${data.title} — ${data.currency} ${Number(data.price).toLocaleString()}`,
    description: data.description ?? `${data.category} for sale on CampusVibe Marketplace`,
    openGraph: {
      title: data.title,
      description: data.description ?? undefined,
      images: data.image_url ? [{ url: data.image_url }] : [],
    },
    alternates: { canonical: `/marketplace/${slug}` },
  }
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("marketplace_listings").select("slug").eq("is_published", true).eq("is_sold", false)
    return (data ?? []).map((l) => ({ slug: l.slug }))
  } catch {
    return []
  }
}

export const revalidate = 120

const conditionColor: Record<string, string> = {
  "Like New": "text-green-600 bg-green-50 border-green-200",
  "Very Good": "text-blue-600 bg-blue-50 border-blue-200",
  Good: "text-amber-600 bg-amber-50 border-amber-200",
  New: "text-purple-600 bg-purple-50 border-purple-200",
  Fair: "text-gray-600 bg-gray-100 border-gray-200",
}

export default async function MarketplaceDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!listing) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.image_url,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: listing.currency,
      availability: listing.is_sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: { "@type": "Person", name: listing.seller_name ?? "CampusVibe Seller" },
    },
    url: `https://campusvibe.co.tz/marketplace/${listing.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-20 pb-16 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors font-body">
            <ArrowLeft size={14} /> Back to Marketplace
          </Link>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Image */}
            <div className="lg:col-span-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                {listing.image_url ? (
                  <Image src={listing.image_url} alt={listing.title} fill className="object-cover" priority sizes="600px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tag size={60} className="text-gray-200" />
                  </div>
                )}
                {listing.is_sold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-heading font-black text-3xl rotate-[-15deg] border-4 border-white px-4 py-2">SOLD</span>
                  </div>
                )}
              </div>
              {listing.images && listing.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {listing.images.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                      <Image src={img} alt={`${listing.title} ${i + 1}`} fill className="object-cover" sizes="120px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-section font-semibold text-muted">
                  <Tag size={9} /> {listing.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-section font-semibold border ${conditionColor[listing.condition] ?? "text-gray-600 bg-gray-100 border-gray-200"}`}>
                  {listing.condition}
                </span>
              </div>

              <h1 className="font-heading font-black text-2xl sm:text-3xl text-dark leading-tight">{listing.title}</h1>

              <div className="mt-3 font-heading font-black text-3xl text-brand">
                {listing.currency} {Number(listing.price).toLocaleString()}
              </div>

              {listing.description && (
                <p className="mt-4 text-gray-600 font-body text-sm leading-relaxed">{listing.description}</p>
              )}

              <div className="mt-5 space-y-2.5 pt-5 border-t border-gray-100">
                {listing.seller_name && (
                  <div className="flex items-center gap-2.5">
                    <UserCircle size={16} className="text-muted shrink-0" />
                    <span className="text-sm font-body text-dark">{listing.seller_name}</span>
                  </div>
                )}
                {listing.university && (
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-muted shrink-0" />
                    <span className="text-sm font-body text-muted">{listing.university}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {!listing.is_sold ? (
                  <Link href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20">
                    <MessageCircle size={15} /> Contact Seller
                  </Link>
                ) : (
                  <div className="w-full text-center py-3 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold">
                    This item has been sold
                  </div>
                )}
                <CopyLinkButton url={`https://campusvibe.co.tz/marketplace/${listing.slug}`} />
              </div>

              <p className="mt-4 text-xs text-gray-400 font-body">
                Listed on CampusVibe · {new Date(listing.created_at).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
