"use client"

import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"

import { AuthAlert } from "@/components/auth/auth-alert"
import { AuthShell } from "@/components/layout/auth-shell"
import { googleAuthCode } from "@/lib/api/auth"
import { ApiRequestError } from "@/lib/api/client"
import { establishSession } from "@/lib/auth/session"

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) {
      return
    }

    const code = searchParams.get("code")
    const oauthError = searchParams.get("error")

    if (oauthError) {
      setError("Google sign-in was cancelled or denied.")
      return
    }

    if (!code) {
      setError("Missing Google authorization code.")
      return
    }

    startedRef.current = true
    const authCode = code

    async function completeSignIn() {
      try {
        const redirectUri = `${window.location.origin}/auth/google/callback`
        const tokens = await googleAuthCode(authCode, redirectUri)
        await establishSession(tokens)
        router.replace("/dashboard")
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError(err.message)
          return
        }
        setError("Unable to complete Google sign-in. Please try again.")
      }
    }

    completeSignIn()
  }, [searchParams, router])

  return (
    <AuthShell title="Signing in" description="Completing Google sign-in...">
      <div className="space-y-4 py-6">
        {error ? (
          <>
            <AuthAlert message={error} />
            <button
              type="button"
              className="text-sm font-medium underline underline-offset-4"
              onClick={() => router.replace("/login")}
            >
              Back to sign in
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Please wait while we sign you in...
            </p>
          </div>
        )}
      </div>
    </AuthShell>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Signing in" description="Completing Google sign-in...">
          <div className="flex justify-center py-6">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </AuthShell>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  )
}
