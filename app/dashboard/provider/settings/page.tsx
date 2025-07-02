import { UserProfileSettings } from "@/components/settings/user-profile-settings"

export default function ProviderSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <UserProfileSettings userType="provider" />
      </main>
    </div>
  )
}
