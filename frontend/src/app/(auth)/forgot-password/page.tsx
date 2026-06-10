import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthShell } from "@/components/layout/auth-shell"

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
