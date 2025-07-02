import { UserProfileSettings } from "@/components/settings/user-profile-settings"

export default function TouristSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <UserProfileSettings userType="tourist" />
      </main>
    </div>
  )
}
