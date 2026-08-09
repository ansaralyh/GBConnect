"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === "/"
  const isDashboard = pathname.startsWith("/dashboard")

  if (isDashboard) {
    return <div className="flex min-h-screen flex-col">{children}</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className={cn("flex flex-1 flex-col", !isLanding && "pt-16")}>{children}</div>
      <Footer />
    </div>
  )
}
