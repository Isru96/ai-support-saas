"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { User } from "@/types/auth"

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "ai-support-auth",
      partialize: (state) => ({ token: state.token }),
    }
  )
)
