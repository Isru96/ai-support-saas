import { LoginForm } from "@/components/auth/login-form"
import { AuthShell } from "@/components/layout/auth-shell"

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to manage your AI support workspace."
    >
      <LoginForm />
    </AuthShell>
  )
}
