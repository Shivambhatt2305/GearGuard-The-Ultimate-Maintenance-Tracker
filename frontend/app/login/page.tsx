"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm, SignupForm } from "@/components/auth"
// Login import



export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate auth
    setTimeout(() => {
      router.push("/")
      setIsLoading(false)
    }, 1000)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">GearGuard Enterprise</h1>
          <p className="text-sm text-muted-foreground">The Ultimate Maintenance Tracker</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <LoginForm />
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <SignupForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
