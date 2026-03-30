import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#ECECEC] flex flex-col items-center justify-center px-4 pt-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-6">
          <Compass size={32} className="text-brand" />
        </div>
        <h1 className="font-heading font-black text-5xl text-dark mb-2">404</h1>
        <p className="font-section font-bold text-xl text-dark mb-3">Page not found</p>
        <p className="text-muted font-body text-sm leading-relaxed mb-8">
          Looks like this page went off campus. It might have moved or never existed.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors">
            <ArrowLeft size={14} /> Go Home
          </Link>
          <Link href="/news" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-dark text-sm font-semibold hover:border-brand hover:text-brand transition-colors">
            Browse News
          </Link>
        </div>
      </div>
    </div>
  )
}
