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
import { register as registerUser } from "@/lib/api/auth"
import { ApiRequestError } from "@/lib/api/client"
import { loginAndEstablishSession } from "@/lib/auth/session"

const registerSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const hasGoogle = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: RegisterFormValues) {
    setError(null)
    setSuccess(null)

    try {
      const response = await registerUser({
        name: values.name || undefined,
        email: values.email,
        password: values.password,
      })

      setSuccess(response.message)

      await loginAndEstablishSession({
        email: values.email,
        password: values.password,
      })
      router.replace("/dashboard")
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message)
        return
      }
      setError("Unable to create your account. Please try again.")
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
        {success && <AuthAlert message={success} variant="success" />}

        <FormField
          id="name"
          label="Name (optional)"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          error={errors.name}
          {...register("name")}
        />

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
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={errors.password}
          {...register("password")}
        />

        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
