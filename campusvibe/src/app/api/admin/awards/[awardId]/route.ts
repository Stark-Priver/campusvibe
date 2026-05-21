import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/custom"

async function isAdmin(userId: string) {
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", userId)
    .single()

  return profile?.roles?.includes("administrator") || profile?.roles?.includes("admin")
}

export async function GET(request: Request, { params }: { params: Promise<{ awardId: string }> }) {
  try {
    const { awardId } = await params
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin = await isAdmin(user.id)
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const supabase = await createAdminClient()

    const { data: award, error } = await supabase
      .from("awards")
      .select("*")
      .eq("id", awardId)
      .single()

    if (error || !award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 })
    }

    return NextResponse.json({ award })
  } catch (error) {
    console.error("Error fetching award:", error)
    return NextResponse.json({ error: "Failed to fetch award" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ awardId: string }> }) {
  try {
    const { awardId } = await params
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin = await isAdmin(user.id)
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const { name, description, category, status, start_date, end_date, rules } = body

    const supabaseClient = await createAdminClient() as any
    const supabase = supabaseClient

    const updateData: Record<string, unknown> = {
      name,
      description,
      category: category || "general",
      status: status || "active",
      updated_at: new Date().toISOString(),
    }

    if (start_date) {
      updateData.start_date = new Date(start_date).toISOString()
    }
    if (end_date) {
      updateData.end_date = new Date(end_date).toISOString()
    }
    if (rules) {
      updateData.rules = rules
    }

    const { data: award, error } = await supabase
      .from("awards")
      .update(updateData)
      .eq("id", awardId)
      .select()
      .single()

    if (error) {
      console.error("Error updating award:", error)
      return NextResponse.json({ error: "Failed to update award" }, { status: 500 })
    }

    return NextResponse.json({ award, success: true })
  } catch (error) {
    console.error("Error updating award:", error)
    return NextResponse.json({ error: "Failed to update award" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ awardId: string }> }) {
  try {
    const { awardId } = await params
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin = await isAdmin(user.id)
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const supabase = await createAdminClient()

    const { error } = await supabase.from("awards").delete().eq("id", awardId)

    if (error) {
      console.error("Error deleting award:", error)
      return NextResponse.json({ error: "Failed to delete award" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting award:", error)
    return NextResponse.json({ error: "Failed to delete award" }, { status: 500 })
  }
}
