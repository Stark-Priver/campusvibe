import type { Metadata, Viewport } from "next"
import { Poppins, Montserrat, Inter } from "next/font/google"
import "./globals.css"
import LayoutProvider from "@/components/layout/LayoutProvider"

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
  themeColor: "#6C63FF",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://campusvibe.co.tz"),
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
  ],
  authors: [{ name: "CampusVibe Media", url: "https://campusvibe.co.tz" }],
  creator: "CampusVibe Media",
  publisher: "CampusVibe Media",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_TZ",
    url: "https://campusvibe.co.tz",
    siteName: "CampusVibe",
    title: "CampusVibe — Ride. Eat. Connect. Earn.",
    description: "Tanzania's #1 university super-app for students.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CampusVibe — Tanzania's #1 University Super-App",
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
    canonical: "https://campusvibe.co.tz",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <body className="antialiased bg-[#ECECEC] text-dark">
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}
