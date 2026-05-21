import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    
    if (!user.data.user) {
      return NextResponse.json(
        { error: "Unauthorized: User not authenticated" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { awards_event_id, nominee_id } = body
    
    if (!awards_event_id || !nominee_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Check if voting is open
    const { data: eventData } = await supabase
      .from("awards_events")
      .select("status")
      .eq("id", awards_event_id)
      .single()
    
    if (eventData?.status !== "voting_open") {
      return NextResponse.json(
        { error: "Voting is not currently open for this event" },
        { status: 400 }
      )
    }
    
    // Check if user has already voted for this nominee
    const { data: existingVote } = await supabase
      .from("votes")
      .select("id")
      .eq("awards_event_id", awards_event_id)
      .eq("nominee_id", nominee_id)
      .eq("voter_id", user.data.user.id)
      .single()
    
    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted for this nominee" },
        { status: 400 }
      )
    }
    
    // Insert vote
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert([
        {
          awards_event_id,
          nominee_id,
          voter_id: user.data.user.id,
          voter_email: user.data.user.email,
        },
      ])
      .select()
      .single()
    
    if (voteError) throw voteError
    
    // Update nominee votes count
    const { data: nominee } = await supabase
      .from("nominees")
      .select("votes_count")
      .eq("id", nominee_id)
      .single()
    
    if (nominee) {
      await supabase
        .from("nominees")
        .update({ votes_count: (nominee.votes_count || 0) + 1 })
        .eq("id", nominee_id)
    }
    
    return NextResponse.json(vote)
  } catch (error) {
    console.error("Error submitting vote:", error)
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const awards_event_id = request.nextUrl.searchParams.get("awards_event_id")
    
    if (!awards_event_id) {
      return NextResponse.json(
        { error: "Missing awards_event_id parameter" },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from("votes")
      .select("nominee_id")
      .eq("awards_event_id", awards_event_id)
    
    if (error) throw error
    
    // Count votes by nominee
    const votesByNominee = data.reduce(
      (acc, vote) => {
        const nomineeId = vote.nominee_id
        acc[nomineeId] = (acc[nomineeId] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    
    return NextResponse.json(votesByNominee)
  } catch (error) {
    console.error("Error fetching votes:", error)
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    )
  }
}
