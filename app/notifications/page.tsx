import { NotificationCenter } from "@/components/notifications/notification-center"

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <NotificationCenter />
      </main>
    </div>
  )
}
