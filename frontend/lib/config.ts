// Environment configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  TIMEOUT: 30000,
}

export const AUTH_CONFIG = {
  TOKEN_KEY: "access_token",
  REDIRECT_LOGIN: "/login",
  REDIRECT_DASHBOARD: "/",
}
