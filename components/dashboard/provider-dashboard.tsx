"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, ChevronRight, Plus, Users, Check, X, BarChart3, ShoppingBag, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { BusinessAnalytics } from "@/components/dashboard/business-analytics"
import { formatCurrency } from "@/lib/utils"

// Mock data
const bookings = [
  {
    id: "booking-1",
    service: {
      id: "1",
      title: "Deluxe Room",
      type: "accommodation",
      image: "/placeholder.svg?height=100&width=100",
    },
    customer: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-12-15",
    checkOut: "2023-12-18",
    guests: 2,
    status: "pending",
    totalPrice: "$600",
  },
  {
    id: "booking-2",
    service: {
      id: "2",
      title: "Family Suite",
      type: "accommodation",
      image: "/placeholder.svg?height=100&width=100",
    },
    customer: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-12-20",
    checkOut: "2023-12-25",
    guests: 4,
    status: "confirmed",
    totalPrice: "$1000",
  },
]

const services = [
  {
    id: "1",
    title: "Deluxe Room",
    type: "accommodation",
    price: "$200/night",
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
    views: 245,
    bookings: 12,
    rating: 4.8,
  },
  {
    id: "2",
    title: "Family Suite",
    type: "accommodation",
    price: "$350/night",
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
    views: 180,
    bookings: 8,
    rating: 4.7,
  },
  {
    id: "3",
    title: "Standard Room",
    type: "accommodation",
    price: "$120/night",
    status: "inactive",
    image: "/placeholder.svg?height=100&width=100",
    views: 95,
    bookings: 3,
    rating: 4.5,
  },
]

const reviews = [
  {
    id: "review-1",
    service: "Deluxe Room",
    customer: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2 days ago",
    comment:
      "Amazing room with stunning views. The service was excellent and the staff was very friendly. Would definitely stay here again!",
  },
  {
    id: "review-2",
    service: "Family Suite",
    customer: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    date: "1 week ago",
    comment:
      "Great room for families. Spacious and comfortable. The only downside was that the Wi-Fi was a bit slow at times.",
  },
]

const notifications = [
  {
    id: "notification-1",
    type: "message",
    content: "New message from John Smith",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notification-2",
    type: "booking",
    content: "New booking confirmed",
    time: "Yesterday",
    read: false,
  },
  {
    id: "notification-3",
    type: "review",
    content: "New 5-star review received",
    time: "2 days ago",
    read: true,
  },
]

// Mock data for recent bookings
const recentBookings = [
  {
    id: "b1",
    serviceName: "Hunza Valley Tour",
    customerName: "Asad Khan",
    date: "2024-05-15",
    status: "confirmed",
    amount: 45000,
  },
  {
    id: "b2",
    serviceName: "Fairy Meadows Trek",
    customerName: "Fatima Ahmed",
    date: "2024-05-18",
    status: "pending",
    amount: 38000,
  },
  {
    id: "b3",
    serviceName: "Skardu Adventure",
    customerName: "Imran Ali",
    date: "2024-05-22",
    status: "confirmed",
    amount: 52000,
  },
]

// Mock data for recent messages
const recentMessages = [
  {
    id: "m1",
    from: "Asad Khan",
    message: "Is the tour still available for next week?",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "m2",
    from: "Fatima Ahmed",
    message: "Do you provide transportation from Islamabad?",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: "m3",
    from: "Imran Ali",
    message: "Thanks for the great service!",
    time: "1 day ago",
    unread: false,
  },
]

export function ProviderDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/login")
      return
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user || user.role !== "provider") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">You need to be logged in as a service provider to view this page.</p>
          <Button asChild className="mt-4">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your business today.</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild>
            <Link href="/dashboard/provider/services/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Service
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+2 added this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+4 since yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(345000)}</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">New inquiries</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your latest booking requests</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pb-4">
              <div className="overflow-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-semibold">Service</th>
                      <th className="py-2 text-left font-semibold">Customer</th>
                      <th className="py-2 text-left font-semibold">Date</th>
                      <th className="py-2 text-left font-semibold">Amount</th>
                      <th className="py-2 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="py-2">{booking.serviceName}</td>
                        <td className="py-2">{booking.customerName}</td>
                        <td className="py-2">{booking.date}</td>
                        <td className="py-2">{formatCurrency(booking.amount)}</td>
                        <td className="py-2">
                          <Badge variant={booking.status === "confirmed" ? "success" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="ml-auto">
                <Link href="/dashboard/provider/bookings">View All</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <BusinessAnalytics />
        </TabsContent>

        <TabsContent value="bookings">
          {/* Booking Management */}
          <section>
            <Card>
              <CardHeader>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>Manage your upcoming and pending bookings</CardDescription>
                  </div>
                  <Tabs defaultValue="pending">
                    <TabsList>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="rounded-lg border">
                      <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr]">
                        <div className="relative h-full">
                          <Image
                            src={booking.service.image || "/placeholder.svg"}
                            alt={booking.service.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="mb-1 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{booking.service.title}</h3>
                              <p className="text-sm text-muted-foreground">Booking #{booking.id}</p>
                            </div>
                            <Badge
                              className={
                                booking.status === "confirmed"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-yellow-500 hover:bg-yellow-600"
                              }
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>
                                {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                                {new Date(booking.checkOut).toLocaleDateString()} (
                                {(new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                                  (1000 * 60 * 60 * 24)}{" "}
                                nights)
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-1 h-3 w-3" />
                              <span>{booking.guests} guests</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={booking.customer.avatar || "/placeholder.svg"}
                                alt={booking.customer.name}
                              />
                              <AvatarFallback>{booking.customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{booking.customer.name}</span>
                          </div>
                          <div className="mt-3 flex justify-end gap-2">
                            {booking.status === "pending" ? (
                              <>
                                <Button variant="outline" size="sm" className="gap-1">
                                  <X className="h-4 w-4" />
                                  Decline
                                </Button>
                                <Button size="sm" className="gap-1">
                                  <Check className="h-4 w-4" />
                                  Confirm
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button variant="outline" size="sm">
                                  Message Guest
                                </Button>
                                <Button size="sm">View Details</Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="ml-auto gap-1">
                  <Link href="/dashboard/provider/bookings">
                    View all bookings
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Your latest messages from customers</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pb-4">
              <div className="overflow-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-semibold">From</th>
                      <th className="py-2 text-left font-semibold">Message</th>
                      <th className="py-2 text-left font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMessages.map((message) => (
                      <tr key={message.id} className="border-b">
                        <td className="py-2">{message.from}</td>
                        <td className="py-2">{message.message}</td>
                        <td className="py-2">{message.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="ml-auto">
                <Link href="/dashboard/provider/messages">View All</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
