"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Zap } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/media", label: "Media" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/get-involved", label: "Get Involved" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuState, setMenuState] = useState({
    open: false,
    pathname: "",
  })
  const pathname = usePathname()
  const menuOpen = menuState.open && menuState.pathname === pathname

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_#E5E7EB]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-heading font-bold text-[1.1rem] tracking-tight text-dark">
            Campus<span className="text-brand">Vibe</span>
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                pathname === link.href
                  ? "text-brand bg-brand/5"
                  : "text-gray-500 hover:text-dark hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3">
          <Link
            href="/get-involved"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#5a52e0] transition-colors duration-150"
          >
            Join Now
          </Link>
          <button
            onClick={() =>
              setMenuState((prev) => ({
                open: !(prev.open && prev.pathname === pathname),
                pathname,
              }))
            }
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-dark hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white" role="dialog" aria-label="Mobile navigation">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuState({ open: false, pathname })}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-brand bg-brand/5"
                    : "text-gray-700 hover:text-brand hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link
                href="/get-involved"
                onClick={() => setMenuState({ open: false, pathname })}
                className="flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#5a52e0] transition-colors"
              >
                Join Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
