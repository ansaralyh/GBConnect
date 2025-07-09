"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mountain, Loader2, User, Mail, Lock, Phone, MapPin, UserCircle2, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    role: z.enum(["tourist", "provider"]),
    location: z.string().optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function SignupForm() {
  const { register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const defaultRole = searchParams.get("role") === "provider" ? "provider" : "tourist"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: defaultRole,
      location: "",
      termsAccepted: false,
    },
  })

  const nextStep = () => {
    if (step === 1) {
      const { email, password, confirmPassword } = form.getValues()
      const isValid = form.trigger(["email", "password", "confirmPassword"])

      if (isValid && password === confirmPassword) {
        setStep(2)
      }
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await register(values)
      toast({
        title: "Registration successful",
        description: "Welcome to GBConnect!",
      })

      // Redirect to login page after successful registration
      router.push("/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please check your information and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto grid w-full max-w-[1000px] gap-6 rounded-lg border bg-card p-10 shadow-lg md:grid-cols-2">
        <div className="relative hidden overflow-hidden rounded-l-lg md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/placeholder.svg?height=600&width=500')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 bg-primary/40"></div>
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
            <div>
              <Mountain className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Join GBConnect and explore the heart of Gilgit Baltistan</h2>
              <p className="mt-2">Create an account to discover authentic experiences and connect with locals</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="mb-2 flex items-center justify-center md:hidden">
              <Mountain className="mr-2 h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GBconnect</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
            <p className="text-sm text-muted-foreground">Join GBconnect and explore the heart of Gilgit Baltistan</p>
          </div>

          <div className="mb-6">
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
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span>Account</span>
              <span>Profile</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Enter your email" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="Create a password" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="Confirm your password" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="button" className="w-full" onClick={nextStep}>
                    Continue
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Enter your full name" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Enter your phone number" className="pl-9" {...field} />
                          </div>
                        </FormControl>
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
                            <Input placeholder="Enter your location" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>I am a</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <FormItem>
                              <FormControl>
                                <div
                                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-4 hover:border-primary ${field.value === "tourist" ? "border-2 border-primary bg-primary/5" : ""}`}
                                  onClick={() => field.onChange("tourist")}
                                  role="button"
                                  tabIndex={0}
                                  onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') field.onChange("tourist") }}
                                >
                                  <RadioGroupItem value="tourist" id="tourist" className="sr-only" />
                                  <UserCircle2 className="mb-2 h-6 w-6 text-primary" />
                                  <FormLabel htmlFor="tourist" className="cursor-pointer font-normal">
                                    Tourist
                                  </FormLabel>
                                </div>
                              </FormControl>
                            </FormItem>
                            <FormItem>
                              <FormControl>
                                <div
                                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-4 hover:border-primary ${field.value === "provider" ? "border-2 border-primary bg-primary/5" : ""}`}
                                  onClick={() => field.onChange("provider")}
                                  role="button"
                                  tabIndex={0}
                                  onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') field.onChange("provider") }}
                                >
                                  <RadioGroupItem value="provider" id="provider" className="sr-only" />
                                  <Building2 className="mb-2 h-6 w-6 text-primary" />
                                  <FormLabel htmlFor="provider" className="cursor-pointer font-normal">
                                    Service Provider
                                  </FormLabel>
                                </div>
                              </FormControl>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I agree to the{" "}
                            <Link href="/terms" className="font-medium text-primary hover:underline">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="font-medium text-primary hover:underline">
                              Privacy Policy
                            </Link>
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-full" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

        

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
