import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

export const metadata: Metadata = {
  title: "Campus Events",
  description: "Upcoming events across Tanzanian universities — awards, conferences, sports, culture, and academic events.",
  alternates: { canonical: "/events" },
}

export const revalidate = 60

const categoryDot: Record<string, string> = {
  Awards: "bg-accent",
  Conference: "bg-brand",
  Academic: "bg-interactive",
  Culture: "bg-success",
}

const categoryBg: Record<string, string> = {
  Awards: "bg-accent/10 text-dark border-accent/20",
  Conference: "bg-brand/10 text-brand border-brand/20",
  Academic: "bg-interactive/10 text-interactive border-interactive/20",
  Culture: "bg-success/10 text-green-700 border-green-200",
}

export default async function EventsPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("date", today)
    .order("is_featured", { ascending: false })
    .order("date", { ascending: true })

  const featured = events?.find((e) => e.is_featured)
  const rest = events?.filter((e) => !e.is_featured) ?? []

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric" })

  return (
    <>
      {/* Hero */}
      <div className="pt-16 bg-[#ECECEC] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-7 sm:pt-10 sm:pb-9">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-section font-semibold text-gray-400 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Campus Events
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark leading-tight">
              What&apos;s happening{" "}
              <span className="text-brand block">on campus.</span>
            </h1>
            <p className="mt-2.5 text-gray-600 text-sm sm:text-base font-body max-w-xl leading-relaxed">
              Discover events, conferences, award ceremonies, and cultural showcases happening across Tanzania.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Featured event */}
      {featured && (
        <div className="bg-[#ECECEC] py-8 sm:py-10 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted mb-4 block">Featured Event</span>
              <Link href={`/events/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-5 card-pro card-hover">
                <div className="lg:col-span-2 min-h-[165px] sm:min-h-[185px] relative flex items-center justify-center bg-gradient-to-br from-brand/20 to-interactive/10">
                  {featured.image_url && (
                    <Image src={featured.image_url} alt={featured.title} fill className="object-cover" sizes="40vw" />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 text-center p-6">
                    <div className="text-4xl sm:text-5xl font-heading font-black text-white/90 leading-none">
                      {new Date(featured.date).toLocaleDateString("en-TZ", { month: "short" }).toUpperCase()}<br />
                      {new Date(featured.date).getDate()}
                    </div>
                  </div>
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-dark text-[10px] font-section font-bold uppercase tracking-wide">Featured</span>
                </div>
                <div className="lg:col-span-3 p-5 sm:p-6 flex flex-col justify-center">
                  <span className={`inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[11px] font-section font-semibold border mb-3 ${categoryBg[featured.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${categoryDot[featured.category] ?? "bg-gray-400"}`} />
                    {featured.category}
                  </span>
                  <h2 className="font-section font-bold text-xl sm:text-2xl text-dark group-hover:text-brand transition-colors leading-snug">{featured.title}</h2>
                  <p className="text-muted text-sm mt-2.5 font-body leading-relaxed max-w-xl line-clamp-3">{featured.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm text-muted font-body">
                    <div className="flex items-center gap-2"><Calendar size={13} className="text-brand" />{fmt(featured.date)}</div>
                    {featured.time && <div className="flex items-center gap-2"><Clock size={13} className="text-brand" />{featured.time}</div>}
                    {featured.location && <div className="flex items-center gap-2 col-span-2"><MapPin size={13} className="text-brand shrink-0" />{featured.location}</div>}
                    <div className="flex items-center gap-2"><Users size={13} className="text-brand" />{featured.attendees_count.toLocaleString()} expected</div>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold">
                      RSVP / Register <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      )}

      {/* All other events */}
      <div className="bg-surface py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {rest.length > 0 ? (
            <>
              <AnimatedSection className="mb-6">
                <h2 className="font-section font-bold text-xl text-dark">
                  {featured ? "More Upcoming Events" : "All Upcoming Events"}
                </h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {rest.map((event, i) => (
                  <AnimatedSection key={event.id} delay={0.07 * i}>
                    <Link href={`/events/${event.slug}`} className="group flex flex-col card-pro card-hover h-full">
                      <div className="relative aspect-video bg-gradient-to-br from-brand/10 to-interactive/10">
                        {event.image_url && <Image src={event.image_url} alt={event.title} fill className="object-cover" sizes="33vw" />}
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                      <div className={`h-1.5 ${categoryDot[event.category] ?? "bg-gray-200"}`} />
                      <div className="flex flex-col flex-1 p-4">
                        <p className="text-[10px] uppercase tracking-wide font-section font-semibold text-muted flex items-center gap-1.5 mb-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${categoryDot[event.category] ?? "bg-gray-400"}`} />
                          {event.category}
                        </p>
                        <h3 className="font-section font-semibold text-dark group-hover:text-brand transition-colors text-base leading-snug">{event.title}</h3>
                        <p className="text-muted text-xs mt-1.5 font-body line-clamp-2">{event.description}</p>
                        <div className="mt-3 space-y-1.5 text-xs text-muted font-body">
                          <div className="flex items-center gap-2"><Calendar size={11} className="text-brand" />{fmt(event.date)}{event.time && ` · ${event.time}`}</div>
                          {event.location && <div className="flex items-center gap-2"><MapPin size={11} className="text-brand" /><span className="line-clamp-1">{event.location}</span></div>}
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-gray-50">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">View Details <ArrowRight size={11} /></span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </>
          ) : !featured ? (
            <div className="text-center py-20">
              <p className="text-muted font-body">No upcoming events right now. Check back soon!</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
