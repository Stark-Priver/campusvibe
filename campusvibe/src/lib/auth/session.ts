import "server-only"

import { cookies } from "next/headers"
import { getMockAuthUserById } from "@/lib/auth/users"

const SESSION_COOKIE = "campusvibe_session"

export async function createMockSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearMockSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentMockUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session?.value) return null
  return getMockAuthUserById(session.value) ?? null
}