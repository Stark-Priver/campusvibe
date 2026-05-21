"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { User } from "./custom"
import { registerUser, loginUser, setAuthCookie, clearAuthCookie, getCurrentUser as getJwtUser } from "./custom"

type UserProfileRow = {
  id: string
  email: string
  full_name: string
  university: string | null
  roles: string[]
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  university: z.string().optional(),
})

export type ActionResult = {
  error?: string
  success?: string
}

export async function login(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" }
  }

  const user = await loginUser(parsed.data.email, parsed.data.password)
  if (!user) {
    return { error: "Incorrect email or password. Please try again." }
  }

  await setAuthCookie(user)
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function register(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    university: formData.get("university"),
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" }
  }

  try {
    const user = await registerUser(
      parsed.data.email,
      parsed.data.password,
      parsed.data.fullName,
      parsed.data.university || undefined
    )
    if (!user) {
      return { error: "An account with this email already exists. Please sign in." }
    }

    await setAuthCookie(user)
    revalidatePath("/", "layout")
    redirect("/dashboard")
  } catch {
    return { error: "Registration failed. Please try again." }
  }
}

export async function logout() {
  await clearAuthCookie()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function getSession() {
  return (await getJwtUser()) ? { user: { id: "" } } : null  // Stub for compatibility
}

export async function getCurrentUser(): Promise<User | null> {
  const user = await getJwtUser()
  if (!user) return null

  // Fetch full profile from DB
  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("Error fetching user profile:", error)
    // Fallback to JWT data if DB fetch fails
    return user
  }

  const typedProfile = profile as UserProfileRow | null

  if (!typedProfile) {
    console.error("User profile not found in database")
    return user
  }

  return {
    id: typedProfile.id,
    email: typedProfile.email,
    full_name: typedProfile.full_name,
    university: typedProfile.university,
    roles: typedProfile.roles && typedProfile.roles.length > 0 ? typedProfile.roles : ["student"]
  }
}
