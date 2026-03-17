import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Lock, Mail, ShieldCheck } from "lucide-react"
import { getCurrentMockUser } from "@/lib/auth/session"
import { mockAuthUsers } from "@/lib/auth/users"
import { loginWithCredentials } from "./actions"

export const metadata: Metadata = {
  title: "Login | CampusVibe",
  description: "Secure role-based login for Campus Vibe operational dashboards.",
}

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentMockUser()
  if (currentUser) redirect("/dashboard")

  const resolvedSearchParams = searchParams ? await searchParams : undefined

  const errorMessage = resolvedSearchParams?.error === "missing"
    ? "Please enter both email and password."
    : resolvedSearchParams?.error === "invalid"
      ? "Invalid credentials. Use one of the demo accounts below."
      : null

  return (
    <>
      <section className="pt-16 bg-surface border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 pb-8 sm:pt-11 sm:pb-10">
          <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
            Campus Vibe Access
          </p>
          <h1 className="mt-2 font-heading font-black text-3xl sm:text-4xl text-dark leading-tight max-w-3xl">
            Sign In to Role Dashboards
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-muted font-body leading-relaxed max-w-3xl">
            Access administrator, student, mobility, and partner workspaces based on your assigned roles.
          </p>
        </div>
      </section>

      <section className="bg-[#ECECEC] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
          <article className="card-pro p-5 lg:col-span-2">
            <h2 className="font-section font-bold text-lg text-dark">Secure Login</h2>
            <p className="mt-1.5 text-sm text-muted font-body">
              Use your account credentials to continue.
            </p>

            {errorMessage ? (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 font-body">
                {errorMessage}
              </p>
            ) : null}

            <form action={loginWithCredentials} className="mt-4 space-y-3.5">
              <div>
                <label htmlFor="email" className="text-xs font-section font-semibold text-dark block mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@campusvibe.co.tz"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white placeholder-muted focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-xs font-section font-semibold text-dark block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter password"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white placeholder-muted focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-interactive transition-colors"
              >
                <ShieldCheck size={15} />
                Sign In
              </button>
            </form>

            <p className="mt-4 text-xs text-muted font-body">
              This is a mock environment. Role assignment is based on demo account data.
            </p>
          </article>

          <article className="card-pro p-5 lg:col-span-3">
            <h2 className="font-section font-bold text-lg text-dark">Demo Accounts</h2>
            <p className="mt-1.5 text-sm text-muted font-body">
              Use these credentials to test single-role and multi-role access behavior.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockAuthUsers.map((user) => (
                <div key={user.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="font-section font-semibold text-sm text-dark">{user.fullName}</p>
                  <p className="text-xs text-muted mt-0.5">{user.organization}</p>
                  <p className="text-xs text-dark mt-2">{user.email}</p>
                  <p className="text-xs text-dark mt-0.5">{user.password}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {user.roles.map((role) => (
                      <span
                        key={`${user.id}-${role}`}
                        className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand/10 text-brand font-section font-semibold"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-sm">
              <Link href="/" className="text-brand font-semibold hover:text-interactive transition-colors">
                Back to website
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}