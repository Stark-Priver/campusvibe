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

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin = await isAdmin(user.id)
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const supabase = await createAdminClient()

    // Get all awards
    const { data: awards } = await supabase
      .from("awards")
      .select("*")
      .order("created_at", { ascending: false })

    // Get vote statistics
    const { data: votes } = await supabase
      .from("award_votes")
      .select("award_id")

    // Calculate statistics
    const awardsList = (awards || []) as Array<{ id: string; name: string; description: string; status: string }>
    const votesList = (votes || []) as Array<{ award_id: string }>

    const stats = {
      totalAwards: awardsList.length,
      activeAwards: awardsList.filter(a => a.status === "active").length,
      totalVotes: votesList.length,
      totalNominees: 0, // Would need to aggregate from nominees table
    }

    // Format awards for display
    const formattedAwards = awardsList.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      votes: votesList.filter(v => v.award_id === a.id).length,
      nominees: 0, // Would query nominees table
      status: a.status,
    }))

    return NextResponse.json({
      stats,
      awards: formattedAwards,
    })
  } catch (error) {
    console.error("Admin awards error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin = await isAdmin(user.id)
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const { name, description, category, status, start_date, end_date, rules } = body

    if (!name || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabaseClient = await createAdminClient() as any
    const supabase = supabaseClient

    const { data: award, error } = await supabase
      .from("awards")
      .insert([
        {
          name,
          description,
          category: category || "general",
          status: status || "active",
          start_date: start_date ? new Date(start_date).toISOString() : null,
          end_date: end_date ? new Date(end_date).toISOString() : null,
          rules: rules || null,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating award:", error)
      return NextResponse.json({ error: "Failed to create award" }, { status: 500 })
    }

    return NextResponse.json({ award, success: true })
  } catch (error) {
    console.error("Error creating award:", error)
    return NextResponse.json({ error: "Failed to create award" }, { status: 500 })
  }
}
