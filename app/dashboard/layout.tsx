"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Home,
  LogOut,
  MessageSquare,
  Mountain,
  Settings,
  ShoppingBag,
} from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { NotificationBadge } from "@/components/notification-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isProvider = user?.role === "provider"

  const providerLinks = [
    { title: "Dashboard", href: "/dashboard/provider", icon: Home, exact: true },
    { title: "Services", href: "/dashboard/provider/services", icon: ShoppingBag },
    { title: "Bookings", href: "/dashboard/provider/bookings", icon: Calendar },
    { title: "Settings", href: "/dashboard/provider/settings", icon: Settings },
  ]

  const touristLinks = [
    { title: "Dashboard", href: "/dashboard/tourist", icon: Home, exact: true },
    { title: "My Bookings", href: "/dashboard/tourist/bookings", icon: Calendar },
    { title: "Settings", href: "/dashboard/tourist/settings", icon: Settings },
  ]

  const links = isProvider ? providerLinks : touristLinks
  const homeHref = isProvider ? "/dashboard/provider" : "/dashboard/tourist"
  const settingsHref = isProvider ? "/dashboard/provider/settings" : "/dashboard/tourist/settings"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar: logo + notifications */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
          <Link href={homeHref} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mountain className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">GBConnect</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <NotificationBadge />
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link href="/messages" aria-label="Messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="gap-2 pl-1 pr-2">
              <Link href={settingsHref}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[120px] truncate text-sm font-medium md:inline">
                  {user?.name || "Account"}
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — fixed full viewport height below top bar */}
        <aside className="fixed bottom-0 left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-56 flex-col border-r border-border/70 bg-muted/30 md:flex">
          <div className="border-b border-border/70 px-5 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" />
              <div>
                <p className="font-display text-sm font-semibold leading-none">GBConnect</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {isProvider ? "Provider studio" : "Traveler hub"}
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {links.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto border-t border-border/70 p-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-3.5rem)] flex-1 overflow-auto p-4 md:ml-56 md:p-6">{children}</main>
      </div>
    </div>
  )
}
