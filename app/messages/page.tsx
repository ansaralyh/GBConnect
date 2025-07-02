import { MessagingInterface } from "@/components/messaging/messaging-interface"

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <MessagingInterface />
      </main>
    </div>
  )
}
