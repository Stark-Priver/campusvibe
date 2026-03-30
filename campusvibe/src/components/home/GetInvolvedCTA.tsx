import Link from "next/link"
import { ArrowRight, Edit3, Briefcase, MapPin } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

const cards = [
  {
    icon: Edit3,
    title: "Content Creator",
    description: "Write news, create videos or podcasts. Build your portfolio with a published byline.",
    color: "bg-brand/8 border-brand/15",
    iconBg: "bg-brand/10 text-brand",
  },
  {
    icon: Briefcase,
    title: "Sponsor & Advertise",
    description: "Reach Tanzania's most active university students through targeted campaigns.",
    color: "bg-accent/8 border-accent/20",
    iconBg: "bg-accent/15 text-dark",
  },
  {
    icon: MapPin,
    title: "Campus Ambassador",
    description: "Represent CampusVibe on your campus. Earn rewards and build leadership skills.",
    color: "bg-interactive/8 border-interactive/15",
    iconBg: "bg-interactive/10 text-interactive",
  },
]

export default function GetInvolvedCTA() {
  return (
    <section className="bg-[#ECECEC] section-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
            Join the Movement
          </span>
          <h2 className="mt-2 font-heading font-black text-3xl sm:text-4xl text-dark">
            Get Involved
          </h2>
          <p className="mt-3 text-muted font-body text-base max-w-xl mx-auto leading-relaxed">
            Whether you create, partner, or represent — there&apos;s a place for you at CampusVibe.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <AnimatedSection key={card.title} delay={0.08 * i}>
              <div className={`card-pro p-6 h-full ${card.color}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${card.iconBg}`}>
                  <card.icon size={20} strokeWidth={2} />
                </div>
                <h3 className="font-section font-bold text-dark text-lg mb-2">{card.title}</h3>
                <p className="text-muted text-sm leading-relaxed font-body mb-5">{card.description}</p>
                <Link
                  href="/get-involved"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <AnimatedSection delay={0.3} className="mt-10">
          <div className="rounded-2xl bg-brand p-7 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(to right,rgba(255,255,255,0.07) 1px,transparent 1px)",
              backgroundSize: "40px 40px"
            }} />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{
              background: "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 65%)"
            }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-white/70 mb-2">
                  Tanzania&apos;s #1 University Platform
                </p>
                <h3 className="font-heading font-black text-white text-2xl sm:text-3xl leading-tight">
                  Ready to join<br />CampusVibe?
                </h3>
                <p className="mt-2 text-white/75 font-body text-sm max-w-md">
                  12,400+ students already connected. Download the app or sign up today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand text-sm font-semibold hover:bg-gray-50 transition-colors shadow-lg whitespace-nowrap"
                >
                  Download App <ArrowRight size={14} />
                </a>
                <Link
                  href="/get-involved"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Get Involved
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
