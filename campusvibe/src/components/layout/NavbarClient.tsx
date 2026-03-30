"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react"
import { logout } from "@/lib/auth/actions"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/media", label: "Media" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/get-involved", label: "Get Involved" },
]

type Props = {
  user: { email: string; name: string } | null
}

export default function NavbarClient({ user }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[#ECECEC]/95 backdrop-blur border-b border-gray-100 transition-shadow duration-300 ${scrolled ? "shadow-[0_8px_24px_-18px_rgba(17,24,39,0.22)]" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="CampusVibe Home">
          <span className="font-heading font-black text-lg sm:text-xl text-dark whitespace-nowrap leading-none">
            Campus <span className="text-brand">Vibe</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${pathname === link.href ? "text-brand bg-brand/5" : "text-gray-500 hover:text-dark hover:bg-gray-50"}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-section font-semibold text-dark hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand/15 border border-brand/25 flex items-center justify-center">
                  <User size={13} className="text-brand" />
                </div>
                <span className="max-w-[120px] truncate">{user.name || user.email}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-muted font-body truncate">{user.email}</p>
                    {user.name && <p className="text-sm font-section font-semibold text-dark truncate">{user.name}</p>}
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark hover:bg-gray-50 transition-colors font-body">
                    <LayoutDashboard size={14} className="text-brand" /> Dashboard
                  </Link>
                  <form action={logout}>
                    <button type="submit" className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-body">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors duration-150">
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-dark hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-[#ECECEC]" role="dialog">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? "text-brand bg-brand/5" : "text-gray-700 hover:text-brand hover:bg-gray-50"}`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1 space-y-1.5">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 w-full py-2.5 px-3 rounded-lg text-sm font-semibold text-dark hover:bg-gray-50 transition-colors">
                    <LayoutDashboard size={14} className="text-brand" /> Dashboard
                  </Link>
                  <form action={logout}>
                    <button type="submit" className="flex items-center gap-2 w-full py-2.5 px-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
