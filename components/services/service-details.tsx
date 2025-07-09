"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Calendar, Clock, Users, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"

export function ServiceDetails({ id }: { id: string }) {
  const { user } = useAuth()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [provider, setProvider] = useState<any>(null)

  useEffect(() => {
    async function fetchService() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/services/${id}`)
        if (!res.ok) throw new Error("Failed to fetch service")
        const data = await res.json()
        setService(data)
      } catch (err: any) {
        setError(err.message || "Error fetching service")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchService()
  }, [id])

  useEffect(() => {
    async function fetchProvider() {
      if (service?.providerId) {
        try {
          const res = await fetch(`/api/user/profile?id=${service.providerId}`)
          if (res.ok) {
            const data = await res.json()
            setProvider(data)
          }
        } catch {
          setProvider(null)
        }
      }
    }
    fetchProvider()
  }, [service])

  useEffect(() => {
    async function fetchReviews() {
      setLoadingReviews(true)
      try {
        const res = await fetch(`/api/services/${id}/review`)
        if (!res.ok) throw new Error("Failed to fetch reviews")
        const data = await res.json()
        setReviews(data)
      } catch {
        setReviews([])
      } finally {
        setLoadingReviews(false)
      }
    }
    if (id) fetchReviews()
  }, [id])

  // Calculate average rating and review count from reviews
  const reviewCount = reviews.length
  const averageRating = reviewCount > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount) : null

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!service) return <div className="p-8 text-center">Service not found.</div>

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{service.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <span className="font-medium">{averageRating ? averageRating.toFixed(1) : "N/A"}</span>
              <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{service.location ?? "Unknown"}</span>
            </div>
          </div>

          {/* Image gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <img
                  src={service.images?.[0] || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
              </div>
              <div>
                <img
                  src={service.images?.[1] || "/placeholder.svg"}
                  alt={`${service.title} view 2`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <div>
                <img
                  src={service.images?.[2] || "/placeholder.svg"}
                  alt={`${service.title} view 3`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Service details tabs */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-line">{service.longDescription || service.description || "No description available."}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2">What's Included</h3>
                    <ul className="space-y-2">
                      {(service.includes || []).map((item: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What's Not Included</h3>
                    <ul className="space-y-2">
                      {(service.excludes || []).map((item: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <span>• {item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Duration</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{service.duration ?? "N/A"}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">Group Size</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{service.groupSize ?? "N/A"}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">Categories</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(service.categories || []).map((category: string) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Available Dates</h3>
                  <div className="space-y-2">
                    {(service.availableDates || []).map((date: any, idx: number) => (
                      <div key={date?.date || idx} className="flex justify-between items-center p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span>
                            {date?.date ? new Date(date.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }) : "N/A"}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{date?.spotsLeft ?? "-"} spots left</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-6">
                {loadingReviews ? (
                  <div className="text-center py-4">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-muted-foreground text-center py-4">No reviews yet.</div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={review.userAvatar || "/placeholder.svg"}
                          alt={review.userName || review.userId || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{review.userName || review.userId || "User"}</div>
                          <div className="text-sm text-muted-foreground">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                )}
                <div className="text-center mt-4">
                  <Link href={`/services/${service._id}/review`}>
                    <Button variant="outline">Write a Review</Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          {/* Booking card */}
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold">{formatCurrency(service.price ?? 0)}</div>
                <div className="text-sm text-muted-foreground">per person</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Select a date to book</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{service.duration ?? "N/A"}</span>
                </div>
              </div>

              <Link href={`/booking/${service._id}`}>
                <Button className="w-full">Book Now</Button>
              </Link>

              {/* About the Provider section (replace the old one) */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">About the Provider</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={provider?.avatar || "/placeholder-user.jpg"}
                    alt={provider?.name || "Provider"}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{provider?.name || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">{provider?.email || ""}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{service.provider?.description || ""}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
