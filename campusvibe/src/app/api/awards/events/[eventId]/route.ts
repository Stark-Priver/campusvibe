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
      .from("awards_events")
      .select("*")
      .eq("id", eventId)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    )
  }
}

export async function PUT(
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
      .from("awards_events")
      .update(body)
      .eq("id", eventId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const { error } = await supabase
      .from("awards_events")
      .delete()
      .eq("id", eventId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    )
  }
}
