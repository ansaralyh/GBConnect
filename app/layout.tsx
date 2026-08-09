import type React from "react"
import { Sora, Manrope } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { SiteShell } from "@/components/site-shell"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata = {
  title: "GBConnect - Connect with Local Service Providers in Gilgit Baltistan",
  description: "Discover authentic local experiences and connect with trusted service providers in Gilgit Baltistan.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${manrope.variable} font-sans`}>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  )
}
