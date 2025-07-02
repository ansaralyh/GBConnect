import { BookingProcess } from "@/components/booking/booking-process"

export default function BookingPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <BookingProcess serviceId={params.id} />
      </main>
    </div>
  )
}
