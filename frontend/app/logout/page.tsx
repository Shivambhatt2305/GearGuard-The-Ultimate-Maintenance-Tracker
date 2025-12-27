"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated")
      // remove cookie
      document.cookie = "isAuthenticated=; path=/; max-age=0"
    }
    router.replace('/login')
  }, [router])
  return null
}
