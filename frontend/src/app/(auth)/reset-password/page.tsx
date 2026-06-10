import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthShell } from "@/components/layout/auth-shell"

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token = "" } = await searchParams

  return (
    <AuthShell
      title="Choose a new password"
      description="Enter a new password for your account."
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  )
}
