"use client"

import { Calendar as CalendarIcon } from "lucide-react" 
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { SearchForm } from "@/components/search/search-form"

export function LandingPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/landing-image.jpeg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 bg-hero-pattern"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-4xl text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Connect with the Heart of Gilgit Baltistan
              </h1>
              <p className="mt-6 text-xl">
                Discover authentic local experiences and connect with trusted service providers in the breathtaking
                regions of Gilgit Baltistan.
              </p>

              <div className="mt-10">
                <SearchForm className="mx-auto max-w-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How GBConnect Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Simple steps to discover and connect with local service providers
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Search,
                  title: "Search",
                  description: "Find services based on your location and preferences",
                },
                {
                  icon: CheckCircle,
                  title: "Select",
                  description: "Choose from verified local service providers",
                },
                {
                  icon: CalendarIcon,
                  title: "Book",
                  description: "Reserve your experience with secure booking",
                },
                {
                  icon: Star,
                  title: "Experience",
                  description: "Enjoy authentic experiences and leave reviews",
                },
              ].map((step, index) => (
                <div key={index} className="group relative">
                  <div
                    className="animate-fade-up rounded-lg border bg-card p-6 opacity-0"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-medium">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  {index < 3 && (
                    <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 transform lg:block">
                      <ChevronRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Services</h2>
                <p className="mt-2 text-lg text-muted-foreground">Discover top-rated services in Gilgit Baltistan</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/services">View All Services</Link>
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="accommodation">
                  <Hotel className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Accommodation</span>
                </TabsTrigger>
                <TabsTrigger value="food">
                  <Utensils className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Food & Dining</span>
                </TabsTrigger>
                <TabsTrigger value="transport">
                  <Car className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Transportation</span>
                </TabsTrigger>
                <TabsTrigger value="tours">
                  <Mountain className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Tours & Activities</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {[
                    {
                      id: 1,
                      title: "Serena Hotel",
                      type: "accommodation",
                      location: "Gilgit City",
                      price: "PKR 35,000/night",
                      rating: 4.8,
                      image: "/images/fyp.pic1.jpg",
                    },
                    {
                      id: 2,
                      title: "Mountain View Restaurant",
                      type: "food",
                      location: "Hunza Valley",
                      price: "PKR 2,500",
                      rating: 4.5,
                      image: "/images/fyp.pic2.jpg",
                    },
                    {
                      id: 3,
                      title: "GB Explorer Tours",
                      type: "tours",
                      location: "Skardu",
                      price: "PKR 15,000/day",
                      rating: 4.7,
                      image: "/images/fyp.pic3.jpg",
                    },
                    {
                      id: 4,
                      title: "Fairy Meadows Cottage",
                      type: "accommodation",
                      location: "Fairy Meadows",
                      price: "PKR 25,000/night",
                      rating: 4.6,
                      image: "/images/fyp.pic4.jpeg",
                    },
                  ].map((service) => (
                    <Card key={service.id} className="service-card overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={service.images?.[0] || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-2 top-2 rounded-full bg-white p-1.5">
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <Star className="h-4 w-4" />
                            <span className="sr-only">Add to favorites</span>
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                          </span>
                          <div className="flex items-center text-sm">
                            <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                            <span>{service.rating}</span>
                          </div>
                        </div>
                        <h3 className="line-clamp-1 text-lg font-semibold">{service.title}</h3>
                        <div className="mb-3 flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-primary">{service.price}</span>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/services/${service.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Other tabs content would be similar but filtered by category */}
              <TabsContent value="accommodation" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* Filtered accommodation services */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Popular Destinations Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Popular Destinations</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Explore the most breathtaking locations in Gilgit Baltistan
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Hunza Valley",
                  description: "Experience the beauty of ancient forts and blooming orchards.",
                  image: "/images/fyp.pic5.jpg",
                },
                {
                  name: "Skardu",
                  description: "Discover the unique cold desert and crystal-clear lakes.",
                  image: "/images/fyp.pic6.jpg",
                },
                {
                  name: "Fairy Meadows",
                  description: "Camp under the stars with views of Nanga Parbat.",
                  image: "/images/fyp.pic7.jpg",
                },
              ].map((destination, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-semibold">{destination.name}</h3>
                    <p className="mb-4 text-muted-foreground">{destination.description}</p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/destinations/${destination.name.toLowerCase().replace(" ", "-")}`}>
                        Explore more
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About GBConnect</h2>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <p className="text-lg">
                GBConnect empowers local communities by connecting them with travelers seeking authentic experiences in
                Gilgit Baltistan. Our platform bridges the gap between tourists and local service providers, creating
                meaningful connections and sustainable tourism opportunities.
              </p>

              <div className="mt-16 grid gap-8 md:grid-cols-2">
                <div className="rounded-lg bg-card p-8 text-center shadow-sm">
                  <Users className="mx-auto mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">For Tourists</h3>
                  <p className="text-muted-foreground">
                    Access verified local services and authentic experiences directly from community members.
                  </p>
                </div>
                <div className="rounded-lg bg-card p-8 text-center shadow-sm">
                  <Building className="mx-auto mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">For Service Providers</h3>
                  <p className="text-muted-foreground">
                    Reach global audiences and grow your business with our easy-to-use platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Experience Gilgit Baltistan?</h2>
              <p className="mt-4 text-lg">
                Join our community and start exploring the wonders of Gilgit Baltistan with local experts.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup?role=tourist">Sign Up as Tourist</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/signup?role=provider">List Your Service</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
