import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("award_categories")
      .select("*")
      .eq("awards_event_id", eventId)
      .order("display_order", { ascending: true })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching award categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch award categories" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
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
      .from("award_categories")
      .insert([
        {
          awards_event_id: eventId,
          name: body.name,
          description: body.description,
          icon: body.icon,
          display_order: body.display_order || 0,
        },
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating award category:", error)
    return NextResponse.json(
      { error: "Failed to create award category" },
      { status: 500 }
    )
  }
}
