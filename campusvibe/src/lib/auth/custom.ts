import { createAdminClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) throw new Error("JWT_SECRET missing in .env.local")

export interface User {
  id: string
  email: string
  full_name: string
  university: string | null
  roles: string[]
}

type AuthUserRow = {
  id: string
  email: string
  password_hash: string
  full_name: string
  university: string | null
  roles: string[]
  email_verified: boolean
  created_at: string
  updated_at: string
}

type AuthUserInsert = {
  id?: string
  email: string
  password_hash: string
  full_name: string
  university?: string | null
  roles?: string[]
  email_verified?: boolean
  created_at?: string
  updated_at?: string
}

type AuthUserUpdate = {
  id?: string
  email?: string
  password_hash?: string
  full_name?: string
  university?: string | null
  roles?: string[]
  email_verified?: boolean
  created_at?: string
  updated_at?: string
}

type AuthDatabase = {
  public: {
    Tables: {
      users: {
        Row: AuthUserRow
        Insert: AuthUserInsert
        Update: AuthUserUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  university?: string
): Promise<User | null> {
  const supabase = (await createAdminClient()) as unknown as SupabaseClient<AuthDatabase>
  
  const { data: existing, error: existingError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle()

  if (existingError) {
    throw new Error(existingError.message)
  }

  if (existing) return null
  
  const passwordHash = await bcrypt.hash(password, 12)
  
  const { data, error } = await supabase
    .from("users")
    .insert({
      email,
      password_hash: passwordHash,
      full_name: fullName,
      university: university || null,
      roles: ["student"],
      email_verified: true
    } as AuthUserInsert)
    .select()
    .single()
  
  if (error || !data) {
    // Postgres unique violation: duplicate email.
    if (error?.code === "23505") return null
    throw new Error(error?.message ?? "Failed to create account")
  }

  const userData = data as AuthUserRow
  
  return {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    university: userData.university,
    roles: userData.roles
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<User | null> {
  const supabase = (await createAdminClient()) as unknown as SupabaseClient<AuthDatabase>
  
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()
  
  if (error || !data) return null
  
  const userData = data as AuthUserRow
  const valid = await bcrypt.compare(password, userData.password_hash)
  if (!valid) return null
  
  return {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    university: userData.university,
    roles: userData.roles && userData.roles.length > 0 ? userData.roles : ["student"]
  }
}

export async function setAuthCookie(user: User) {
  const token = jwt.sign(
    { userId: user.id, email: user.email, roles: user.roles },
    JWT_SECRET,
    { expiresIn: "7d" }
  )
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete({ name: "auth-token", path: "/" })
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    if (!token) return null
    
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      roles: string[]
    }
    
    return {
      id: decoded.userId,
      email: decoded.email,
      full_name: "",
      university: null,
      roles: decoded.roles && decoded.roles.length > 0 ? decoded.roles : ["student"]
    }
  } catch {
    return null
  }
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      roles: string[]
    }
    
    return {
      id: decoded.userId,
      email: decoded.email,
      full_name: "",
      university: null,
      roles: decoded.roles
    }
  } catch {
    return null
  }
}

