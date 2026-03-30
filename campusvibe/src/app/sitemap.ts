import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const BASE_URL = "https://campusvibe.co.tz"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/media`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/get-involved`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ]

  // Dynamic news routes
  const { data: articles } = await supabase
    .from("news_articles")
    .select("slug, updated_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  const newsRoutes: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE_URL}/news/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  // Dynamic event routes
  const { data: events } = await supabase
    .from("events")
    .select("slug, updated_at")
    .eq("is_published", true)

  const eventRoutes: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: `${BASE_URL}/events/${e.slug}`,
    lastModified: new Date(e.updated_at),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  // Dynamic marketplace routes
  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("slug, updated_at")
    .eq("is_published", true)
    .eq("is_sold", false)

  const marketplaceRoutes: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${BASE_URL}/marketplace/${l.slug}`,
    lastModified: new Date(l.updated_at),
    changeFrequency: "weekly",
    priority: 0.5,
  }))

  return [...staticRoutes, ...newsRoutes, ...eventRoutes, ...marketplaceRoutes]
}
