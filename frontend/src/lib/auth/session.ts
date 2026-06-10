import { getMe, login as loginApi } from "@/lib/api/auth"
import type { LoginInput, TokenPair } from "@/types/auth"
import { useAuthStore } from "@/stores/auth-store"

export async function establishSession(tokens: TokenPair) {
  const store = useAuthStore.getState()
  store.setTokens(tokens)
  const { user } = await getMe()
  store.setSession(tokens, user)
}

export async function loginAndEstablishSession(input: LoginInput) {
  const tokens = await loginApi(input)
  await establishSession(tokens)
}
