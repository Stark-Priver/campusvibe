import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from("events")
    .select("title, description, image_url, date")
    .eq("slug", slug)
    .single()

  if (!event) return { title: "Events — CampusVibe" }
  return {
    title: event.title,
    description: event.description ?? undefined,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
      type: "website",
      images: event.image_url ? [{ url: event.image_url }] : [],
    },
    alternates: { canonical: `/events/${slug}` },
  }
}

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data } = await supabase.from("events").select("slug").eq("is_published", true)
  return (data ?? []).map((e) => ({ slug: e.slug }))
}

export const revalidate = 300

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!event) notFound()

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-TZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: `${event.date}T${event.time ?? "00:00"}`,
    location: event.location ? { "@type": "Place", name: event.location } : undefined,
    image: event.image_url,
    url: `https://campusvibe.co.tz/events/${event.slug}`,
    organizer: { "@type": "Organization", name: "CampusVibe", url: "https://campusvibe.co.tz" },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-20 pb-16 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors font-body">
            <ArrowLeft size={14} /> Back to Events
          </Link>

          {event.image_url && (
            <div className="relative mt-6 aspect-[16/9] rounded-2xl overflow-hidden border border-gray-100">
              <Image src={event.image_url} alt={event.title} fill className="object-cover" priority sizes="896px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="px-3 py-1 rounded-full bg-accent text-dark text-xs font-section font-bold uppercase tracking-wide">{event.category}</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            {!event.image_url && (
              <span className="inline-flex px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-section font-semibold uppercase tracking-wide mb-4">{event.category}</span>
            )}
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark leading-tight">{event.title}</h1>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-surface">
                <Calendar size={18} className="text-brand shrink-0" />
                <div>
                  <p className="text-xs text-muted font-body">Date</p>
                  <p className="text-sm font-section font-semibold text-dark">{fmt(event.date)}</p>
                </div>
              </div>
              {event.time && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-surface">
                  <Clock size={18} className="text-brand shrink-0" />
                  <div>
                    <p className="text-xs text-muted font-body">Time</p>
                    <p className="text-sm font-section font-semibold text-dark">{event.time}</p>
                  </div>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-surface">
                  <MapPin size={18} className="text-brand shrink-0" />
                  <div>
                    <p className="text-xs text-muted font-body">Location</p>
                    <p className="text-sm font-section font-semibold text-dark">{event.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-surface">
                <Users size={18} className="text-brand shrink-0" />
                <div>
                  <p className="text-xs text-muted font-body">Expected Attendance</p>
                  <p className="text-sm font-section font-semibold text-dark">{event.attendees_count.toLocaleString()} people</p>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="mt-7">
                <h2 className="font-section font-bold text-xl text-dark mb-3">About this Event</h2>
                <p className="text-gray-700 font-body leading-relaxed">{event.description}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {event.rsvp_url ? (
                <a href={event.rsvp_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20">
                  RSVP / Register Now
                </a>
              ) : (
                <Link href="/get-involved"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors">
                  Get More Info
                </Link>
              )}
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(`https://campusvibe.co.tz/events/${event.slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand transition-colors">
                <Share2 size={14} /> Share
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
