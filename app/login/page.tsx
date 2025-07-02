import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <LoginForm />
      </main>
    </div>
  )
}
