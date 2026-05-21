import { createAdminClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/custom"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()

    // Get user's bookings
    const { data: bookings, error } = await supabase
      .from("campus_memory_bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ bookings })
  } catch (err) {
    console.error("Error fetching bookings:", err)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { package_type, event_type, event_date, additional_notes, payment_plan } = body

    const supabase = await createAdminClient()

    // Ensure profile exists for this user
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          university: user.university || null,
          roles: user.roles || ["student"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      
      if (profileError) {
        console.error("Error creating profile:", profileError)
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
      }
    }

    // Get package pricing
    const packagePrices: Record<string, number> = {
      basic: 50000,
      standard: 80000,
      premium: 150000,
    }

    const totalPrice = packagePrices[package_type] || 0

    // Create booking
    const { data: booking, error } = await supabase
      .from("campus_memory_bookings")
      .insert([
        {
          user_id: user.id,
          package_type,
          event_type,
          event_date,
          additional_notes,
          total_price: totalPrice,
          payment_plan,
          status: "pending",
          payment_status: "unpaid",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    // If installment plan, create installment records
    if (payment_plan === "installment" && booking) {
      const installmentAmount = Math.ceil(totalPrice / 3)
      const installments = [
        { booking_id: booking.id, amount: installmentAmount, due_date: new Date().toISOString(), installment_number: 1, status: "pending" },
        { booking_id: booking.id, amount: installmentAmount, due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), installment_number: 2, status: "pending" },
        { booking_id: booking.id, amount: totalPrice - installmentAmount * 2, due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), installment_number: 3, status: "pending" },
      ]

      await supabase.from("campus_memory_installments").insert(installments)
    }

    return NextResponse.json({ booking, message: "Booking created successfully" })
  } catch (err) {
    console.error("Error creating booking:", err)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
