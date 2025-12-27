// React Hook for Authentication
"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { User, LoginRequest, SignupRequest } from "@/lib/types"

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  })

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (apiClient.isAuthenticated()) {
        const response = await apiClient.getCurrentUser()
        if (response.status === "success" && response.data) {
          setState({
            user: response.data,
            isLoading: false,
            error: null,
            isAuthenticated: true,
          })
        }
      }
    }
    checkAuth()
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    const response = await apiClient.login(credentials)

    if (response.status === "success" && response.data) {
      setState({
        user: response.data.user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      })
      router.push("/")
      return { success: true }
    } else {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.message,
      }))
      return { success: false, error: response.message }
    }
  }, [router])

  const signup = useCallback(async (data: SignupRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    const response = await apiClient.signup(data)

    if (response.status === "success" && response.data) {
      setState({
        user: response.data.user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      })
      router.push("/")
      return { success: true }
    } else {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.message,
      }))
      return { success: false, error: response.message }
    }
  }, [router])

  const logout = useCallback(() => {
    apiClient.logout()
    setState({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    })
    router.push("/login")
  }, [router])

  return {
    ...state,
    login,
    signup,
    logout,
  }
}
