import { ServiceDetails } from "@/components/services/service-details"

export default function ServiceDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ServiceDetails id={params.id} />
      </main>
    </div>
  )
}
