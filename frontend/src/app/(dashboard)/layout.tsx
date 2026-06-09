import { AuthGuard } from "@/components/auth/auth-guard"
import { AppHeader } from "@/components/layout/app-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-full flex-1 flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  )
}
