"use client"

import Link from "next/link"
import { Bot, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { logout } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/auth-store"
import { useWorkspaceStore } from "@/stores/workspace-store"

export function AppHeader() {
  const router = useRouter()
  const { user, refreshToken, clearAuth } = useAuthStore()
  const clearWorkspaces = useWorkspaceStore((state) => state.clearWorkspaces)
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleLogout() {
    setIsSigningOut(true)

    try {
      if (refreshToken) {
        await logout(refreshToken)
      }
    } catch {
      // Clear local session even if the API call fails.
    } finally {
      clearAuth()
      clearWorkspaces()
      router.replace("/login")
      setIsSigningOut(false)
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bot className="size-4" />
          </span>
          AI Support
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isSigningOut}
          >
            <LogOut className="size-4" />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </div>
    </header>
  )
}
