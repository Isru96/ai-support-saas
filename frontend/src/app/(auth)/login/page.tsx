import { LoginForm } from "@/components/auth/login-form"
import { AuthAlert } from "@/components/auth/auth-alert"
import { AuthShell } from "@/components/layout/auth-shell"

interface LoginPageProps {
  searchParams: Promise<{ reset?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { reset } = await searchParams

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to manage your AI support workspace."
    >
      <div className="space-y-4">
        {reset === "success" && (
          <AuthAlert
            message="Your password has been updated. Sign in with your new password."
            variant="success"
          />
        )}
        <LoginForm />
      </div>
    </AuthShell>
  )
}
