export interface Workspace {
  id: string
  owner_id: string
  name: string
  slug: string
  logo_url?: string | null
  plan: string
  role?: string
  created_at: string
  updated_at: string
}

export interface CreateWorkspaceInput {
  name: string
  slug?: string
}

export interface UpdateWorkspaceInput {
  name?: string
  slug?: string
  logo_url?: string | null
}

export interface WorkspacesResponse {
  workspaces: Workspace[]
}

export interface WorkspaceResponse {
  workspace: Workspace
}
