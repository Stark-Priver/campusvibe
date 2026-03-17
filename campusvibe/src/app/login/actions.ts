"use server"

import { redirect } from "next/navigation"
import { createMockSession, clearMockSession } from "@/lib/auth/session"
import { findMockAuthUserByCredentials } from "@/lib/auth/users"

export type LoginState = {
  error: string | null
}

export async function loginWithCredentials(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Please enter both email and password." }
  }

  const user = findMockAuthUserByCredentials(email, password)
  if (!user) {
    return { error: "Invalid credentials. Please use one of the demo accounts below." }
  }

  await createMockSession(user.id)
  redirect("/dashboard")
}

export async function signOut() {
  await clearMockSession()
  redirect("/login")
}