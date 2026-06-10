"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

import { AuthAlert } from "@/components/auth/auth-alert"
import { Button } from "@/components/ui/button"
import { getMe, verifyEmail } from "@/lib/api/auth"
import { ApiRequestError } from "@/lib/api/client"
import { useAuthStore } from "@/stores/auth-store"

interface VerifyEmailClientProps {
  token: string
}

export function VerifyEmailClient({ token }: VerifyEmailClientProps) {
  const setUser = useAuthStore((state) => state.setUser)
  const accessToken = useAuthStore((state) => state.accessToken)
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error")
        setMessage("Verification link is invalid or missing.")
        return
      }

      try {
        const response = await verifyEmail(token)
        setStatus("success")
        setMessage(response.message)

        if (accessToken) {
          const { user } = await getMe()
          setUser(user)
        }
      } catch (err) {
        setStatus("error")
        setMessage(
          err instanceof ApiRequestError
            ? err.message
            : "Unable to verify your email. Please try again."
        )
      }
    }

    verify()
  }, [token, accessToken, setUser])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Verifying your email...</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="size-10 text-emerald-600" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Button asChild className="w-full">
          <Link href={accessToken ? "/dashboard" : "/login"}>
            {accessToken ? "Go to dashboard" : "Sign in"}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <XCircle className="size-10 text-destructive" />
      </div>
      <AuthAlert message={message} />
      <Button variant="outline" asChild className="w-full">
        <Link href="/login">Back to sign in</Link>
      </Button>
    </div>
  )
}
