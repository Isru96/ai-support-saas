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
import { getMe, login, register as registerUser } from "@/lib/api/auth"
import { ApiRequestError } from "@/lib/api/client"
import { useAuthStore } from "@/stores/auth-store"

const registerSchema = z
  .object({
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
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: RegisterFormValues) {
    setError(null)

    try {
      await registerUser({
        email: values.email,
        password: values.password,
      })

      const { token } = await login({
        email: values.email,
        password: values.password,
      })
      const { user } = await getMe(token)
      setAuth(token, user)
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
  )
}
