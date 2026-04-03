"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { login, type ActionResult } from "@/lib/auth/actions"

const initialState: ActionResult = {}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#ECECEC] flex flex-col">
      {/* Top nav */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-heading font-black text-xl text-dark">
            Campus <span className="text-brand">Vibe</span>
          </span>
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-7 sm:p-8 shadow-sm">
            {/* Brand mark */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                <Lock size={18} className="text-brand" />
              </div>
              <div>
                <h1 className="font-heading font-black text-xl text-dark">Welcome back</h1>
                <p className="text-muted text-xs font-body">Sign in to your CampusVibe account</p>
              </div>
            </div>

            {/* Error */}
            {state.error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-body">
                {state.error}
              </div>
            )}
            {state.success && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-body">
                {state.success}
              </div>
            )}

            <form action={formAction} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-section font-semibold text-dark mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="email" name="email" type="email" required autoComplete="email"
                    placeholder="you@university.ac.tz"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-surface text-dark text-sm placeholder-muted focus:outline-none focus:border-brand transition-colors font-body"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-section font-semibold text-dark">Password</label>
                  <Link href="#" className="text-xs text-brand hover:text-brand-dark transition-colors font-body">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="password" name="password" type={showPassword ? "text" : "password"}
                    required autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-surface text-dark text-sm placeholder-muted focus:outline-none focus:border-brand transition-colors font-body"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isPending}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-brand/20">
                {isPending ? <><span className="spinner" />Signing in...</> : <>Sign In <ArrowRight size={14} /></>}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-muted font-body">New to CampusVibe?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <Link href="/register"
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-dark text-sm font-semibold hover:border-brand hover:text-brand transition-colors">
              Create an Account
            </Link>
          </div>

          <p className="mt-5 text-center">
            <Link href="/" className="text-muted text-sm font-body hover:text-dark transition-colors">
              ← Back to campusvibe.co.tz
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
