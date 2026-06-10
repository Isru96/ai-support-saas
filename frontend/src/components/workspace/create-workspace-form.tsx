"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AuthAlert } from "@/components/auth/auth-alert"
import { FormField } from "@/components/auth/form-field"
import { Button } from "@/components/ui/button"
import { createWorkspace } from "@/lib/api/workspaces"
import { ApiRequestError } from "@/lib/api/client"
import { useWorkspaceStore } from "@/stores/workspace-store"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateWorkspaceForm() {
  const router = useRouter()
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace)
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces)
  const workspaces = useWorkspaceStore((state) => state.workspaces)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "" },
  })

  async function onSubmit(values: FormValues) {
    setError(null)

    try {
      const { workspace } = await createWorkspace({
        name: values.name,
        slug: values.slug || undefined,
      })
      setWorkspaces([...workspaces, workspace])
      setActiveWorkspace(workspace)
      router.replace("/dashboard")
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message)
        return
      }
      setError("Unable to create workspace. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <AuthAlert message={error} />}

      <FormField
        id="name"
        label="Workspace name"
        placeholder="Acme Support"
        error={errors.name}
        {...register("name")}
      />

      <FormField
        id="slug"
        label="URL slug (optional)"
        placeholder="acme-support"
        error={errors.slug}
        {...register("slug")}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create workspace"}
      </Button>
    </form>
  )
}
