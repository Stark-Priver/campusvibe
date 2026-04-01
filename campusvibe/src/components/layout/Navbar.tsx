import { createAdminClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/custom"
import NavbarClient from "./NavbarClient"

export default async function Navbar() {
  const user = await getCurrentUser()

  let profile = null
  if (user) {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
    profile = data
  }

  return (
    <NavbarClient
      user={user ? { email: user.email, name: profile?.full_name ?? user.full_name ?? "" } : null}
    />
  )
}
