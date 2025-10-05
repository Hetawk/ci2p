# Dashboard Layout - Visual Guide

## Before (❌ Problem)

```
┌─────────────────────────────────────────┐
│  ViewSwitcher (Top-Left)                │ ← From (main) layout
├─────────────────────────────────────────┤
│  CircularNavbar                         │ ← From (main) layout
├─────────────────────────────────────────┤
│  ┌──────────┬────────────────────────┐  │
│  │          │                        │  │
│  │ Dashboard│  Dashboard Content     │  │
│  │ Sidebar  │                        │  │
│  │          │  ← Overlapping!        │  │
│  │ (From    │                        │  │
│  │ dashboard│                        │  │
│  │ layout)  │                        │  │
│  │          │                        │  │
│  └──────────┴────────────────────────┘  │
├─────────────────────────────────────────┤
│  Footer                                 │ ← From (main) layout
└─────────────────────────────────────────┘
```

**Issues:**

- ViewSwitcher overlaps dashboard sidebar
- CircularNavbar adds unnecessary header
- Footer wastes space
- Confusing navigation (two systems competing)

---

## After (✅ Solution)

### Public Pages (about, blog, contact, portfolio, etc.)

```
┌─────────────────────────────────────────┐
│  ViewSwitcher (Top-Left)                │
├─────────────────────────────────────────┤
│  CircularNavbar                         │
├─────────────────────────────────────────┤
│                                         │
│  Page Content                           │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

### Dashboard Pages (/dashboard, /portfolio/dashboard)

```
┌──────────┬──────────────────────────────┐
│          │                              │
│  Logo    │  Dashboard Header            │
│  Title   │                              │
│          ├──────────────────────────────┤
│──────────│                              │
│          │                              │
│ Overview │                              │
│ Programs │  Dashboard Content           │
│ Members  │                              │
│ Events   │                              │
│ Content  │                              │
│          │                              │
│──────────│                              │
│          │                              │
│View Site │                              │
│ Logout   │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Benefits:**

- Clean, dedicated dashboard interface
- No navigation conflicts
- Full screen utilization
- Professional appearance

---

## Layout Hierarchy Explained

### Route: `/about` (Organization public page)

```
app/layout.tsx (root)
  └─> app/(main)/layout.tsx (passthrough)
      └─> app/(main)/(organization)/layout.tsx (renders nav ✓)
          └─> app/(main)/(organization)/about/page.tsx
```

**Result**: ViewSwitcher + CircularNavbar + Page + Footer

---

### Route: `/dashboard` (Organization dashboard)

```
app/layout.tsx (root)
  └─> app/(main)/layout.tsx (passthrough)
      └─> app/(main)/(organization)/layout.tsx (passthrough for /dashboard)
          └─> app/(main)/(organization)/dashboard/layout.tsx (sidebar)
              └─> app/(main)/(organization)/dashboard/page.tsx
```

**Result**: Dashboard sidebar + Page only (no main nav)

---

### Route: `/portfolio` (Patience public page)

```
app/layout.tsx (root)
  └─> app/(main)/layout.tsx (passthrough)
      └─> app/(main)/(patience)/layout.tsx (renders nav ✓)
          └─> app/(main)/(patience)/portfolio/page.tsx
```

**Result**: ViewSwitcher + CircularNavbar + Page + Footer

---

### Route: `/portfolio/dashboard` (Portfolio dashboard)

```
app/layout.tsx (root)
  └─> app/(main)/layout.tsx (passthrough)
      └─> app/(main)/(patience)/layout.tsx (passthrough for /dashboard)
          └─> app/(main)/(patience)/portfolio/dashboard/layout.tsx (sidebar)
              └─> app/(main)/(patience)/portfolio/dashboard/page.tsx
```

**Result**: Dashboard sidebar + Page only (no main nav)

---

## Code Logic

### Organization Layout (`app/(main)/(organization)/layout.tsx`)

```tsx
const pathname = usePathname();
const isDashboard = pathname?.includes("/dashboard");

if (isDashboard) {
  return <>{children}</>; // No nav
}

return (
  <>
    <ViewSwitcher />
    <CircularNavbar />
    {children}
    <Footer />
  </>
);
```

### Patience Layout (`app/(main)/(patience)/layout.tsx`)

```tsx
const pathname = usePathname();
const isDashboard = pathname?.includes("/dashboard");

if (isDashboard) {
  return <>{children}</>; // No nav
}

return (
  <>
    <ViewSwitcher />
    <CircularNavbar />
    {children}
    <Footer />
  </>
);
```

---

## URL Structure

### Organization (Her Promise)

- **Public Pages**:

  - `/about` → Full nav
  - `/blog` → Full nav
  - `/contact` → Full nav
  - `/donate` → Full nav
  - `/impact` → Full nav
  - `/programs` → Full nav

- **Dashboard**:
  - `/dashboard` → Sidebar only
  - `/dashboard/programs` → Sidebar only
  - `/dashboard/members` → Sidebar only
  - `/dashboard/events` → Sidebar only
  - `/dashboard/content` → Sidebar only

### Patience (Portfolio)

- **Public Pages**:

  - `/portfolio` → Full nav
  - `/portfolio/about` → Full nav
  - `/portfolio/login` → Full nav

- **Dashboard**:
  - `/portfolio/dashboard` → Sidebar only
  - `/portfolio/dashboard/personal-info` → Sidebar only
  - `/portfolio/dashboard/education` → Sidebar only
  - `/portfolio/dashboard/awards` → Sidebar only
  - `/portfolio/dashboard/experience` → Sidebar only
  - `/portfolio/dashboard/skills` → Sidebar only
  - `/portfolio/dashboard/languages` → Sidebar only
  - `/portfolio/dashboard/research` → Sidebar only

---

## Testing Steps

1. **Start dev server**: `npm run dev`

2. **Test Organization routes**:

   - Visit `/about` → Should see ViewSwitcher + CircularNavbar
   - Visit `/dashboard` → Should see ONLY dashboard sidebar

3. **Test Patience routes**:

   - Visit `/portfolio` → Should see ViewSwitcher + CircularNavbar
   - Visit `/portfolio/dashboard` → Should see ONLY dashboard sidebar

4. **Check ViewSwitcher**:

   - Should appear on public pages (top-left corner)
   - Should NOT appear on dashboard pages

5. **Check CircularNavbar**:

   - Should appear on public pages
   - Should NOT appear on dashboard pages

6. **Check Footer**:
   - Should appear on public pages
   - Should NOT appear on dashboard pages

---

## Common Issues & Solutions

### Issue: ViewSwitcher still showing in dashboard

**Solution**: Clear browser cache and hard reload (Cmd+Shift+R)

### Issue: Navigation not showing on public pages

**Solution**: Check that the pathname condition is working correctly

### Issue: Layout shifts or jumps

**Solution**: Verify all layouts return consistent structure

### Issue: TypeScript errors

**Solution**: Ensure ViewMode type is properly exported from (main)/layout.tsx

---

## Maintenance Notes

### Adding a new public page

1. Create page under `app/(main)/(organization)/[name]/page.tsx`
2. Automatically gets full navigation
3. No additional configuration needed

### Adding a new dashboard page

1. Create page under `app/(main)/(organization)/dashboard/[name]/page.tsx`
2. Automatically gets dashboard layout only
3. Add link to sidebar in `dashboard/layout.tsx` menuItems array

### Changing dashboard detection logic

Edit the conditional in group layouts:

```tsx
const isDashboard = pathname?.includes("/dashboard");
```

Could be changed to:

```tsx
const isDashboard = pathname?.startsWith("/dashboard");
```

Or use regex for more complex patterns.
