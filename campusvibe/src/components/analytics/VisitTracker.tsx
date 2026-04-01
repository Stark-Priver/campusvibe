"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

function getVisitorToken() {
  if (typeof window === "undefined") return ""

  const key = "campusvibe_visitor_token"
  const existing = window.localStorage.getItem(key)
  if (existing) return existing

  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
  window.localStorage.setItem(key, token)
  return token
}

export default function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const visitorToken = getVisitorToken()

    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        visitorToken,
      }),
      keepalive: true,
    })
  }, [pathname])

  return null
}
