import { CreateWorkspaceForm } from "@/components/workspace/create-workspace-form"
import { AuthShell } from "@/components/layout/auth-shell"

export default function OnboardingPage() {
  return (
    <AuthShell
      title="Create your workspace"
      description="Workspaces keep your team, documents, and AI assistant organized."
    >
      <CreateWorkspaceForm />
    </AuthShell>
  )
}
