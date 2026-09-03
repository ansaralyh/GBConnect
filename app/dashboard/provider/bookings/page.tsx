"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Check, Eye, Loader2, Trash2, ArrowLeft, Calendar, Users, MapPin, Mail, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

function statusVariant(status: string) {
  switch (status) {
    case "confirmed":
      return "default"
    case "pending":
      return "secondary"
    case "cancelled":
    case "rejected":
      return "destructive"
    case "completed":
      return "outline"
    default:
      return "secondary"
  }
}

function formatPKR(amount: number) {
  return `Rs ${Number(amount || 0).toLocaleString("en-PK")}`
}

export default function ProviderBookingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [detailBooking, setDetailBooking] = useState<any | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const fetchBookings = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings?providerId=${user.id}`)
      if (!res.ok) throw new Error("Failed to fetch bookings")
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchBookings()
  }, [user, router])

  const handleConfirm = async (booking: any) => {
    const id = booking.id || booking._id
    setActionId(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to confirm booking")

      setBookings((prev) =>
        prev.map((b) => ((b.id || b._id) === id ? { ...b, status: "confirmed" } : b)),
      )
      if (detailBooking && (detailBooking.id || detailBooking._id) === id) {
        setDetailBooking({ ...detailBooking, status: "confirmed" })
      }
      toast({ title: "Booking confirmed", description: "The guest booking is now confirmed." })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Could not confirm",
        description: err.message || "Something went wrong",
      })
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const id = deleteTarget.id || deleteTarget._id
    setActionId(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to delete booking")

      setBookings((prev) => prev.filter((b) => (b.id || b._id) !== id))
      setDeleteTarget(null)
      setDetailOpen(false)
      toast({ title: "Booking deleted", description: "The booking has been removed." })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Could not delete",
        description: err.message || "Something went wrong",
      })
    } finally {
      setActionId(null)
    }
  }

  const openDetails = async (booking: any) => {
    const id = booking.id || booking._id
    setDetailBooking(booking)
    setDetailOpen(true)
    try {
      const res = await fetch(`/api/bookings/${id}`)
      if (res.ok) {
        const data = await res.json()
        setDetailBooking(data)
      }
    } catch {
      // keep list data if detail fetch fails
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">All Bookings</h1>
          <p className="text-sm text-muted-foreground">Confirm, review, or remove guest bookings.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/provider">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const id = booking.id || booking._id
            const busy = actionId === id
            const canConfirm = booking.status === "pending" || booking.status === "rejected"

            return (
              <div
                key={id}
                className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={booking.service?.images?.[0] || booking.serviceSnapshot?.images?.[0] || "/placeholder.svg"}
                    alt={booking.service?.title || "Service"}
                    width={56}
                    height={56}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        {booking.service?.title || booking.serviceSnapshot?.title || "Service"}
                      </span>
                      <Badge variant={statusVariant(booking.status) as any} className="capitalize">
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "—"} –{" "}
                      {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "—"}
                    </div>
                    <div className="mt-1 text-sm">
                      Guest: {booking.guestName || booking.user?.name || "Unknown Guest"} · Guests:{" "}
                      {booking.guests}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-primary">
                      {formatPKR(Number(booking.totalPrice) || 0)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <Button variant="outline" size="sm" onClick={() => openDetails(booking)} disabled={busy}>
                    <Eye className="mr-1.5 h-4 w-4" />
                    View Detail
                  </Button>
                  {canConfirm && (
                    <Button size="sm" onClick={() => handleConfirm(booking)} disabled={busy}>
                      {busy ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-1.5 h-4 w-4" />
                      )}
                      Confirm
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(booking)}
                    disabled={busy}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* View Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription>Full information for this guest booking.</DialogDescription>
          </DialogHeader>

          {detailBooking && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Image
                  src={
                    detailBooking.service?.images?.[0] ||
                    detailBooking.serviceSnapshot?.images?.[0] ||
                    "/placeholder.svg"
                  }
                  alt="Service"
                  width={72}
                  height={72}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {detailBooking.service?.title || detailBooking.serviceSnapshot?.title || "Service"}
                  </p>
                  <Badge variant={statusVariant(detailBooking.status) as any} className="mt-1 capitalize">
                    {detailBooking.status}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 rounded-lg border p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {detailBooking.checkIn ? new Date(detailBooking.checkIn).toLocaleDateString() : "—"} –{" "}
                    {detailBooking.checkOut ? new Date(detailBooking.checkOut).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{detailBooking.guests} guest(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {detailBooking.service?.location ||
                      detailBooking.serviceSnapshot?.location ||
                      "Location N/A"}
                  </span>
                </div>
                <div className="font-semibold text-primary">
                  Total: {formatPKR(Number(detailBooking.totalPrice) || 0)}
                </div>
              </div>

              <div className="rounded-lg border p-3 text-sm">
                <p className="mb-2 font-medium">Guest</p>
                <p>{detailBooking.guestName || "Unknown Guest"}</p>
                {detailBooking.guestEmail && (
                  <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {detailBooking.guestEmail}
                  </p>
                )}
                {detailBooking.guestPhone && (
                  <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {detailBooking.guestPhone}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {detailBooking &&
              (detailBooking.status === "pending" || detailBooking.status === "rejected") && (
                <Button
                  onClick={() => handleConfirm(detailBooking)}
                  disabled={actionId === (detailBooking.id || detailBooking._id)}
                >
                  <Check className="mr-1.5 h-4 w-4" />
                  Confirm
                </Button>
              )}
            <Button variant="destructive" onClick={() => setDeleteTarget(detailBooking)}>
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete booking?</DialogTitle>
            <DialogDescription>
              This will permanently remove the booking
              {deleteTarget?.guestName ? ` for ${deleteTarget.guestName}` : ""}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!!actionId}
            >
              {actionId ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
