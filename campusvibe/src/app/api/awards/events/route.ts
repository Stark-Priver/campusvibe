import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { jwtDecode } from "jsonwebtoken"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("awards_events")
      .select("*")
      .neq("status", "draft")
      .order("created_at", { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching awards events:", error)
    return NextResponse.json(
      { error: "Failed to fetch awards events" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    
    // Check if user is admin
    const { data: userData } = await supabase
      .from("users")
      .select("roles")
      .eq("id", user.data.user?.id)
      .single()
    
    if (!userData?.roles?.includes("administrator")) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    const { data, error } = await supabase
      .from("awards_events")
      .insert([
        {
          title: body.title,
          slug: body.slug,
          description: body.description,
          status: "draft",
          nominations_start_at: body.nominations_start_at,
          nominations_end_at: body.nominations_end_at,
          voting_start_at: body.voting_start_at,
          voting_end_at: body.voting_end_at,
          university: body.university,
          image_url: body.image_url,
          banner_url: body.banner_url,
          created_by: user.data.user?.id,
        },
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating awards event:", error)
    return NextResponse.json(
      { error: "Failed to create awards event" },
      { status: 500 }
    )
  }
}
