"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AuthAlert } from "@/components/auth/auth-alert"
import { FormField } from "@/components/auth/form-field"
import { Button } from "@/components/ui/button"
import { getMe, login } from "@/lib/api/auth"
import { ApiRequestError } from "@/lib/api/client"
import { useAuthStore } from "@/stores/auth-store"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState<string | null>(null)

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
      const { token } = await login(values)
      const { user } = await getMe(token)
      setAuth(token, user)
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

      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password}
        {...register("password")}
      />

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
  )
}
