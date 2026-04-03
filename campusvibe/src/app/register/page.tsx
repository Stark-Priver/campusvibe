"use client"

import { useActionState } from "react"
import Link from "next/link"
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap } from "lucide-react"
import { useState } from "react"
import { register, type ActionResult } from "@/lib/auth/actions"

const initialState: ActionResult = {}

const universities = [
  "University of Dar es Salaam (UDSM)",
  "University of Dodoma (UDOM)",
  "Muhimbili University of Health and Allied Sciences (MUHAS)",
  "Ardhi University",
  "Sokoine University of Agriculture (SUA)",
  "Nelson Mandela African Institution of Science and Technology (NM-AIST)",
  "Institute of Finance Management (IFM)",
  "Mbeya University of Science and Technology (MUST)",
  "Other",
]

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState)
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
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          <div className="bg-white border border-gray-200 rounded-2xl p-7 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                <GraduationCap size={18} className="text-brand" />
              </div>
              <div>
                <h1 className="font-heading font-black text-xl text-dark">Create account</h1>
                <p className="text-muted text-xs font-body">Join 12,400+ students on CampusVibe</p>
              </div>
            </div>

            {state.error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-body">{state.error}</div>
            )}
            {state.success && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-body">{state.success}</div>
            )}

            <form action={formAction} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-section font-semibold text-dark mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input id="fullName" name="fullName" type="text" required autoComplete="name" placeholder="Amina Hassan"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-surface text-dark text-sm placeholder-muted focus:outline-none focus:border-brand transition-colors font-body" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-section font-semibold text-dark mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@university.ac.tz"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-surface text-dark text-sm placeholder-muted focus:outline-none focus:border-brand transition-colors font-body" />
                </div>
              </div>

              <div>
                <label htmlFor="university" className="block text-xs font-section font-semibold text-dark mb-1.5">University</label>
                <div className="relative">
                  <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <select id="university" name="university"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-surface text-dark text-sm focus:outline-none focus:border-brand transition-colors font-body appearance-none">
                    <option value="">Select university (optional)</option>
                    {universities.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-section font-semibold text-dark mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input id="password" name="password" type={showPassword ? "text" : "password"}
                    required autoComplete="new-password" minLength={8} placeholder="Minimum 8 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-surface text-dark text-sm placeholder-muted focus:outline-none focus:border-brand transition-colors font-body" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-muted font-body mt-1">At least 8 characters</p>
              </div>

              <p className="text-xs text-muted font-body">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="text-brand hover:underline">Terms of Service</Link>{" "}and{" "}
                <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>.
              </p>

              <button type="submit" disabled={isPending}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-brand/20">
                {isPending ? <><span className="spinner-dark" />Creating account...</> : <>Create Account <ArrowRight size={14} /></>}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-muted font-body">Already have an account?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <Link href="/login"
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-dark text-sm font-semibold hover:border-brand hover:text-brand transition-colors">
              Sign In Instead
            </Link>
          </div>

          <p className="mt-5 text-center">
            <Link href="/" className="text-muted text-sm font-body hover:text-dark transition-colors">← Back to campusvibe.co.tz</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
