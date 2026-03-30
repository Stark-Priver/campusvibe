"use client"

import { useState, useActionState } from "react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { Edit3, Briefcase, MapPin, CheckCircle, Send, ArrowRight } from "lucide-react"

const roles = [
  {
    id: "contributor",
    icon: Edit3,
    title: "Content Contributor",
    description: "Write campus news, event coverage, opinion pieces, or create videos and podcasts for CampusVibe Media. Build your portfolio while earning recognition.",
    perks: ["Published byline", "Media press accreditation", "Revenue share eligibility", "CampusVibe Contributor badge"],
    accent: "bg-brand/8 border-brand/15",
    iconBg: "bg-brand/10",
    iconColor: "text-brand",
    cta: "Apply to Contribute",
  },
  {
    id: "sponsor",
    icon: Briefcase,
    title: "Sponsor or Advertise",
    description: "Reach Tanzania's most active and connected university students through native content, event partnerships, digital placements, and targeted campaigns.",
    perks: ["Campus-targeted reach", "Event brand integration", "Content sponsorships", "Performance reporting"],
    accent: "bg-accent/8 border-accent/20",
    iconBg: "bg-accent/15",
    iconColor: "text-dark",
    cta: "Start a Conversation",
  },
  {
    id: "ambassador",
    icon: MapPin,
    title: "Campus Ambassador",
    description: "Be the face of CampusVibe on your campus. Drive adoption, create buzz, run events, and earn rewards while building real community management experience.",
    perks: ["Monthly stipend", "Exclusive ambassador swag", "Priority app features", "Leadership pathway"],
    accent: "bg-interactive/8 border-interactive/15",
    iconBg: "bg-interactive/10",
    iconColor: "text-interactive",
    cta: "Apply to Represent",
  },
]

type FormState = { success?: boolean; error?: string }

async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const body = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    organization: formData.get("organization"),
    interest: formData.get("interest"),
    message: formData.get("message"),
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error("Failed")
    return { success: true }
  } catch {
    return { error: "Failed to send. Please try again or email us at info@campusvibe.co.tz" }
  }
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, {})

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <CheckCircle size={28} className="text-success" />
        </div>
        <h3 className="font-section font-bold text-xl text-dark">Message Received!</h3>
        <p className="text-muted text-sm font-body mt-2 max-w-xs">
          Thank you for reaching out. The CampusVibe team will get back to you within 2 business days.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-3.5">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-body">
          {state.error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-section font-semibold text-dark mb-1.5">Full Name <span className="text-red-400">*</span></label>
          <input required name="full_name" type="text" placeholder="Amina Hassan"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-body text-dark placeholder-muted focus:outline-none focus:border-brand transition-colors bg-white" />
        </div>
        <div>
          <label className="block text-xs font-section font-semibold text-dark mb-1.5">Email <span className="text-red-400">*</span></label>
          <input required name="email" type="email" placeholder="you@university.ac.tz"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-body text-dark placeholder-muted focus:outline-none focus:border-brand transition-colors bg-white" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-section font-semibold text-dark mb-1.5">University / Organisation</label>
        <input name="organization" type="text" placeholder="University of Dar es Salaam"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-body text-dark placeholder-muted focus:outline-none focus:border-brand transition-colors bg-white" />
      </div>
      <div>
        <label className="block text-xs font-section font-semibold text-dark mb-1.5">I am interested in <span className="text-red-400">*</span></label>
        <select required name="interest" defaultValue=""
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-body text-dark focus:outline-none focus:border-brand transition-colors bg-white appearance-none">
          <option value="" disabled>Select a role...</option>
          <option>Content Contributor</option>
          <option>Sponsorship / Advertising</option>
          <option>Campus Ambassador</option>
          <option>University Partnership</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-section font-semibold text-dark mb-1.5">Message <span className="text-red-400">*</span></label>
        <textarea required name="message" rows={4} placeholder="Tell us a little about yourself and how you would like to get involved..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-body text-dark placeholder-muted focus:outline-none focus:border-brand transition-colors bg-white resize-none" />
      </div>
      <button type="submit" disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark disabled:opacity-60 transition-colors">
        {isPending ? <><span className="spinner" />Sending...</> : <><Send size={14} />Send Message</>}
      </button>
    </form>
  )
}

export default function GetInvolvedPage() {
  return (
    <>
      <div className="pt-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-7 sm:pt-10 sm:pb-9">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">Join CampusVibe</span>
            <h1 className="mt-2 font-heading font-black text-4xl sm:text-5xl text-dark">Get Involved</h1>
            <p className="mt-2.5 text-muted text-base font-body max-w-xl leading-relaxed">
              Whether you create content, build partnerships, sponsor campaigns, or represent CampusVibe on your campus — your contribution matters.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <section className="bg-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-6 sm:mb-7">
            <h2 className="font-section font-bold text-2xl text-dark">Choose Your Role</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {roles.map((role, i) => (
              <AnimatedSection key={role.id} delay={0.08 * i}>
                <div className={`flex flex-col h-full card-pro p-5 ${role.accent}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${role.iconBg}`}>
                    <role.icon size={20} className={role.iconColor} strokeWidth={2} />
                  </div>
                  <h3 className="font-section font-bold text-dark text-lg mb-2">{role.title}</h3>
                  <p className="text-muted text-sm leading-relaxed font-body mb-4">{role.description}</p>
                  <ul className="space-y-1.5 mb-5">
                    {role.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2 text-sm text-dark font-body">
                        <CheckCircle size={13} className="text-success shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
                    {role.cta} <ArrowRight size={14} />
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-surface py-8 sm:py-10 scroll-mt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-6 sm:mb-7">
            <h2 className="font-section font-bold text-2xl text-dark">Send Us a Message</h2>
            <p className="text-muted text-sm font-body mt-2">Fill in the form and we&apos;ll follow up within 48 hours.</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="card-pro p-6 sm:p-7">
              <ContactForm />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-6 text-center">
            <p className="text-xs text-muted font-body">
              Or email us directly at{" "}
              <a href="mailto:info@campusvibe.co.tz" className="text-brand hover:underline">info@campusvibe.co.tz</a>
              {", "}
              <a href="mailto:ads@campusvibe.co.tz" className="text-brand hover:underline">ads@campusvibe.co.tz</a>
              {", or "}
              <a href="mailto:editor@campusvibe.co.tz" className="text-brand hover:underline">editor@campusvibe.co.tz</a>
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
