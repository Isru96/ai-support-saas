import { Sparkles } from "lucide-react"

import { UserProfileCard } from "@/components/dashboard/user-profile-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-muted-foreground">
          You are signed in. Workspace management, documents, and AI chat will
          appear here as backend features are added.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <UserProfileCard />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Coming next
            </CardTitle>
            <CardDescription>
              Planned modules from your product roadmap.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Workspaces and team members</p>
            <p>• Document uploads and knowledge base</p>
            <p>• AI chat with source citations</p>
            <p>• Real-time analytics dashboard</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
