import { createAdminClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/custom"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { booking_id, amount, payment_method, phone_number, installment_id } = body

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

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from("campus_memory_bookings")
      .select("*")
      .eq("id", booking_id)
      .eq("user_id", user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("campus_memory_payments")
      .insert([
        {
          booking_id,
          user_id: user.id,
          amount,
          payment_method,
          phone_number,
          installment_id: installment_id || null,
          status: "pending",
          mpesa_reference: `CM-${Date.now()}`,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (paymentError) throw paymentError

    // In production, integrate with actual M-Pesa API
    // For now, we'll simulate the payment
    const transactionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Update payment status to completed (in production, wait for M-Pesa callback)
    const { error: updateError } = await supabase
      .from("campus_memory_payments")
      .update({ status: "completed", mpesa_reference: transactionId })
      .eq("id", payment.id)

    if (updateError) throw updateError

    // If installment payment, update installment status
    if (installment_id) {
      await supabase
        .from("campus_memory_installments")
        .update({ status: "paid" })
        .eq("id", installment_id)
    }

    // Check if all payments completed
    const { data: payments } = await supabase
      .from("campus_memory_payments")
      .select("*")
      .eq("booking_id", booking_id)
      .eq("status", "completed")

    const totalPaid = payments?.reduce((sum, p) => sum + p.amount, 0) || 0

    if (totalPaid >= booking.total_price) {
      // Mark booking as confirmed
      await supabase
        .from("campus_memory_bookings")
        .update({ status: "confirmed", payment_status: "paid" })
        .eq("id", booking_id)
    }

    return NextResponse.json({
      payment,
      message: "Payment processed successfully",
      transactionId,
    })
  } catch (err) {
    console.error("Error processing payment:", err)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()

    // Get all payments for user
    const { data: payments, error } = await supabase
      .from("campus_memory_payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ payments })
  } catch (err) {
    console.error("Error fetching payments:", err)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}
