import { MyBookings } from "@/components/dashboard/my-bookings"

export default function MyBookingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <MyBookings />
      </main>
    </div>
  )
}
