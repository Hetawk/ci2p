# CI2P Lab Platform - Implementation Roadmap

## Project Structure Analysis & Implementation Plan

**Date:** October 10, 2025  
**Status:** Phase 1 Complete - Homepage & Ticker Implementation ✅

---

## ✅ COMPLETED (Phase 1)

### Homepage & Core UI

- ✅ Hero Section with scrolling ticker
- ✅ Research Showcase (image carousel)
- ✅ Research Areas section
- ✅ Lab Metrics section
- ✅ Featured Papers section
- ✅ Featured Projects section
- ✅ Navbar with dual logos (CI2P + UJN)
- ✅ Footer
- ✅ Video background (15s loop)
- ✅ Favicon & logo setup
- ✅ Beautiful ticker with dynamic content
- ✅ Blockchain-inspired ledger effects (disabled for now)

---

## 📋 PHASE 2: Public Pages (High Priority)

### **Priority 1: Core Information Pages**

#### 1. `/app/(public)/about/page.tsx`

**Purpose:** Lab overview, mission, history, facilities  
**Components Needed:**

- About hero section
- Timeline component
- Facilities showcase
- Mission statement
- Lab history
- Contact information section

#### 2. `/app/(public)/team/page.tsx`

**Purpose:** Team members directory  
**Components Needed:**

- Team grid layout
- Member cards with filters (faculty, postdocs, PhD, masters)
- Individual member detail modal/page
- ProfessorNiuCard (already exists)
- Alumni section

#### 3. `/app/(public)/papers/page.tsx` & `featured/page.tsx`

**Purpose:** Publications listing and featured papers  
**Components Needed:**

- Papers grid with pagination
- Paper filter/search
- PaperCard (already exists)
- Featured papers showcase
- Year/category filters

#### 4. `/app/(public)/research/projects/page.tsx`

**Purpose:** Research projects showcase  
**Components Needed:**

- Project cards grid
- Project categories
- Project detail pages
- Collaboration indicators

#### 5. `/app/(public)/news/page.tsx`

**Purpose:** Lab news and updates  
**Components Needed:**

- News feed
- News card component
- News detail page
- Date sorting
- Category tags

#### 6. `/app/(public)/contact/page.tsx`

**Purpose:** Contact form and information  
**Components Needed:**

- Contact form
- Map integration (optional)
- Lab address
- Email directory
- Social links

#### 7. `/app/(public)/resources/page.tsx`

**Purpose:** Lab resources and equipment booking  
**Components Needed:**

- Resources listing
- Equipment booking calendar
- Resource request form

---

## 📋 PHASE 3: Authentication System

### **Priority 2: Auth Pages (Already Have API Routes)**

#### Auth Pages to Implement:

1. `/app/(auth)/login/page.tsx` ✅ (exists)
2. `/app/(auth)/register/page.tsx`
3. `/app/(auth)/forgot-pass/page.tsx`
4. `/app/(auth)/reset-pass/page.tsx`
5. `/app/(auth)/verify/page.tsx`

**Components Needed:**

- `components/forms/LoginForm.tsx`
- `components/forms/RegisterForm.tsx`
- `components/forms/ForgotPasswordForm.tsx`
- `components/forms/ResetPasswordForm.tsx`
- Form validation utilities

**API Routes (Already Exist):**

- ✅ `/api/auth/login`
- ✅ `/api/auth/register`
- ✅ `/api/auth/logout`
- ✅ `/api/auth/forgot-password`
- ✅ `/api/auth/reset-password`
- ✅ `/api/auth/verify-email`
- ✅ `/api/auth/me`

---

## 📋 PHASE 4: User Dashboard (Member Portal)

### **Priority 3: Dashboard Pages**

#### `/app/(dash)/home/page.tsx`

- User dashboard overview
- Quick stats
- Recent papers
- Recent projects
- Notifications

#### `/app/(dash)/papers/page.tsx` & `new/page.tsx`

- User's papers listing
- Add new paper form
- Edit paper
- Paper status tracking

#### `/app/(dash)/projects/page.tsx` & `new/page.tsx`

- User's projects
- Create project form
- Project management
- Collaborator management

#### `/app/(dash)/awards/page.tsx` & `new/page.tsx`

- User's awards
- Add award form
- Awards timeline

#### `/app/(dash)/profile/page.tsx` & `edit/page.tsx`

- View profile
- Edit profile
- Upload avatar
- Bio management

#### `/app/(dash)/profile/orcid/*`

- ORCID integration
- Connect ORCID
- Sync publications

#### `/app/(dash)/settings/*`

- Notifications settings
- Security settings (password, 2FA)

**Components Needed:**

- `components/dash/DashboardLayout.tsx`
- `components/dash/DashboardSidebar.tsx`
- `components/dash/StatsCard.tsx`
- `components/dash/RecentActivity.tsx`

---

## 📋 PHASE 5: Admin Dashboard

### **Priority 4: Admin Pages**

#### `/app/(admin)/overview/page.tsx`

- Admin dashboard
- System statistics
- User analytics
- Content analytics

#### `/app/(admin)/users/page.tsx` & `new/page.tsx`

- User management
- Create user
- Edit user roles
- User permissions

#### `/app/(admin)/papers/page.tsx` & `featured/page.tsx`

- Approve/reject papers
- Manage featured papers
- Paper moderation

#### `/app/(admin)/projects/page.tsx`

- Project approval
- Project management

#### `/app/(admin)/news/page.tsx` & `new/page.tsx`

- News management
- Create/edit news
- Publish/unpublish

#### `/app/(admin)/resources/page.tsx`

- Resource management
- Equipment management
- Booking management

#### `/app/(admin)/settings/*`

- General settings
- Email settings
- ORCID integration settings
- Storage settings

#### `/app/(admin)/analytics/*`

- ORCID sync analytics
- Paper analytics
- User analytics

**Components Needed:**

- `components/admin/AdminLayout.tsx`
- `components/admin/AdminSidebar.tsx`
- `components/admin/UserManagementTable.tsx`
- `components/admin/ContentApprovalQueue.tsx`
- `components/admin/AnalyticsCharts.tsx`

---

## 📋 PHASE 6: API Routes Consolidation

### **RESTful API Structure Review**

#### ✅ Already Implemented:

```
/api/auth/*              - Authentication
/api/users/[id]/*        - User operations
/api/papers/*            - Papers CRUD
/api/projects/*          - Projects CRUD
/api/orcid/*             - ORCID integration
/api/upload/*            - File uploads
/api/resources/*         - Resources & bookings
/api/news/*              - News CRUD
/api/analytics/*         - Analytics data
/api/cron/*              - Scheduled tasks
```

#### 🔄 Needs Implementation:

- `/api/team/route.ts` - Team members list (public)
- `/api/about/route.ts` - Lab information (public)
- `/api/contact/route.ts` - Contact form submission
- `/api/dashboard/stats/route.ts` - Dashboard statistics

---

## 📁 Component Organization

### **Directories to Populate:**

#### `components/admin/` (Empty)

- AdminLayout.tsx
- AdminSidebar.tsx
- AdminHeader.tsx
- UserTable.tsx
- ContentApprovalQueue.tsx
- AnalyticsCharts.tsx

#### `components/dash/` (Empty)

- DashboardLayout.tsx
- DashboardSidebar.tsx
- DashboardHeader.tsx
- StatsCard.tsx
- RecentActivity.tsx
- QuickActions.tsx

#### `components/forms/` (Empty)

- LoginForm.tsx
- RegisterForm.tsx
- ForgotPasswordForm.tsx
- ResetPasswordForm.tsx
- PaperForm.tsx
- ProjectForm.tsx
- AwardForm.tsx
- ProfileForm.tsx
- ContactForm.tsx

#### `components/orcid/` (Empty)

- OrcidConnectButton.tsx
- OrcidSyncStatus.tsx
- OrcidPublicationsList.tsx

---

## 🎯 Implementation Priority Order

### **Week 1-2: Public Pages** (Most Important - Visitor Facing)

1. About page
2. Team page
3. Papers page
4. Research projects page
5. Contact page
6. News page

### **Week 3: Authentication Flow**

1. Login page
2. Register page
3. Password reset flow
4. Email verification

### **Week 4-5: User Dashboard**

1. Dashboard home
2. Profile management
3. Papers management
4. Projects management
5. Settings

### **Week 6-7: Admin Dashboard**

1. Admin overview
2. User management
3. Content moderation
4. Analytics

### **Week 8: Polish & Testing**

1. Bug fixes
2. Performance optimization
3. SEO optimization
4. Mobile responsiveness
5. Accessibility

---

## 🔧 Technical Decisions

### **Merge Opportunities:**

1. **Combine Auth Routes:**

   - `/app/(main)/login` → DELETE (use `/app/(auth)/login`)
   - Keep all auth in `(auth)` group

2. **Consolidate Layouts:**

   - Create shared `DashboardLayout` for both admin and user dashboards
   - Use role-based sidebar rendering

3. **Reusable Components:**
   - Single `PaperCard` for public, dash, and admin
   - Single `ProjectCard` with role-based actions
   - Unified form components with variants

### **RESTful API Best Practices:**

```
GET    /api/resource      - List
POST   /api/resource      - Create
GET    /api/resource/[id] - Read
PUT    /api/resource/[id] - Update
DELETE /api/resource/[id] - Delete
```

### **State Management:**

- Use React Server Components where possible
- Client components only when needed (forms, interactive)
- SWR for data fetching on client
- Server actions for mutations

---

## 📝 Next Steps

1. **Immediate:** Start with public pages (about, team, papers)
2. **Database:** Ensure Prisma schema supports all features
3. **Components:** Build reusable UI components library
4. **API:** Test all existing API routes
5. **Testing:** Set up testing framework
6. **Documentation:** Document each new feature

---

## 🎨 Design System

- ✅ Colors: Blue (#3b82f6), Cyan (#06b6d4), Purple (#a855f7)
- ✅ Fonts: Inter (body), Playfair Display (headings)
- ✅ Components: Button, Card, Input, Badge, Pagination
- ✅ Effects: Ledger patterns, blockchain animations
- ✅ Animations: Fade, slide, marquee, glow

---

**Last Updated:** October 10, 2025  
**Next Review:** After Phase 2 completion
