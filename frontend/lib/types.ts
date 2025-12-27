// API Types and Interfaces

export type ApiStatus = "success" | "error"

export interface ApiResponse<T = any> {
  status: ApiStatus
  code: number
  message: string
  data: T | null
}

export interface User {
  id: number
  email: string
}

export interface SignupRequest {
  email: string
  password: string
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
