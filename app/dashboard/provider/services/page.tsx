import { ServiceManagement } from "@/components/services/service-management"

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ServiceManagement />
      </main>
    </div>
  )
}
