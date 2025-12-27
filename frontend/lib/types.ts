// API Types and Interfaces

export type ApiStatus = "success" | "error"

export interface ApiResponse<T = any> {
  status: ApiStatus
  code: number
  message: string
  data: T | null
}

export interface User {
  user_id: number
  full_name: string
  email: string
  user_role?: string
  department?: string
  avatar_url?: string
  created_at?: string
}

export interface SignupRequest {
  full_name: string
  email: string
  password: string
  user_role?: string
  department?: string
  avatar_url?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}
