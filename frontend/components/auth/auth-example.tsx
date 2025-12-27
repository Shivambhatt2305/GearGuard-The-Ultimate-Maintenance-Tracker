// Example of how to integrate authentication in your components

import { useAuth } from "@/hooks/useAuth"

export function AuthExample() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div>Loading authentication...</div>
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this page</div>
  }

  return (
    <div>
      <h1>Welcome, {user?.full_name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.user_role || "Employee"}</p>
      {user?.department && <p>Department: {user.department}</p>}
      
      <button onClick={logout}>Logout</button>
    </div>
  )
}

// Usage: Import and use this component in any page that requires authentication
