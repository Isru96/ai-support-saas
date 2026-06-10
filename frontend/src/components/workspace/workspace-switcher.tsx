"use client"

import { Building2, Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  useActiveWorkspace,
  useWorkspaceStore,
} from "@/stores/workspace-store"
import { cn } from "@/lib/utils"

export function WorkspaceSwitcher() {
  const workspaces = useWorkspaceStore((state) => state.workspaces)
  const activeWorkspace = useActiveWorkspace()
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace)
  const [open, setOpen] = useState(false)

  if (!activeWorkspace) {
    return null
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between gap-2"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Building2 className="size-4 shrink-0" />
          <span className="truncate">{activeWorkspace.name}</span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute top-full z-20 mt-2 w-full rounded-lg border bg-popover p-1 shadow-md">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              type="button"
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted",
                workspace.id === activeWorkspace.id && "bg-muted"
              )}
              onClick={() => {
                setActiveWorkspace(workspace)
                setOpen(false)
              }}
            >
              <span className="truncate">{workspace.name}</span>
              {workspace.id === activeWorkspace.id && (
                <Check className="size-4 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
