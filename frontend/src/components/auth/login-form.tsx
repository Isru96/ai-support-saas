"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AuthAlert } from "@/components/auth/auth-alert"
import { AuthDivider } from "@/components/auth/auth-divider"
import { FormField } from "@/components/auth/form-field"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { Button } from "@/components/ui/button"
import { ApiRequestError } from "@/lib/api/client"
import { loginAndEstablishSession } from "@/lib/auth/session"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const hasGoogle = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setError(null)

    try {
      await loginAndEstablishSession(values)
      router.replace("/dashboard")
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message)
        return
      }
      setError("Unable to sign in. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      {hasGoogle && (
        <>
          <GoogleSignInButton />
          <AuthDivider />
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <AuthAlert message={error} />}

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email}
          {...register("email")}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Password</span>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <FormField
            id="password"
            label="Password"
            labelClassName="sr-only"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            {...register("password")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  )
}
