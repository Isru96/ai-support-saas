import { RegisterForm } from "@/components/auth/register-form"
import { AuthShell } from "@/components/layout/auth-shell"

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start building an AI assistant trained on your company knowledge."
    >
      <RegisterForm />
    </AuthShell>
  )
}
