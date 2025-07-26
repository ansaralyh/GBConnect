"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, ChevronRight, Plus, Users, Check, X, BarChart3, ShoppingBag, MessageSquare, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { BusinessAnalytics } from "@/components/dashboard/business-analytics"
import { formatCurrency } from "@/lib/utils"

export function ProviderDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [totalServices, setTotalServices] = useState(0)
  const [bookings, setBookings] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [pendingBookings, setPendingBookings] = useState(0)

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

  useEffect(() => {
    if (!user) return;
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/services/provider?providerId=${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data);
          setTotalServices(data.length);
        } else {
          setServices([]);
          setTotalServices(0);
        }
      } catch (err) {
        setServices([]);
        setTotalServices(0);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingBookings(true);
    fetch(`/api/bookings?providerId=${user.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
        
        // Calculate dynamic metrics
        const revenue = data.reduce((sum: number, booking: any) => {
          return sum + (Number(booking.totalPrice) || 0);
        }, 0);
        setTotalRevenue(revenue);
        
        const pending = data.filter((booking: any) => 
          booking.status === 'pending' || booking.status === 'confirmed'
        ).length;
        setPendingBookings(pending);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false));
  }, [user]);

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Handle edit
  const handleEditService = (service: any) => {
    router.push(`/dashboard/provider/services/${service._id}/edit`);
  };

  // Handle delete
  const handleDeleteService = async (service: any) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/services/${service._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId: user.id }),
      });
      if (!res.ok) throw new Error("Failed to delete service");
      setServices((prev) => prev.filter((s) => s._id !== service._id));
      setTotalServices((prev) => prev - 1);
    } catch (err) {
      alert("Error deleting service");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format PKR
  const formatPKR = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-PK')}`;
  };

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
    <div className="flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-muted/40 border-r mr-8 p-6">
        <nav className="flex flex-col gap-4 flex-1">
          <Link href="/dashboard/provider" className="font-medium text-base hover:text-primary">Dashboard</Link>
          <Link href="/dashboard/provider/services" className="font-medium text-base hover:text-primary">Services</Link>
          <Link href="/dashboard/provider/settings" className="font-medium text-base hover:text-primary">Settings</Link>
          
          {/* Logout button at bottom */}
          <div className="mt-auto pt-4 border-t">
            <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1">
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
                    <div className="text-2xl font-bold">{totalServices}</div>
                    <p className="text-xs text-muted-foreground">&nbsp;</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingBookings}</div>
                    <p className="text-xs text-muted-foreground">&nbsp;</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatPKR(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">&nbsp;</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">&nbsp;</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Your latest booking requests</CardDescription>
                </CardHeader>
                <CardContent className="pl-2 pb-4">
                  {loadingBookings ? (
                    <div className="text-center py-4">Loading bookings...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-muted-foreground text-center py-4">No booking data yet</div>
                  ) : (
                    <div className="space-y-2">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center gap-3 border-b pb-2 last:border-b-0 last:pb-0">
                          <Image
                            src={booking.service?.images?.[0] || "/placeholder.svg"}
                            alt={booking.service?.title || "Service"}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{booking.service?.title || "Service"}</div>
                            <div className="text-xs text-muted-foreground">Guest: {booking.guestName || 'Unknown Guest'} &bull; {booking.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {loadingBookings ? (
                      <div className="text-center py-4">Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                      <div className="text-muted-foreground text-center py-4">No booking data yet</div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Image
                                src={booking.service?.images?.[0] || "/placeholder.svg"}
                                alt={booking.service?.title || "Service"}
                                width={48}
                                height={48}
                                className="rounded"
                              />
                              <div>
                                <div className="font-semibold">{booking.service?.title || "Service"}</div>
                                <div className="text-xs text-muted-foreground">{booking.status}</div>
                                <div className="text-xs">{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ""} - {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ""}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-sm">Guest: {booking.guestName || 'Unknown Guest'}</div>
                              <div className="text-sm">Guests: {booking.guests}</div>
                              <div className="text-sm font-semibold">Total: {formatPKR(Number(booking.totalPrice) || 0)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                  <div className="text-muted-foreground text-center py-4">No message data yet</div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" className="ml-auto">
                    <Link href="/dashboard/provider/messages">View All</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold mt-5">My Services</h2>
            
          </div>
          {loading ? (
            <div>Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(services) && services.map((service) => (
                <Card key={service._id}>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">{service.description}</div>
                    <div className="mb-2 font-semibold">Price: {formatPKR(Number(service.price) || 0)}</div>
                    <div className="mb-2">Location: {service.location}</div>
                    {/* Images preview */}
                    {service.images && service.images.length > 0 && (
                      <div className="flex gap-2">
                        {service.images.map((img: string, idx: number) => (
                          <Image key={idx} src={img} alt="Service Image" width={60} height={60} className="rounded" />
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEditService(service)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteService(service)} disabled={!user}>Delete</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
