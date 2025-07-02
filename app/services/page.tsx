import { ServiceListings } from "@/components/services/service-listings"

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ServiceListings />
      </main>
    </div>
  )
}
