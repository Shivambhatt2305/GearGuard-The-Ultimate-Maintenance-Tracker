"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SignupForm() {
  const { signup, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    user_role: "",
    department: "",
    password: "",
    confirmPassword: "",
  })
  const [localError, setLocalError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setLocalError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.full_name || !formData.email || !formData.password) {
      setLocalError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters")
      return
    }

    const { confirmPassword, ...signupData } = formData
    const result = await signup(signupData)
    if (!result.success) {
      setLocalError(result.error || "Signup failed")
    }
  }

  const displayError = localError || error

  return (
    <>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Register to start managing your maintenance operations.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {displayError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              name="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_role">User Role</Label>
            <Input
              id="user_role"
              name="user_role"
              placeholder="Employee"
              value={formData.user_role}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              placeholder="Engineering"
              value={formData.department}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </CardFooter>
      </form>
    </>
  )
}
