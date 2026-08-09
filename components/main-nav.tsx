"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Mountain } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { NotificationBadge } from "@/components/notification-badge"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for transparent navbar on landing page
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isLandingPage = pathname === "/"
  const onHero = isLandingPage && !isScrolled
  const navbarClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    onHero
      ? "border-b border-white/10 bg-black/55 shadow-lg shadow-black/20 backdrop-blur-md"
      : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  )

  const linkClass = (path: string) => {
    return cn(
      "text-sm font-semibold transition-colors",
      pathname === path
        ? onHero
          ? "text-white"
          : "text-primary"
        : onHero
          ? "text-white hover:text-white/80"
          : "text-foreground/80 hover:text-primary",
    )
  }

  const logoTextClass = cn(
    "font-display text-lg font-semibold tracking-tight",
    onHero ? "text-white" : "text-foreground",
  )

  return (
    <header className={navbarClass}>
      <div className="container flex h-16 items-center justify-between">
        <nav className={cn("flex items-center", className)} {...props}>
          <Link href="/" className="flex items-center space-x-2 mr-6">
            <Mountain className={cn("h-6 w-6", onHero ? "text-white" : "text-primary")} />
            <span className={logoTextClass}>GBConnect</span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/services" className={linkClass("/services")}>
              Explore
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              About
            </Link>
            <Link href="/contact" className={linkClass("/contact")}>
              Contact
            </Link>
          </div>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <NotificationBadge className={onHero ? "text-white hover:bg-white/10 hover:text-white" : undefined} />
              <Link href="/messages" className={linkClass("/messages")}>
                Messages
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-9 w-9 rounded-full p-0",
                      onHero && "ring-2 ring-white/40 hover:bg-white/10",
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className={onHero ? "bg-white/20 text-white" : undefined}>
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "provider" ? "/dashboard/provider" : "/dashboard/tourist"}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={user.role === "provider" ? "/dashboard/provider/settings" : "/dashboard/tourist/settings"}
                    >
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/logout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                href="/login"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  onHero
                    ? "text-white hover:bg-white/15"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                Login
              </Link>
              <Button
                asChild
                variant={onHero ? "outline" : "default"}
                className={
                  onHero
                    ? "border-white bg-white text-primary hover:bg-white/90 hover:text-primary"
                    : ""
                }
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("md:hidden", onHero ? "text-white hover:bg-white/20 hover:text-white" : "")}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-10">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <Mountain className="h-6 w-6 text-primary" />
                    <span className="font-bold">GBConnect</span>
                  </Link>
                  <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>

                {user && (
                  <div className="flex items-center space-x-4 mb-6 p-4 bg-muted rounded-lg">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Navigation</h3>
                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/services"
                          className="flex items-center py-2 text-base font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          Explore
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/about"
                          className="flex items-center py-2 text-base font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          About
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/contact"
                          className="flex items-center py-2 text-base font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          Contact
                        </Link>
                      </SheetClose>
                    </div>
                  </div>

                  {user ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Link
                            href={user.role === "provider" ? "/dashboard/provider" : "/dashboard/tourist"}
                            className="flex items-center py-2 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/messages"
                            className="flex items-center py-2 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                          >
                            Messages
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/notifications"
                            className="flex items-center py-2 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                          >
                            Notifications
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href={
                              user.role === "provider" ? "/dashboard/provider/settings" : "/dashboard/tourist/settings"
                            }
                            className="flex items-center py-2 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                          >
                            Settings
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/logout"
                            className="flex items-center py-2 text-base font-medium text-red-500"
                            onClick={() => setIsOpen(false)}
                          >
                            Logout
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4">
                      <SheetClose asChild>
                        <Button className="w-full" asChild>
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/login">Login</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} GBConnect. All rights reserved.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
