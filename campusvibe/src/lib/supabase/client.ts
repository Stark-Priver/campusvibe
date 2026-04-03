import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

type SupabaseBrowserClient = SupabaseClient<
  Database,
  "public",
  "public",
  Database["public"]
>

export function createClient(): SupabaseBrowserClient {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as unknown as SupabaseBrowserClient
}
