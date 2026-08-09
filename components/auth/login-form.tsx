"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mountain, Loader2, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
})

export function LoginForm() {
  const { login, user, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Redirect user based on role after login
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "provider") {
        router.push("/dashboard/provider")
      } else if (user.role === "tourist") {
        router.push("/dashboard/tourist")
      }
    }
  }, [isAuthenticated, user, router])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      await login(values.email, values.password)
      toast({
        title: "Login successful",
        description: "Welcome back to GBConnect!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-[hsl(var(--gb-glacier))/0.15]" />
      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-primary/10 md:grid-cols-2">
        <div className="relative hidden min-h-[520px] md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/fyp.pic19.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/20" />
          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
            <div className="flex items-center gap-2">
              <Mountain className="h-7 w-7" />
              <span className="font-display text-lg font-semibold">GBConnect</span>
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight">
                Discover Gilgit Baltistan with locals
              </h2>
              <p className="mt-3 text-white/85">
                Authentic hospitality, mountain roads, and experiences you won&apos;t find in a guidebook.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div className="mb-8 text-center md:text-left">
            <div className="mb-3 flex items-center justify-center md:hidden">
              <Mountain className="mr-2 h-6 w-6 text-primary" />
              <span className="font-display text-xl font-semibold">GBConnect</span>
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to continue your journey</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter your email" className="h-11 pl-9" {...field} />
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
                        <Input type="password" placeholder="Enter your password" className="h-11 pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                    </FormItem>
                  )}
                />

                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="h-11 w-full" disabled={loading || isLoading}>
                {loading || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
