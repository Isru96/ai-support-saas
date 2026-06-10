import Link from "next/link"
import { Bot } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AuthShellProps {
  title?: string
  description?: string
  children: React.ReactNode
}

export function AuthShell({
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-5" />
            </span>
            <span className="text-xl font-semibold tracking-tight">
              AI Support
            </span>
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            Train AI assistants on your company knowledge and deliver instant
            support.
          </p>
        </div>

        <Card>
          {title && description ? (
            <CardHeader>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          ) : null}
          <CardContent className={title ? undefined : "pt-6"}>{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
