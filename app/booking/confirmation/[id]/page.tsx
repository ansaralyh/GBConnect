import { BookingConfirmation } from "@/components/booking/booking-confirmation"

export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <BookingConfirmation bookingId={params.id} />
      </main>
    </div>
  )
}
