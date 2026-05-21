import { getCurrentUser } from "@/lib/auth/custom"
import { redirect } from "next/navigation"
import BookingForm from "@/components/campus-memory/BookingForm"

export default async function BookPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/campus-memory/book")
  }

  return <BookingForm />
}
