"use server"

import { redirect } from "next/navigation"
import { createMockSession, clearMockSession } from "@/lib/auth/session"
import { findMockAuthUserByCredentials } from "@/lib/auth/users"

export async function loginWithCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    redirect("/login?error=missing")
  }

  const user = findMockAuthUserByCredentials(email, password)
  if (!user) {
    redirect("/login?error=invalid")
  }

  await createMockSession(user.id)
  redirect("/dashboard")
}

export async function signOut() {
  await clearMockSession()
  redirect("/login")
}