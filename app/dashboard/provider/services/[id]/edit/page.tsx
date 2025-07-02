import { ServiceForm } from "@/components/services/service-form"

export default function EditServicePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ServiceForm mode="edit" serviceId={params.id} />
      </main>
    </div>
  )
}
