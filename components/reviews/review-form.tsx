"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"

// Mock service data
const mockServices = [
  {
    id: "1",
    title: "Serena Hotel",
    type: "accommodation",
    location: "Gilgit City",
    image: "/placeholder.svg?height=300&width=400",
    provider: {
      id: "provider-1",
      name: "Serena Hotels",
    },
  },
  {
    id: "2",
    title: "Mountain View Restaurant",
    type: "food",
    location: "Hunza Valley",
    image: "/placeholder.svg?height=300&width=400",
    provider: {
      id: "provider-2",
      name: "Hunza Hospitality",
    },
  },
]

const reviewFormSchema = z.object({
  rating: z.number().min(1, { message: "Please select a rating" }).max(5),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  comment: z.string().min(10, { message: "Review must be at least 10 characters" }),
  recommend: z.boolean().optional(),
})

export function ReviewForm({ serviceId }: { serviceId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  // Find the service by ID
  const service = mockServices.find((s) => s.id === serviceId) || mockServices[0]

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
      recommend: true,
    },
  })

  const watchRating = form.watch("rating")

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    if (!user) {
      router.push("/login")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/services/${serviceId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id || user._id,
          userName: user.name || null,
          userAvatar: user.avatar || null,
          rating: values.rating,
          comment: values.comment,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit review")
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your experience!",
      })
      router.push(`/services/${serviceId}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error submitting your review. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard/tourist" className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Login
                </Link>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/30 py-8">
        <div className="container">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href={`/services/${serviceId}`}>
                <ArrowLeft className="h-4 w-4" />
                Back to service details
              </Link>
            </Button>
          </div>

          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with {service.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.location}</p>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => field.onChange(rating)}
                                  onMouseEnter={() => setHoveredRating(rating)}
                                  onMouseLeave={() => setHoveredRating(0)}
                                  className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <Star
                                    className={`h-8 w-8 ${
                                      rating <= (hoveredRating || field.value)
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormDescription>
                            {watchRating === 5
                              ? "Excellent - Highly recommended!"
                              : watchRating === 4
                                ? "Very Good - Great experience"
                                : watchRating === 3
                                  ? "Average - Satisfactory"
                                  : watchRating === 2
                                    ? "Poor - Below expectations"
                                    : watchRating === 1
                                      ? "Terrible - Would not recommend"
                                      : "Select a rating"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Summarize your experience" {...field} />
                          </FormControl>
                          <FormDescription>A brief headline for your review.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Review</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share details of your experience at this place"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include what you liked, what could be improved, and other helpful details.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recommend"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I recommend this place</FormLabel>
                            <FormDescription>Would you recommend this service to others?</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/services/${serviceId}`}>Cancel</Link>
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
