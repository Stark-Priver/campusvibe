import Link from "next/link"
import { Edit3, Briefcase, MapPin, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

const roles = [
  {
    icon: Edit3,
    title: "Become a Contributor",
    description:
      "Write campus news, publish event coverage, or create video and podcast content for CampusVibe Media. Build your portfolio while reaching 12,000+ students.",
    cta: "Apply to Write",
    href: "/get-involved#contributor",
    accent: "bg-brand/8 border-brand/15",
    iconBg: "bg-brand/10",
    iconColor: "text-brand",
  },
  {
    icon: Briefcase,
    title: "Sponsor or Advertise",
    description:
      "Reach Tanzania's most active university students through targeted sponsorships, native content, event partnerships, and digital placements.",
    cta: "Talk to Us",
    href: "/get-involved#sponsor",
    accent: "bg-accent/8 border-accent/20",
    iconBg: "bg-accent/15",
    iconColor: "text-dark",
  },
  {
    icon: MapPin,
    title: "Campus Ambassador",
    description:
      "Represent CampusVibe on your campus. Drive app adoption, run events, and earn rewards while building real-world community management experience.",
    cta: "Apply Now",
    href: "/get-involved#ambassador",
    accent: "bg-interactive/8 border-interactive/15",
    iconBg: "bg-interactive/10",
    iconColor: "text-interactive",
  },
]

export default function GetInvolvedCTA() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <AnimatedSection className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
            Get Involved
          </span>
          <h2 className="mt-2 font-section font-bold text-2xl sm:text-3xl text-dark">
            Be Part of Something Bigger
          </h2>
          <p className="mt-3 text-muted text-base font-body max-w-lg mx-auto">
            Whether you create, contribute, sponsor, or advocate — there is a role for you in the CampusVibe ecosystem.
          </p>
        </AnimatedSection>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <AnimatedSection key={role.title} delay={0.08 * i}>
              <div
                className={`group flex flex-col h-full bg-white border rounded-2xl p-6 card-hover ${role.accent}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${role.iconBg}`}>
                  <role.icon size={20} className={role.iconColor} strokeWidth={2} />
                </div>
                <h3 className="font-section font-bold text-dark text-lg mb-3">{role.title}</h3>
                <p className="text-muted text-sm leading-relaxed font-body flex-1">
                  {role.description}
                </p>
                <Link
                  href={role.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-[#5a52e0] transition-colors group-hover:gap-2"
                >
                  {role.cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  )
}
