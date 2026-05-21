"use client"

import { useRouter } from "next/navigation"
import { CheckCircle2, Video, Camera, Award, Users, Phone, MessageCircle } from "lucide-react"

export default function CampusMemoryPage() {
  const router = useRouter()

  const packages = [
    {
      id: "basic",
      name: "Basic Memory",
      price: "40,000 - 60,000",
      features: ["Edited & Raw Photos", "Graduation Highlight Reel", "Photo Processing"],
      highlight: false,
    },
    {
      id: "standard",
      name: "Standard Vibe",
      price: "70,000 - 90,000",
      features: ["High-Quality Photos", "Event Video Coverage", "Graduation Interview", "Professional Editing"],
      highlight: true,
    },
    {
      id: "premium",
      name: "Full Campus Experience",
      price: "150,000",
      features: ["Photos, Videos & Interviews", "Complete Documentary", "Event Ticket", "Alumni Networking", "Career Connections"],
      highlight: false,
    },
  ]

  const eventTypes = [
    { icon: Users, title: "Birthday Bashes", desc: "Campus venue celebrations" },
    { icon: Camera, title: "Casual Vibes", desc: "Daily lifestyle moments" },
    { icon: Users, title: "Squad Memories", desc: "Friend group moments" },
    { icon: Award, title: "Graduation", desc: "Your special day" },
    { icon: Camera, title: "Welcome Freshers", desc: "Orientation coverage" },
    { icon: Video, title: "Campus Events", desc: "Sports & competitions" },
  ]

  const addOns = [
    { service: "Individual/Squad Shoot", price: "10,000 - 35,000" },
    { service: "Campus Vibe Reel", price: "10,000 - 15,000" },
    { service: "Event Coverage", price: "60,000 - 120,000" },
    { service: "Entrepreneur Promo", price: "20,000" },
    { service: "Class Documentary", price: "500,000" },
  ]

  const handleBookPackage = (packageId: string) => {
    router.push(`/campus-memory/book?package=${packageId}`)
  }

  return (
    <div className="min-h-screen bg-[#ECECEC]">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="h-16" />
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-section font-semibold text-brand uppercase tracking-widest">Professional Memory Services</span>
          </div>

          <h1 className="mt-4 font-heading font-black text-dark leading-tight" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            Preserve Your <span className="text-brand">Campus Memories</span>
          </h1>

          <p className="mt-3 text-muted text-base sm:text-lg max-w-2xl mx-auto font-body">
            Professional photography & videography for every campus moment. Capture what matters forever.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/campus-memory/book" className="px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-section font-semibold hover:bg-brand-dark transition-colors inline-block">
              Book Now
            </a>
            <a href="/campus-memory/my-bookings" className="px-6 py-2.5 bg-white border-2 border-gray-300 text-dark rounded-lg text-sm font-section font-semibold hover:border-brand transition-colors inline-block">
              My Bookings
            </a>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-black text-dark text-center" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>Events We Cover</h2>
          <p className="text-center text-muted text-sm mt-1 font-body">From personal moments to major campus celebrations</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {eventTypes.map((event, idx) => {
              const Icon = event.icon
              return (
                <div key={idx} className="p-6 rounded-xl border border-gray-200 hover:border-brand/50 hover:shadow-md transition-all bg-gradient-to-br from-gray-50 to-white">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                    <Icon className="text-brand" size={20} />
                  </div>
                  <h3 className="font-section font-bold text-dark text-sm">{event.title}</h3>
                  <p className="text-muted text-xs mt-1 font-body">{event.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-black text-dark text-center" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>Graduation Packages</h2>
          <p className="text-center text-muted text-sm mt-1 font-body">Choose your perfect memory package</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-xl transition-all duration-300 ${
                  pkg.highlight ? "ring-2 ring-brand shadow-lg" : "border border-gray-200 hover:shadow-md"
                } ${pkg.highlight ? "bg-brand/5" : "bg-white"} p-6`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-brand text-white px-3 py-1 rounded-full text-xs font-section font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <h3 className="font-section font-bold text-dark text-lg">{pkg.name}</h3>
                <div className="mt-3 text-2xl font-heading font-black text-brand">{pkg.price} TSH</div>

                <div className="space-y-2 mt-5">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="text-success flex-shrink-0" size={16} />
                      <span className="text-muted text-xs font-body">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleBookPackage(pkg.id)}
                  className={`w-full mt-5 py-2.5 rounded-lg font-section font-semibold text-sm transition-all ${
                    pkg.highlight
                      ? "bg-brand text-white hover:bg-brand-dark"
                      : "bg-gray-100 text-dark hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-black text-dark text-center" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>Additional Services</h2>
          <p className="text-center text-muted text-sm mt-1 font-body">More options for your campus moments</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {addOns.map((addon, idx) => (
              <div key={idx} className="p-5 rounded-lg border border-gray-200 hover:border-brand/50 hover:shadow-md transition-all bg-gray-50 hover:bg-white">
                <h3 className="font-section font-bold text-dark text-sm">{addon.service}</h3>
                <div className="mt-2 text-lg font-heading font-black text-brand">{addon.price} TSH</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-black text-dark text-center" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>Why Campus Vibe?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Camera className="text-brand" size={20} />
              </div>
              <div>
                <h3 className="font-section font-bold text-dark text-sm">Professional Quality</h3>
                <p className="text-muted text-xs mt-1 font-body">Expert photography & videography</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="text-brand" size={20} />
              </div>
              <div>
                <h3 className="font-section font-bold text-dark text-sm">Campus Expert</h3>
                <p className="text-muted text-xs mt-1 font-body">We understand student life</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Award className="text-brand" size={20} />
              </div>
              <div>
                <h3 className="font-section font-bold text-dark text-sm">Fast Delivery</h3>
                <p className="text-muted text-xs mt-1 font-body">Quick turnaround, high quality</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Video className="text-brand" size={20} />
              </div>
              <div>
                <h3 className="font-section font-bold text-dark text-sm">Creative Editing</h3>
                <p className="text-muted text-xs mt-1 font-body">Trending sounds & effects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-brand">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-black text-white text-center" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>Ready to Book?</h2>

          <div className="bg-white rounded-xl p-8 mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mx-auto mb-3">
                  <Phone className="text-brand" size={24} />
                </div>
                <h4 className="font-section font-bold text-dark text-sm">M-Pesa Payment</h4>
                <p className="text-muted text-xs mt-1 font-body">Lipa via M-Pesa</p>
                <div className="mt-2 text-2xl font-heading font-black text-brand font-mono">353332037</div>
                <p className="text-muted text-xs mt-1 font-body">Campus Vibe Media</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="text-success" size={24} />
                </div>
                <h4 className="font-section font-bold text-dark text-sm">Contact</h4>
                <p className="text-muted text-xs mt-1 font-body">Phone: <span className="text-dark font-semibold">0798194062</span></p>
                <p className="text-muted text-xs mt-1 font-body">YouTube: <span className="text-dark font-semibold">Campus Vibe Tv</span></p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-muted text-xs text-center font-body">© 2026 Campus Vibes Media Company Limited</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                <button className="px-6 py-2.5 bg-brand text-white rounded-lg font-section font-semibold text-sm hover:bg-brand-dark transition-colors">
                  Book Now
                </button>
                <button className="px-6 py-2.5 bg-gray-100 text-dark rounded-lg font-section font-semibold text-sm hover:bg-gray-200 transition-colors">
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
