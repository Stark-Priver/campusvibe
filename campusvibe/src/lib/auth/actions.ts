"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

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

export async function login(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      if (error.message.toLowerCase().includes("invalid login")) {
        return { error: "Incorrect email or password. Please try again." }
      }
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return { error: "Please verify your email address before signing in." }
      }
      if (error.message.toLowerCase().includes("rate limit")) {
        return { error: "Too many attempts. Please wait a few minutes and try again." }
      }
      return { error: "Sign in failed. Please check your credentials and try again." }
    }
  } catch {
    return { error: "Unable to connect. Please check your internet connection." }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function register(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
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
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.fullName,
          university: parsed.data.university ?? "",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        return { error: "An account with this email already exists. Please sign in." }
      }
      return { error: "Registration failed. Please try again." }
    }
  } catch {
    return { error: "Unable to connect. Please check your internet connection." }
  }

  return {
    success:
      "Account created! Please check your email to verify your account, then sign in.",
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // Ignore errors during logout — we always redirect
  }
  revalidatePath("/", "layout")
  redirect("/")
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    return profile
  } catch {
    return null
  }
}
