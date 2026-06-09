export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterResponse {
  user: User
}

export interface MeResponse {
  user: User
}

export interface ApiError {
  error: string
}
