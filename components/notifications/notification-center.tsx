"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Filter,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Star,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/auth-context"

// Mock notification data
const mockNotifications = [
  {
    id: "notif-1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your booking at Serena Hotel has been confirmed.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isRead: false,
    actionUrl: "/dashboard/tourist",
    icon: Calendar,
  },
  {
    id: "notif-2",
    type: "message",
    title: "New Message",
    message: "You have a new message from Hunza Guides.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
    actionUrl: "/messages",
    icon: MessageSquare,
  },
  {
    id: "notif-3",
    type: "payment",
    title: "Payment Successful",
    message: "Your payment of $250 for Mountain View Restaurant has been processed.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isRead: true,
    actionUrl: "/dashboard/tourist",
    icon: CreditCard,
  },
  {
    id: "notif-4",
    type: "review",
    title: "Review Request",
    message: "Please leave a review for your recent stay at Fairy Meadows Cottages.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    actionUrl: "/services/4/review",
    icon: Star,
  },
  {
    id: "notif-5",
    type: "booking",
    title: "Upcoming Booking",
    message: "Your booking at Serena Hotel is in 2 days. Get ready for your trip!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
    actionUrl: "/dashboard/tourist",
    icon: Clock,
  },
]

export function NotificationCenter() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  if (!user) {
    router.push("/login")
    return null
  }

  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notif.isRead
    return notif.type === activeTab
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/tourist">
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>
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

      <main className="container flex-1 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "No new notifications"}
              </p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab("all")}>All Notifications</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("unread")}>Unread</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("booking")}>Bookings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("message")}>Messages</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("payment")}>Payments</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("review")}>Reviews</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                Mark all as read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
                Clear all
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="all" className="relative">
                All
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="booking">Bookings</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
              <TabsTrigger value="review">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications
                  </CardTitle>
                  <CardDescription>
                    {filteredNotifications.length > 0
                      ? `Showing ${filteredNotifications.length} notification${
                          filteredNotifications.length !== 1 ? "s" : ""
                        }`
                      : "No notifications to display"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="max-h-[600px]">
                    {filteredNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Bell className="mb-2 h-12 w-12 text-muted-foreground/50" />
                        <h3 className="text-lg font-medium">No notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          You don't have any {activeTab !== "all" ? activeTab : ""} notifications at the moment.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications.map((notification) => {
                          const NotificationIcon = notification.icon
                          return (
                            <div
                              key={notification.id}
                              className={`relative flex items-start gap-4 p-4 hover:bg-muted/50 ${
                                !notification.isRead ? "bg-muted/30" : ""
                              }`}
                            >
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                  notification.type === "booking"
                                    ? "bg-blue-100 text-blue-600"
                                    : notification.type === "message"
                                      ? "bg-green-100 text-green-600"
                                      : notification.type === "payment"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-amber-100 text-amber-600"
                                }`}
                              >
                                <NotificationIcon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{notification.title}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(notification.timestamp), "MMM d, h:mm a")}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                                <div className="mt-2">
                                  <Button variant="link" asChild className="h-auto p-0 text-sm">
                                    <Link href={notification.actionUrl}>
                                      View Details
                                      <ChevronRight className="ml-1 h-3 w-3" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Mark as read</span>
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
