import { WorkspaceSettingsForm } from "@/components/workspace/workspace-settings-form"

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Workspace settings
        </h1>
        <p className="text-muted-foreground">
          Update your workspace name and slug.
        </p>
      </div>
      <WorkspaceSettingsForm />
    </div>
  )
}
