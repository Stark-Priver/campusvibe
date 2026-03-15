import Hero from "@/components/home/Hero"
import BreakingNewsTicker from "@/components/home/BreakingNewsTicker"
import NewsFeed from "@/components/home/NewsFeed"
import MediaHighlights from "@/components/home/MediaHighlights"
import FeaturedEvents from "@/components/home/FeaturedEvents"
import MarketplacePreview from "@/components/home/MarketplacePreview"
import AwardsBlock from "@/components/home/AwardsBlock"
import GetInvolvedCTA from "@/components/home/GetInvolvedCTA"

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — full viewport brand statement */}
      <Hero />

      {/* 2. Breaking News ticker */}
      <BreakingNewsTicker />

      {/* 3. Latest news feed */}
      <NewsFeed />

      {/* 4. Media highlights */}
      <MediaHighlights />

      {/* 5. Featured events */}
      <FeaturedEvents />

      {/* 6. Marketplace preview */}
      <MarketplacePreview />

      {/* 7. CampusVibe Awards */}
      <AwardsBlock />

      {/* 8. Get Involved CTA */}
      <GetInvolvedCTA />
    </>
  )
}
