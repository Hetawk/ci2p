# Missing Features Implementation Plan

**Date:** October 10, 2025  
**Status:** Ready for Implementation

## Overview

This document outlines all missing features that need to be implemented to complete the CI2P Lab website. The frontend-backend integration for Papers, Projects, and News listing pages has been completed. The following items remain.

---

## 1. Detail Pages Integration (HIGH PRIORITY)

### Status: Using Mock Data ❌

All three detail pages currently use mock data and need API integration:

### 1.1 Papers Detail Page

**File:** `app/(public)/papers/[id]/page.tsx`

**Current State:**

- Uses `mockPapers` object with hardcoded data
- Client-side only rendering
- No view count tracking

**Required Changes:**

- Fetch from `/api/papers/[id]` using dynamic `id` param
- Increment view count on page load: `PATCH /api/papers/[id]` with `{ action: "incrementViews" }`
- Add loading skeleton
- Add error handling (404 for invalid IDs)
- Display author details from API response
- Handle PDF download link
- Show related papers using API data
- Add edit/delete buttons for authenticated admin users

**API Endpoint:** ✅ Already exists at `app/api/papers/[id]/route.ts`

---

### 1.2 Projects Detail Page

**File:** `app/(public)/research/projects/[id]/page.tsx`

**Current State:**

- Uses `mockProjects` object
- Static team member data
- No API integration

**Required Changes:**

- Fetch from `/api/projects/[id]` with team member relationships
- Display team members from `ProjectMember` join table
- Parse JSON tags field
- Show funding information
- Display project timeline and milestones
- Handle project cover images
- Add edit button for project leads/admins
- Include related publications

**API Endpoint:** ✅ Already exists at `app/api/projects/[id]/route.ts`

---

### 1.3 News Detail Page

**File:** `app/(public)/news/[id]/page.tsx`

**Current State:**

- Uses `mockNews` object
- Hardcoded author data
- No view tracking

**Required Changes:**

- Fetch from `/api/news/[id]` (Announcement model)
- Increment view count on load
- Display author details from User relationship
- Render full content with proper formatting
- Show related articles
- Add social sharing functionality
- Display tags and category

**API Endpoint:** ✅ Already exists at `app/api/news/[id]/route.ts`

---

## 2. Resources API & Page (MEDIUM PRIORITY)

### Status: No API ❌ | Page Uses Mock Data ❌

**Files to Create:**

- `app/api/resources/route.ts` - List & Create
- `app/api/resources/[id]/route.ts` - Get, Update, Delete
- `app/api/resources/bookings/route.ts` - List bookings
- `app/api/resources/bookings/[id]/route.ts` - Booking management

**Current State:**

- `app/(public)/resources/page.tsx` uses `mockResources` array
- No backend API exists
- Booking system not implemented

**Database Schema:** ✅ Already defined

```prisma
model Resource {
  id            String    @id @default(cuid())
  name          String
  type          ResourceType
  description   String?
  specifications Json?
  location      String?
  isAvailable   Boolean   @default(true)
  bookings      ResourceBooking[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model ResourceBooking {
  id          String    @id @default(cuid())
  resourceId  String
  userId      String
  startDate   DateTime
  endDate     DateTime
  purpose     String
  status      BookingStatus @default(PENDING)
  // ... relationships
}
```

**Required Implementation:**

### 2.1 Resources API (CRUD)

- GET `/api/resources` - List with filters (type, availability)
- POST `/api/resources` - Create (admin only)
- GET `/api/resources/[id]` - Get single resource
- PUT `/api/resources/[id]` - Update (admin only)
- DELETE `/api/resources/[id]` - Delete (admin only)

### 2.2 Bookings API

- GET `/api/resources/bookings` - List user's bookings
- POST `/api/resources/bookings` - Create booking request
- GET `/api/resources/bookings/[id]` - Get booking details
- PUT `/api/resources/bookings/[id]` - Update booking (modify dates/purpose)
- DELETE `/api/resources/bookings/[id]` - Cancel booking
- PATCH `/api/resources/bookings/[id]/approve` - Approve (admin only)
- PATCH `/api/resources/bookings/[id]/reject` - Reject (admin only)

### 2.3 Frontend Integration

- Convert `resources/page.tsx` to use API
- Add booking modal/form
- Display user's active bookings
- Show resource availability calendar
- Admin panel for booking approvals

**Estimated Time:** 4-5 hours

---

## 3. Team/Users API (MEDIUM PRIORITY)

### Status: Partial API ✅ | Page Uses Mock Data ❌

**Current State:**

- `app/(public)/team/page.tsx` uses hardcoded `teamMembers` array
- No API integration for team listing
- Individual profile pages not dynamic

**Database Schema:** ✅ Users and UserProfile tables exist

**Required Implementation:**

### 3.1 Users API

- GET `/api/users` - List all users (public profiles only)
  - Filters: role, department, active status
  - Include profile data
  - Pagination support
- GET `/api/users/[id]` - Get user profile

  - Public profile information
  - Research interests
  - Publications (join with Publication table)
  - Projects (join with ProjectMember)
  - ORCID data if connected

- PUT `/api/users/[id]` - Update own profile
  - Auth check: user can only update their own profile
  - Profile fields: bio, research interests, social links
- PUT `/api/users/[id]/avatar` - Upload avatar (or integrate with upload API)

### 3.2 Profile API Extensions

- GET `/api/users/[id]/publications` - User's publications
- GET `/api/users/[id]/projects` - User's projects
- GET `/api/users/[id]/profile` - Extended profile with stats

### 3.3 Frontend Integration

- Convert `team/page.tsx` to fetch from `/api/users?role=RESEARCHER`
- Update `team/[id]/page.tsx` to fetch from `/api/users/[id]`
- Add profile edit page for authenticated users
- Display publication counts, project involvement
- Show ORCID badge if connected

**Estimated Time:** 3-4 hours

---

## 4. Upload APIs (MEDIUM PRIORITY)

### Status: Placeholder Routes Exist ❌

**Files:**

- `app/api/upload/avatar` - No route.ts file
- `app/api/upload/paper-pdf` - No route.ts file

**Required Implementation:**

### 4.1 Avatar Upload

- POST `/api/upload/avatar`
  - Accept image file (jpg, png, webp)
  - Validate file size (max 5MB)
  - Resize and optimize image
  - Store in `/public/avatars/` or cloud storage
  - Update user.avatar field
  - Return image URL

### 4.2 Paper PDF Upload

- POST `/api/upload/paper-pdf`
  - Accept PDF file (max 50MB)
  - Validate PDF format
  - Store in `/public/papers/` or cloud storage
  - Extract metadata if possible
  - Return PDF URL
  - Link to Publication record

### 4.3 Storage Strategy

**Options:**

1. Local storage in `/public` folder (simple, not scalable)
2. Cloud storage (AWS S3, Azure Blob, Cloudflare R2)
3. Vercel Blob Storage (recommended for Vercel deployment)

**Recommended:** Start with local storage, add cloud later

**Estimated Time:** 2-3 hours

---

## 5. ORCID Integration (LOW PRIORITY)

### Status: Partial Implementation ⚠️

**Files:**

- `app/api/orcid/authorize` - Exists but needs route.ts
- `app/api/orcid/callback` - Exists but needs route.ts
- `app/api/orcid/webhook` - Exists but needs route.ts
- `app/api/users/[id]/orcid/connect` - Exists but needs route.ts
- `app/api/users/[id]/orcid/sync` - Exists but needs route.ts

**Current State:**

- OAuth flow not implemented
- No ORCID data syncing
- Frontend pages exist but not functional

**Required Implementation:**

- Complete OAuth 2.0 flow for ORCID
- Sync publications from ORCID
- Display ORCID badge on profiles
- Auto-update publication data

**Note:** This is marked LOW PRIORITY as it's a nice-to-have feature. Core functionality should be completed first.

**Estimated Time:** 6-8 hours

---

## 6. Admin Panel Pages (MEDIUM-LOW PRIORITY)

### Status: Routes Exist ❌ | No Implementation

**Directories:**

```
app/(admin)/
  ├── analytics/
  ├── news/new/
  ├── overview/
  ├── papers/featured/
  ├── projects/
  ├── resources/
  ├── settings/
  └── users/new/
```

**Required Implementation:**

- Dashboard overview with stats
- User management (CRUD)
- Content management (papers, projects, news)
- Resource & booking management
- Analytics views
- Settings pages

**Note:** Admin panel is lower priority as APIs are more critical. Admins can use database tools temporarily.

**Estimated Time:** 12-15 hours

---

## 7. Dashboard Pages (MEDIUM PRIORITY)

### Status: Routes Exist ❌ | Minimal Implementation

**Directories:**

```
app/(dash)/
  ├── home/ ✅ (page exists)
  ├── awards/new/
  ├── papers/new/
  ├── profile/edit/
  ├── profile/orcid/
  ├── projects/new/
  └── settings/
```

**Required Implementation:**

- User dashboard home with personal stats
- Paper submission form
- Project creation form
- Profile editing
- User settings (notifications, security)

**Estimated Time:** 8-10 hours

---

## 8. Bug Fixes & Polish (HIGH PRIORITY)

### 8.1 Missing Badge Component

**Error:** `Cannot find module '@/components/ui/badge'`
**Files Affected:** Multiple (PaperCard, etc.)

**Fix:** Create badge component

```bash
npx shadcn@latest add badge
```

### 8.2 Type Safety Issues

- Fix `any` types in PaperCard.tsx
- Fix `any` types in lib/types/index.ts
- Update NewsCard to handle API response structure

### 8.3 Seed Data Issues

**File:** `prisma/seed-ci2p.ts`
**Problems:**

- Schema mismatch with Role enum
- Field name mismatches
- Need to update to match current schema

**Estimated Time:** 1-2 hours

---

## Implementation Priority Order

### Phase 1: Critical Features (Complete First) 🔴

**Goal:** Make the public-facing site fully functional

1. ✅ **Fix Badge Component** (15 minutes)
   - Run `npx shadcn@latest add badge`
2. ✅ **Detail Pages Integration** (3-4 hours)
   - Papers detail page → API integration
   - Projects detail page → API integration
   - News detail page → API integration
   - View count tracking
3. ✅ **Resources API & Integration** (4-5 hours)

   - Create Resources CRUD API
   - Create Bookings API
   - Integrate resources page with API

4. ✅ **Team API & Integration** (3-4 hours)
   - Create Users list API
   - Integrate team page
   - Dynamic team member profiles

### Phase 2: User Features (Second) 🟡

**Goal:** Enable user interactions and content management

5. **Upload APIs** (2-3 hours)
   - Avatar upload
   - PDF upload
6. **Dashboard Pages** (8-10 hours)
   - User dashboard
   - Paper submission
   - Project creation
   - Profile editing

### Phase 3: Admin Features (Third) 🟢

**Goal:** Complete admin functionality

7. **Admin Panel** (12-15 hours)
   - Overview dashboard
   - User management
   - Content management
   - Resource management
   - Booking approvals

### Phase 4: Advanced Features (Optional) ⚪

**Goal:** Enhanced functionality

8. **ORCID Integration** (6-8 hours)
   - OAuth flow
   - Data syncing
   - Auto-updates

---

## Next Steps

### Immediate Actions:

1. **Install Badge Component**

   ```bash
   npx shadcn@latest add badge
   ```

2. **Start with Papers Detail Page**

   - Read current implementation
   - Create API-integrated version
   - Test with real data
   - Apply same pattern to Projects and News

3. **Create Resources API**

   - Follow established pattern from Papers/Projects/News
   - Include booking system
   - Test all endpoints

4. **Team/Users API**
   - Public profile listing
   - Individual profile pages
   - Research output aggregation

### Testing Strategy:

- Test each API endpoint with Postman or Thunder Client
- Verify authentication/authorization
- Test pagination and filtering
- Ensure proper error handling
- Validate data types match frontend expectations

---

## File Status Summary

### ✅ Completed & Integrated

- Papers listing page
- Projects listing page
- News listing page
- Papers API (CRUD)
- Projects API (CRUD)
- News API (CRUD)
- Authentication API

### ⚠️ Needs Integration (API exists)

- Papers detail page
- Projects detail page
- News detail page

### ❌ Missing Entirely

- Resources API
- Resources page integration
- Team/Users API
- Team page integration
- Upload APIs
- Dashboard pages
- Admin panel pages
- ORCID integration

---

## Success Criteria

### Phase 1 Complete When:

- [ ] Badge component installed and errors resolved
- [ ] All detail pages fetch real data from APIs
- [ ] View counts increment correctly
- [ ] Resources page fully functional with booking system
- [ ] Team page displays real user data
- [ ] No mock data in public-facing pages

### Full Project Complete When:

- [ ] All APIs implemented and tested
- [ ] All frontend pages integrated
- [ ] Upload functionality working
- [ ] Dashboard fully functional
- [ ] Admin panel operational
- [ ] All TypeScript errors resolved
- [ ] Comprehensive seed data for testing
- [ ] Documentation updated

---

## Notes

- **Pattern Established:** The Papers/Projects/News integration provides a clear pattern for all remaining work
- **Database Schema:** Complete and ready (no schema changes needed)
- **Authentication:** Working and tested
- **Code Quality:** Maintain TypeScript type safety throughout
- **Testing:** Test each feature thoroughly before moving to next

**Estimated Total Time for Phase 1:** 12-15 hours  
**Estimated Total Time for All Phases:** 40-50 hours

---

_This document will be updated as features are completed._
