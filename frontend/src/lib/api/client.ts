import type { ApiError } from "@/types/auth"

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
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options

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

  const data = (await response.json().catch(() => ({}))) as T & ApiError

  if (!response.ok) {
    throw new ApiRequestError(
      data.error ?? "Something went wrong. Please try again.",
      response.status
    )
  }

  return data
}
