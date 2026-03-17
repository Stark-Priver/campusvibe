import Link from "next/link"
import { ArrowRight, LogOut } from "lucide-react"
import { signOut } from "@/app/login/actions"

type SidebarLink = {
  label: string
  href: string
}

type DashboardSidebarProps = {
  title: string
  description: string
  links: SidebarLink[]
  showSignOut?: boolean
}

export default function DashboardSidebar({
  title,
  description,
  links,
  showSignOut = false,
}: DashboardSidebarProps) {
  return (
    <aside className="card-pro p-5 lg:sticky lg:top-24">
      <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
        Action Center
      </p>
      <h2 className="mt-1.5 font-section font-bold text-lg text-dark">{title}</h2>
      <p className="mt-1.5 text-sm text-muted font-body leading-relaxed">{description}</p>

      <div className="mt-4 space-y-2.5">
        {links.map((link) => (
          <Link
            key={`${link.label}-${link.href}`}
            href={link.href}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-dark hover:border-brand hover:text-brand transition-colors"
          >
            <span>{link.label}</span>
            <ArrowRight size={13} />
          </Link>
        ))}
      </div>

      {showSignOut ? (
        <form action={signOut} className="mt-4">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-dark hover:border-brand hover:text-brand transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </form>
      ) : null}
    </aside>
  )
}