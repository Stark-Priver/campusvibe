import Link from "next/link"
import { Zap, Twitter, Instagram, Youtube, Linkedin, MapPin } from "lucide-react"

const footerLinks = {
  Platform: [
    { label: "Download App", href: "#" },
    { label: "News", href: "/news" },
    { label: "Events", href: "/events" },
    { label: "Media", href: "/media" },
  ],
  Campus: [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Join as Driver", href: "/get-involved" },
    { label: "Become a Creator", href: "/get-involved" },
    { label: "Campus Partners", href: "/get-involved" },
  ],
  Company: [
    { label: "Get Involved", href: "/get-involved" },
    { label: "Sponsor Us", href: "/get-involved" },
    { label: "Advertise", href: "/get-involved" },
    { label: "Contact", href: "/get-involved" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Community Rules", href: "#" },
  ],
}

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <span className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-heading font-bold text-lg tracking-tight text-white">
                Campus<span className="text-brand">Vibe</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-[280px] font-body">
              Tanzania&apos;s #1 university super-app. Ride. Eat. Connect. Earn.{" "}
              Everything campus life, in one platform.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-section font-semibold text-[10px] uppercase tracking-widest text-white/35 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors duration-150 font-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Row ── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-sm font-body">
            &copy; {new Date().getFullYear()} CampusVibe Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-white/35 text-sm font-body">
            <MapPin size={12} />
            <span>Dar es Salaam, Tanzania</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
