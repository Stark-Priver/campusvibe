import { headers } from "next/headers"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default async function LayoutProvider({ children }: { children: React.ReactNode }) {
  let pathname = "/"

  try {
    const headersList = await headers()
    pathname = headersList.get("x-pathname") ?? "/"
  } catch {
    // headers() unavailable in some contexts — use safe default
  }

  const isDashboard = pathname.startsWith("/dashboard")
  const isAuth =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth")

  // Dashboard and auth pages handle their own layout (no navbar/footer)
  if (isDashboard || isAuth) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
