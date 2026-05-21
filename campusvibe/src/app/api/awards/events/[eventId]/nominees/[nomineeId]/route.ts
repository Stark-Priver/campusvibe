import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; nomineeId: string }> }
) {
  try {
    const { eventId, nomineeId } = await params
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

    const { error } = await supabase.from("nominees").delete().eq("id", nomineeId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting nominee:", error)
    return NextResponse.json(
      { error: "Failed to delete nominee" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; nomineeId: string }> }
) {
  try {
    const { eventId, nomineeId } = await params
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
      .update(body)
      .eq("id", nomineeId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating nominee:", error)
    return NextResponse.json(
      { error: "Failed to update nominee" },
      { status: 500 }
    )
  }
}
