# Authentication System Documentation

## Overview

A stunning, secure authentication system protecting both the Portfolio and Her Promise dashboards with password-only login.

## Features

### 🎨 Beautiful Design

- **Glassmorphism UI** with backdrop blur effects
- **Animated backgrounds** with rotating gradients
- **Smooth transitions** and hover effects
- **Responsive design** for all screen sizes
- **Theme-specific colors**:
  - Portfolio: Blue/Purple gradient
  - Her Promise: Pink/Purple gradient

### 🔐 Security Features

- Cookie-based session management
- HTTP-only cookies for security
- 7-day session expiration
- Separate authentication for each dashboard
- Password verification from environment variables
- Automatic redirect to login for protected routes

### 🚀 User Experience

- Show/hide password toggle
- Loading states during authentication
- Error messages for invalid credentials
- Redirect to requested page after login
- Logout functionality in dashboard layouts
- Smooth animations and transitions

## Routes

### Login Pages

- `/portfolio/login` - Portfolio dashboard login
- `/login` - Her Promise dashboard login

### Protected Routes

- `/portfolio/dashboard/*` - All portfolio dashboard pages
- `/dashboard/*` - All Her Promise dashboard pages

### API Endpoints

- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Clear session

## Environment Variables

Add these to your `.env` file:

```bash
# Dashboard Authentication
PORTFOLIO_DASHBOARD_PASSWORD="patience2025"
HERPROMISE_DASHBOARD_PASSWORD="herpromise2025"
```

### For Vercel Deployment

Add these environment variables in your Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - `PORTFOLIO_DASHBOARD_PASSWORD` = `patience2025`
   - `HERPROMISE_DASHBOARD_PASSWORD` = `herpromise2025`
3. Select: Production, Preview, Development
4. Click **Save**

## Architecture

### Middleware (`middleware.ts`)

- Intercepts requests to protected routes
- Verifies authentication cookie
- Redirects to appropriate login page if not authenticated
- Preserves original URL for post-login redirect

### Authentication Library (`lib/auth.ts`)

Functions:

- `setAuthCookie()` - Create session cookie
- `getAuthCookie()` - Read session data
- `clearAuthCookie()` - Remove session
- `verifyPassword()` - Validate password
- `isAuthenticated()` - Check auth status

### Login Components

Beautiful, animated login pages with:

- Password input with visibility toggle
- Form validation
- Error handling
- Loading states
- Animated background gradients
- Responsive layout

### Dashboard Layouts

Both dashboard layouts include:

- Logout button with loading state
- Clean, intuitive UI
- Glassmorphism design
- Smooth transitions

## Security Considerations

### Current Implementation

✅ Password-based authentication
✅ HTTP-only cookies
✅ Secure flag in production
✅ SameSite policy
✅ Session expiration (7 days)
✅ Separate auth for each dashboard

### Future Enhancements

- [ ] Password hashing (currently plain text comparison)
- [ ] Rate limiting on login attempts
- [ ] Two-factor authentication (2FA)
- [ ] Session management dashboard
- [ ] Password reset functionality
- [ ] Login history and activity log

## Usage

### Testing Locally

1. Start development server:

```bash
npm run dev
```

2. Try accessing dashboard:

```
http://localhost:3000/portfolio/dashboard
```

3. You'll be redirected to login page
4. Enter password: `patience2025`
5. Access granted!

### Changing Passwords

Edit `.env` file:

```bash
PORTFOLIO_DASHBOARD_PASSWORD="your-new-password"
HERPROMISE_DASHBOARD_PASSWORD="your-new-password"
```

For production, update environment variables in Vercel dashboard.

## File Structure

```
├── app/
│   ├── (main)/
│   │   ├── (patience)/portfolio/
│   │   │   └── login/page.tsx          # Portfolio login page
│   │   ├── login/page.tsx              # Her Promise login page
│   │   └── dashboard/layout.tsx        # Her Promise dashboard (with logout)
│   ├── api/auth/
│   │   ├── login/route.ts              # Login API
│   │   └── logout/route.ts             # Logout API
├── lib/
│   └── auth.ts                         # Authentication utilities
├── middleware.ts                       # Route protection
└── .env                                # Environment variables
```

## Design Highlights

### Portfolio Login

- **Icon**: Sparkles (rotating animation)
- **Colors**: Blue to Purple gradient
- **Theme**: Professional, modern
- **Background**: Animated blue/purple orbs

### Her Promise Login

- **Icon**: Heart (pulsing animation)
- **Colors**: Pink to Purple gradient
- **Theme**: Warm, inviting
- **Background**: Animated pink/purple orbs

### Shared Elements

- Glassmorphism cards with backdrop blur
- Smooth scale animations on hover
- Loading spinners during authentication
- Eye icon for password visibility
- Responsive padding and sizing
- Accessibility features (labels, focus states)

## Troubleshooting

### Can't login

- Check `.env` file exists and has correct passwords
- Verify environment variables in Vercel
- Clear cookies and try again
- Check browser console for errors

### Redirect loop

- Clear browser cookies
- Check middleware configuration
- Verify cookie settings

### Session expires too quickly

- Adjust `AUTH_COOKIE_MAX_AGE` in `lib/auth.ts`
- Default is 7 days (604800 seconds)

## Credits

Built with:

- Next.js 15
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling
- TypeScript for type safety

---

**Status**: ✅ Complete and Deployed
**Last Updated**: October 5, 2025
**Version**: 1.0.0
