"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, Check, Download, MapPin, Share2, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"

// Mock service data
const mockServices = [
  {
    id: "1",
    title: "Serena Hotel",
    type: "accommodation",
    location: "Gilgit City",
    price: 200,
    rating: 4.8,
    reviewCount: 124,
    image: "/placeholder.svg?height=300&width=400",
    description: "Luxury hotel with stunning mountain views and excellent service.",
    provider: {
      id: "provider-1",
      name: "Serena Hotels",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  },
  {
    id: "2",
    title: "Mountain View Restaurant",
    type: "food",
    location: "Hunza Valley",
    price: 50,
    rating: 4.5,
    reviewCount: 86,
    image: "/placeholder.svg?height=300&width=400",
    description: "Traditional cuisine with panoramic views of the Hunza Valley.",
    provider: {
      id: "provider-2",
      name: "Hunza Hospitality",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  },
]

export function BookingConfirmation({ serviceId }: { serviceId: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: "GB-" + Math.floor(100000 + Math.random() * 900000),
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
    checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 10 days from now
    guests: 2,
    nights: 3,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  })

  // Find the service by ID
  const service = mockServices.find((s) => s.id === serviceId) || mockServices[0]

  // Calculate prices
  const subtotal = service.price * bookingDetails.nights
  const serviceFee = Math.round(subtotal * 0.1)
  const taxes = Math.round(subtotal * 0.05)
  const total = subtotal + serviceFee + taxes

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard/tourist" className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Login
                </Link>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/30 py-8">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl">Booking Confirmed!</h1>
              <p className="mt-2 text-muted-foreground">
                Your booking has been confirmed and is ready. We've sent a confirmation email with all the details.
              </p>
            </div>

            <Card className="mb-8 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary/10 p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-lg font-semibold">Booking Reference</h2>
                      <p className="text-2xl font-bold text-primary">{bookingDetails.bookingId}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                      <Button size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium">Service Details</h3>
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{service.title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>{service.location}</span>
                          </div>
                          <div className="mt-1 flex items-center text-sm">
                            <Star className="mr-1 h-3 w-3 fill-primary text-primary" />
                            <span>{service.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Booking Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Check-in</span>
                          </div>
                          <span className="text-sm">{new Date(bookingDetails.checkIn).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Check-out</span>
                          </div>
                          <span className="text-sm">{new Date(bookingDetails.checkOut).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Guests</span>
                          </div>
                          <span className="text-sm">{bookingDetails.guests}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="mb-4 font-medium">Payment Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">
                          ${service.price} x {bookingDetails.nights} nights
                        </span>
                        <span className="text-sm">${subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Service fee</span>
                        <span className="text-sm">${serviceFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Taxes</span>
                        <span className="text-sm">${taxes}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total (USD)</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-8 space-y-4 rounded-lg border bg-card p-6">
              <h3 className="font-medium">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Check your email</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email with all the details of your booking.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Contact the service provider</p>
                    <p className="text-sm text-muted-foreground">
                      Feel free to reach out to the service provider if you have any specific questions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Enjoy your experience</p>
                    <p className="text-sm text-muted-foreground">
                      Get ready for your trip and don't forget to leave a review after your stay!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/dashboard/tourist">View My Bookings</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/services">Browse More Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
