import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  organization: z.string().optional(),
  interest: z.string().min(1),
  message: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from("contact_submissions")
      .insert({
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        organization: parsed.data.organization ?? null,
        interest: parsed.data.interest,
        message: parsed.data.message,
      })

    if (error) {
      console.error("Contact submission error:", error)
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Contact route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
