import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react"
import { events } from "@/lib/data"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = events.find((item) => item.slug === slug)

  if (!event) return { title: "Events — CampusVibe" }

  return {
    title: `${event.title} — CampusVibe`,
    description: event.description,
  }
}

export default async function EventDetailsPage({ params }: Props) {
  const { slug } = await params
  const event = events.find((item) => item.slug === slug)

  if (!event) notFound()

  return (
    <section className="pt-20 pb-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors">
          <ArrowLeft size={14} /> Back to Events
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <span className="inline-flex px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-section font-semibold uppercase tracking-wide">
              {event.category}
            </span>
            <h1 className="mt-4 font-heading font-black text-3xl sm:text-4xl text-dark leading-tight">
              {event.title}
            </h1>
            <p className="mt-4 text-gray-600 text-base leading-relaxed font-body">{event.description}</p>
          </div>

          <aside className="lg:col-span-2 rounded-2xl border border-gray-100 bg-gray-50 p-5 h-fit">
            <h2 className="font-section font-bold text-base text-dark mb-4">Event Details</h2>
            <div className="space-y-3 text-sm text-gray-600 font-body">
              <p className="flex items-center gap-2"><Calendar size={14} className="text-brand" /> {event.date}</p>
              <p className="flex items-center gap-2"><Clock size={14} className="text-brand" /> {event.time}</p>
              <p className="flex items-center gap-2"><MapPin size={14} className="text-brand" /> {event.location}</p>
              <p className="flex items-center gap-2"><Users size={14} className="text-brand" /> {event.attendees.toLocaleString()} expected attendees</p>
            </div>
            <button className="mt-5 w-full px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-[#5a52e0] transition-colors">
              RSVP / Register
            </button>
          </aside>
        </div>

        <div className="relative mt-8 aspect-[16/8] rounded-2xl overflow-hidden border border-gray-100">
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" priority sizes="100vw" />
        </div>
      </div>
    </section>
  )
}
