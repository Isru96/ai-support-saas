"use client"

import { Building2, Sparkles } from "lucide-react"

import { UserProfileCard } from "@/components/dashboard/user-profile-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useActiveWorkspace } from "@/stores/workspace-store"

export default function DashboardPage() {
  const workspace = useActiveWorkspace()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-muted-foreground">
          Manage your AI support workspace, documents, and team from here.
        </p>
      </div>

      {workspace && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              Active workspace
            </CardTitle>
            <CardDescription>
              You are working inside this tenant space.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Name:</span> {workspace.name}
            </p>
            <p>
              <span className="text-muted-foreground">Slug:</span> {workspace.slug}
            </p>
            <p>
              <span className="text-muted-foreground">Your role:</span>{" "}
              {workspace.role}
            </p>
            <p>
              <span className="text-muted-foreground">Plan:</span> {workspace.plan}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <UserProfileCard />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Coming next
            </CardTitle>
            <CardDescription>Phase 3 and beyond.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Document uploads and knowledge base</p>
            <p>• AI chat with source citations</p>
            <p>• Team invitations and roles</p>
            <p>• Real-time analytics dashboard</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
