"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(3)

  // Simulate fetching notification count
  useEffect(() => {
    // In a real app, this would be an API call or WebSocket connection
    const interval = setInterval(() => {
      // Randomly add a notification sometimes
      if (Math.random() > 0.8) {
        setUnreadCount((prev) => prev + 1)
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </Link>
    </Button>
  )
}
