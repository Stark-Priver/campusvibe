"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import {
  ArrowRight, Download, TrendingUp, Zap, Star, MapPin,
  ShoppingBag, Utensils, Newspaper, Trophy, Wifi
} from "lucide-react"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}
const fadeIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
}

// Floating feature cards around the hero visual
const floatingCards = [
  {
    icon: Zap,
    label: "Instant Rides",
    value: "2 min",
    color: "from-violet-500 to-brand",
    delay: "0.6s",
    cls: "top-6 -left-6 lg:-left-16",
    anim: "animate-hero-float-1",
  },
  {
    icon: Utensils,
    label: "Food Delivery",
    value: "14 min",
    color: "from-orange-400 to-amber-400",
    delay: "0.8s",
    cls: "top-24 -right-4 lg:-right-14",
    anim: "animate-hero-float-2",
  },
  {
    icon: ShoppingBag,
    label: "Marketplace",
    value: "10K+ items",
    color: "from-sky-400 to-interactive",
    delay: "1.0s",
    cls: "bottom-28 -left-4 lg:-left-14",
    anim: "animate-hero-float-3",
  },
  {
    icon: Trophy,
    label: "Awards 2026",
    value: "Apr 15",
    color: "from-yellow-400 to-accent",
    delay: "1.2s",
    cls: "bottom-8 -right-4 lg:-right-12",
    anim: "animate-hero-float-1",
  },
]

const stats = [
  { value: "12,400+", label: "Students" },
  { value: "8", label: "Universities" },
  { value: "500+", label: "Events / yr" },
  { value: "3,200+", label: "Daily Rides" },
]

const features = [
  { icon: Zap, label: "Campus Rides" },
  { icon: Utensils, label: "Food Delivery" },
  { icon: ShoppingBag, label: "Marketplace" },
  { icon: Newspaper, label: "Campus News" },
  { icon: Trophy, label: "Events & Awards" },
  { icon: Wifi, label: "Student Network" },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-[#0D0D14] overflow-hidden flex flex-col justify-center"
    >
      {/* ── Background layers ── */}
      {/* Deep grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,99,255,0.08) 1px,transparent 1px),linear-gradient(to right,rgba(108,99,255,0.08) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow orbs */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute animate-glow-pulse"
          style={{
            top: "15%", left: "10%",
            width: 600, height: 600,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(108,99,255,0.22) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute animate-glow-pulse"
          style={{
            top: "40%", right: "5%",
            width: 500, height: 500,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,200,69,0.12) 0%, transparent 65%)",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "10%", left: "35%",
            width: 400, height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(61,155,233,0.14) 0%, transparent 65%)",
          }}
        />
      </motion.div>

      {/* ── Floating orbit decorations ── */}
      <div className="absolute inset-0 pointer-events-none hidden xl:block overflow-hidden">
        <div className="absolute" style={{ top: "50%", right: "14%", transform: "translate(0, -50%)" }}>
          {/* Orbit ring 1 */}
          <div
            className="absolute rounded-full border border-brand/10"
            style={{ width: 320, height: 320, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
          />
          {/* Orbit ring 2 */}
          <div
            className="absolute rounded-full border border-brand/6"
            style={{ width: 480, height: 480, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
          />
          {/* Orbiting dots */}
          <div
            className="absolute animate-orbit"
            style={{ top: "50%", left: "50%", marginTop: -6, marginLeft: -6 }}
          >
            <div className="w-3 h-3 rounded-full bg-brand/60" />
          </div>
          <div
            className="absolute animate-orbit-reverse"
            style={{ top: "50%", left: "50%", marginTop: -4, marginLeft: -4, animationDelay: "-8s" }}
          >
            <div className="w-2 h-2 rounded-full bg-accent/60" />
          </div>
        </div>
      </div>

      {/* ── Navbar spacer ── */}
      <div className="h-16 shrink-0" />

      {/* ── Main content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 xl:py-24 flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-20">

        {/* LEFT — Text content */}
        <motion.div
          className="flex-1 max-w-2xl"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/15 border border-brand/30 text-brand text-xs font-section font-semibold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Tanzania&apos;s #1 University Super-App
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="mt-6 font-heading font-black text-white leading-[1.03] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5.2rem)" }}
          >
            Your Campus,
            <br />
            <span className="text-shimmer">Fully Connected.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl font-body"
          >
            Transport, food delivery, marketplace, events, and campus news —
            one powerful platform built exclusively for Tanzanian students.
          </motion.p>

          {/* Feature pills */}
          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-2">
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-body"
              >
                <Icon size={11} className="text-brand" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand/30"
            >
              <Download size={15} strokeWidth={2.5} />
              Download the App
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-gray-300 text-sm font-semibold hover:border-brand/50 hover:text-white transition-all duration-200"
            >
              Explore Platform
            </Link>
          </motion.div>

          {/* Location badge */}
          <motion.div variants={fadeUp} className="mt-6 flex items-center gap-2 text-gray-500 text-xs font-body">
            <MapPin size={12} className="text-brand" />
            <span>Based in Mbeya, Tanzania · Serving universities nationwide</span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            className="mt-10 pt-8 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="animate-counter-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                <div className="font-heading font-black text-2xl sm:text-3xl text-white leading-none">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-xs mt-1.5 font-body">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Visual mockup */}
        <motion.div
          className="flex-1 relative mt-14 lg:mt-0 flex items-center justify-center"
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          <div className="relative w-full max-w-[400px] mx-auto">

            {/* Phone frame mockup */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 mx-auto"
              style={{ width: 280 }}
            >
              {/* Phone shell */}
              <div className="relative rounded-[2.5rem] border-2 border-white/15 bg-[#161620] shadow-2xl shadow-brand/10 overflow-hidden"
                style={{ paddingTop: "210%", width: "100%" }}>
                <div className="absolute inset-0 flex flex-col">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 pt-3 pb-1">
                    <span className="text-white/60 text-[10px] font-body">9:41</span>
                    <div className="flex gap-1">
                      <Wifi size={10} className="text-white/60" />
                      <Star size={10} className="text-white/60" />
                    </div>
                  </div>
                  {/* Notch */}
                  <div className="mx-auto w-24 h-5 rounded-full bg-black mb-3" />

                  {/* App UI */}
                  <div className="flex-1 px-4 pb-4 flex flex-col gap-2.5 overflow-hidden">
                    {/* App header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-[9px] font-body">Good morning,</p>
                        <p className="text-white font-section font-bold text-sm">Brian 👋</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30" />
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-4 gap-1.5 mt-1">
                      {[
                        { icon: Zap, label: "Ride", color: "bg-brand/20 text-brand" },
                        { icon: Utensils, label: "Food", color: "bg-orange-500/20 text-orange-400" },
                        { icon: ShoppingBag, label: "Shop", color: "bg-sky-500/20 text-sky-400" },
                        { icon: Newspaper, label: "News", color: "bg-accent/20 text-accent" },
                      ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                          <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                            <Icon size={14} />
                          </div>
                          <span className="text-white/50 text-[8px] font-body">{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Feature card */}
                    <div className="rounded-xl bg-brand/15 border border-brand/25 p-2.5">
                      <p className="text-white/50 text-[8px] font-body mb-1">CampusVibe Awards 2026</p>
                      <p className="text-white font-section font-bold text-xs leading-tight">
                        Vote for your campus hero
                      </p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <div className="flex-1 h-1 rounded-full bg-white/10">
                          <div className="h-full w-2/3 rounded-full bg-brand" />
                        </div>
                        <span className="text-brand text-[8px] font-section font-bold">Vote →</span>
                      </div>
                    </div>

                    {/* News items */}
                    {[
                      "UDSM students win innovation award",
                      "New transport routes for MUHAS",
                    ].map((headline, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-white/4 border border-white/6 p-2">
                        <div className="w-8 h-8 rounded-lg bg-white/8 shrink-0" />
                        <p className="text-white/70 text-[8px] font-body leading-tight line-clamp-2">{headline}</p>
                      </div>
                    ))}

                    {/* Bottom nav hint */}
                    <div className="mt-auto flex justify-around pt-2 border-t border-white/8">
                      {[Zap, Newspaper, ShoppingBag, Trophy].map((Icon, i) => (
                        <Icon key={i} size={14} className={i === 0 ? "text-brand" : "text-white/30"} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Screen glow */}
              <div
                className="absolute -inset-4 rounded-[3rem] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(108,99,255,0.18) 0%, transparent 70%)" }}
              />
            </motion.div>

            {/* Floating feature cards */}
            {floatingCards.map(({ icon: Icon, label, value, color, cls, anim }) => (
              <div
                key={label}
                className={`absolute ${cls} ${anim} z-20`}
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1a1a2e]/90 border border-white/10 backdrop-blur-sm shadow-xl">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[8px] font-body leading-none mb-0.5">{label}</p>
                    <p className="text-white font-section font-bold text-xs leading-none">{value}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 animate-badge-in"
            >
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-success/15 border border-success/30 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-success text-xs font-section font-semibold">Live on campus</span>
              </div>
            </motion.div>

            {/* Rating badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1a2e]/90 border border-white/10 backdrop-blur-sm">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="text-accent fill-accent" />
                  ))}
                </div>
                <span className="text-white/70 text-xs font-body">4.9 · 12K+ reviews</span>
              </div>
            </motion.div>

            {/* Trending badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="absolute top-1/2 -right-2 lg:-right-8 z-20 animate-hero-float-2"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1a1a2e]/90 border border-white/10 backdrop-blur-sm">
                <TrendingUp size={11} className="text-brand" />
                <span className="text-white/70 text-[10px] font-section font-semibold">#1 in Tanzania</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0D0D14 80%, #ECECEC)" }}
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-white/30 text-[10px] font-body uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  )
}
