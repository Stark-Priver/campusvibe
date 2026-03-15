import Link from "next/link"
import Image from "next/image"
import { Twitter, Instagram, Youtube, Linkedin, MapPin } from "lucide-react"

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
    <footer className="bg-white text-dark border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-12 border-b border-gray-100">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <Image
                src="/media/campusvibe-logo.svg"
                alt="CampusVibe"
                width={160}
                height={34}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] font-body">
              Tanzania&apos;s #1 university super-app. Ride. Eat. Connect. Earn.{" "}
              Everything campus life, in one platform.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand/25 hover:bg-brand/5 transition-colors duration-150"
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
              <h4 className="font-section font-semibold text-[10px] uppercase tracking-widest text-gray-400 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-brand transition-colors duration-150 font-body"
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
          <p className="text-gray-400 text-sm font-body">
            &copy; {new Date().getFullYear()} CampusVibe Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm font-body">
            <MapPin size={12} />
            <span>Dar es Salaam, Tanzania</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
