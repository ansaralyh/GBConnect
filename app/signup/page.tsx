import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <SignupForm />
      </main>
    </div>
  )
}
