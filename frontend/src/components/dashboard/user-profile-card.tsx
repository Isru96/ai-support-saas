"use client"

import { useQuery } from "@tanstack/react-query"
import { CalendarDays, Mail, User } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getMe } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/auth-store"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function UserProfileCard() {
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me", token],
    queryFn: async () => {
      const response = await getMe(token!)
      setUser(response.user)
      return response.user
    },
    enabled: !!token,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>Loading account details...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>
            Unable to load your account. Try signing in again.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your profile</CardTitle>
        <CardDescription>
          Account connected to the backend API.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
          <User className="size-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">User ID</p>
            <p className="font-mono text-sm">{data.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
          <Mail className="size-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm">{data.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
          <CalendarDays className="size-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Member since</p>
            <p className="text-sm">{formatDate(data.created_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
