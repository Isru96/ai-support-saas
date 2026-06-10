"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { listWorkspaces } from "@/lib/api/workspaces"
import { useWorkspaceStore } from "@/stores/workspace-store"

export function WorkspaceBootstrap({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const { workspaces } = await listWorkspaces()
        setWorkspaces(workspaces)

        if (workspaces.length === 0) {
          router.replace("/onboarding")
          return
        }

        setReady(true)
      } catch {
        router.replace("/login")
      }
    }

    loadWorkspaces()
  }, [router, setWorkspaces])

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground">
        Loading workspace...
      </div>
    )
  }

  return <>{children}</>
}
