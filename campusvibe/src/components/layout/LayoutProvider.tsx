"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

interface LayoutProviderProps {
  children: React.ReactNode
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname()
  
  // Don't show navbar/footer on dashboard and login routes
  const isDashboardRoute = pathname?.startsWith("/dashboard")
  const isLoginRoute = pathname?.startsWith("/login")
  const shouldHideLayout = isDashboardRoute || isLoginRoute

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  )
}
