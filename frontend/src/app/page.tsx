"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Rocket, Sparkles } from "lucide-react"

import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"

function LogoMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
      <Sparkles className="size-4" />
    </span>
  )
}

export default function HomePage() {
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (accessToken) {
      router.replace("/dashboard")
    }
  }, [accessToken, router])

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-background">
      {/* Background accents */}
      <div
        aria-hidden
        className="landing-dot-pattern pointer-events-none absolute bottom-0 left-0 h-48 w-72 opacity-40 sm:h-64 sm:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-linear-to-t from-primary/10 via-primary/5 to-transparent sm:h-40"
      />

      <header className="relative z-10 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <LogoMark />
            AI Support
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="rounded-full">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="rounded-full px-5 shadow-md shadow-primary/20">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <section className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center space-y-6 lg:max-w-xl">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Your AI Support,{" "}
              <span className="text-primary">Trained on Your Knowledge</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Register your company, upload your documents, and launch your AI agent in
              seconds.
            </p>
            <div>
              <Button
                size="lg"
                asChild
                className="h-12 rounded-full px-7 text-base shadow-lg shadow-primary/25"
              >
                <Link href="/register">
                  <Rocket className="size-5" />
                  Start Your Free Trial
                </Link>
              </Button>
            </div>
          </div>

          <DashboardPreview />
        </section>
      </main>
    </div>
  )
}
