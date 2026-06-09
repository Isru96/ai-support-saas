import { apiRequest } from "@/lib/api/client"
import type {
  LoginInput,
  LoginResponse,
  MeResponse,
  RegisterInput,
  RegisterResponse,
} from "@/types/auth"

export function login(input: LoginInput) {
  return apiRequest<LoginResponse>("/auth/login", {
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

export function getMe(token: string) {
  return apiRequest<MeResponse>("/auth/me", { token })
}
