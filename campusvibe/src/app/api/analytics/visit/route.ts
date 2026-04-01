import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { verifyToken } from "@/lib/auth/custom"
import { cookies, headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as Record<string, unknown>))
    const h = await headers()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    const user = token ? verifyToken(token) : null

    const ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null
    const userAgent = h.get("user-agent") || null

    const supabase = await createAdminClient()
    await supabase.from("site_visits").insert({
      user_id: user?.id ?? null,
      visitor_token: typeof body.visitorToken === "string" ? body.visitorToken : null,
      path: typeof body.path === "string" && body.path.length > 0 ? body.path : "/",
      referrer: typeof body.referrer === "string" ? body.referrer : null,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
