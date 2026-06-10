"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AuthAlert } from "@/components/auth/auth-alert"
import { FormField } from "@/components/auth/form-field"
import { Button } from "@/components/ui/button"
import { forgotPassword } from "@/lib/api/auth"
import { ApiRequestError } from "@/lib/api/client"

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: FormValues) {
    setError(null)
    setSuccess(null)

    try {
      const response = await forgotPassword(values.email)
      setSuccess(response.message)
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message)
        return
      }
      setError("Unable to process your request. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <AuthAlert message={error} />}
      {success && <AuthAlert message={success} variant="success" />}

      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        error={errors.email}
        {...register("email")}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
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
