"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AuthAlert } from "@/components/auth/auth-alert"
import { FormField } from "@/components/auth/form-field"
import { Button } from "@/components/ui/button"
import { updateWorkspace } from "@/lib/api/workspaces"
import { ApiRequestError } from "@/lib/api/client"
import {
  useActiveWorkspace,
  useWorkspaceStore,
} from "@/stores/workspace-store"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
})

type FormValues = z.infer<typeof schema>

export function WorkspaceSettingsForm() {
  const workspace = useActiveWorkspace()
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces)
  const workspaces = useWorkspaceStore((state) => state.workspaces)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: workspace?.name ?? "",
      slug: workspace?.slug ?? "",
    },
  })

  if (!workspace) {
    return null
  }

  async function onSubmit(values: FormValues) {
    setError(null)
    setSuccess(null)

    try {
      const { workspace: updated } = await updateWorkspace(workspace!.id, values)
      setWorkspaces(
        workspaces.map((item) => (item.id === updated.id ? updated : item))
      )
      setSuccess("Workspace updated successfully.")
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message)
        return
      }
      setError("Unable to update workspace.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      {error && <AuthAlert message={error} />}
      {success && <AuthAlert message={success} variant="success" />}

      <FormField
        id="name"
        label="Workspace name"
        error={errors.name}
        {...register("name")}
      />

      <FormField
        id="slug"
        label="URL slug"
        error={errors.slug}
        {...register("slug")}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  )
}
