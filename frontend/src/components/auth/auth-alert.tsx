import { cn } from "@/lib/utils"

interface AuthAlertProps {
  message: string
  variant?: "error" | "success"
}

export function AuthAlert({ message, variant = "error" }: AuthAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variant === "error" &&
          "border-destructive/30 bg-destructive/10 text-destructive",
        variant === "success" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      )}
    >
      {message}
    </div>
  )
}
