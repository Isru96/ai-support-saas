import { apiRequest } from "@/lib/api/client"
import type {
  CheckEmailResponse,
  LoginInput,
  MeResponse,
  MessageResponse,
  RegisterInput,
  RegisterResponse,
  TokenPair,
} from "@/types/auth"

export function checkEmail(email: string) {
  return apiRequest<CheckEmailResponse>("/auth/check-email", {
    method: "POST",
    body: { email },
  })
}

export function googleAuth(credential: string) {
  return apiRequest<TokenPair>("/auth/google", {
    method: "POST",
    body: { credential },
  })
}

export function googleAuthCode(code: string, redirectUri: string) {
  return apiRequest<TokenPair>("/auth/google/code", {
    method: "POST",
    body: { code, redirect_uri: redirectUri },
  })
}

export function login(input: LoginInput) {
  return apiRequest<TokenPair>("/auth/login", {
    method: "POST",
    body: input,
  })
}

export function register(input: RegisterInput) {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: input,
  })
}

export function refresh(refreshToken: string) {
  return apiRequest<TokenPair>("/auth/refresh", {
    method: "POST",
    body: { refresh_token: refreshToken },
  })
}

export function logout(refreshToken: string) {
  return apiRequest<MessageResponse>("/auth/logout", {
    method: "POST",
    body: { refresh_token: refreshToken },
  })
}

export function forgotPassword(email: string) {
  return apiRequest<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  })
}

export function resetPassword(token: string, password: string) {
  return apiRequest<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: { token, password },
  })
}

export function verifyEmail(token: string) {
  return apiRequest<MessageResponse>("/auth/verify-email", {
    method: "POST",
    body: { token },
  })
}

export function getMe() {
  return apiRequest<MeResponse>("/auth/me", { auth: true })
}
