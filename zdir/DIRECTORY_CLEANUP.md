# Directory Cleanup & Consolidation Plan

## 🗑️ Directories to DELETE (Duplicates/Redundant)

### 1. `/app/(main)/login/` ❌

**Reason:** Duplicate of `/app/(auth)/login`  
**Action:** DELETE - Use auth group instead  
**Status:** Keep only `(auth)/login`

---

## 📁 Directory Mapping & Purpose

### Authentication Flow (Keep: `(auth)` group)

```
(auth)/
├── login/          ✅ Main login page
├── register/       ✅ Registration
├── forgot-pass/    ✅ Password reset request
├── reset-pass/     ✅ Password reset with token
└── verify/         ✅ Email verification
```

### Public Pages (`(public)` group)

```
(public)/
├── about/          📝 Lab information
├── contact/        📝 Contact form
├── news/           📝 News articles
├── papers/         📝 Publications listing
│   └── featured/   📝 Featured papers
├── research/       📝 Research areas
│   └── projects/   📝 Active projects
├── resources/      📝 Lab resources
└── team/           📝 Team members
```

### User Dashboard (`(dash)` group)

```
(dash)/
├── home/           📝 Dashboard home
├── papers/         📝 User papers
│   └── new/        📝 Add paper
├── projects/       📝 User projects
│   └── new/        📝 Add project
├── awards/         📝 User awards
│   └── new/        📝 Add award
├── profile/        📝 User profile
│   ├── edit/       📝 Edit profile
│   └── orcid/      📝 ORCID integration
│       ├── connect/📝 Connect ORCID
│       └── sync/   📝 Sync publications
└── settings/       📝 User settings
    ├── notif/      📝 Notification settings
    └── security/   📝 Security settings
```

### Admin Dashboard (`(admin)` group)

```
(admin)/
├── overview/       📝 Admin dashboard
├── users/          📝 User management
│   └── new/        📝 Create user
├── papers/         📝 Paper management
│   └── featured/   📝 Featured papers
├── projects/       📝 Project management
├── news/           📝 News management
│   └── new/        📝 Create news
├── resources/      📝 Resource management
│   ├── bookings/   📝 Booking management
│   └── new/        📝 Add resource
├── analytics/      📝 Analytics dashboard
│   ├── orcid/      📝 ORCID sync stats
│   ├── papers/     📝 Paper statistics
│   └── users/      📝 User statistics
└── settings/       📝 Admin settings
    ├── general/    📝 General settings
    ├── email/      📝 Email configuration
    └── integrations/ 📝 Integrations
        ├── orcid/  📝 ORCID settings
        └── storage/📝 Storage settings
```

### Main Group (`(main)` group)

```
(main)/
├── layout.tsx      ✅ Main layout with navbar
├── page.tsx        ✅ Homepage
├── login/          ❌ DELETE (use (auth)/login)
└── showcase/       📝 Research showcase page
```

---

## 🔄 Consolidation Strategy

### Shared Components

#### Forms (All in `components/forms/`)

```typescript
// LoginForm - Used by (auth)/login
// RegisterForm - Used by (auth)/register
// ForgotPasswordForm - Used by (auth)/forgot-pass
// ResetPasswordForm - Used by (auth)/reset-pass
// PaperForm - Used by (dash)/papers/new & (admin)/papers
// ProjectForm - Used by (dash)/projects/new & (admin)/projects
// ProfileForm - Used by (dash)/profile/edit
// ContactForm - Used by (public)/contact
```

#### Dashboard Components (All in `components/dash/`)

```typescript
// DashboardLayout - Shared by (dash) and (admin)
// DashboardSidebar - Role-based rendering
// DashboardHeader - Shared header
// StatsCard - Reusable stat display
```

#### Admin Components (All in `components/admin/`)

```typescript
// UserTable - User management
// ContentApprovalQueue - Approve/reject content
// AnalyticsCharts - Data visualization
```

---

## 🎯 Implementation Order

### Phase 1: Cleanup ✅

1. Delete `/app/(main)/login/`
2. Archive unused documentation to `/archive/zdir/`

### Phase 2: Public Pages (Week 1-2)

```bash
# Priority order:
1. /app/(public)/about/page.tsx
2. /app/(public)/team/page.tsx
3. /app/(public)/papers/page.tsx
4. /app/(public)/research/projects/page.tsx
5. /app/(public)/contact/page.tsx
6. /app/(public)/news/page.tsx
```

### Phase 3: Authentication (Week 3)

```bash
1. /app/(auth)/register/page.tsx
2. /app/(auth)/forgot-pass/page.tsx
3. /app/(auth)/reset-pass/page.tsx
4. /app/(auth)/verify/page.tsx
```

### Phase 4: User Dashboard (Week 4-5)

```bash
1. /app/(dash)/home/page.tsx
2. /app/(dash)/profile/page.tsx
3. /app/(dash)/papers/page.tsx
4. /app/(dash)/projects/page.tsx
```

### Phase 5: Admin Dashboard (Week 6-7)

```bash
1. /app/(admin)/overview/page.tsx
2. /app/(admin)/users/page.tsx
3. /app/(admin)/papers/page.tsx
4. /app/(admin)/analytics/overview/page.tsx
```

---

## 📊 Statistics

**Total Directories:** 129  
**Empty Directories:** ~95 (73%)  
**Need Implementation:** ~85 pages  
**Can DELETE:** 1 (duplicate login)  
**Already Complete:** ~10 (core homepage)

**Estimated Time:**

- Public Pages: 2 weeks (6 pages × 2-3 days each)
- Auth Pages: 1 week (4 pages × 1-2 days each)
- User Dashboard: 2 weeks (10+ pages)
- Admin Dashboard: 2 weeks (15+ pages)
- **Total:** ~7-8 weeks for full implementation

---

## ✅ Quick Wins (Do First)

1. **About Page** - Easy, mostly static content
2. **Contact Page** - Simple form
3. **Team Page** - Grid of cards, already have component
4. **Papers Page** - Already have PaperCard component

---

**Created:** October 10, 2025  
**Status:** Ready for implementation
