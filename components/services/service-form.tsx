"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Home,
  Settings,
  LogOut,
  ArrowLeft,
  Upload,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Loader2,
  Save,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

const serviceFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.string({ required_error: "Please select a service type" }),
  category: z.string({ required_error: "Please select a category" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  priceUnit: z.string({ required_error: "Please select a price unit" }),
  amenities: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  availableDays: z.array(z.string()).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  houseRules: z.string().optional(),
  status: z.enum(["draft", "active", "inactive"]),
})

export function ServiceForm({ mode, serviceId }: { mode: "create" | "edit"; serviceId?: string }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      type: "",
      category: "",
      description: "",
      location: "",
      price: 0,
      priceUnit: "night",
      amenities: [],
      startDate: "",
      endDate: "",
      availableDays: [],
      startTime: "",
      endTime: "",
      cancellationPolicy: "",
      houseRules: "",
      status: "draft",
    },
  })

  useEffect(() => {
    // Check if user is authenticated and is a provider
    if (!user || user.role !== "provider") {
      router.push("/login")
      return
    }

    // If in edit mode, fetch service data
    if (mode === "edit" && serviceId) {
      setIsLoading(true)
      fetch(`/api/services/${serviceId}`)
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch service data")
          const data = await res.json()
          form.reset({
            title: data.title || "",
            type: data.type || "",
            category: data.category || "",
            description: data.description || "",
            location: data.location || "",
            price: data.price || 0,
            priceUnit: data.priceUnit || "night",
            amenities: data.amenities || [],
            startDate: data.availability?.startDate || "",
            endDate: data.availability?.endDate || "",
            availableDays: data.availability?.availableDays || [],
            startTime: data.availability?.startTime || "",
            endTime: data.availability?.endTime || "",
            cancellationPolicy: data.policies?.cancellation || "",
            houseRules: data.policies?.houseRules || "",
            status: data.status || "draft",
          })
          setImages(data.images || [])
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load service data. Please try again.",
          })
        })
        .finally(() => setIsLoading(false))
    }
  }, [user, router, mode, serviceId, form, toast])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  async function onSubmit(values: z.infer<typeof serviceFormSchema>) {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not loaded. Please log in again.",
      });
      return;
    }
    
    // Debug: Log user information
    console.log('Creating service with user:', {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role
    });
    
    setIsLoading(true);
    try {
      if (mode === "create") {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            images,
            providerId: user.id,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create service");
        toast({
          title: "Service created",
          description: "Your service has been created successfully.",
        });
        router.push("/dashboard/provider");
      } else {
        // Actually update the service in the backend
        const res = await fetch(`/api/services/${serviceId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            images,
            providerId: user.id,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update service");
        toast({
          title: "Service updated",
          description: "Your service has been updated successfully."
        });
        router.push("/dashboard/provider/services");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: mode === "create" ? "Failed to create service. Please try again." : "Failed to update service. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/provider/services">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <span className="font-medium">{mode === "create" ? "New Service" : "Edit Service"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start py-6 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Sidebar - Desktop */}
        <aside className="fixed top-0 z-30 hidden h-screen w-full shrink-0 border-r md:sticky md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex h-14 items-center border-b px-4 py-2">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image
                  src="/placeholder.svg?height=30&width=30"
                  alt="GBConnect Logo"
                  width={30}
                  height={30}
                  className="rounded"
                />
                <span>GBConnect</span>
              </Link>
            </div>
            <div className="flex items-center gap-4 px-4 py-2">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <nav className="grid gap-1 px-2 pt-4">
              <Link
                href="/dashboard/provider"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/provider/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
            <div className="mt-auto">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col gap-8">
          {/* Back button - Desktop */}
          <div className="hidden md:flex">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/dashboard/provider/services">
                <ArrowLeft className="h-4 w-4" />
                Back to services
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "create" ? "Create New Service" : "Edit Service"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "Add a new service to your listings."
                : "Update your service information and settings."}
            </p>
          </div>

          {isLoading && mode === "edit" ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Loading service information...</p>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide the basic details about your service.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a descriptive title for your service" {...field} />
                          </FormControl>
                          <FormDescription>This will be the main title displayed to users.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="accommodation">Accommodation</SelectItem>
                                <SelectItem value="food">Food & Dining</SelectItem>
                                <SelectItem value="transport">Transportation</SelectItem>
                                <SelectItem value="tours">Tours & Activities</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="guesthouse">Guesthouse</SelectItem>
                                <SelectItem value="restaurant">Restaurant</SelectItem>
                                <SelectItem value="cafe">Café</SelectItem>
                                <SelectItem value="car_rental">Car Rental</SelectItem>
                                <SelectItem value="jeep_tour">Jeep Tour</SelectItem>
                                <SelectItem value="hiking">Hiking Tour</SelectItem>
                                <SelectItem value="cultural_tour">Cultural Tour</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your service in detail..."
                              className="min-h-32 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed description of your service, including features and benefits.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Enter the location" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Specify where your service is located.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="0" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priceUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select price unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="night">Per Night</SelectItem>
                                <SelectItem value="day">Per Day</SelectItem>
                                <SelectItem value="hour">Per Hour</SelectItem>
                                <SelectItem value="person">Per Person</SelectItem>
                                <SelectItem value="trip">Per Trip</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>Upload images of your service to attract customers.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <FormLabel>Images</FormLabel>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="mb-2"
                      />
                      <div className="flex flex-wrap gap-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24">
                            <Image
                              src={img}
                              alt={`Service image ${idx + 1}`}
                              fill
                              className="object-cover rounded"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1"
                              onClick={() => handleRemoveImage(idx)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                    <CardDescription>Select the amenities that your service offers.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {[
                              { id: "wifi", label: "Wi-Fi" },
                              { id: "parking", label: "Parking" },
                              { id: "restaurant", label: "Restaurant" },
                              { id: "ac", label: "Air Conditioning" },
                              { id: "breakfast", label: "Breakfast" },
                              { id: "pool", label: "Swimming Pool" },
                              { id: "gym", label: "Gym" },
                              { id: "spa", label: "Spa" },
                              { id: "bar", label: "Bar" },
                              { id: "laundry", label: "Laundry" },
                              { id: "pets", label: "Pet Friendly" },
                              { id: "shuttle", label: "Airport Shuttle" },
                            ].map((amenity) => (
                              <FormItem key={amenity.id} className="flex items-start space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || []
                                      if (checked) {
                                        field.onChange([...currentValues, amenity.id])
                                      } else {
                                        field.onChange(currentValues.filter((value) => value !== amenity.id))
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{amenity.label}</FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                    <CardDescription>Set when your service is available for booking.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="date" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="date" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="availableDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Days</FormLabel>
                          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                            {[
                              { id: "monday", label: "Mon" },
                              { id: "tuesday", label: "Tue" },
                              { id: "wednesday", label: "Wed" },
                              { id: "thursday", label: "Thu" },
                              { id: "friday", label: "Fri" },
                              { id: "saturday", label: "Sat" },
                              { id: "sunday", label: "Sun" },
                            ].map((day) => (
                              <FormItem key={day.id} className="flex flex-col items-center space-y-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || []
                                      if (checked) {
                                        field.onChange([...currentValues, day.id])
                                      } else {
                                        field.onChange(currentValues.filter((value) => value !== day.id))
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-xs font-normal">{day.label}</FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="time" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="time" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Policies</CardTitle>
                    <CardDescription>Set your service policies and rules.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="cancellationPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cancellation Policy</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your cancellation policy..."
                              className="min-h-24 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Explain your cancellation policy, including any refund terms.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="houseRules"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>House Rules</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List your house rules..."
                              className="min-h-24 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Specify any rules or guidelines for guests.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Status</CardTitle>
                    <CardDescription>Control the visibility and status of your service.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <input
                                  type="radio"
                                  className="peer hidden"
                                  id="status-draft"
                                  value="draft"
                                  checked={field.value === "draft"}
                                  onChange={() => field.onChange("draft")}
                                />
                              </FormControl>
                              <label
                                htmlFor="status-draft"
                                className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-muted ${
                                  field.value === "draft" ? "border-primary bg-primary/5" : ""
                                }`}
                              >
                                <div className="space-y-1">
                                  <p className="font-medium">Draft</p>
                                  <p className="text-sm text-muted-foreground">Save as draft and publish later.</p>
                                </div>
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <input
                                  type="radio"
                                  className="peer hidden"
                                  id="status-active"
                                  value="active"
                                  checked={field.value === "active"}
                                  onChange={() => field.onChange("active")}
                                />
                              </FormControl>
                              <label
                                htmlFor="status-active"
                                className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-muted ${
                                  field.value === "active" ? "border-primary bg-primary/5" : ""
                                }`}
                              >
                                <div className="space-y-1">
                                  <p className="font-medium">Active</p>
                                  <p className="text-sm text-muted-foreground">
                                    Publish and make available for booking.
                                  </p>
                                </div>
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <input
                                  type="radio"
                                  className="peer hidden"
                                  id="status-inactive"
                                  value="inactive"
                                  checked={field.value === "inactive"}
                                  onChange={() => field.onChange("inactive")}
                                />
                              </FormControl>
                              <label
                                htmlFor="status-inactive"
                                className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-muted ${
                                  field.value === "inactive" ? "border-primary bg-primary/5" : ""
                                }`}
                              >
                                <div className="space-y-1">
                                  <p className="font-medium">Inactive</p>
                                  <p className="text-sm text-muted-foreground">
                                    Hide from search results and prevent bookings.
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard/provider/services">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isLoading || !user?.id}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {mode === "create" ? "Creating..." : "Updating..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {mode === "create" ? "Create Service" : "Update Service"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </main>
      </div>
    </div>
  )
}
