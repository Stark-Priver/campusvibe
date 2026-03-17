import Link from "next/link"
import { Trophy, ArrowRight, ChevronRight } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { awardsNominees } from "@/lib/data"

export default function AwardsBlock() {
  return (
    <section className="section-space bg-[#ECECEC] overflow-hidden border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: brand statement */}
          <AnimatedSection direction="left">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={18} className="text-accent" />
              <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-gray-400">
                CampusVibe Awards 2026
              </span>
            </div>
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-dark leading-tight">
              Celebrate the best of
              <span className="text-accent block">campus Tanzania.</span>
            </h2>
            <p className="mt-5 text-gray-600 text-base leading-relaxed font-body max-w-sm">
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:text-dark transition-colors"
              >
                Nominate Someone <ChevronRight size={14} />
              </Link>
            </div>

            {/* Deadline notice */}
            <p className="mt-6 text-gray-400 text-xs font-body">
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
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 card-hover hover:bg-white transition-colors"
                  >
                    {/* Rank */}
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-bold shrink-0 ${
                        i === 0
                          ? "bg-accent text-dark"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </span>

                    {/* Avatar placeholder */}
                    <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                      <span className="text-brand text-sm font-heading font-bold">
                        {nominee.name.charAt(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-section font-semibold text-sm text-dark leading-tight">
                        {nominee.name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-body mt-0.5">
                        {nominee.category} · {nominee.university}
                      </div>
                    </div>

                    {/* Vote count */}
                    <div className="text-right shrink-0">
                      <div className="font-heading font-bold text-sm text-dark">
                        {nominee.votes.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 font-body">votes</div>
                    </div>
                  </div>
                ))}
            </div>

            <p className="mt-5 text-center text-xs text-gray-400 font-body">
              Live vote counts updated every 30 minutes
            </p>
          </AnimatedSection>

        </div>
      </div>
    </section>
  )
}
