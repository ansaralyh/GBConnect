"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Home } from "lucide-react"

import { useAuth } from "@/context/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const pathname = usePathname()
  
  const isTourist = user?.role === "tourist"
  const isProvider = user?.role === "provider"

  const touristMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard/tourist",
      active: pathname === "/dashboard/tourist",
    },
    {
      title: "My Bookings",
      icon: Calendar,
      href: "/dashboard/tourist/bookings",
      active: pathname.startsWith("/dashboard/tourist/bookings"),
    },
    {
      title: "Settings",
      icon: Calendar,
      href: "/dashboard/tourist/settings",
      active: pathname.startsWith("/dashboard/tourist/settings"),
    },
  ]



  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
