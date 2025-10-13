# Logo, Navigation & Analytics Fixes

## Summary of Changes

This document outlines all the fixes made to address four major issues:

1. **Added CI2P lab logo to all navigation areas**
2. **Added Home button to admin sidebar**
3. **Fixed hardcoded "Prof. Sijie Niu" in admin sidebar**
4. **Fixed analytics page showing incorrect/outdated data**

---

## 1. Added CI2P Lab Logo

### Issue

Navigation headers and admin sidebar were using placeholder graphics or text instead of the actual lab logo.

### Solution

Integrated the actual CI2P lab logo (`/public/ci2p_logo.png`) in:

- **Public Header** - Used in all public pages
- **Admin Sidebar** - Used in admin dashboard

### Files Modified

- `components/layout/PublicHeader.tsx`
- `app/admin/layout.tsx`

### Implementation

```tsx
<div className="w-8 h-8 relative">
  <Image
    src="/ci2p_logo.png"
    alt="CI2P Lab Logo"
    width={32}
    height={32}
    className="object-contain"
  />
</div>
```

---

## 2. Added Home Button to Admin Sidebar

### Issue

Admins had no way to navigate back to the main website from the admin panel.

### Solution

Added a "Home" button as the first item in the admin sidebar navigation, linking to `/` (homepage).

### Files Modified

- `app/admin/layout.tsx`

### Implementation

```typescript
const navigation = [
  {
    name: "Home",
    href: "/",
    icon: Home, // New Home icon
  },
  {
    name: "Overview",
    href: "/admin/overview",
    icon: LayoutDashboard,
  },
  // ... other nav items
];
```

### UI Changes

- Home button appears at the top of the sidebar navigation
- Uses Home icon for visual clarity
- Follows same styling as other navigation items

---

## 3. Fixed Hardcoded User Info in Admin Sidebar

### Issue

The admin sidebar showed "Prof. Sijie Niu" and "Super Admin" for ALL users, regardless of who was logged in.

### Root Cause

User information was hardcoded in the layout component instead of dynamically fetching the current user's data.

### Solution

Enhanced the `getUser()` function to:

1. Verify the authentication token
2. Fetch full user data from database including:
   - Full name from profile
   - Avatar image
   - Email
   - Role
3. Display actual user information dynamically

### Files Modified

- `app/admin/layout.tsx`

### Code Changes

#### Before:

```tsx
<div className="flex-1 min-w-0">
  <p className="text-sm font-medium truncate">Prof. Sijie Niu</p>
  <p className="text-xs text-muted-foreground">Super Admin</p>
</div>
```

#### After:

```tsx
async function getUser() {
  // ... token verification

  // Fetch full user data from database
  if (payload?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    if (user) {
      return {
        ...payload,
        fullName: user.profile?.fullName,
        avatar: user.profile?.avatar,
      };
    }
  }

  return payload;
}

// Display dynamic user info
<p className="text-sm font-medium truncate">
  {"fullName" in user && user.fullName ? user.fullName : user.email || "Admin"}
</p>
<p className="text-xs text-muted-foreground">
  {user.role === "SUPER_ADMIN" ? "Super Admin" : user.role === "ADMIN" ? "Admin" : user.role}
</p>
```

### Features

- Shows user's actual full name (or email if name not available)
- Displays user's avatar if uploaded
- Shows initials in colored circle if no avatar
- Correctly displays role (Super Admin, Admin, etc.)

---

## 4. Fixed Analytics Page Data

### Issue

The analytics page showed outdated/incorrect data:

- Total Views: 0
- Team Members: 11 (incorrect)
- Publications: 12 (incorrect)
- Active Projects: 5 (incorrect)
- Top viewed publications not showing actual view counts

### Root Cause

Analytics was fetching paginated API data and counting array lengths instead of getting actual database totals.

### Solution

Changed from API-based counting to direct database queries:

- Query database for accurate counts
- Use Prisma aggregation for total views
- Fetch top viewed publications sorted by actual view counts

### Files Modified

- `app/admin/analytics/page.tsx`

### Implementation

#### Before:

```typescript
// Fetching paginated data
const papers = papersData?.data?.papers || [];
return {
  totalPapers: papers.length || 0, // Only counts current page!
  // ...
};
```

#### After:

```typescript
// Direct database queries
const [totalUsers, totalPapers, totalProjects, totalNews] = await Promise.all([
  prisma.user.count({
    where: {
      active: true,
      profile: { isNot: null },
    },
  }),
  prisma.publication.count({
    where: {
      isPublished: true,
    },
  }),
  prisma.project.count(),
  prisma.announcement.count({
    where: {
      isPublished: true,
    },
  }),
]);

// Aggregate total views
const allPapersViews = await prisma.publication.aggregate({
  where: { isPublished: true },
  _sum: { views: true },
});

const allNewsViews = await prisma.announcement.aggregate({
  where: { isPublished: true },
  _sum: { views: true },
});

return {
  totalUsers,
  totalPapers,
  totalProjects,
  totalNews,
  totalViews: (allPapersViews._sum.views || 0) + (allNewsViews._sum.views || 0),
  topPapers: await prisma.publication.findMany({
    where: { isPublished: true },
    orderBy: { views: "desc" },
    take: 5,
  }),
  topNews: await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { views: "desc" },
    take: 5,
  }),
};
```

### Benefits

- **Accurate counts**: Shows total records in database, not just paginated results
- **Real-time data**: No caching, always shows current state
- **Correct view counts**: Aggregates all views across all publications and news
- **Proper ranking**: Top viewed items sorted by actual view counts

---

## Testing Checklist

### Logo Implementation

- [x] Public pages show CI2P lab logo in header
- [x] Admin sidebar shows CI2P lab logo
- [x] Logo displays correctly at 32x32px size
- [x] Logo is clickable and links to homepage

### Admin Sidebar

- [x] Home button appears at top of navigation
- [x] Home button navigates to main website
- [x] Each logged-in user sees their own name
- [x] User avatar displays if uploaded
- [x] User initials show if no avatar
- [x] User role displays correctly (Super Admin, Admin, etc.)

### Analytics Page

- [x] Total views shows aggregated count
- [x] Team members count is accurate
- [x] Publications count is accurate
- [x] Projects count is accurate
- [x] Top viewed publications show correct view counts
- [x] Top viewed news shows correct view counts
- [x] All metrics update in real-time

---

## Visual Changes

### Before:

```
Admin Sidebar Bottom:
┌─────────────────────┐
│  SN  Prof. Sijie Niu│  <- Hardcoded for everyone
│      Super Admin    │
└─────────────────────┘

Analytics:
Total Views: 0          <- Wrong
Team Members: 11        <- Wrong
Publications: 12        <- Wrong
Active Projects: 5      <- Wrong
```

### After:

```
Admin Sidebar Top:
┌─────────────────────┐
│ 🏠 Home            │  <- New Home button
│ 📊 Overview        │
│ ...                │
└─────────────────────┘

Admin Sidebar Bottom:
┌─────────────────────┐
│  ED  Enoch Kwateh  │  <- Dynamic user info
│      Super Admin   │
└─────────────────────┘

Analytics:
Total Views: [actual]   <- Correct aggregate
Team Members: [actual]  <- Correct count
Publications: [actual]  <- Correct count
Active Projects: [actual] <- Correct count
```

---

## Files Changed Summary

1. **components/layout/PublicHeader.tsx**

   - Added Image import from next/image
   - Replaced placeholder logo with actual CI2P logo
   - Updated alt text and accessibility

2. **app/admin/layout.tsx**

   - Added Image import from next/image
   - Added prisma import
   - Added Home icon import
   - Enhanced getUser() to fetch full profile data
   - Added Home button to navigation array
   - Replaced hardcoded logo with actual CI2P logo
   - Replaced hardcoded user info with dynamic data

3. **app/admin/analytics/page.tsx**
   - Added prisma import
   - Completely rewrote getAnalytics() function
   - Changed from API fetching to direct database queries
   - Added proper view count aggregation
   - Added proper sorting for top viewed items

---

## Database Queries Used

### User Count:

```typescript
prisma.user.count({
  where: {
    active: true,
    profile: { isNot: null },
  },
});
```

### Publication Count:

```typescript
prisma.publication.count({
  where: {
    isPublished: true,
  },
});
```

### Total Views Aggregation:

```typescript
prisma.publication.aggregate({
  where: { isPublished: true },
  _sum: { views: true },
});
```

### Top Viewed Publications:

```typescript
prisma.publication.findMany({
  where: { isPublished: true },
  orderBy: { views: "desc" },
  take: 5,
});
```

---

## Benefits

1. **Professional Branding**: Actual lab logo displayed everywhere
2. **Better Navigation**: Easy access to main website from admin panel
3. **Personalized Experience**: Each user sees their own name and role
4. **Accurate Analytics**: Real-time, correct data from database
5. **Improved UX**: Consistent user experience across platform
6. **Data Integrity**: No more hardcoded values that could mislead

---

## Notes

- All changes are server-side rendered for security
- Database queries are optimized with proper indexes
- View counts use Prisma aggregation for performance
- User authentication is verified on every page load
- Logo is optimized with Next.js Image component
