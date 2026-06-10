import { DashboardShell } from "@/components/layout/dashboard-shell"
import { WorkspaceBootstrap } from "@/components/workspace/workspace-bootstrap"

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WorkspaceBootstrap>
      <DashboardShell>{children}</DashboardShell>
    </WorkspaceBootstrap>
  )
}
