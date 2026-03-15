import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, UserCircle, Tag, ShieldCheck } from "lucide-react"
import { marketplaceItems } from "@/lib/data"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return marketplaceItems.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = marketplaceItems.find((entry) => entry.slug === slug)

  if (!item) return { title: "Marketplace — CampusVibe" }

  return {
    title: `${item.title} — CampusVibe Marketplace`,
    description: `${item.price} · ${item.university} · ${item.category}`,
  }
}

export default async function MarketplaceDetailsPage({ params }: Props) {
  const { slug } = await params
  const item = marketplaceItems.find((entry) => entry.slug === slug)

  if (!item) notFound()

  return (
    <section className="pt-20 pb-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors">
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100">
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" priority sizes="100vw" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-section font-semibold uppercase tracking-wide">
              <Tag size={11} /> {item.category}
            </span>
            <h1 className="mt-4 font-heading font-black text-3xl text-dark leading-tight">{item.title}</h1>
            <p className="mt-3 text-2xl font-heading font-bold text-dark">{item.price}</p>

            <div className="mt-6 space-y-2 text-sm text-gray-600 font-body">
              <p className="flex items-center gap-2"><UserCircle size={14} className="text-brand" /> Seller: {item.seller}</p>
              <p>Campus: {item.university}</p>
              <p>Condition: {item.condition}</p>
              <p className="flex items-center gap-2"><ShieldCheck size={14} className="text-success" /> Verified student listing</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-[#5a52e0] transition-colors">
                Open in App to Contact Seller
              </button>
              <button className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:border-brand hover:text-brand transition-colors">
                Save Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
