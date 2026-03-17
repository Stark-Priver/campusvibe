import type { Metadata } from "next"
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

export const metadata: Metadata = {
  title: "CampusVibe — Ride. Eat. Connect. Earn.",
  description:
    "Tanzania's #1 university super-app. Transport, food, marketplace, events, and campus life in one connected platform for students.",
  keywords: ["campus", "university", "Tanzania", "students", "CampusVibe", "UDSM", "UDOM"],
  openGraph: {
    title: "CampusVibe — Ride. Eat. Connect. Earn.",
    description: "Tanzania's #1 university super-app for students.",
    type: "website",
    locale: "en_TZ",
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
