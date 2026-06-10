import type { ApiError, TokenPair } from "@/types/auth"
import { useAuthStore } from "@/stores/auth-store"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  auth?: boolean
  retry?: boolean
}

let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken, setTokens, clearAuth } = useAuthStore.getState()

  if (!refreshToken) {
    clearAuth()
    return false
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    const data = (await response.json().catch(() => ({}))) as TokenPair & ApiError

    if (!response.ok) {
      clearAuth()
      return false
    }

    setTokens(data)
    return true
  } catch {
    clearAuth()
    return false
  }
}

async function tryRefreshToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = false, retry = true } = options
  let token = options.token

  if (auth && !token) {
    token = useAuthStore.getState().accessToken
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401 && auth && retry) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      return apiRequest<T>(path, { ...options, retry: false })
    }
  }

  const data = (await response.json().catch(() => ({}))) as T & ApiError

  if (!response.ok) {
    throw new ApiRequestError(
      data.error ?? "Something went wrong. Please try again.",
      response.status
    )
  }

  return data
}
