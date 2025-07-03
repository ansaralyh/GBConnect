"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProviderBookingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    setLoading(true)
    fetch(`/api/bookings?providerId=${user.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings")
        const data = await res.json()
        setBookings(data)
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [user, router])

  if (!user) return null

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      {loading ? (
        <div>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-muted-foreground">No bookings found.</div>
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
                <div className="text-sm">Guest: {booking.userId}</div>
                <div className="text-sm">Guests: {booking.guests}</div>
                <div className="text-sm font-semibold">Total: {booking.totalPrice}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button asChild className="mt-8">
        <Link href="/dashboard/provider">Back to Dashboard</Link>
      </Button>
    </div>
  )
} 