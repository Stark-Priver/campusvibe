import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { events } from "@/lib/data"

const categoryDot: Record<string, string> = {
  Awards: "bg-accent",
  Conference: "bg-brand",
  Academic: "bg-interactive",
  Culture: "bg-success",
}

export default function FeaturedEvents() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <AnimatedSection className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-section font-semibold text-muted">
              Upcoming
            </span>
            <h2 className="mt-1.5 font-section font-bold text-2xl sm:text-3xl text-dark">
              Featured Events
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-[#5a52e0] transition-colors shrink-0"
          >
            All events <ArrowRight size={14} />
          </Link>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((event, i) => (
            <AnimatedSection key={event.id} delay={0.07 * i}>
              <Link
                href={`/events/${event.slug}`}
                className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Color stripe */}
                <div
                  className={`h-1.5 w-full ${categoryDot[event.category] ?? "bg-gray-200"}`}
                />

                <div className="flex flex-col flex-1 p-5">
                  {/* Category + Attendees row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-section font-semibold uppercase tracking-wider text-muted">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          categoryDot[event.category] ?? "bg-gray-400"
                        }`}
                      />
                      {event.category}
                    </span>
                    {event.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-accent text-dark text-[9px] font-section font-bold uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-section font-semibold text-dark group-hover:text-brand transition-colors text-base leading-snug flex-1">
                    {event.title}
                  </h3>

                  {/* Meta */}
                  <div className="mt-4 space-y-2 text-xs text-muted font-body">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-brand shrink-0" />
                      <span>{event.date}</span>
                      <Clock size={12} className="text-brand ml-1 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-brand shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-brand shrink-0" />
                      <span>{event.attendees.toLocaleString()} expected</span>
                    </div>
                  </div>

                  {/* RSVP */}
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand group-hover:gap-2 transition-all">
                      View & RSVP <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  )
}
