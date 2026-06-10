"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  )

  const content = (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  if (!googleClientId) {
    return content
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>
  )
}
