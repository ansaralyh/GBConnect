"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  Hotel,
  Utensils,
  Car,
  Mountain,
  Star,
  Users,
  Building,
  CheckCircle,
  Search,
  MapPin,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchForm } from "@/components/search/search-form"

function formatPrice(price: unknown) {
  if (price == null || price === "") return "Price on request"
  if (typeof price === "number") return `PKR ${price.toLocaleString()}`
  const raw = String(price).trim()
  if (/^pkr/i.test(raw) || raw.includes("₨")) return raw
  if (/^\d+(\.\d+)?$/.test(raw)) return `PKR ${Number(raw).toLocaleString()}`
  return raw
}

function formatCategory(category: unknown) {
  if (!category) return "Service"
  return String(category)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function ServiceTile({ service }: { service: any }) {
  const id = service.id || service._id
  const rating = service.rating != null && service.rating !== "" ? Number(service.rating) : null

  return (
    <Link
      href={`/services/${id}`}
      className="service-card group flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={service.images?.[0] || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary shadow-sm backdrop-blur-sm">
            {formatCategory(service.category)}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {rating != null && !Number.isNaN(rating) ? rating.toFixed(1) : "New"}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {service.title}
          </h3>
          <p className="mt-1.5 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="truncate">{service.location || "Gilgit Baltistan"}</span>
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">From</p>
            <p className="font-display text-base font-bold text-primary">{formatPrice(service.price)}</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            View
            <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function LandingPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getServicesByCategory = (category: string) => {
    if (category === "all") return services
    if (category === "accommodation") return services.filter((s) => s.category?.toLowerCase() === "accommodation")
    if (category === "food") return services.filter((s) => s.category?.toLowerCase() === "food")
    if (category === "transport") return services.filter((s) => s.category?.toLowerCase() === "transportation")
    if (category === "tours") return services.filter((s) => s.category?.toLowerCase() === "tours")
    return []
  }

  const steps = [
    { icon: Search, title: "Search", description: "Find stays, food, rides, and tours by place and dates." },
    { icon: CheckCircle, title: "Select", description: "Pick verified locals you trust." },
    { icon: CalendarIcon, title: "Book", description: "Reserve in a few taps." },
    { icon: Star, title: "Experience", description: "Go, enjoy, and leave a review." },
  ]

  const destinations = [
    {
      name: "Hunza Valley",
      description: "Ancient forts and blooming orchards.",
      image: "/images/fyp.pic5.jpg",
    },
    {
      name: "Skardu",
      description: "Cold desert and crystal lakes.",
      image: "/images/fyp.pic6.jpg",
    },
    {
      name: "Fairy Meadows",
      description: "Camp under Nanga Parbat.",
      image: "/images/fyp.pic7.jpg",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero — copy left, filter panel right */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 scale-105 animate-kenburns bg-cover bg-center"
              style={{ backgroundImage: "url('/images/landing-image.jpeg')" }}
            />
            <div className="absolute inset-0 bg-hero-pattern" />
            <div className="absolute inset-0 gb-grain opacity-30" />
          </div>

          <div className="container relative z-10 flex min-h-[100svh] items-center py-24 lg:py-28">
            <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div className="max-w-2xl text-white">
                <p className="animate-reveal font-display text-sm font-medium uppercase tracking-[0.35em] text-white/80 sm:text-base">
                  GBConnect
                </p>
                <h1 className="animate-reveal animate-reveal-delay-1 mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
                  The mountains, with locals who know them
                </h1>
                <p className="animate-reveal animate-reveal-delay-2 mt-5 max-w-xl text-base text-white/85 sm:text-lg">
                  Book authentic stays, meals, rides, and guides across Gilgit Baltistan.
                </p>
                <div className="animate-reveal animate-reveal-delay-3 mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                    <Link href="/services">Explore services</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    asChild
                  >
                    <Link href="/signup?role=provider">List your service</Link>
                  </Button>
                </div>
              </div>

              <div className="animate-reveal animate-reveal-delay-2 w-full max-w-md justify-self-start lg:max-w-none lg:justify-self-end">
                <div className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-2xl shadow-black/25 backdrop-blur-md sm:p-6">
                  <p className="mb-1 font-display text-lg font-semibold text-foreground">Find your trip</p>
                  <p className="mb-4 text-sm text-muted-foreground">Filter by place, dates, and guests</p>
                  <SearchForm variant="panel" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
              <p className="mt-3 text-muted-foreground">Four simple steps from search to the trail.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="animate-fade-up group relative opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  <div className="relative h-full overflow-hidden rounded-2xl border border-primary/15 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/10">
                    <div className="absolute -right-1 -top-1 font-display text-6xl font-bold leading-none text-primary/25 transition-colors group-hover:text-primary/40">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-[hsl(var(--gb-glacier))/0.2] text-primary ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < 3 && (
                    <ChevronRight className="absolute -right-3.5 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 text-primary/40 lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured services */}
        <section className="relative overflow-hidden border-y border-border/60 bg-secondary/50 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(152_40%_40%/0.08),transparent_50%)]" />
          <div className="container relative">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Discover</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Featured services</h2>
                <p className="mt-2 text-muted-foreground">Top picks from hosts across the valleys</p>
              </div>
              <Button variant="outline" className="border-primary/25 bg-card hover:bg-primary hover:text-primary-foreground" asChild>
                <Link href="/services">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border border-primary/10 bg-card/80 p-2 shadow-sm backdrop-blur-sm">
                {[
                  { value: "all", label: "All", icon: null },
                  { value: "accommodation", label: "Stay", icon: Hotel },
                  { value: "food", label: "Food", icon: Utensils },
                  { value: "transport", label: "Rides", icon: Car },
                  { value: "tours", label: "Tours", icon: Mountain },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-xl border border-transparent px-4 py-2 text-muted-foreground data-[state=active]:border-primary/20 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {["all", "accommodation", "food", "transport", "tours"].map((cat) => (
                <TabsContent key={cat} value={cat} className="mt-0">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {loading ? (
                      <p className="text-muted-foreground">Loading services…</p>
                    ) : getServicesByCategory(cat).length === 0 ? (
                      <p className="col-span-full rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center text-muted-foreground">
                        No services in this category yet.
                      </p>
                    ) : (
                      getServicesByCategory(cat).map((service) => (
                        <ServiceTile key={service.id || service._id} service={service} />
                      ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Destinations — image-forward, not card-heavy */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mb-12 max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Popular destinations</h2>
              <p className="mt-3 text-muted-foreground">Places that stay with you long after the road home.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {destinations.map((destination, index) => (
                <Link
                  key={destination.name}
                  href={`/services?location=${encodeURIComponent(destination.name)}`}
                  className={`group relative overflow-hidden rounded-2xl ${index === 0 ? "md:col-span-2 md:min-h-[380px]" : "min-h-[280px]"}`}
                >
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="font-display text-2xl font-semibold">{destination.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{destination.description}</p>
                    <span className="mt-3 inline-flex items-center text-sm font-medium text-white/90">
                      Explore
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--gb-glacier))/0.12]" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Built for the people of GB</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                GBConnect links travelers with local hosts — so tourism strengthens communities instead of bypassing them.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
                <Users className="mb-4 h-9 w-9 text-primary" />
                <h3 className="font-display text-xl font-semibold">For travelers</h3>
                <p className="mt-2 text-muted-foreground">
                  Verified local services and experiences straight from the community.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
                <Building className="mb-4 h-9 w-9 text-primary" />
                <h3 className="font-display text-xl font-semibold">For providers</h3>
                <p className="mt-2 text-muted-foreground">
                  Reach guests who value authentic hospitality — and grow on your terms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20 text-primary-foreground md:py-28">
          <div className="absolute inset-0 bg-primary" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, hsl(188 55% 38% / 0.5), transparent 50%), radial-gradient(circle at 80% 20%, hsl(150 40% 40% / 0.4), transparent 40%)",
            }}
          />
          <div className="container relative text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Ready for Gilgit Baltistan?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Join travelers and hosts already exploring the northern valleys together.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link href="/signup?role=tourist">Sign up as traveler</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/signup?role=provider">List your service</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
