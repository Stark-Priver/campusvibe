"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
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
      className={`fixed inset-x-0 top-0 z-50 bg-[#ECECEC]/95 backdrop-blur border-b border-gray-100 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_24px_-18px_rgba(17,24,39,0.22)]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Campus Vibe Home">
          <Image
            src="/media/logo.jpeg"
            alt="Campus Vibe"
            width={172}
            height={40}
            priority
            className="h-8 sm:h-9 w-auto rounded-sm"
          />
          <span className="font-section font-bold text-sm sm:text-base tracking-tight text-dark whitespace-nowrap leading-none">
            Campus <span className="text-brand">Vibe</span>
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
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#5a52e0] transition-colors duration-150"
          >
            Login
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
        <div className="lg:hidden border-t border-gray-100 bg-[#ECECEC]" role="dialog" aria-label="Mobile navigation">
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
                href="/login"
                onClick={() => setMenuState({ open: false, pathname })}
                className="flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#5a52e0] transition-colors"
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
