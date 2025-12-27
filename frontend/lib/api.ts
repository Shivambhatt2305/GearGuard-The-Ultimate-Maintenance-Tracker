// API Client for backend communication
import { ApiResponse, AuthResponse, LoginRequest, SignupRequest } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Add auth token if available
    const token = this.getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data: ApiResponse<T> = await response.json()

      // Handle unauthorized
      if (response.status === 401) {
        this.clearToken()
        // Redirect to login if needed
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      return {
        status: "error",
        code: 500,
        message: error instanceof Error ? error.message : "An error occurred",
        data: null,
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
    })
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }

  // Auth Methods
  async signup(data: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>("/api/v1/users/signup", data)
    if (response.status === "success" && response.data?.access_token) {
      this.setToken(response.data.access_token)
    }
    return response
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>("/api/v1/users/login", data)
    if (response.status === "success" && response.data?.access_token) {
      this.setToken(response.data.access_token)
    }
    return response
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    const token = this.getToken()
    if (!token) {
      return {
        status: "error",
        code: 401,
        message: "Not authenticated",
        data: null,
      }
    }
    return this.get("/api/v1/users/me")
  }

  logout(): void {
    this.clearToken()
  }

  // Token Management
  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token")
    }
    return null
  }

  private clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const apiClient = new ApiClient()
