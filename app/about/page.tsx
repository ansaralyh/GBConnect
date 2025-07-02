import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Mountain, Users, Globe, Heart, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About GBConnect | Connecting Tourists with Local Service Providers",
  description:
    "Learn about GBConnect's mission to empower local communities in Gilgit Baltistan through sustainable tourism.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Connecting Communities, Creating Experiences
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  GBConnect is a platform dedicated to empowering local communities in Gilgit Baltistan by connecting
                  them with travelers seeking authentic experiences. We believe in sustainable tourism that benefits
                  both visitors and locals.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild>
                    <Link href="/services">Explore Services</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src="/images/fyp.pic15.webp"
                  alt="Scenic view of Gilgit Baltistan"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Mountain className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Story</h2>
              <p className="mt-6 text-lg">
                GBConnect was founded in 2025 by a group of passionate locals from Gilgit Baltistan who saw the need for
                a platform that could connect tourists with authentic local experiences while ensuring that tourism
                benefits the local communities.
              </p>
              <p className="mt-4 text-lg">
                What started as a small initiative has grown into a comprehensive platform that serves both tourists
                seeking unique experiences and local service providers looking to showcase their offerings to a global
                audience.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
              <p className="mt-6 text-lg">
                We're on a mission to transform tourism in Gilgit Baltistan by creating a sustainable ecosystem that
                benefits local communities while providing authentic experiences for travelers.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-card p-8 text-center shadow-sm">
                <Globe className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Sustainable Tourism</h3>
                <p className="text-muted-foreground">
                  Promoting responsible travel practices that minimize environmental impact and respect local cultures.
                </p>
              </div>
              <div className="rounded-lg bg-card p-8 text-center shadow-sm">
                <Users className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Community Empowerment</h3>
                <p className="text-muted-foreground">
                  Creating economic opportunities for local communities through direct connections with tourists.
                </p>
              </div>
              <div className="rounded-lg bg-card p-8 text-center shadow-sm">
                <Heart className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Authentic Experiences</h3>
                <p className="text-muted-foreground">
                  Facilitating genuine cultural exchanges and memorable experiences for travelers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Team</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Our diverse team of locals and tourism experts is passionate about showcasing the beauty of Gilgit
                Baltistan to the world.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                {
                  name: "Zeeshan Haider",
                  role: "Founder",
                  image: "/images/fyp.pic16.jpeg",
                },
                {
                  name: "Jahangeer Karamat",
                  role: "founder",
                  image: "/images/fyp.pic18.jpeg",
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto aspect-square w-40 overflow-hidden rounded-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                These core principles guide everything we do at GBConnect.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Trust & Transparency</h3>
                  <p className="mt-2 text-muted-foreground">
                    We believe in building trust through transparent practices, verified service providers, and honest
                    reviews.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Community First</h3>
                  <p className="mt-2 text-muted-foreground">
                    We prioritize the needs and interests of local communities in all our decisions and initiatives.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Environmental Responsibility</h3>
                  <p className="mt-2 text-muted-foreground">
                    We promote sustainable practices that preserve the natural beauty of Gilgit Baltistan for future
                    generations.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Cultural Respect</h3>
                  <p className="mt-2 text-muted-foreground">
                    We honor and celebrate the rich cultural heritage of Gilgit Baltistan and encourage respectful
                    cultural exchange.
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
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Join Our Community</h2>
              <p className="mt-4 text-lg">
                Whether you're a traveler seeking authentic experiences or a local service provider looking to grow your
                business, GBConnect is here for you.
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
                  <Link href="/signup?role=provider">Join as Service Provider</Link>
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
