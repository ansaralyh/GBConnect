import { ServiceForm } from "@/components/services/service-form"

export default function NewServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ServiceForm mode="create" />
      </main>
    </div>
  )
}
