import { headers } from "next/headers"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default async function LayoutProvider({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  // x-pathname is set by middleware so server components can read the current path
  const pathname = headersList.get("x-pathname") ?? ""

  const isDashboard = pathname.startsWith("/dashboard")
  const isAuth =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth")

  if (isAuth) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </>
  )
}
