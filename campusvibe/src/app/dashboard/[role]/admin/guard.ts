import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/actions"

export async function requireAdministrator(role: string) {
  if (role !== "administrator") notFound()

  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (!user.roles.includes("administrator")) redirect("/dashboard")

  return user
}
