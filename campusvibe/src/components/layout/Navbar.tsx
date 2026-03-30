import { createClient } from "@/lib/supabase/server"
import NavbarClient from "./NavbarClient"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single()
    profile = data
  }

  return (
    <NavbarClient
      user={user ? { email: user.email ?? "", name: profile?.full_name ?? "" } : null}
    />
  )
}
