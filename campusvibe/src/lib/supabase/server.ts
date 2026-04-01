import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Read-only context (Server Component) — safe to ignore
          }
        },
      },
    }
  )
}

/**
 * Safe version that returns null instead of throwing when Supabase is
 * not configured. Use this in pages that need to check auth state but
 * should still render (rather than crash) without a live Supabase project.
 */
export async function getSessionUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

  if (!url || !key || url.includes("your-project-ref")) {
    return null
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
  } catch {
    return null
  }
}

export async function createAdminClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
