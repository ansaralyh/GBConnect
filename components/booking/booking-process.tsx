"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Calendar, Check, CreditCard, Loader2, MapPin, Star, Users, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { DatePicker } from "@/components/ui/date-picker"
import { formatCurrency } from "@/lib/utils"

// Mock service data
const mockServices = [
  {
    id: "1",
    title: "Serena Hotel",
    type: "accommodation",
    location: "Gilgit City",
    price: 35000, // in PKR
    rating: 4.8,
    reviewCount: 124,
    image: "/placeholder.svg?height=300&width=400",
    description: "Luxury hotel with stunning mountain views and excellent service.",
    provider: {
      id: "provider-1",
      name: "Serena Hotels",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    serviceFeeRate: 0.1,
    taxRate: 0.05,
  },
  {
    id: "2",
    title: "Mountain View Restaurant",
    type: "food",
    location: "Hunza Valley",
    price: 8000, // in PKR
    rating: 4.5,
    reviewCount: 86,
    image: "/placeholder.svg?height=300&width=400",
    description: "Traditional cuisine with panoramic views of the Hunza Valley.",
    provider: {
      id: "provider-2",
      name: "Hunza Hospitality",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    serviceFeeRate: 0.15,
    taxRate: 0.08,
  },
]

// Form schema for guest information
const guestFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(6, { message: "Phone number is required" }),
  specialRequests: z.string().optional(),
})

// Form schema for payment information
const paymentFormSchema = z.object({
  cardholderName: z.string().min(2, { message: "Cardholder name is required" }),
  cardNumber: z
    .string()
    .min(16, { message: "Card number must be at least 16 digits" })
    .max(19, { message: "Card number must not exceed 19 digits" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Please use MM/YY format" }),
  cvv: z
    .string()
    .min(3, { message: "CVV must be at least 3 digits" })
    .max(4, { message: "CVV must not exceed 4 digits" }),
  paymentMethod: z.enum(["credit", "debit", "easypaisa", "jazzcash"], {
    required_error: "Please select a payment method",
  }),
})

export function BookingProcess({ serviceId }: { serviceId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    guests: 2,
    nights: 3,
  })

  // Find the service by ID
  const service = mockServices.find((s) => s.id === serviceId) || mockServices[0]

  // Calculate prices
  const nights = Math.ceil((bookingDetails.checkOut.getTime() - bookingDetails.checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const price = service.price || 0;
  const guests = bookingDetails.guests;
  const serviceFeeRate = service.serviceFeeRate ?? 0.1;
  const taxRate = service.taxRate ?? 0.05;
  const subtotal = price * nights * guests;
  const serviceFee = Math.round(subtotal * serviceFeeRate);
  const taxes = Math.round(subtotal * taxRate);
  const total = subtotal + serviceFee + taxes;

  // Guest information form
  const guestForm = useForm<z.infer<typeof guestFormSchema>>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      specialRequests: "",
    },
  })

  // Payment information form
  const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      paymentMethod: "credit",
    },
  })

  const nextStep = () => {
    if (step === 1) {
      const isValid = guestForm.trigger()
      if (isValid) {
        setStep(2)
        window.scrollTo(0, 0)
      }
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const onSubmitPayment = async (values: z.infer<typeof paymentFormSchema>) => {
    setIsLoading(true)
    console.log("Submitting booking...");
    try {
      if (!user || !service) throw new Error("Missing user or service info");
      // Create booking in backend
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: serviceId,
          userId: user.id || user._id,
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
          guests: bookingDetails.guests,
          status: "confirmed",
          totalPrice: total,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Booking creation failed:", errorData);
        throw new Error(errorData.error || "Failed to create booking");
      }
      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been successfully confirmed. Check your email for details.",
      });
      router.push(`/booking/confirmation/${serviceId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
      });
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
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

          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Complete Your Booking</h1>
            <p className="mt-2 text-muted-foreground">
              You're just a few steps away from confirming your booking with {service.title}.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
              >
                1
              </div>
              <div className={`h-1 flex-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
              >
                2
              </div>
              <div className={`h-1 flex-1 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step >= 3 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
              >
                3
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Guest Information</span>
              <span>Payment</span>
              <span>Confirmation</span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Main Content */}
            <div>
              {step === 1 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">Guest Information</h2>
                    <Form {...guestForm}>
                      <form className="space-y-4">
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={guestForm.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={guestForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your phone number" {...field} />
                                  </FormControl>
                                  <FormDescription>For urgent communications related to your booking.</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={guestForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your email address" {...field} />
                                </FormControl>
                                <FormDescription>
                                  We'll send the booking confirmation to this email address.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <FormLabel>Check-in Date</FormLabel>
                              <DatePicker
                                date={bookingDetails.checkIn}
                                setDate={(date) => {
                                  if (date) {
                                    setBookingDetails({
                                      ...bookingDetails,
                                      checkIn: date,
                                      nights: Math.ceil(
                                        (bookingDetails.checkOut.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
                                      ),
                                    })
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <FormLabel>Check-out Date</FormLabel>
                              <DatePicker
                                date={bookingDetails.checkOut}
                                setDate={(date) => {
                                  if (date) {
                                    setBookingDetails({
                                      ...bookingDetails,
                                      checkOut: date,
                                      nights: Math.ceil(
                                        (date.getTime() - bookingDetails.checkIn.getTime()) / (1000 * 60 * 60 * 24),
                                      ),
                                    })
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <FormLabel>Number of Guests</FormLabel>
                            <div className="flex items-center h-10 rounded-md border px-3">
                              <select
                                className="w-full bg-transparent focus:outline-none"
                                value={bookingDetails.guests}
                                onChange={(e) =>
                                  setBookingDetails({ ...bookingDetails, guests: Number(e.target.value) })
                                }
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                  <option key={num} value={num}>
                                    {num} {num === 1 ? "Guest" : "Guests"}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <FormField
                            control={guestForm.control}
                            name="specialRequests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Special Requests (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Any special requests or requirements for your stay"
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  The service provider will do their best to accommodate your requests.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-4 p-6 pt-0">
  <Button
    onClick={async () => {
      const isValid = await guestForm.trigger();
      if (isValid) {
        setIsLoading(true);
        try {
          if (!user || !service) throw new Error("Missing user or service info");

          const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serviceId: serviceId,
              userId: user.id || user._id,
              checkIn: bookingDetails.checkIn,
              checkOut: bookingDetails.checkOut,
              guests: bookingDetails.guests,
              status: "confirmed",
              totalPrice: total,
            }),
          });

          if (!res.ok) throw new Error("Failed to create booking");
          const booking = await res.json();

          router.push(`/booking/confirmation/${booking._id}`);
        } catch (error) {
          console.error("Booking error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }}
  >
    Confirm Booking (Skip Payment)
  </Button>
                 </CardFooter>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">Payment Information</h2>
                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)} className="space-y-4">
                        <FormField
                          control={paymentForm.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Payment Method</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="credit" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      <div className="flex items-center">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Credit Card
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="debit" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      <div className="flex items-center">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Debit Card
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="easypaisa" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      <div className="flex items-center">
                                        <Wallet className="mr-2 h-4 w-4" />
                                        EasyPaisa
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="jazzcash" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      <div className="flex items-center">
                                        <Wallet className="mr-2 h-4 w-4" />
                                        JazzCash
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="rounded-md border p-4">
                          <FormField
                            control={paymentForm.control}
                            name="cardholderName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cardholder Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Name as it appears on card" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={paymentForm.control}
                              name="cardNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Card Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="1234 5678 9012 3456" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={paymentForm.control}
                                name="expiryDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={paymentForm.control}
                                name="cvv"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                      <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-md border p-4">
                          <h3 className="mb-2 font-medium">Billing Address</h3>
                          <p className="text-sm text-muted-foreground">
                            Your billing address will be the same as your account address. To change it, please update
                            your profile.
                          </p>
                        </div>

                        <div className="rounded-md border p-4">
                          <div className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
                            <p className="text-sm">
                              By clicking "Complete Booking", you agree to the{" "}
                              <Link href="/terms" className="text-primary hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                              </Link>
                              .
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Back
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Complete Booking"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                      </span>
                      <div className="flex items-center text-sm">
                        <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                        <span>{service.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <div className="mb-4 flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{service.location}</span>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Check-in</span>
                        </div>
                        <span className="text-sm">{bookingDetails.checkIn.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Check-out</span>
                        </div>
                        <span className="text-sm">{bookingDetails.checkOut.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Guests</span>
                        </div>
                        <span className="text-sm">{bookingDetails.guests}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">
                          Rs {price.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""} × {guests} guest{guests > 1 ? "s" : ""}
                        </span>
                        <span className="text-sm">Rs {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Service fee ({(serviceFeeRate * 100).toFixed(0)}%)</span>
                        <span className="text-sm">Rs {serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Taxes ({(taxRate * 100).toFixed(0)}%)</span>
                        <span className="text-sm">Rs {taxes.toLocaleString()}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>Rs {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
