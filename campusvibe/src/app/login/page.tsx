"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { login, type ActionResult } from "@/lib/auth/actions"

const initialState: ActionResult = {}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D0D14] flex flex-col">
      {/* Top nav */}
      <div className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-heading font-black text-xl text-white">Campus <span className="text-brand">Vibe</span></span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-[#161620] border border-white/10 rounded-2xl p-7 sm:p-8 shadow-2xl">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center mb-5">
              <ShieldCheck size={22} className="text-brand" />
            </div>

            <h1 className="font-heading font-black text-2xl text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm font-body mt-1">Sign in to your CampusVibe account</p>

            {/* Error */}
            {state.error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-body">
                {state.error}
              </div>
            )}

            {/* Success */}
            {state.success && (
              <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 font-body">
                {state.success}
              </div>
            )}

            <form action={formAction} className="mt-6 space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-section font-semibold text-gray-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@university.ac.tz"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand transition-colors font-body"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-section font-semibold text-gray-300">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-brand hover:text-brand-dark transition-colors font-body">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand transition-colors font-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? (
                  <><span className="spinner" />Signing in...</>
                ) : (
                  <>Sign In <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="mt-5 text-center text-sm text-gray-400 font-body">
              New to CampusVibe?{" "}
              <Link href="/register" className="text-brand font-semibold hover:text-brand-dark transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          {/* Back to site */}
          <p className="mt-5 text-center">
            <Link href="/" className="text-gray-500 text-sm font-body hover:text-gray-300 transition-colors">
              ← Back to campusvibe.co.tz
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
