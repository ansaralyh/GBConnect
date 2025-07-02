"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  Star,
  Grid,
  List,
  Map,
  ChevronDown,
  Wifi,
  Car,
  Utensils,
  Heart,
  X,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
// Mock data with Pakistani locations and PKR currency
const mockServices = [
  {
    id: "1",
    title: "Guided Tour of Badshahi Mosque",
    description: "Explore the historic Badshahi Mosque with a knowledgeable local guide.",
    location: "Lahore, Punjab",
    price: 2500, // in PKR
    rating: 4.8,
    reviews: 124,
    image: "/images/fyp.pic8.jpeg",
    provider: {
      id: "3",
      name: "Muhammad Ali",
      rating: 4.9,
    },
    categories: ["Cultural", "Historical"],
  },
  {
    id: "2",
    title: "Hunza Valley Adventure Trek",
    description: "Experience the breathtaking beauty of Hunza Valley with our expert guides.",
    location: "Hunza, Gilgit-Baltistan",
    price: 15000, // in PKR
    rating: 4.9,
    reviews: 87,
    image: "/images/fyp.pic5.jpg",
    provider: {
      id: "4",
      name: "Ayesha Malik",
      rating: 4.7,
    },
    categories: ["Adventure", "Trekking"],
  },
  {
    id: "3",
    title: "Karachi City Tour",
    description: "Discover the vibrant culture and landmarks of Pakistan's largest city.",
    location: "Karachi, Sindh",
    price: 3500, // in PKR
    rating: 4.6,
    reviews: 92,
    image: "/images/fyp.pic11.jpg",
    provider: {
      id: "6",
      name: "Imran Hussain",
      rating: 4.8,
    },
    categories: ["City Tour", "Cultural"],
  },
  {
    id: "4",
    title: "Swat Valley Exploration",
    description: "Explore the scenic beauty of Swat Valley, known as the 'Switzerland of Pakistan'.",
    location: "Swat, Khyber Pakhtunkhwa",
    price: 12000, // in PKR
    rating: 4.7,
    reviews: 65,
    image: "/images/fyp.pic12.png",
    provider: {
      id: "3",
      name: "Muhammad Ali",
      rating: 4.9,
    },
    categories: ["Nature", "Adventure"],
  },
  {
    id: "5",
    title: "Mohenjo-daro Archaeological Tour",
    description: "Step back in time with a guided tour of the ancient Indus Valley Civilization site.",
    location: "Larkana, Sindh",
    price: 4500, // in PKR
    rating: 4.8,
    reviews: 43,
    image: "/images/fyp.pic13.jpg",
    provider: {
      id: "4",
      name: "Ayesha Malik",
      rating: 4.7,
    },
    categories: ["Historical", "Educational"],
  },
  {
    id: "6",
    title: "Kalash Valley Cultural Experience",
    description: "Immerse yourself in the unique culture of the Kalash people in Chitral.",
    location: "Chitral, Khyber Pakhtunkhwa",
    price: 18000, // in PKR
    rating: 4.9,
    reviews: 38,
    image: "/images/fyp.pic14.jpg",
    provider: {
      id: "6",
      name: "Imran Hussain",
      rating: 4.8,
    },
    categories: ["Cultural", "Immersive"],
  },
]

// Filter categories
const categories = [
  "All",
  "Adventure",
  "Cultural",
  "Historical",
  "Nature",
  "City Tour",
  "Trekking",
  "Educational",
  "Immersive",
]

export function ServiceListings() {
  const searchParams = useSearchParams()
  const initialLocation = searchParams.get("location") || ""
  const initialType = searchParams.get("type") || ""

  const [location, setLocation] = useState(initialLocation)
  const [serviceType, setServiceType] = useState(initialType)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [amenities, setAmenities] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [sortBy, setSortBy] = useState("recommended")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [services, setServices] = useState(mockServices)
  const [filteredServices, setFilteredServices] = useState(mockServices)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...services]

    // Filter by location
    if (location) {
      filtered = filtered.filter((service) => service.location.toLowerCase().includes(location.toLowerCase()))
    }

    // Filter by service type
    if (serviceType) {
      filtered = filtered.filter((service) => service.type === serviceType)
    }

    // Filter by price range (simplified for demo)
    // In a real app, you would convert price strings to numbers

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter((service) => service.rating >= minRating)
    }

    // Filter by amenities
    if (amenities.length > 0) {
      filtered = filtered.filter((service) => amenities.every((amenity) => service.amenities.includes(amenity)))
    }

    // Sort results
    switch (sortBy) {
      case "price-low":
        // Simplified sorting for demo
        filtered.sort((a, b) => a.price.length - b.price.length)
        break
      case "price-high":
        filtered.sort((a, b) => b.price.length - a.price.length)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Default "recommended" sorting
        break
    }

    setFilteredServices(filtered)
  }, [location, serviceType, priceRange, minRating, amenities, sortBy, services])

  useEffect(() => {
    let filtered = [...services]

    // Filter by location
    if (location) {
      filtered = filtered.filter((service) => service.location.toLowerCase().includes(location.toLowerCase()))
    }

    // Filter by service type
    if (serviceType) {
      filtered = filtered.filter((service) => service.type=== serviceType)
    }

    // Filter by price range (simplified for demo)
    // In a real app, you would convert price strings to numbers

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter((service) => service.rating >= minRating)
    }

    // Filter by amenities
    if (amenities.length > 0) {
      filtered = filtered.filter((service) => amenities.every((amenity) => service.amenities.includes(amenity)))
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((service) => service.categories.includes(selectedCategory))
    }

    // Sort results
    switch (sortBy) {
      case "price-low":
        // Simplified sorting for demo
        filtered.sort((a, b) => a.price.length - b.price.length)
        break
      case "price-high":
        filtered.sort((a, b) => b.price.length - a.price.length)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Default "recommended" sorting
        break
    }

    setFilteredServices(filtered)
  }, [location, serviceType, priceRange, minRating, amenities, sortBy, services, selectedCategory])

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const clearFilters = () => {
    setLocation("")
    setServiceType("")
    setPriceRange([0, 1000])
    setMinRating(0)
    setAmenities([])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-primary py-8 text-primary-foreground">
        <div className="container">
          <h1 className="text-3xl font-bold">Discover Local Services in Gilgit Baltistan</h1>

          <div className="mt-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Location"
                className="border-0 p-0 bg-white text-gray-700"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="flex w-full items-center gap-2 sm:w-[180px]">
                <Search className="h-5 w-5 text-muted-foreground" />
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
                <SelectItem value="tours">Tours & Activities</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="flex w-full items-center gap-2 sm:w-[180px]">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="mid">Mid-range</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full sm:w-auto">Search</Button>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-muted/30 py-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-[280px_1fr]">
            {/* Filters - Desktop */}
            <div className="hidden md:block">
              <div className="rounded-lg border bg-card shadow-sm">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                      Clear all
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-sm font-medium">Rating</h3>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center">
                            <Checkbox
                              id={`rating-${rating}`}
                              checked={minRating === rating}
                              onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
                            />
                            <label
                              htmlFor={`rating-${rating}`}
                              className="ml-2 flex cursor-pointer items-center text-sm"
                            >
                              {Array.from({ length: rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                              ))}
                              {Array.from({ length: 5 - rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-muted-foreground" />
                              ))}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm font-medium">Amenities</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="amenity-wifi"
                            checked={amenities.includes("wifi")}
                            onCheckedChange={() => toggleAmenity("wifi")}
                          />
                          <label htmlFor="amenity-wifi" className="ml-2 flex cursor-pointer items-center text-sm">
                            <Wifi className="mr-2 h-4 w-4" />
                            Wi-Fi
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="amenity-parking"
                            checked={amenities.includes("parking")}
                            onCheckedChange={() => toggleAmenity("parking")}
                          />
                          <label htmlFor="amenity-parking" className="ml-2 flex cursor-pointer items-center text-sm">
                            <Car className="mr-2 h-4 w-4" />
                            Parking
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="amenity-restaurant"
                            checked={amenities.includes("restaurant")}
                            onCheckedChange={() => toggleAmenity("restaurant")}
                          />
                          <label htmlFor="amenity-restaurant" className="ml-2 flex cursor-pointer items-center text-sm">
                            <Utensils className="mr-2 h-4 w-4" />
                            Restaurant
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm font-medium">Price Range</h3>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={[0, 1000]}
                          max={1000}
                          step={10}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">${priceRange[0]}</span>
                          <span className="text-sm">${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters - Mobile */}
            <div className="md:hidden">
              <div className="mb-6 flex items-center justify-between">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div>
                        <h3 className="mb-4 text-sm font-medium">Rating</h3>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center">
                              <Checkbox
                                id={`rating-mobile-${rating}`}
                                checked={minRating === rating}
                                onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
                              />
                              <label
                                htmlFor={`rating-mobile-${rating}`}
                                className="ml-2 flex cursor-pointer items-center text-sm"
                              >
                                {Array.from({ length: rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                                {Array.from({ length: 5 - rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-muted-foreground" />
                                ))}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-4 text-sm font-medium">Amenities</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Checkbox
                              id="amenity-wifi-mobile"
                              checked={amenities.includes("wifi")}
                              onCheckedChange={() => toggleAmenity("wifi")}
                            />
                            <label
                              htmlFor="amenity-wifi-mobile"
                              className="ml-2 flex cursor-pointer items-center text-sm"
                            >
                              <Wifi className="mr-2 h-4 w-4" />
                              Wi-Fi
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              id="amenity-parking-mobile"
                              checked={amenities.includes("parking")}
                              onCheckedChange={() => toggleAmenity("parking")}
                            />
                            <label
                              htmlFor="amenity-parking-mobile"
                              className="ml-2 flex cursor-pointer items-center text-sm"
                            >
                              <Car className="mr-2 h-4 w-4" />
                              Parking
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              id="amenity-restaurant-mobile"
                              checked={amenities.includes("restaurant")}
                              onCheckedChange={() => toggleAmenity("restaurant")}
                            />
                            <label
                              htmlFor="amenity-restaurant-mobile"
                              className="ml-2 flex cursor-pointer items-center text-sm"
                            >
                              <Utensils className="mr-2 h-4 w-4" />
                              Restaurant
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-4 text-sm font-medium">Price Range</h3>
                        <div className="space-y-4">
                          <Slider
                            defaultValue={[0, 1000]}
                            max={1000}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm">${priceRange[0]}</span>
                            <span className="text-sm">${priceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={clearFilters}>
                          Clear all
                        </Button>
                        <Button>Apply Filters</Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 gap-1 text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex rounded-md border">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none rounded-l-md"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                      <span className="sr-only">List view</span>
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none rounded-r-md"
                      onClick={() => setViewMode("map")}
                    >
                      <Map className="h-4 w-4" />
                      <span className="sr-only">Map view</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active filters */}
              {(location || serviceType || minRating > 0 || amenities.length > 0) && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {location && (
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                      <span>Location: {location}</span>
                      <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setLocation("")}>
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove location filter</span>
                      </Button>
                    </div>
                  )}

                  {serviceType && (
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                      <span>Type: {serviceType}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => setServiceType("")}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove type filter</span>
                      </Button>
                    </div>
                  )}

                  {minRating > 0 && (
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                      <span>Rating: {minRating}+ stars</span>
                      <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setMinRating(0)}>
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove rating filter</span>
                      </Button>
                    </div>
                  )}

                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                      <span>Amenity: {amenity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => toggleAmenity(amenity)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove amenity filter</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Results */}
            <div>
              {/* Desktop sort and view controls */}
              <div className="mb-6 hidden items-center justify-between md:flex">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredServices.length}</span> results
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex rounded-md border">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none rounded-l-md"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                      <span className="sr-only">List view</span>
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none rounded-r-md"
                      onClick={() => setViewMode("map")}
                    >
                      <Map className="h-4 w-4" />
                      <span className="sr-only">Map view</span>
                    </Button>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">Loading services...</p>
                  </div>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No services found in this category.</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <Link href={`/services/${service.id}`} key={service.id}>
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                          <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg line-clamp-2">{service.title}</h3>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-4 w-4 fill-amber-500" />
                              <span className="text-sm font-medium">{service.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground mt-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{service.location}</span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {service.categories.map((category) => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center pt-0">
                          <div className="text-sm text-muted-foreground">By {service.provider.name}</div>
                          <div className="font-semibold">{formatCurrency(service.price)}</div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : viewMode === "list" ? (
                <div className="space-y-4">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className="service-card overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                        <div className="relative h-48 md:h-full">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-muted-foreground hover:bg-white hover:text-primary"
                          >
                            <Heart className="h-4 w-4" />
                            <span className="sr-only">Add to favorites</span>
                          </Button>
                        </div>
                        <CardContent className="p-4 md:p-6">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                              {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                            </span>
                            <div className="flex items-center text-sm">
                              <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                              <span>{service.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold">{service.title}</h3>
                          <div className="mb-3 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span>{service.location}</span>
                          </div>
                          <p className="mb-4 text-muted-foreground">{service.description}</p>
                          <div className="mb-4 flex flex-wrap gap-2">
                            {service.amenities.includes("wifi") && (
                              <span className="flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs">
                                <Wifi className="mr-1 h-3 w-3" />
                                Wi-Fi
                              </span>
                            )}
                            {service.amenities.includes("parking") && (
                              <span className="flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs">
                                <Car className="mr-1 h-3 w-3" />
                                Parking
                              </span>
                            )}
                            {service.amenities.includes("restaurant") && (
                              <span className="flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs">
                                <Utensils className="mr-1 h-3 w-3" />
                                Restaurant
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-primary">{service.price}</span>
                            <Button size="sm" asChild>
                              <Link href={`/services/${service.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-card">
                  <div className="relative h-[500px] w-full bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Map view is not available in this demo</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {filteredServices.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" disabled>
                      <ChevronDown className="h-4 w-4 rotate-90" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8">
                      1
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      2
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      3
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
