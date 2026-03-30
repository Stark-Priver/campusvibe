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
    <div className="min-h-screen bg-[#0D0D14] flex flex-col">
      <div className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-heading font-black text-xl text-white">Campus <span className="text-brand">Vibe</span></span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-[#161620] border border-white/10 rounded-2xl p-7 sm:p-8 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center mb-5">
              <GraduationCap size={22} className="text-brand" />
            </div>

            <h1 className="font-heading font-black text-2xl text-white">Create account</h1>
            <p className="text-gray-400 text-sm font-body mt-1">Join 12,400+ students on CampusVibe</p>

            {state.error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-body">
                {state.error}
              </div>
            )}
            {state.success && (
              <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 font-body">
                {state.success}
              </div>
            )}

            <form action={formAction} className="mt-6 space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-section font-semibold text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input id="fullName" name="fullName" type="text" required autoComplete="name"
                    placeholder="Amina Hassan"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand transition-colors font-body" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-section font-semibold text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input id="email" name="email" type="email" required autoComplete="email"
                    placeholder="you@university.ac.tz"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand transition-colors font-body" />
                </div>
              </div>

              <div>
                <label htmlFor="university" className="block text-xs font-section font-semibold text-gray-300 mb-1.5">University</label>
                <div className="relative">
                  <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select id="university" name="university"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-brand transition-colors font-body appearance-none [&>option]:bg-gray-900 [&>option]:text-white">
                    <option value="">Select university (optional)</option>
                    {universities.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-section font-semibold text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input id="password" name="password" type={showPassword ? "text" : "password"}
                    required autoComplete="new-password" minLength={8}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand transition-colors font-body" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-body mt-1">At least 8 characters</p>
              </div>

              <p className="text-xs text-gray-500 font-body">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="text-brand hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>.
              </p>

              <button type="submit" disabled={isPending}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {isPending ? (
                  <><span className="spinner" />Creating account...</>
                ) : (
                  <>Create Account <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-400 font-body">
              Already have an account?{" "}
              <Link href="/login" className="text-brand font-semibold hover:text-brand-dark transition-colors">Sign in</Link>
            </p>
          </div>
          <p className="mt-5 text-center">
            <Link href="/" className="text-gray-500 text-sm font-body hover:text-gray-300 transition-colors">← Back to campusvibe.co.tz</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
