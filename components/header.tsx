"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileMenu } from "@/components/mobile-menu"
import { NotificationBadge } from "@/components/notification-badge"

export function Header() {
  const { user } = useAuth()
  const pathname = usePathname()

  // Don't show header on login and signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl text-primary">GBConnect</span>
          </Link>
        </div>

        <MainNav className="hidden md:flex" />

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/notifications" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <NotificationBadge count={3} />
                </Button>
              </Link>

              <div className="hidden md:flex items-center gap-2">
                <Link href={user.role === "tourist" ? "/dashboard/tourist" : "/dashboard/provider"}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" asChild>
                  <Link href={user.role === "tourist" ? "/dashboard/tourist/settings" : "/dashboard/provider/settings"}>
                    {user.name}
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
