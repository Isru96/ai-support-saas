import { VerifyEmailClient } from "@/components/auth/verify-email-client"
import { AuthShell } from "@/components/layout/auth-shell"

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token = "" } = await searchParams

  return (
    <AuthShell
      title="Verify your email"
      description="Confirming your email address."
    >
      <VerifyEmailClient token={token} />
    </AuthShell>
  )
}
