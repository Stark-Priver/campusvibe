"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Download, ArrowRight, TrendingUp } from "lucide-react"
import { stats } from "@/lib/data"

const words = ["Connected."]

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
}
// cubic-bezier as a proper tuple to satisfy framer-motion TS types
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE },
  },
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % words.length)
        setWordVisible(true)
      }, 380)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-screen bg-[#ECECEC] overflow-hidden flex flex-col justify-center">

      {/* Dot-grid background */}
      <div className="absolute inset-0 hero-grid pointer-events-none select-none" />

      {/* Subtle brand ambient glow */}
      <div
        className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(108,99,255,0.11) 0%, transparent 68%)" }}
      />

      {/* Floating decorative badge — top right */}
      <div className="absolute top-28 right-8 lg:right-20 animate-float hidden lg:flex">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
          <TrendingUp size={13} className="text-accent" />
          <span className="text-gray-600 text-xs font-body font-medium">#1 Campus App in Tanzania</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <motion.div className="max-w-4xl" variants={stagger} initial="hidden" animate="show">

          {/* Live badge */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand/20 bg-brand/5 text-brand text-[11px] font-section font-semibold uppercase tracking-[0.16em]">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Tanzania&apos;s University Super-App · Live Now
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp}>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[4.6rem] xl:text-[5.1rem] text-dark leading-[1.04] tracking-tight">
              Your Campus,
              <br />
              <span
                className="text-brand inline-block relative"
                style={{
                  transition: "opacity 0.38s ease, transform 0.38s ease",
                  opacity: wordVisible ? 1 : 0,
                  transform: wordVisible ? "translateY(0)" : "translateY(10px)",
                }}
              >
                {words[wordIdx]}
                <span className="absolute -bottom-1.5 left-0 h-[5px] w-[70%] rounded-full bg-brand/18" />
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-body"
          >
            Transport, food, marketplace, events, and campus news in one trusted platform
            built for Tanzanian students.
          </motion.p>

          {/* Brand line */}
          <motion.p
            variants={fadeUp}
            className="mt-3 text-xs sm:text-sm font-section font-semibold uppercase tracking-[0.22em] text-brand"
          >
            Celebrate. Connect. Thrive.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-[#5a52e0] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand/20"
            >
              <Download size={16} strokeWidth={2.5} />
              Download the App
            </a>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 hover:text-dark transition-all duration-200"
            >
              Explore Platform
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white/75 backdrop-blur-sm px-4 py-4 shadow-[0_8px_28px_-24px_rgba(26,26,26,0.5)]">
                <div className="font-heading font-bold text-2xl sm:text-3xl text-dark leading-none">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm mt-2 font-body">{stat.label}</div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>

      {/* Bottom edge fade into white */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(236,236,236,1))" }} />
    </section>
  )
}
