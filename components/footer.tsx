import Link from "next/link"
import { Mountain, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GBconnect</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting tourists with local service providers in Gilgit Baltistan.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link
                href="#"
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services?type=accommodation" className="text-muted-foreground hover:text-foreground">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/services?type=food" className="text-muted-foreground hover:text-foreground">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/services?type=transport" className="text-muted-foreground hover:text-foreground">
                  Transportation
                </Link>
              </li>
              <li>
                <Link href="/services?type=tours" className="text-muted-foreground hover:text-foreground">
                  Tours
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Connect With Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  support@gbconnect.com
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">+92 300 1234567</span>
              </li>
              <li>
                <span className="text-muted-foreground">Gilgit City, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2023 GBconnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
