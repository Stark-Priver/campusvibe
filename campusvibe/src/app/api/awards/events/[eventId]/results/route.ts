import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const categoryId = request.nextUrl.searchParams.get("categoryId")
    const supabase = await createClient()
    
    // Verify event exists
    const { data: event } = await supabase
      .from("awards_events")
      .select("*")
      .eq("id", eventId)
      .single()
    
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }
    
    // Get nominees with vote counts
    let query = supabase
      .from("nominees")
      .select(
        `
        id,
        full_name,
        bio,
        image_url,
        achievement,
        university,
        votes_count,
        award_categories (
          id,
          name,
          icon
        )
        `
      )
      .eq("awards_event_id", eventId)
    
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }
    
    const { data: nominees, error } = await query.order("votes_count", {
      ascending: false,
    })
    
    if (error) throw error
    
    return NextResponse.json({
      event,
      nominees,
      totalVotes: nominees.reduce((sum, n) => sum + (n.votes_count || 0), 0),
    })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    )
  }
}
