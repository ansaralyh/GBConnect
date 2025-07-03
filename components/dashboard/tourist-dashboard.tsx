"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Home, Search, Calendar, User, MapPin, Heart, ChevronRight, Settings, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"

// Mock data
const upcomingBookings = [
  {
    id: "booking-1",
    service: {
      id: "1",
      title: "Serena Hotel",
      type: "accommodation",
      location: "Gilgit City",
      image: "/placeholder.svg?height=100&width=100",
    },
    checkIn: "2023-12-15",
    checkOut: "2023-12-18",
    guests: 2,
    status: "confirmed",
    totalPrice: "$600",
  },
  {
    id: "booking-2",
    service: {
      id: "3",
      title: "GB Explorer Tours",
      type: "tours",
      location: "Skardu",
      image: "/placeholder.svg?height=100&width=100",
    },
    date: "2023-12-20",
    participants: 2,
    status: "pending",
    totalPrice: "$200",
  },
]

const recommendedServices = [
  {
    id: "1",
    title: "Serena Hotel",
    type: "accommodation",
    location: "Gilgit City",
    price: "$200/night",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Mountain View Restaurant",
    type: "food",
    location: "Hunza Valley",
    price: "$$",
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "GB Explorer Tours",
    type: "tours",
    location: "Skardu",
    price: "$100/day",
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
  },
]

const recentActivity = [
  {
    id: "activity-1",
    type: "review",
    service: "Serena Hotel",
    date: "2 days ago",
    rating: 5,
  },
  {
    id: "activity-2",
    type: "booking",
    service: "GB Explorer Tours",
    date: "1 week ago",
    status: "confirmed",
  },
  {
    id: "activity-3",
    type: "view",
    service: "Mountain View Restaurant",
    date: "2 weeks ago",
  },
]

const savedServices = [
  {
    id: "1",
    title: "Serena Hotel",
    type: "accommodation",
    location: "Gilgit City",
    price: "$200/night",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "Fairy Meadows Cottage",
    type: "accommodation",
    location: "Fairy Meadows",
    price: "$150/night",
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function TouristDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [services, setServices] = useState<any[]>([])
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  
  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/login")
      return
    }
    setLoadingBookings(true)
    fetch(`/api/bookings?userId=${user.id || user._id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings")
        const data = await res.json()
        setBookings(data)
      })
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false))
  }, [user, router])
  
  useEffect(() => {
    // Fetch all services for recommendations
    fetch('/api/services')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch services')
        const data = await res.json()
        setServices(data)
      })
      .catch(() => setServices([]))
  }, [])

  useEffect(() => {
    if (!user) return
    // Fetch recent reviews
    fetch(`/api/services/review?userId=${user.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch reviews')
        const data = await res.json()
        setRecentReviews(data)
      })
      .catch(() => setRecentReviews([]))
    // Fetch recent bookings
    fetch(`/api/bookings?userId=${user.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch bookings')
        const data = await res.json()
        setRecentBookings(data)
      })
      .catch(() => setRecentBookings([]))
  }, [user])
  
  const handleLogout = () => {
    logout()
    router.push("/")
  }
  
  if (!user) {
    return null
  }
  
  // Filter for upcoming bookings
  const now = new Date()
  const upcomingBookings = bookings.filter(
    (b) =>
      (b.status === "confirmed" || b.status === "pending") &&
      new Date(b.checkIn) >= now
  )
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/tourist/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container flex-1 items-start py-6 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Sidebar - Desktop */}
        <aside className="fixed top-0 z-30 hidden h-screen w-full shrink-0 border-r md:sticky md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex h-14 items-center border-b px-4 py-2">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image 
                  src="/placeholder.svg?height=30&width=30" 
                  alt="GBConnect Logo" 
                  width={30} 
                  height={30} 
                  className="rounded"
                />
                <span>GBConnect</span>
              </Link>
            </div>
            <div className="flex items-center gap-4 px-4 py-2">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <nav className="grid gap-1 px-2 pt-4">
              <Link
                href="/dashboard/tourist"
                className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/services"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Search className="h-4 w-4" />
                <span>Explore</span>
              </Link>
              <Link
                href="/dashboard/tourist/bookings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Calendar className="h-4 w-4" />
                <span>My Bookings</span>
              </Link>
              <Link
                href="/dashboard/tourist/saved"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Heart className="h-4 w-4" />
                <span>Saved</span>
              </Link>
              <Link
                href="/dashboard/tourist/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </nav>
            <div className="mt-auto">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex w-full flex-col gap-8">
          {/* Welcome Section */}
          <section>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your travel plans.
                </p>
              </div>
              <Button asChild>
                <Link href="/services">
                  <Search className="mr-2 h-4 w-4" />
                  Discover Services
                </Link>
              </Button>
            </div>
            
            {user.location && (
              <div className="mt-4 flex items-center rounded-lg border bg-card p-4">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Current Location</div>
                  <div className="text-sm text-muted-foreground">{user.location}</div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto gap-1">
                  Change
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </section>
          
          {/* Upcoming Bookings */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Upcoming Bookings</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/tourist/bookings" className="gap-1">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-4">
              {loadingBookings ? (
                <div className="flex h-32 items-center justify-center">
                  <span>Loading bookings...</span>
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="grid gap-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr]">
                          <div className="relative h-full">
                            <Image
                              src={booking.service?.image || "/placeholder.svg"}
                              alt={booking.service?.title || "Service"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div className="mb-1 flex items-center justify-between">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                              <span className="font-medium text-primary">{booking.totalPrice}</span>
                            </div>
                            <h3 className="font-semibold">{booking.service?.title || "Service"}</h3>
                            <div className="mt-1 flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              <span>{booking.service?.location || "Location"}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>
                                  {booking.checkIn && booking.checkOut
                                    ? `${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}`
                                    : booking.date
                                    ? new Date(booking.date).toLocaleDateString()
                                    : 'Date not available'}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <User className="mr-1 h-3 w-3" />
                                <span>{booking.guests || booking.participants} {booking.guests ? "guests" : "participants"}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end gap-2">
                              <Button variant="outline" size="sm">View Details</Button>
                              {booking.status === "pending" && (
                                <Button variant="destructive" size="sm">Cancel</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium">No upcoming bookings</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start exploring services and book your next adventure!
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/services">Discover Services</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            </section>

{/* Recommended Services */}
<section>
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold tracking-tight">Recommended Services</h2>
    <Button variant="ghost" size="sm" asChild>
      <Link href="/services" className="gap-1">
        View all
        <ChevronRight className="h-4 w-4" />
      </Link>
    </Button>
  </div>

  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {services
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
      .map((service) => (
        <Card key={service.id}>
          <CardContent>
            <Image
              src={service.images?.[0] || "/placeholder.svg"}
              alt={service.title}
              width={300}
              height={180}
              style={{ objectFit: "cover", width: "100%", height: "180px", borderRadius: "8px" }}
              className="mb-2"
            />
            <div className="font-semibold text-lg">{service.title}</div>
            <div className="text-muted-foreground text-sm flex items-center gap-1"><MapPin className="h-4 w-4" />{service.location}</div>
            <div className="text-sm">Price: {service.price}</div>
            <div className="text-sm">Rating: {service.rating ?? 'N/A'}</div>
            <Button asChild className="mt-2"><Link href={`/services/${service.id}`}>View Details</Link></Button>
          </CardContent>
        </Card>
      ))}
  </div>
</section>

{/* Recent Activity */}
<section>
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
  </div>

  <div className="mt-4 space-y-2">
    {/* Recent reviews */}
    {recentReviews.slice(0, 3).map((review) => (
      <div key={review.id} className="flex items-center justify-between border rounded p-2">
        <span>review</span>
        <span className="text-muted-foreground text-xs">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
        <span className="font-medium">{review.service?.title || ''}</span>
      </div>
    ))}
    {/* Recent bookings */}
    {recentBookings.slice(0, 3).map((booking) => (
      <div key={booking.id} className="flex items-center justify-between border rounded p-2">
        <span>booking</span>
        <span className="text-muted-foreground text-xs">{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''}</span>
        <span className="font-medium">{booking.service?.title || ''}</span>
      </div>
    ))}
  </div>
</section>

</main>
</div>
</div>
)
}