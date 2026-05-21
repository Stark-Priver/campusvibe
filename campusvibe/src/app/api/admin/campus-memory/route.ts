import { createAdminClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/custom"
import { NextRequest, NextResponse } from "next/server"

// Admin-only endpoint to view all bookings and payments
async function isAdmin(userId: string) {
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", userId)
    .single()

  return profile?.roles?.includes("administrator") || profile?.roles?.includes("admin")
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin = await isAdmin(user.id)
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const supabase = await createAdminClient()

    // Get all bookings with user info
    const { data: bookings, error: bookingsError } = await supabase
      .from("campus_memory_bookings")
      .select(`
        *,
        profiles!user_id (
          full_name,
          email,
          phone,
          university
        )
      `)
      .order("created_at", { ascending: false })

    if (bookingsError) throw bookingsError

    // Get all payments
    const { data: payments, error: paymentsError } = await supabase
      .from("campus_memory_payments")
      .select("*")
      .order("created_at", { ascending: false })

    if (paymentsError) throw paymentsError

    // Calculate statistics
    const stats = {
      totalBookings: bookings?.length || 0,
      totalRevenue: payments?.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0) || 0,
      confirmedBookings: bookings?.filter(b => b.status === "confirmed").length || 0,
      pendingPayments: payments?.filter(p => p.status === "pending").length || 0,
      completedPayments: payments?.filter(p => p.status === "completed").length || 0,
    }

    return NextResponse.json({
      bookings,
      payments,
      stats,
    })
  } catch (err) {
    console.error("Error fetching admin data:", err)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
