import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const supabase = await createClient()
    
    const categoryId = request.nextUrl.searchParams.get("categoryId")
    
    let query = supabase
      .from("nominees")
      .select("*")
      .eq("awards_event_id", eventId)
    
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }
    
    const { data, error } = await query.order("votes_count", {
      ascending: false,
    })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching nominees:", error)
    return NextResponse.json(
      { error: "Failed to fetch nominees" },
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
      .from("nominees")
      .insert([
        {
          awards_event_id: eventId,
          category_id: body.category_id,
          full_name: body.full_name,
          bio: body.bio,
          image_url: body.image_url,
          achievement: body.achievement,
          university: body.university,
          email: body.email,
          phone: body.phone,
          created_by: user.data.user?.id,
        },
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating nominee:", error)
    return NextResponse.json(
      { error: "Failed to create nominee" },
      { status: 500 }
    )
  }
}
