import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Contact Us | GBConnect",
  description: "Get in touch with the GBConnect team for inquiries, support, or partnership opportunities.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Get in Touch</h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Have questions, feedback, or need assistance? We're here to help. Reach out to our team using any of the
                methods below.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Email</h3>
                <p className="text-muted-foreground">For general inquiries</p>
                <a href="mailto:info@gbconnect.pk" className="mt-2 block font-medium text-primary hover:underline">
                  info@gbconnect.pk
                </a>
              </div>

              <div className="rounded-lg border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Phone</h3>
                <p className="text-muted-foreground">Mon-Fri from 9am to 5pm</p>
                <a href="tel:+923117732214" className="mt-2 block font-medium text-primary hover:underline">
                  +92 300 123 4567
                </a>
              </div>

              <div className="rounded-lg border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Office</h3>
                <p className="text-muted-foreground">Visit our office</p>
                <address className="mt-2 not-italic font-medium text-primary">
                  Main Road, Gilgit City
                  <br />
                  Gilgit-Baltistan, Pakistan
                </address>
              </div>

              <div className="rounded-lg border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Working Hours</h3>
                <p className="text-muted-foreground">We're available</p>
                <p className="mt-2 font-medium text-primary">
                  Monday - Friday
                  <br />
                  9:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-lg border bg-card p-8">
                <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Full Name
                      </label>
                      <Input id="name" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email Address
                      </label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
                  </div>

                  <Button type="submit" className="w-full sm:w-auto">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-6 text-2xl font-bold">Our Location</h2>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
                <div className="flex h-full items-center justify-center">
                  {/* <p className="text-muted-foreground">Map view is not available in this demo</p> */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12..."
                    width="600"
                    height="450"
                    Style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Find quick answers to common questions about GBConnect.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">How do I sign up as a service provider?</h3>
                <p className="mt-2 text-muted-foreground">
                  You can sign up as a service provider by clicking on the "List Your Service" button on our homepage
                  and following the registration process. You'll need to provide details about your business and the
                  services you offer.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">How does the booking process work?</h3>
                <p className="mt-2 text-muted-foreground">
                  Once you find a service you're interested in, you can check availability, select dates, and complete
                  the booking through our secure platform. You'll receive a confirmation email with all the details.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">What payment methods do you accept?</h3>
                <p className="mt-2 text-muted-foreground">
                  We accept various payment methods including credit/debit cards, bank transfers, and mobile payment
                  services like JazzCash and EasyPaisa for your convenience.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">How can I become a partner?</h3>
                <p className="mt-2 text-muted-foreground">
                  If you're interested in partnering with GBConnect, please reach out to us at partners@gbconnect.pk
                  with details about your organization and partnership ideas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
