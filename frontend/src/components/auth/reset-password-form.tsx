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
import { resetPassword } from "@/lib/api/auth"
import { ApiRequestError } from "@/lib/api/client"

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setError(null)

    try {
      await resetPassword(token, values.password)
      router.replace("/login?reset=success")
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message)
        return
      }
      setError("Unable to reset your password. Please try again.")
    }
  }

  if (!token) {
    return (
      <AuthAlert message="Reset link is invalid or missing. Request a new one." />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <AuthAlert message={error} />}

      <FormField
        id="password"
        label="New password"
        type="password"
        placeholder="At least 6 characters"
        autoComplete="new-password"
        error={errors.password}
        {...register("password")}
      />

      <FormField
        id="confirmPassword"
        label="Confirm new password"
        type="password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword}
        {...register("confirmPassword")}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update password"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
