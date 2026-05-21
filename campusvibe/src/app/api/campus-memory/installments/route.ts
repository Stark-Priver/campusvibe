import { createAdminClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/custom"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const bookingId = searchParams.get("booking")

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Get installments for booking
    const { data: installments, error } = await supabase
      .from("campus_memory_installments")
      .select("*")
      .eq("booking_id", bookingId)
      .order("installment_number", { ascending: true })

    if (error) throw error

    return NextResponse.json({ installments })
  } catch (err) {
    console.error("Error fetching installments:", err)
    return NextResponse.json({ error: "Failed to fetch installments" }, { status: 500 })
  }
}
