import Link from "next/link"
import { Trophy, ArrowRight, ChevronRight } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { awardsNominees } from "@/lib/data"

export default function AwardsBlock() {
  return (
    <section className="py-20 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: brand statement */}
          <AnimatedSection direction="left">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={18} className="text-accent" />
              <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-white/40">
                CampusVibe Awards 2026
              </span>
            </div>
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-white leading-tight">
              Celebrate the best of
              <span className="text-accent block">campus Tanzania.</span>
            </h2>
            <p className="mt-5 text-white/50 text-base leading-relaxed font-body max-w-sm">
              Nominate and vote for the most outstanding students in innovation, leadership,
              sports, arts, and community impact across all Tanzanian universities.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/events/campusvibe-awards-2026"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-dark text-sm font-semibold hover:bg-[#f5bc30] transition-colors"
              >
                Vote Now <ArrowRight size={14} />
              </Link>
              <Link
                href="/events/campusvibe-awards-2026"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 text-white/70 text-sm font-semibold hover:bg-white/5 hover:text-white transition-colors"
              >
                Nominate Someone <ChevronRight size={14} />
              </Link>
            </div>

            {/* Deadline notice */}
            <p className="mt-6 text-white/30 text-xs font-body">
              Nominations close April 1, 2026 · Ceremony: April 15, 2026
            </p>
          </AnimatedSection>

          {/* Right: nominee leaderboard */}
          <AnimatedSection direction="right" delay={0.1}>
            <div className="space-y-3">
              {awardsNominees
                .sort((a, b) => b.votes - a.votes)
                .map((nominee, i) => (
                  <div
                    key={nominee.id}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"
                  >
                    {/* Rank */}
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-bold shrink-0 ${
                        i === 0
                          ? "bg-accent text-dark"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {i + 1}
                    </span>

                    {/* Avatar placeholder */}
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-white/50 text-sm font-heading font-bold">
                        {nominee.name.charAt(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-section font-semibold text-sm text-white leading-tight">
                        {nominee.name}
                      </div>
                      <div className="text-[11px] text-white/40 font-body mt-0.5">
                        {nominee.category} · {nominee.university}
                      </div>
                    </div>

                    {/* Vote count */}
                    <div className="text-right shrink-0">
                      <div className="font-heading font-bold text-sm text-white">
                        {nominee.votes.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-white/35 font-body">votes</div>
                    </div>
                  </div>
                ))}
            </div>

            <p className="mt-5 text-center text-xs text-white/30 font-body">
              Live vote counts updated every 30 minutes
            </p>
          </AnimatedSection>

        </div>
      </div>
    </section>
  )
}
