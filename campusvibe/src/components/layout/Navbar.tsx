import NavbarClient from "./NavbarClient"

export default async function Navbar() {
  let user = null

  // Only attempt Supabase auth if env vars are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  if (supabaseUrl && !supabaseUrl.includes("your-project-ref")) {
    try {
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = await createClient()
      const { data: { user: authUser }, error } = await supabase.auth.getUser()

      if (!error && authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", authUser.id)
          .single()

        user = {
          email: authUser.email ?? "",
          name: profile?.full_name ?? "",
        }
      }
    } catch {
      // Supabase error — render navbar without auth state
    }
  }

  return <NavbarClient user={user} />
}
