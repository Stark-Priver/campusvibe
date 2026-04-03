"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Handle route changes
    const handleStart = () => setIsLoading(true)
    const handleStop = () => setIsLoading(false)

    // Listen to route changes by monitoring when links are clicked
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")
      
      if (link && (
        link.getAttribute("href")?.startsWith("/") ||
        link.getAttribute("href")?.startsWith(".")
      )) {
        setIsLoading(true)
      }
    }

    document.addEventListener("click", handleClick)
    
    // Clear loading state after navigation completes
    const timer = setTimeout(() => setIsLoading(false), 100)

    return () => {
      document.removeEventListener("click", handleClick)
      clearTimeout(timer)
    }
  }, [router])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
        <p className="text-sm font-medium text-white">Loading...</p>
      </div>
    </div>
  )
}
