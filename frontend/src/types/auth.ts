export interface User {
  id: string
  name?: string | null
  email: string
  avatar_url?: string | null
  email_verified: boolean
  last_login_at?: string | null
  created_at: string
  updated_at: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name?: string
  email: string
  password: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  expires_in: number
  token?: string
}

export interface RegisterResponse {
  user: User
  message: string
}

export interface MeResponse {
  user: User
}

export interface MessageResponse {
  message: string
}

export interface CheckEmailResponse {
  exists: boolean
}

export interface ApiError {
  error: string
}
