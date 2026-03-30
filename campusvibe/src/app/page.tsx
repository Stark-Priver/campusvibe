import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import Hero from "@/components/home/Hero"
import BreakingNewsTicker from "@/components/home/BreakingNewsTicker"
import NewsFeed from "@/components/home/NewsFeed"
import { MediaHighlights } from "@/components/home/MediaHighlights"
import FeaturedEvents from "@/components/home/FeaturedEvents"
import MarketplacePreview from "@/components/home/MarketplacePreview"
import GetInvolvedCTA from "@/components/home/GetInvolvedCTA"

export const metadata: Metadata = {
  title: "CampusVibe — Ride. Eat. Connect. Earn.",
  description:
    "Tanzania's #1 university super-app. Transport, food delivery, student marketplace, campus events, and news — all in one platform.",
}

export const revalidate = 60 // ISR: refresh every 60 seconds

export default async function HomePage() {
  const supabase = await createClient()
  const { data: mediaItems } = await supabase
    .from("media_items")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4)

  return (
    <>
      <Hero />
      <BreakingNewsTicker />
      <NewsFeed />
      <FeaturedEvents />
      <MediaHighlights items={mediaItems ?? []} />
      <MarketplacePreview />
      <GetInvolvedCTA />
    </>
  )
}
