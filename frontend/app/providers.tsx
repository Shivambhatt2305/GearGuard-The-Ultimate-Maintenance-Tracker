// Authentication Context
"use client"

import React, { createContext, useContext } from "react"
import { useAuth } from "@/hooks/useAuth"
import { User, LoginRequest, SignupRequest } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>
  signup: (data: SignupRequest) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
