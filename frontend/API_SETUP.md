# API Configuration

Add this to your `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Files Created

### 1. `lib/types.ts`
- Type definitions for API requests/responses
- User interface
- Auth types

### 2. `lib/api.ts`
- API Client class with methods for:
  - GET, POST, PUT, DELETE requests
  - Login/Signup
  - Token management
  - Auto redirect on 401

### 3. `hooks/useAuth.ts`
- React hook for managing authentication state
- Handles login, signup, logout
- Auto-checks authentication on mount

### 4. `app/providers.tsx`
- AuthProvider component for Context API
- Wraps app with authentication context

### 5. `lib/config.ts`
- Centralized configuration
- API base URL
- Auth constants

## Usage in Components

```tsx
import { useAuth } from "@/hooks/useAuth"

export function LoginForm() {
  const { login, isLoading, error } = useAuth()
  
  const handleLogin = async (email: string, password: string) => {
    const result = await login({ email, password })
    if (result.success) {
      // Redirects to home automatically
    }
  }
}
```

## Next Steps

1. Update `app/layout.tsx` to wrap with `AuthProvider`
2. Update `app/login/page.tsx` to use `useAuth()` hook
3. Create protected route wrapper
4. Set `NEXT_PUBLIC_API_URL` in `.env.local`
