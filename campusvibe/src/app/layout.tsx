import type { Metadata, Viewport } from "next"
import { Poppins, Montserrat, Inter } from "next/font/google"
import "./globals.css"
import LayoutProvider from "@/components/layout/LayoutProvider"
import VisitTracker from "@/components/analytics/VisitTracker"

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#3A22A3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
}

const BASE_URL = "https://campusvibe.co.tz"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CampusVibe — Ride. Eat. Connect. Earn.",
    template: "%s | CampusVibe",
  },
  description:
    "Tanzania's #1 university super-app. Transport, food delivery, student marketplace, campus events, and news — all in one platform for Tanzanian students.",
  keywords: [
    "CampusVibe",
    "Tanzania university app",
    "student marketplace Tanzania",
    "campus transport Tanzania",
    "UDSM student app",
    "UDOM student platform",
    "campus food delivery Tanzania",
    "university events Tanzania",
    "campus news Tanzania",
    "student super app Tanzania",
    "ride sharing Tanzania",
    "peer to peer marketplace",
    "campus community",
  ],
  authors: [{ name: "CampusVibe Media", url: BASE_URL }],
  creator: "CampusVibe Media",
  publisher: "CampusVibe Media",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_TZ",
    url: BASE_URL,
    siteName: "CampusVibe",
    title: "CampusVibe — Ride. Eat. Connect. Earn.",
    description: "Tanzania's #1 university super-app for students.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CampusVibe — Tanzania's #1 University Super-App",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusVibe — Ride. Eat. Connect. Earn.",
    description: "Tanzania's #1 university super-app for students.",
    images: ["/og-image.png"],
    creator: "@campusvibetz",
    site: "@campusvibetz",
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-TZ": BASE_URL,
      "en-US": BASE_URL,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CampusVibe",
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CampusVibe",
    description: "Tanzania's #1 university super-app for students",
    url: BASE_URL,
    applicationCategory: "MultiService",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TZS",
      offers: [
        {
          "@type": "Offer",
          name: "Ride Sharing",
          description: "Campus transportation services",
        },
        {
          "@type": "Offer",
          name: "Food Delivery",
          description: "Campus food delivery service",
        },
        {
          "@type": "Offer",
          name: "Student Marketplace",
          description: "Buy and sell items on campus",
        },
        {
          "@type": "Offer",
          name: "Events",
          description: "Campus events and activities",
        },
        {
          "@type": "Offer",
          name: "News",
          description: "Campus news and updates",
        },
      ],
    },
    author: {
      "@type": "Organization",
      name: "CampusVibe Media",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@campusvibe.co.tz",
    },
    sameAs: [
      "https://www.facebook.com/campusvibetz",
      "https://www.instagram.com/campusvibetz",
      "https://twitter.com/campusvibetz",
      "https://www.tiktok.com/@campusvibetz",
    ],
  }

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CampusVibe" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#ECECEC] text-dark">
        <VisitTracker />
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}
