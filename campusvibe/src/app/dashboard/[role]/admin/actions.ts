"use server"

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/server"
import type { Json } from "@/types/database"
import { getCurrentUser } from "@/lib/auth/actions"

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function requireAdminActor() {
  const actor = await getCurrentUser()
  if (!actor || !actor.roles.includes("administrator")) {
    throw new Error("Unauthorized")
  }
  return actor
}

async function logAudit(action: string, entityType: string, entityId?: string, details?: Json) {
  const actor = await requireAdminActor()
  const supabase = await createAdminClient()

  await supabase.from("audit_logs").insert({
    actor_id: actor.id,
    actor_email: actor.email,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    details: details ?? null,
  })
}

function revalidateAdmin(role: string) {
  revalidatePath(`/dashboard/${role}/admin/overview`)
  revalidatePath(`/dashboard/${role}/admin/moderation`)
  revalidatePath(`/dashboard/${role}/admin/inbox`)
  revalidatePath(`/dashboard/${role}/admin/content`)
  revalidatePath(`/dashboard/${role}/admin/users`)
  revalidatePath(`/dashboard/${role}/admin/campuses`)
  revalidatePath(`/dashboard/${role}/admin/company`)
  revalidatePath(`/dashboard/${role}/admin/audit`)
  revalidatePath(`/dashboard/${role}/admin/analytics`)
}

export async function upsertCompanyProfile(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()

  const id = String(formData.get("id") || "").trim()
  const payload = {
    company_name: String(formData.get("company_name") || "Campus Vibe"),
    tagline: String(formData.get("tagline") || "") || null,
    website_url: String(formData.get("website_url") || "") || null,
    support_email: String(formData.get("support_email") || "") || null,
    contact_phone: String(formData.get("contact_phone") || "") || null,
    headquarters: String(formData.get("headquarters") || "") || null,
    registration_number: String(formData.get("registration_number") || "") || null,
    tax_number: String(formData.get("tax_number") || "") || null,
  }

  if (id) {
    const { error } = await supabase.from("company_profile").update(payload).eq("id", id)
    if (error) throw new Error(error.message)
    await logAudit("update", "company_profile", id, payload)
  } else {
    const { data, error } = await supabase.from("company_profile").insert(payload).select("id").single()
    if (error) throw new Error(error.message)
    await logAudit("create", "company_profile", data.id, payload)
  }

  revalidateAdmin(role)
}

export async function createSocialHandle(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()

  const payload = {
    platform: String(formData.get("platform") || "x"),
    handle: String(formData.get("handle") || ""),
    url: String(formData.get("url") || ""),
    display_order: Number(formData.get("display_order") || 0),
    is_active: formData.get("is_active") === "on",
  }

  const { data, error } = await supabase.from("company_social_handles").insert(payload).select("id").single()
  if (error) throw new Error(error.message)
  await logAudit("create", "company_social_handles", data.id, payload)
  revalidateAdmin(role)
}

export async function updateSocialHandle(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()

  const id = String(formData.get("id") || "")
  const payload = {
    platform: String(formData.get("platform") || "x"),
    handle: String(formData.get("handle") || ""),
    url: String(formData.get("url") || ""),
    display_order: Number(formData.get("display_order") || 0),
    is_active: formData.get("is_active") === "on",
  }

  const { error } = await supabase.from("company_social_handles").update(payload).eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("update", "company_social_handles", id, payload)
  revalidateAdmin(role)
}

export async function deleteSocialHandle(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")

  const { error } = await supabase.from("company_social_handles").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("delete", "company_social_handles", id)
  revalidateAdmin(role)
}

export async function createCampus(role: string, formData: FormData) {
  const actor = await requireAdminActor()
  const supabase = await createAdminClient()

  const payload = {
    name: String(formData.get("name") || ""),
    short_name: String(formData.get("short_name") || "") || null,
    city: String(formData.get("city") || "") || null,
    country: String(formData.get("country") || "Tanzania"),
    status: String(formData.get("status") || "pending"),
    verification_notes: String(formData.get("verification_notes") || "") || null,
    contact_email: String(formData.get("contact_email") || "") || null,
    contact_phone: String(formData.get("contact_phone") || "") || null,
    created_by: actor.id,
    verified_by: formData.get("status") === "verified" ? actor.id : null,
    verified_at: formData.get("status") === "verified" ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase.from("campuses").insert(payload).select("id").single()
  if (error) throw new Error(error.message)
  await logAudit("create", "campuses", data.id, payload)
  revalidateAdmin(role)
}

export async function updateCampus(role: string, formData: FormData) {
  const actor = await requireAdminActor()
  const supabase = await createAdminClient()

  const id = String(formData.get("id") || "")
  const status = String(formData.get("status") || "pending")
  const payload = {
    name: String(formData.get("name") || ""),
    short_name: String(formData.get("short_name") || "") || null,
    city: String(formData.get("city") || "") || null,
    country: String(formData.get("country") || "Tanzania"),
    status,
    verification_notes: String(formData.get("verification_notes") || "") || null,
    contact_email: String(formData.get("contact_email") || "") || null,
    contact_phone: String(formData.get("contact_phone") || "") || null,
    verified_by: status === "verified" ? actor.id : null,
    verified_at: status === "verified" ? new Date().toISOString() : null,
  }

  const { error } = await supabase.from("campuses").update(payload).eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("update", "campuses", id, payload)
  revalidateAdmin(role)
}

export async function deleteCampus(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")

  const { error } = await supabase.from("campuses").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("delete", "campuses", id)
  revalidateAdmin(role)
}

export async function createManagedUser(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()

  const plainPassword = String(formData.get("password") || "")
  const passwordHash = await bcrypt.hash(plainPassword, 12)

  const payload = {
    email: String(formData.get("email") || ""),
    full_name: String(formData.get("full_name") || ""),
    university: String(formData.get("university") || "") || null,
    password_hash: passwordHash,
    roles: [String(formData.get("role") || "student")],
    email_verified: formData.get("email_verified") === "on",
  }

  const { data, error } = await supabase.from("users").insert(payload).select("id").single()
  if (error) throw new Error(error.message)
  await logAudit("create", "users", data.id, { email: payload.email, roles: payload.roles })
  revalidateAdmin(role)
}

export async function updateManagedUser(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()

  const id = String(formData.get("id") || "")
  const payload = {
    email: String(formData.get("email") || ""),
    full_name: String(formData.get("full_name") || ""),
    university: String(formData.get("university") || "") || null,
    roles: [String(formData.get("role") || "student")],
    email_verified: formData.get("email_verified") === "on",
  }

  const { error } = await supabase.from("users").update(payload).eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("update", "users", id, { email: payload.email, roles: payload.roles })
  revalidateAdmin(role)
}

export async function deleteManagedUser(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")

  const { error } = await supabase.from("users").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("delete", "users", id)
  revalidateAdmin(role)
}

export async function createNews(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const title = String(formData.get("title") || "")
  const slug = toSlug(String(formData.get("slug") || title))
  const payload = {
    title,
    slug,
    category: String(formData.get("category") || "general"),
    excerpt: String(formData.get("excerpt") || "") || null,
    content: String(formData.get("content") || "") || null,
    author_name: String(formData.get("author_name") || "Admin"),
    is_published: formData.get("is_published") === "on",
    published_at: formData.get("is_published") === "on" ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase.from("news_articles").insert(payload).select("id").single()
  if (error) throw new Error(error.message)
  await logAudit("create", "news_articles", data.id, { title, slug })
  revalidateAdmin(role)
}

export async function updateNews(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")
  const title = String(formData.get("title") || "")
  const slug = toSlug(String(formData.get("slug") || title))
  const payload = {
    title,
    slug,
    category: String(formData.get("category") || "general"),
    excerpt: String(formData.get("excerpt") || "") || null,
    content: String(formData.get("content") || "") || null,
    author_name: String(formData.get("author_name") || "Admin"),
    is_published: formData.get("is_published") === "on",
    published_at: formData.get("is_published") === "on" ? new Date().toISOString() : null,
  }

  const { error } = await supabase.from("news_articles").update(payload).eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("update", "news_articles", id, { title, slug })
  revalidateAdmin(role)
}

export async function deleteNews(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")
  const { error } = await supabase.from("news_articles").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("delete", "news_articles", id)
  revalidateAdmin(role)
}

export async function createEventItem(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const title = String(formData.get("title") || "")
  const slug = toSlug(String(formData.get("slug") || title))
  const payload = {
    title,
    slug,
    category: String(formData.get("category") || "General"),
    description: String(formData.get("description") || "") || null,
    date: String(formData.get("date") || new Date().toISOString().slice(0, 10)),
    time: String(formData.get("time") || "") || null,
    location: String(formData.get("location") || "") || null,
    university: String(formData.get("university") || "") || null,
    is_published: formData.get("is_published") === "on",
  }

  const { data, error } = await supabase.from("events").insert(payload).select("id").single()
  if (error) throw new Error(error.message)
  await logAudit("create", "events", data.id, { title, slug })
  revalidateAdmin(role)
}

export async function updateEventItem(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")
  const title = String(formData.get("title") || "")
  const slug = toSlug(String(formData.get("slug") || title))
  const payload = {
    title,
    slug,
    category: String(formData.get("category") || "General"),
    description: String(formData.get("description") || "") || null,
    date: String(formData.get("date") || new Date().toISOString().slice(0, 10)),
    time: String(formData.get("time") || "") || null,
    location: String(formData.get("location") || "") || null,
    university: String(formData.get("university") || "") || null,
    is_published: formData.get("is_published") === "on",
  }

  const { error } = await supabase.from("events").update(payload).eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("update", "events", id, { title, slug })
  revalidateAdmin(role)
}

export async function deleteEventItem(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("delete", "events", id)
  revalidateAdmin(role)
}

export async function createMedia(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const title = String(formData.get("title") || "")
  const slug = toSlug(String(formData.get("slug") || title))
  const payload = {
    title,
    slug,
    type: String(formData.get("type") || "video"),
    channel: String(formData.get("channel") || "") || null,
    duration: String(formData.get("duration") || "") || null,
    media_url: String(formData.get("media_url") || "") || null,
    is_published: formData.get("is_published") === "on",
  }

  const { data, error } = await supabase.from("media_items").insert(payload).select("id").single()
  if (error) throw new Error(error.message)
  await logAudit("create", "media_items", data.id, { title, slug })
  revalidateAdmin(role)
}

export async function updateMedia(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")
  const title = String(formData.get("title") || "")
  const slug = toSlug(String(formData.get("slug") || title))
  const payload = {
    title,
    slug,
    type: String(formData.get("type") || "video"),
    channel: String(formData.get("channel") || "") || null,
    duration: String(formData.get("duration") || "") || null,
    media_url: String(formData.get("media_url") || "") || null,
    is_published: formData.get("is_published") === "on",
  }

  const { error } = await supabase.from("media_items").update(payload).eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("update", "media_items", id, { title, slug })
  revalidateAdmin(role)
}

export async function deleteMedia(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")
  const { error } = await supabase.from("media_items").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("delete", "media_items", id)
  revalidateAdmin(role)
}

export async function createListing(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const title = String(formData.get("title") || "")
  const slug = toSlug(String(formData.get("slug") || title))
  const payload = {
    title,
    slug,
    category: String(formData.get("category") || "General"),
    description: String(formData.get("description") || "") || null,
    condition: String(formData.get("condition") || "Good"),
    price: Number(formData.get("price") || 0),
    currency: String(formData.get("currency") || "TZS"),
    seller_name: String(formData.get("seller_name") || "CampusVibe"),
    university: String(formData.get("university") || "") || null,
    is_published: formData.get("is_published") === "on",
  }

  const { data, error } = await supabase.from("marketplace_listings").insert(payload).select("id").single()
  if (error) throw new Error(error.message)
  await logAudit("create", "marketplace_listings", data.id, { title, slug })
  revalidateAdmin(role)
}

export async function updateListing(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")
  const title = String(formData.get("title") || "")
  const slug = toSlug(String(formData.get("slug") || title))
  const payload = {
    title,
    slug,
    category: String(formData.get("category") || "General"),
    description: String(formData.get("description") || "") || null,
    condition: String(formData.get("condition") || "Good"),
    price: Number(formData.get("price") || 0),
    currency: String(formData.get("currency") || "TZS"),
    seller_name: String(formData.get("seller_name") || "CampusVibe"),
    university: String(formData.get("university") || "") || null,
    is_published: formData.get("is_published") === "on",
  }

  const { error } = await supabase.from("marketplace_listings").update(payload).eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("update", "marketplace_listings", id, { title, slug })
  revalidateAdmin(role)
}

export async function deleteListing(role: string, formData: FormData) {
  await requireAdminActor()
  const supabase = await createAdminClient()
  const id = String(formData.get("id") || "")
  const { error } = await supabase.from("marketplace_listings").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await logAudit("delete", "marketplace_listings", id)
  revalidateAdmin(role)
}
