# Authentication Setup - Frontend

## Overview
The frontend has been integrated with the FastAPI backend authentication system. All authentication logic is properly connected and the login/signup pages are fully functional.

## Components Created

### 1. **Login Form** (`components/auth/login-form.tsx`)
- Handles user login with email and password
- Form validation
- Error display with Alert component
- Loading states
- Integrated with `useAuth` hook

### 2. **Signup Form** (`components/auth/signup-form.tsx`)
- Handles user registration with full_name, email, and password
- Confirms password matching
- Password minimum length validation (6 chars)
- Error display with Alert component
- Loading states
- Integrated with `useAuth` hook

### 3. **Login Page** (`app/login/page.tsx`)
- Combines Login and Signup forms in tabs
- Professional UI with GearGuard branding
- Responsive design

## Files Updated

### Type Definitions (`lib/types.ts`)
- **User Interface**: Updated to match backend schema
  - `user_id` (instead of `id`)
  - `full_name`, `email`, `user_role`, `department`, `avatar_url`, `created_at`

- **SignupRequest**: Now includes `full_name` field

### API Client (`lib/api.ts`)
- Enhanced error handling for 401 responses
- Better type safety with User import
- Proper Bearer token handling

## API Response Structure
All requests follow the standard FastAPI response format:

```json
{
  "status": "success" | "error",
  "code": 200 | 400 | 401 | 500,
  "message": "Human readable message",
  "data": {
    // Response data (null for errors)
  }
}
```

## Authentication Flow

### Login Flow
1. User enters email and password
2. Form validates input
3. `apiClient.login()` sends POST request to `/api/v1/users/login`
4. Backend returns access token and user data
5. Token is stored in localStorage
6. User is redirected to dashboard

### Signup Flow
1. User enters full name, email, and password
2. Form validates:
   - All fields filled
   - Passwords match
   - Password min 6 characters
3. `apiClient.signup()` sends POST request to `/api/v1/users/signup`
4. Backend creates user and credential entries
5. Returns access token and user data
6. Token is stored in localStorage
7. User is redirected to dashboard

### Token Management
- Token stored in `localStorage.access_token`
- Automatically sent with all API requests via `Authorization: Bearer {token}` header
- Auto logout on 401 response (unauthorized)

## Environment Configuration

### `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### `lib/config.ts`
- `API_CONFIG.BASE_URL`: FastAPI server URL
- `AUTH_CONFIG.TOKEN_KEY`: localStorage key for token
- `AUTH_CONFIG.REDIRECT_LOGIN`: Redirect on logout
- `AUTH_CONFIG.REDIRECT_DASHBOARD`: Redirect on login

## Usage in Components

### Using `useAuth` Hook
```typescript
import { useAuth } from "@/hooks/useAuth"

export function MyComponent() {
  const { user, isLoading, error, isAuthenticated, login, signup, logout } = useAuth()

  // Use auth state and methods
}
```

### Protecting Routes
To add route protection, middleware can be added to check for valid tokens in `_middleware.ts` or using Next.js Route Handlers.

## Testing

### Test Login
```
Email: admin@gearguard.com (or any registered user)
Password: password123
```

### Test Signup
1. Go to `/login` tab to "Register"
2. Fill in form with new credentials
3. Password must match confirmation
4. Click Register

## Next Steps

1. **Add Protected Routes**: Create middleware to protect dashboard routes
2. **Add Logout Button**: Add logout button to dashboard header
3. **Persist Auth State**: Persist user state on page reload
4. **Add 2FA**: Implement two-factor authentication if needed
5. **Add Password Reset**: Implement forgot password functionality

## Backend Integration Status

✅ Signup endpoint working
✅ Login endpoint working
✅ User model matching
✅ Request/response structure aligned
✅ Token generation and validation

## Common Issues

### "Not authenticated" error
- Ensure token is stored in localStorage
- Verify API_URL is correct in .env.local
- Check that token is valid and not expired

### CORS errors
- Make sure FastAPI backend has CORS enabled for http://localhost:3000

### Invalid credentials
- Verify email exists in database
- Check password is correct
- Ensure user was created via signup endpoint first
