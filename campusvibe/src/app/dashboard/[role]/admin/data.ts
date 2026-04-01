import { createAdminClient } from "@/lib/supabase/server"
import type { AdminSnapshot } from "./types"

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const supabase = await createAdminClient()

  const [
    usersTotalRes,
    usersAdminsRes,
    newsTotalRes,
    newsPublishedRes,
    eventsTotalRes,
    eventsPublishedRes,
    mediaTotalRes,
    mediaPublishedRes,
    listingsTotalRes,
    listingsPublishedRes,
    contactsUnreadRes,
    breakingActiveRes,
    pendingNewsRes,
    pendingEventsRes,
    pendingMediaRes,
    pendingListingsRes,
    recentContactsRes,
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }).contains("roles", ["administrator"]),
    supabase.from("news_articles").select("id", { count: "exact", head: true }),
    supabase.from("news_articles").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("media_items").select("id", { count: "exact", head: true }),
    supabase.from("media_items").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("marketplace_listings").select("id", { count: "exact", head: true }),
    supabase.from("marketplace_listings").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("breaking_news").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("news_articles").select("id", { count: "exact", head: true }).eq("is_published", false),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("is_published", false),
    supabase.from("media_items").select("id", { count: "exact", head: true }).eq("is_published", false),
    supabase.from("marketplace_listings").select("id", { count: "exact", head: true }).eq("is_published", false),
    supabase
      .from("contact_submissions")
      .select("id, full_name, email, interest, created_at, is_read")
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  return {
    totalUsers: usersTotalRes.count ?? 0,
    adminUsers: usersAdminsRes.count ?? 0,
    totalNews: newsTotalRes.count ?? 0,
    publishedNews: newsPublishedRes.count ?? 0,
    totalEvents: eventsTotalRes.count ?? 0,
    publishedEvents: eventsPublishedRes.count ?? 0,
    totalMedia: mediaTotalRes.count ?? 0,
    publishedMedia: mediaPublishedRes.count ?? 0,
    totalListings: listingsTotalRes.count ?? 0,
    publishedListings: listingsPublishedRes.count ?? 0,
    unreadContacts: contactsUnreadRes.count ?? 0,
    activeBreakingNews: breakingActiveRes.count ?? 0,
    pendingNews: pendingNewsRes.count ?? 0,
    pendingEvents: pendingEventsRes.count ?? 0,
    pendingMedia: pendingMediaRes.count ?? 0,
    pendingListings: pendingListingsRes.count ?? 0,
    recentContacts: (recentContactsRes.data as AdminSnapshot["recentContacts"]) ?? [],
  }
}
