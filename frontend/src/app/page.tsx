"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowRight, Bot, Shield, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"

export default function HomePage() {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (token) {
      router.replace("/dashboard")
    }
  }, [token, router])

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bot className="size-4" />
            </span>
            AI Support
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-4 py-16 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              AI Customer Support SaaS
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Turn your documentation into an intelligent support assistant.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Upload company knowledge, generate embeddings, and answer customer
              questions with accurate, source-backed AI responses.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  Create free account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Secure auth</CardTitle>
                <CardDescription>
                  Register, sign in, and access protected routes with JWT.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Shield className="size-5 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Knowledge base</CardTitle>
                <CardDescription>
                  Upload PDFs and documents to train your assistant.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">RAG chat</CardTitle>
                <CardDescription>
                  Ask questions and get answers with source citations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
