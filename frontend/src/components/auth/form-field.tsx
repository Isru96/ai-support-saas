"use client"

import type { FieldError } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  id: string
  label: string
  error?: FieldError
}

export function FormField({
  id,
  label,
  error,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        className={cn(className)}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  )
}
