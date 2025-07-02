"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileMenu() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const userNavItems = user
    ? user.role === "tourist"
      ? [
          { name: "Dashboard", href: "/dashboard/tourist" },
          { name: "My Bookings", href: "/dashboard/tourist/bookings" },
          { name: "Settings", href: "/dashboard/tourist/settings" },
          { name: "Messages", href: "/messages" },
          { name: "Notifications", href: "/notifications" },
        ]
      : [
          { name: "Dashboard", href: "/dashboard/provider" },
          { name: "My Services", href: "/dashboard/provider/services" },
          { name: "Settings", href: "/dashboard/provider/settings" },
          { name: "Messages", href: "/messages" },
          { name: "Notifications", href: "/notifications" },
        ]
    : []

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-10">
        <div className="flex flex-col h-full">
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="flex flex-col space-y-4 mt-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`px-2 py-2 text-lg hover:bg-accent hover:text-accent-foreground rounded-md transition-colors ${
                  pathname === item.href ? "font-medium text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {userNavItems.length > 0 && (
              <>
                <div className="h-px bg-border my-2" />
                {userNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={`px-2 py-2 text-lg hover:bg-accent hover:text-accent-foreground rounded-md transition-colors ${
                      pathname === item.href ? "font-medium text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="mt-auto mb-8">
            {user ? (
              <div className="space-y-4">
                <div className="px-2 py-2 bg-accent rounded-md">
                  <p className="font-medium">Signed in as</p>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button asChild className="w-full" onClick={closeMenu}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={closeMenu}>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
