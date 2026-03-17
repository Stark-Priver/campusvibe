import type { Metadata } from "next"
import Link from "next/link"
import { Globe2, Lightbulb, ShieldCheck, Sparkles, Megaphone, Clapperboard, Palette, Trophy, Newspaper, Smartphone, ArrowRight, Handshake } from "lucide-react"

export const metadata: Metadata = {
  title: "About Campus Vibe Media | CampusVibe",
  description:
    "Learn about Campus Vibe Media: our vision, mission, services, values, and strategic projects supporting university students across Tanzania and East Africa.",
  keywords: [
    "Campus Vibe Media",
    "About CampusVibe",
    "Tanzania university media",
    "student platform Tanzania",
    "campus marketing hub",
    "Campus Vibes Awards",
  ],
  openGraph: {
    title: "About Campus Vibe Media",
    description:
      "Campus Vibe Media connects students, institutions, and opportunities through digital media, technology, and creative services.",
    type: "website",
    locale: "en_TZ",
  },
  alternates: {
    canonical: "/about",
  },
}

const services = [
  {
    title: "Digital Content",
    description:
      "Video production, features, interviews, and campus storytelling that inform, entertain, and inspire student communities.",
    icon: Clapperboard,
  },
  {
    title: "Branding and Advertising",
    description:
      "Helping institutions and businesses reach students through in-app placements, digital campaigns, posters, and influencer collaboration.",
    icon: Megaphone,
  },
  {
    title: "Event Management",
    description:
      "Planning and coordinating flagship campus programs including sports, arts festivals, and student recognition events.",
    icon: Trophy,
  },
  {
    title: "Creative Design",
    description:
      "Professional design services for logos, branded apparel, and visual assets that strengthen identity and impact.",
    icon: Palette,
  },
]

const values = [
  {
    title: "Innovation",
    description: "We do not operate on routine. We continually create better ways to deliver meaningful communication.",
    icon: Lightbulb,
  },
  {
    title: "Unity",
    description: "We believe in the collective strength of students from every discipline and background.",
    icon: Globe2,
  },
  {
    title: "Integrity",
    description: "We deliver trustworthy information and run our operations with transparency and accountability.",
    icon: ShieldCheck,
  },
  {
    title: "Excellence",
    description: "From media and advertising to design and video, we hold every output to professional standards.",
    icon: Sparkles,
  },
]

const projects = [
  {
    title: "Campus Vibes News",
    description:
      "Positive, relevant campus reporting and feature interviews with institutions and students to grow visibility, inspire progress, and support social impact.",
    icon: Newspaper,
  },
  {
    title: "Campus Vibes Awards",
    description:
      "Recognizing and celebrating students who excel in academics, creativity, and leadership.",
    icon: Trophy,
  },
  {
    title: "Campus Vibe App",
    description:
      "Using modern technology to simplify student life and make campus opportunities easier to access.",
    icon: Smartphone,
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-space-tight">
          <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
            Campus Vibe Media Profile
          </span>
          <h1 className="mt-2 font-heading font-black text-4xl sm:text-5xl text-dark max-w-3xl">
            About Campus Vibe Media
          </h1>
          <p className="mt-4 text-base text-muted font-body leading-relaxed max-w-3xl">
            Campus Vibe Media is a leading digital platform dedicated to connecting institutions, university
            students, and opportunity ecosystems across Tanzania. We serve as the bridge between campus life
            and the future through media, technology, and creative execution.
          </p>
          <p className="mt-3 text-base text-muted font-body leading-relaxed max-w-3xl">
            Our work is built to educate, entertain, and empower the current generation of scholars and
            young professionals.
          </p>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-brand/20 bg-brand/5 p-7 sm:p-8">
            <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">Direction</p>
            <h2 className="font-section font-bold text-2xl text-dark">Vision</h2>
            <p className="mt-3 text-sm sm:text-base text-muted font-body leading-relaxed">
              To become the most trusted media and marketing hub across universities in Tanzania and East
              Africa, leading in simplifying campus life, unlocking talent, and growing digital brands.
            </p>
          </article>
          <article className="rounded-2xl border border-interactive/20 bg-interactive/5 p-7 sm:p-8">
            <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">Purpose</p>
            <h2 className="font-section font-bold text-2xl text-dark">Mission</h2>
            <p className="mt-3 text-sm sm:text-base text-muted font-body leading-relaxed">
              To provide a formal student platform for buying and selling, showcasing talent, and receiving
              accurate timely information, while helping institutions and companies reach youth audiences
              through creativity and modern technology.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-surface section-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">Services</p>
          <h2 className="font-section font-bold text-2xl sm:text-3xl text-dark">What We Do</h2>
          <p className="mt-2 text-muted font-body max-w-2xl">
            We offer practical services designed to create change within and beyond campus communities.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((service) => (
              <article key={service.title} className="card-pro p-6 card-hover">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <service.icon size={19} />
                </div>
                <h3 className="mt-4 font-section font-bold text-lg text-dark">{service.title}</h3>
                <p className="mt-2 text-sm text-muted font-body leading-relaxed">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">Culture</p>
          <h2 className="font-section font-bold text-2xl sm:text-3xl text-dark">Core Values</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => (
              <article key={value.title} className="card-pro bg-surface p-6">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-dark flex items-center justify-center">
                  <value.icon size={18} />
                </div>
                <h3 className="mt-4 font-section font-bold text-lg text-dark">{value.title}</h3>
                <p className="mt-2 text-sm text-muted font-body leading-relaxed">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface section-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">Impact</p>
          <h2 className="font-section font-bold text-2xl sm:text-3xl text-dark">Key Projects</h2>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <article key={project.title} className="card-pro p-6">
                <div className="w-10 h-10 rounded-xl bg-accent/25 text-dark flex items-center justify-center">
                  <project.icon size={19} />
                </div>
                <h3 className="mt-4 font-section font-bold text-lg text-dark">{project.title}</h3>
                <p className="mt-2 text-sm text-muted font-body leading-relaxed">{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-space border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-surface p-7 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <Handshake size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
                  Next Step
                </p>
                <h2 className="mt-1 font-section font-bold text-2xl sm:text-3xl text-dark">
                  Contact or Partner With Campus Vibe Media
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted font-body max-w-3xl leading-relaxed">
                  Whether you are a university, business, sponsor, or student community, we are ready to collaborate
                  on campaigns, media coverage, events, and youth-focused growth initiatives.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/get-involved"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-interactive transition-colors"
                  >
                    Partner With Us
                    <ArrowRight size={15} />
                  </Link>
                  <a
                    href="mailto:info@campusvibe.co.tz"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 bg-white text-dark text-sm font-semibold hover:border-interactive hover:text-interactive transition-colors"
                  >
                    Contact Team
                  </a>
                </div>
                <p className="mt-4 text-xs text-muted font-body">
                  Also reachable via ads@campusvibe.co.tz, editor@campusvibe.co.tz, and director@campusvibe.co.tz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}