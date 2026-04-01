import { redirect } from "next/navigation"

type Props = { params: Promise<{ role: string }> }

export default async function AdminRootPage({ params }: Props) {
  const { role } = await params
  redirect(`/dashboard/${role}/admin/overview`)
}
