# CI2P Lab Platform - Route Architecture & Flow

**Last Updated:** October 10, 2025

## 📋 Table of Contents
1. [Route Structure Overview](#route-structure-overview)
2. [Public Routes (No Auth Required)](#public-routes)
3. [Dashboard Routes (Auth Required)](#dashboard-routes)
4. [Admin Routes (Admin Only)](#admin-routes)
5. [API Routes](#api-routes)
6. [Data Flow & ORCID Integration](#data-flow--orcid-integration)
7. [Component Architecture](#component-architecture)

---

## Route Structure Overview

### Route Groups (Next.js 14 App Router)

```
app/
├── (public)/      # Public-facing pages (no authentication)
├── (auth)/        # Authentication pages (login, register, etc.)
├── (dash)/        # User dashboard (requires authentication)
├── (admin)/       # Admin panel (requires admin role)
├── (main)/        # Homepage and main layouts
└── api/           # API endpoints
```

---

## Public Routes

### 🏠 Homepage & Main Pages
| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Homepage with hero, research areas, metrics | ✅ Complete |
| `/about` | Lab information & Professor Niu profile | ✅ Complete |
| `/team` | Team members grid (faculty, students, alumni) | ✅ Complete |
| `/team/[id]` | **Individual member profile (PUBLIC VIEW)** | ✅ Complete |
| `/contact` | Contact form & lab information | ✅ Complete |

### 📚 Research & Publications
| Route | Purpose | Status |
|-------|---------|--------|
| `/papers` | All publications with filters & pagination | 🔄 In Progress |
| `/papers/featured` | Featured/highlighted papers | ⏳ Pending |
| `/papers/[id]` | Individual paper details | ⏳ Pending |
| `/research/projects` | Research projects showcase | ⏳ Pending |
| `/research/projects/[id]` | Project details | ⏳ Pending |

### 📰 News & Resources
| Route | Purpose | Status | 
|-------|---------|--------|
| `/news` | Lab news feed | ⏳ Pending |
| `/news/[id]` | Individual news article | ⏳ Pending |
| `/resources` | Lab resources & equipment | ⏳ Pending |

---

## Dashboard Routes (Authenticated Users)

### 🔐 Authentication Context
All `/dash/*` routes require user to be logged in via NextAuth.js

### User's Own Profile Management
| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/dash/home` | Dashboard overview | Stats, recent activity, quick actions |
| `/dash/profile` | **View OWN profile** | User views their own profile |
| `/dash/profile/edit` | **Edit OWN profile** | Update bio, photo, interests, etc. |
| `/dash/profile/orcid/connect` | **Connect ORCID** | OAuth flow to link ORCID account |
| `/dash/profile/orcid/sync` | **Sync ORCID papers** | Fetch publications from ORCID |

### Content Management
| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/dash/papers` | User's papers list | Manage own publications |
| `/dash/papers/new` | Add new paper | Manual paper entry or ORCID import |
| `/dash/projects` | User's projects | Manage research projects |
| `/dash/projects/new` | Create project | Add collaborators, descriptions |
| `/dash/awards` | User's awards | Track achievements |
| `/dash/awards/new` | Add award | Certificates, honors |

### Settings
| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/dash/settings/notif` | Notification preferences | Email alerts, updates |
| `/dash/settings/security` | Security settings | Password, 2FA, sessions |

---

## Admin Routes (Admin Role Only)

### 📊 Admin Panel Overview
| Route | Purpose | Status |
|-------|---------|--------|
| `/admin/overview` | Admin dashboard | ⏳ Pending |
| `/admin/users` | User management | ⏳ Pending |
| `/admin/users/new` | Create user | ⏳ Pending |

### Content Moderation
| Route | Purpose | Status |
|-------|---------|--------|
| `/admin/papers` | All papers moderation | ⏳ Pending |
| `/admin/papers/featured` | Manage featured papers | ⏳ Pending |
| `/admin/projects` | Projects moderation | ⏳ Pending |
| `/admin/news` | News management | ⏳ Pending |
| `/admin/news/new` | Create news article | ⏳ Pending |

### Resources & Analytics
| Route | Purpose | Status |
|-------|---------|--------|
| `/admin/resources` | Equipment management | ⏳ Pending |
| `/admin/resources/bookings` | Booking requests | ⏳ Pending |
| `/admin/analytics/users` | User analytics | ⏳ Pending |
| `/admin/analytics/papers` | Publication metrics | ⏳ Pending |
| `/admin/analytics/orcid` | ORCID sync stats | ⏳ Pending |

### Settings
| Route | Purpose | Status |
|-------|---------|--------|
| `/admin/settings/general` | Site-wide settings | ⏳ Pending |
| `/admin/settings/email` | Email configuration | ⏳ Pending |
| `/admin/settings/integrations/orcid` | ORCID API config | ⏳ Pending |

---

## API Routes

### Authentication API
```
POST   /api/auth/register           # Create new account
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Get current user
POST   /api/auth/forgot-password    # Request reset
POST   /api/auth/reset-password     # Reset password
POST   /api/auth/verify-email       # Verify email
```

### User & Profile API
```
GET    /api/users/[id]              # Get user profile
PATCH  /api/users/[id]              # Update user
DELETE /api/users/[id]              # Delete user
POST   /api/users/[id]/orcid/connect  # Connect ORCID
POST   /api/users/[id]/orcid/sync     # Sync ORCID papers
```

### Papers API
```
GET    /api/papers                  # List papers (with filters)
POST   /api/papers                  # Create paper
GET    /api/papers/[id]             # Get paper details
PATCH  /api/papers/[id]             # Update paper
DELETE /api/papers/[id]             # Delete paper
GET    /api/papers/featured         # Get featured papers
```

### ORCID Integration API
```
GET    /api/orcid/authorize         # Start OAuth flow
GET    /api/orcid/callback          # OAuth callback
POST   /api/orcid/webhook           # ORCID webhook (auto-sync)
```

### Upload API
```
POST   /api/upload/avatar           # Upload profile photo
POST   /api/upload/paper-pdf        # Upload paper PDF
```

---

## Data Flow & ORCID Integration

### 🔄 ORCID Paper Fetching Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN CREATES USER                        │
│  /admin/users/new - Admin enters: name, email, ORCID ID     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  USER CONNECTS ORCID                         │
│  /dash/profile/orcid/connect - OAuth flow to authorize      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FETCH PAPERS                              │
│  /dash/profile/orcid/sync - Fetch from ORCID API            │
│  GET https://pub.orcid.org/v3.0/[orcid]/works               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              STORE IN DATABASE (Prisma)                      │
│  - Create Paper records with isFromOrcid = true             │
│  - Link to User via userId                                   │
│  - Store: title, authors, journal, year, DOI, abstract      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  DISPLAY PAPERS                              │
│  • /team/[id] - Public view of member's papers              │
│  • /dash/papers - User's own papers                          │
│  • /papers - All published papers                            │
│  • Homepage - Featured papers                                │
└─────────────────────────────────────────────────────────────┘
```

### 📝 Paper Editing Flow

```
User can edit ORCID papers:
- Add custom description
- Upload PDF
- Add custom tags/categories
- Mark as featured (admin only)
- Toggle published status (admin only)

Original ORCID data is preserved with isFromOrcid flag
```

---

## Component Architecture

### 🎨 Reusable Components

#### Team Components (`components/team/`)
```typescript
MemberCard        // Team member card (clickable)
  └─> Links to /team/[id]
  
ProfessorNiuCard  // Special card for lab director
```

#### Paper Components (`components/papers/`)
```typescript
PaperCard         // Paper display card
  - Variants: default, featured, compact
  - Shows: title, authors, year, journal, abstract
  - Actions: view, download, edit (if auth)
  
FeaturedPapers    // Section showing featured papers
  - Used on homepage
  - Grid layout (2 or 3 columns)
```

#### Form Components (`components/forms/`)
```typescript
ContactForm       // Contact form with validation
```

### 🎭 Page Component Patterns

```typescript
// Public Profile Page
/app/(public)/team/[id]/page.tsx
  - Fetches member data by ID
  - Shows: photo, bio, education, achievements
  - Lists: publications from ORCID
  - Social links: ORCID, GitHub, Google Scholar
  - NO edit buttons (public view only)

// User Dashboard Profile
/app/(dash)/profile/page.tsx
  - Shows current user's profile
  - "Edit Profile" button → /dash/profile/edit
  - "Connect ORCID" button → /dash/profile/orcid/connect
  - "Sync Papers" button → /dash/profile/orcid/sync
  - Stats: paper count, citations, views
```

---

## Key Design Decisions

### ✅ Route Separation

**PUBLIC** (`/team/[id]`)
- Anyone can view without login
- Read-only display
- SEO-friendly for researchers
- Shows published papers only

**DASHBOARD** (`/dash/profile`)
- Requires authentication
- User edits THEIR OWN profile
- Manage papers, ORCID connection
- Privacy controls

**ADMIN** (`/admin/users`)
- Admin manages ALL users
- Create accounts, assign ORCID IDs
- Moderate content, feature papers
- Analytics and settings

### 🔐 Authentication Flow

```typescript
Middleware (middleware.ts):
  - Protects /dash/* routes → require auth
  - Protects /admin/* routes → require admin role
  - Public routes accessible to all
  
NextAuth Session:
  - User object: id, name, email, role, orcidId
  - Used in API routes for authorization
  - Used in components to show/hide actions
```

### 📊 Database Schema (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  role          Role     @default(USER)  // USER | ADMIN
  orcidId       String?  @unique
  orcidToken    String?  // OAuth access token
  photo         String?
  bio           String?
  papers        Paper[]
  projects      Project[]
  // ... other fields
}

model Paper {
  id              String   @id @default(cuid())
  title           String
  authors         Json     // Array of author objects
  journal         String?
  year            Int?
  doi             String?
  abstract        String?
  pdfUrl          String?
  isFromOrcid     Boolean  @default(false)
  isPublished     Boolean  @default(true)
  isFeatured      Boolean  @default(false)
  userId          String
  user            User     @relation(...)
  // ... other fields
}
```

---

## Next Steps (Implementation Order)

### Phase 1: Public Pages (In Progress)
- [x] Homepage
- [x] About page
- [x] Team page
- [x] Team member profiles `/team/[id]`
- [x] Contact page
- [ ] Papers listing `/papers`
- [ ] News page `/news`
- [ ] Resources page `/resources`

### Phase 2: Authentication System
- [ ] Login page `/auth/login`
- [ ] Register page `/auth/register`
- [ ] Password reset flow
- [ ] Email verification
- [ ] NextAuth.js configuration

### Phase 3: User Dashboard
- [ ] Dashboard home `/dash/home`
- [ ] Profile view/edit `/dash/profile`
- [ ] ORCID connection flow
- [ ] Paper management `/dash/papers`
- [ ] Project management `/dash/projects`

### Phase 4: Admin Panel
- [ ] Admin overview `/admin/overview`
- [ ] User management `/admin/users`
- [ ] Content moderation
- [ ] Analytics dashboards
- [ ] Settings & configuration

### Phase 5: ORCID Integration
- [ ] ORCID OAuth setup
- [ ] Paper sync functionality
- [ ] Webhook handlers
- [ ] Automatic sync cron jobs

---

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# ORCID API
ORCID_CLIENT_ID="your-client-id"
ORCID_CLIENT_SECRET="your-client-secret"
ORCID_REDIRECT_URI="http://localhost:3000/api/orcid/callback"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
UPLOAD_MAX_SIZE="10485760"  # 10MB
```

---

## Summary

**Current Status:** Phase 1 - Public Pages (5/8 complete)

**Key Achievement:** Proper route architecture with clear separation:
- `/team/[id]` for public viewing
- `/dash/profile` for self-management
- `/admin/users` for administration

**Next Priority:** Complete papers listing page with ORCID integration

---

*This document will be updated as implementation progresses.*
