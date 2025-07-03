"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Star, Users, FileText, AlertTriangle, Filter, Search, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { formatCurrency } from "@/lib/utils"

export function MyBookings() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [bookings, setBookings] = useState<any[]>([])
  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/login")
      return
    }
    setIsLoading(true)
    // Fetch real bookings for the user
    fetch(`/api/bookings?userId=${user.id || user._id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings")
        const data = await res.json()
        setBookings(data)
      })
      .catch(() => setBookings([]))
      .finally(() => setIsLoading(false))
  }, [user, router])

  useEffect(() => {
    let filtered = bookings

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((booking) => booking.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.service.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredBookings(filtered)
  }, [activeTab, searchQuery, bookings])

  const handleCancelBooking = () => {
    if (!bookingToCancel) return

    setIsCancelling(true)

    // Simulate API call
    setTimeout(() => {
      // Update booking status locally
      const updatedBookings = bookings.map((booking) => {
        if (booking.id === bookingToCancel) {
          return {
            ...booking,
            status: "cancelled",
            cancellationReason,
          }
        }
        return booking
      })

      // Update state
      setFilteredBookings(updatedBookings.filter((booking) => activeTab === "all" || booking.status === activeTab))

      // Show success message
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      })

      // Reset state
      setBookingToCancel(null)
      setCancellationReason("")
      setIsCancelling(false)
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg font-medium">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage and track all your bookings in one place</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookings..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
          <p className="mt-2 text-center text-muted-foreground">
            {searchQuery
              ? "No bookings match your search criteria. Try a different search term."
              : activeTab !== "all"
                ? `You don't have any ${activeTab} bookings.`
                : "You haven't made any bookings yet."}
          </p>
          <Button asChild className="mt-4">
            <Link href="/services">Browse Services</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
                <div className="relative h-48 md:h-full">
                  <Image
                    src={booking.service.image || "/placeholder.svg"}
                    alt={booking.service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:hidden">
                    <h3 className="text-lg font-semibold text-white">{booking.service.title}</h3>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="hidden text-xl font-semibold md:block">{booking.service.title}</h3>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{booking.service.location}</span>
                      </div>
                    </div>

                    <Badge
                      className={
                        booking.status === "confirmed"
                          ? "bg-green-500 hover:bg-green-600"
                          : booking.status === "pending"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : booking.status === "completed"
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-red-500 hover:bg-red-600"
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                      <div className="text-sm font-medium">Booking ID</div>
                      <div className="text-sm text-muted-foreground">{booking.id}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Booking Date</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Total Price</div>
                      <div className="text-sm font-semibold text-primary">{formatCurrency(booking.totalPrice)}</div>
                    </div>

                    {"checkIn" in booking && "checkOut" in booking && (
                      <>
                        <div>
                          <div className="text-sm font-medium">Check-in</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium">Check-out</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium">Guests</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-4 w-4" />
                            <span>{booking.guests}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {"date" in booking && (
                      <div>
                        <div className="text-sm font-medium">Date</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    {"participants" in booking && (
                      <div>
                        <div className="text-sm font-medium">Participants</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{booking.participants}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {booking.status === "cancelled" && booking.cancellationReason && (
                    <div className="mb-4 rounded-md bg-red-50 p-3">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Cancellation Reason</h3>
                          <div className="mt-1 text-sm text-red-700">{booking.cancellationReason}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {booking.status === "completed" && booking.review && (
                    <div className="mb-4 rounded-md bg-blue-50 p-3">
                      <div className="flex">
                        <Star className="h-5 w-5 text-blue-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Your Review</h3>
                          <div className="mt-1 flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < booking.review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <div className="mt-1 text-sm text-blue-700">{booking.review.comment}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={booking.provider?.avatar || booking.service?.provider?.avatar || "/placeholder.svg"}
                          alt={booking.provider?.name || booking.service?.provider?.name || "Provider"}
                          width={32}
                          height={32}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{booking.provider?.name || booking.service?.provider?.name || "Provider"}</div>
                        <div className="text-xs text-muted-foreground">{booking.provider?.contactInfo || booking.service?.provider?.contactInfo || "No contact info available"}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {booking.status !== 'cancelled' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            try {
                              const res = await fetch(`/api/bookings/${booking.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'cancelled' }),
                              });
                              if (res.ok) {
                                // Optionally show a toast
                                setBookings((prev) => prev.map((b) => b.id === booking.id ? { ...b, status: 'cancelled' } : b));
                              } else {
                                // Optionally show error toast
                              }
                            } catch (e) {
                              // Optionally show error toast
                            }
                          }}
                        >
                          Cancel Booking
                        </Button>
                      )}

                      {booking.status === "completed" && !booking.review && (
                        <Button asChild>
                          <Link href={`/services/${booking.service.id}/review`}>Write a Review</Link>
                        </Button>
                      )}

                      <Button asChild variant="outline" size="sm">
                        <Link href={`/booking/confirmation/${booking.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancellation Dialog */}
      <Dialog open={!!bookingToCancel} onOpenChange={(open) => !open && setBookingToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label htmlFor="reason" className="mb-2 block text-sm font-medium">
              Reason for cancellation (optional)
            </label>
            <Textarea
              id="reason"
              placeholder="Please tell us why you're cancelling..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingToCancel(null)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={isCancelling}>
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
