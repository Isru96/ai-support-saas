"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Workspace } from "@/types/workspace"

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  setWorkspaces: (workspaces: Workspace[]) => void
  setActiveWorkspace: (workspace: Workspace) => void
  clearWorkspaces: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [],
      activeWorkspaceId: null,
      setWorkspaces: (workspaces) =>
        set((state) => ({
          workspaces,
          activeWorkspaceId:
            state.activeWorkspaceId &&
            workspaces.some((w) => w.id === state.activeWorkspaceId)
              ? state.activeWorkspaceId
              : workspaces[0]?.id ?? null,
        })),
      setActiveWorkspace: (workspace) =>
        set({ activeWorkspaceId: workspace.id }),
      clearWorkspaces: () =>
        set({ workspaces: [], activeWorkspaceId: null }),
    }),
    {
      name: "ai-support-workspace",
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    }
  )
)

export function useActiveWorkspace() {
  const workspaces = useWorkspaceStore((state) => state.workspaces)
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId)
  return workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? null
}
