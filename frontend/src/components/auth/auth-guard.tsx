"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuthStore } from "@/stores/auth-store"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (!token) {
      router.replace("/login")
    }
  }, [token, router])

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}
