import Link from "next/link"
import { Twitter, Instagram, Youtube, Linkedin, MapPin, Mail } from "lucide-react"

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
    { label: "About Us", href: "/about" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Sponsor Us", href: "/get-involved" },
    { label: "Advertise", href: "/get-involved" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Contact", href: "/get-involved" },
  ],
}

const socials = [
  { icon: Twitter, href: "https://twitter.com/campusvibetz", label: "Twitter / X" },
  { icon: Instagram, href: "https://instagram.com/campusvibetz", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@campusvibetz", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com/company/campusvibetz", label: "LinkedIn" },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#ECECEC] text-dark border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-gray-100">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2 space-y-4 sm:space-y-5">
            <Link href="/" className="inline-flex items-center w-fit">
              <span className="font-heading font-black text-2xl text-dark leading-none tracking-tight">
                Campus <span className="text-brand">Vibe</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-body">
              Tanzania&apos;s #1 university super-app. Ride. Eat. Connect. Earn.
              Everything campus life, in one platform.
            </p>
            <div className="space-y-1.5">
              <a href="mailto:info@campusvibe.co.tz" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors font-body">
                <Mail size={13} /> info@campusvibe.co.tz
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
                <MapPin size={13} /> Mbeya, Tanzania
              </div>
            </div>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand/25 hover:bg-brand/5 transition-colors duration-150">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="font-section font-semibold text-[10px] uppercase tracking-widest text-gray-400 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-brand transition-colors duration-150 font-body">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-sm font-body">
            &copy; {year} Campus Vibe Media Ltd. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs font-body">
            Built with ❤️ for Tanzanian students · campusvibe.co.tz
          </p>
        </div>
      </div>
    </footer>
  )
}
