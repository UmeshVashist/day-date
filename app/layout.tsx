import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import GlassBackground from "@/components/glass-background"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Day & Date MS",
  description: "Calculate days between dates and add days to dates",
  generator: "Day & Date MS",
  icons: {
    icon: [
      {
        url: "https://jxechgirxrbrblyrrqmt.supabase.co/storage/v1/object/public/images/bb5b5ced-6b47-425c-aad2-065017342a96/1768574759761-development.png",

      },

    ],

  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-sans antialiased overflow-x-hidden`}>
        <GlassBackground>
          {children}
        </GlassBackground>
        <Analytics />
      </body>
    </html>
  )
}
