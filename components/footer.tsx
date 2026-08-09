import Link from "next/link"
import { Mountain, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="container py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-semibold tracking-tight">GBConnect</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Connecting travelers with local hosts across the valleys of Gilgit Baltistan.
            </p>
            <div className="mt-6 flex space-x-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="rounded-full border border-border/70 bg-card p-2.5 text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">Social</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold">Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services?type=accommodation" className="text-muted-foreground transition-colors hover:text-foreground">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/services?type=food" className="text-muted-foreground transition-colors hover:text-foreground">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/services?type=transport" className="text-muted-foreground transition-colors hover:text-foreground">
                  Transportation
                </Link>
              </li>
              <li>
                <Link href="/services?type=tours" className="text-muted-foreground transition-colors hover:text-foreground">
                  Tours
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold">Connect</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  support@gbconnect.com
                </Link>
              </li>
              <li>+92 300 1234567</li>
              <li>Gilgit City, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GBConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
