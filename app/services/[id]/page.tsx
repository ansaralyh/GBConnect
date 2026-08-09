import { ServiceDetails } from "@/components/services/service-details"

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ServiceDetails id={id} />
      </main>
    </div>
  )
}
