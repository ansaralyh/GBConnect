import { ReviewForm } from "@/components/reviews/review-form"

export default function ReviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ReviewForm serviceId={params.id} />
      </main>
    </div>
  )
}
