import { apiRequest } from "@/lib/api/client"
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceResponse,
  WorkspacesResponse,
} from "@/types/workspace"

export function listWorkspaces() {
  return apiRequest<WorkspacesResponse>("/workspaces", { auth: true })
}

export function createWorkspace(input: CreateWorkspaceInput) {
  return apiRequest<WorkspaceResponse>("/workspaces", {
    method: "POST",
    body: input,
    auth: true,
  })
}

export function getWorkspace(id: string) {
  return apiRequest<WorkspaceResponse>(`/workspaces/${id}`, { auth: true })
}

export function updateWorkspace(id: string, input: UpdateWorkspaceInput) {
  return apiRequest<WorkspaceResponse>(`/workspaces/${id}`, {
    method: "PATCH",
    body: input,
    auth: true,
  })
}
