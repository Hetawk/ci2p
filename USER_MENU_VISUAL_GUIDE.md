# User Menu Visual Guide

## 🎨 UserMenu Component States

### State 1: Not Logged In

```
┌─────────────────────────────────┐
│  Sign In    [Get Started]       │  ← Button states
└─────────────────────────────────┘
```

- "Sign In" - Text link (gray → pink on hover)
- "Get Started" - Gradient button (pink → purple)

---

### State 2: Logged In (Collapsed)

```
┌──────────────────────────────┐
│  [👤]  John Doe  ▼           │  ← Avatar + Name + Dropdown arrow
│       Admin                   │  ← Role badge (pink text)
└──────────────────────────────┘
```

- Avatar shows user initials or profile image
- Green dot indicator (online status)
- Hover effect: light gray background
- Border changes to pink on hover

---

### State 3: Logged In (Expanded Dropdown)

```
┌────────────────────────────────────────┐
│  [👤]  John Doe  ▲                     │
│       Admin                             │
└─┬──────────────────────────────────────┘
  │
  └─► ┌──────────────────────────────────┐
      │  GRADIENT HEADER (Pink → Purple) │
      │  👤 John Doe                      │
      │  ✉  john@example.com             │
      │  🛡 Super Admin Access            │
      ├──────────────────────────────────┤
      │  DASHBOARDS                       │
      │  ❤️  Her Promise Dashboard       │
      │  💼 Portfolio Dashboard           │
      ├──────────────────────────────────┤
      │  ACCOUNT                          │
      │  👤 Profile Settings              │
      │  ⚙️  Account Settings             │
      ├──────────────────────────────────┤
      │  🚪 Sign Out                      │
      └──────────────────────────────────┘
```

---

## 📐 Layout & Positioning

### Desktop View

```
┌─────────────────────────────────────────────────────────┐
│  [ViewSwitcher]              [UserMenu]                 │  ← Top bar
│                                                          │
│                   [Circular Navbar]                     │  ← Center/right
│                                                          │
│                     Page Content                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Positioning:**

- UserMenu: `fixed top-6 right-6 z-50`
- Always visible, floats above content
- Sticky position (doesn't scroll away)

---

### Mobile View

```
┌──────────────────────────┐
│  [Get Started]          │  ← Stacked buttons
│                         │
│  Circular Navbar        │
│  (smaller scale)        │
│                         │
│  Page Content           │
└──────────────────────────┘
```

**Responsive Features:**

- Avatar and name visible on mobile
- Dropdown menu scales appropriately
- Touch-friendly tap targets
- Smooth animations

---

## 🎭 Animation Details

### Dropdown Open Animation

```
Initial State:  opacity: 0, y: -10, scale: 0.95
↓ (150ms)
Final State:    opacity: 1, y: 0, scale: 1
```

### Dropdown Close Animation

```
Initial State:  opacity: 1, y: 0, scale: 1
↓ (150ms)
Final State:    opacity: 0, y: -10, scale: 0.95
```

### Logo Pulse (Login/Register Pages)

```
Scale: 1 → 1.1 → 1
Duration: 2s
Repeat: Infinite
Easing: easeInOut
```

### Background Orbs

```
Orb 1 (Pink):
  x: 0 → 100 → 0
  y: 0 → -100 → 0
  Duration: 20s

Orb 2 (Purple):
  x: 0 → -100 → 0
  y: 0 → 100 → 0
  Duration: 25s
```

---

## 🎨 Color Scheme

### User Menu

```css
/* Avatar Background (no image) */
background: linear-gradient(to-br, #ec4899, #a855f7);  /* Pink to Purple */

/* Dropdown Header */
background: linear-gradient(to-r, #ec4899, #a855f7);   /* Pink to Purple */

/* Card Background */
background: rgba(255, 255, 255, 0.8);                   /* White 80% */
backdrop-filter: blur(12px);                            /* Blur effect */

/* Border */
border: 1px solid rgba(255, 255, 255, 0.2);            /* White 20% */

/* Hover States */
Dashboard Items: bg-pink-50, text-pink-600
Account Items:   bg-gray-50, text-gray-900
Logout Button:   bg-red-50, text-red-600

/* Role Badges */
Admin:        text-pink-600
Super Admin:  text-pink-600 with shield icon
```

### Buttons

```css
/* Primary Button (Get Started) */
background: linear-gradient(to-r, #ec4899, #a855f7);
hover: linear-gradient(to-r, #db2777, #9333ea);
transform: scale(1.05) on hover

/* Secondary Button (Sign In) */
color: #374151;  /* Gray 700 */
hover: #db2777;  /* Pink 600 */
```

---

## 🔍 Interactive States

### Avatar/Button

1. **Default:** Border gray-200
2. **Hover:** Border pink-300, background gray-100
3. **Active/Open:** Keep hover styles

### Menu Items

1. **Default:** Transparent background
2. **Hover:**
   - Dashboard links: pink-50 background, pink-600 text
   - Account links: gray-50 background, gray-900 text
   - Logout: red-50 background, red-600 text
3. **Active/Clicked:** Slight scale animation

### Dropdown Backdrop

```
Click outside → Close dropdown
Escape key → Close dropdown
Click menu item → Close dropdown (except logout which needs confirmation)
```

---

## 📱 Responsive Breakpoints

### Large Screens (≥ 768px)

- Full avatar + name + role display
- Dropdown width: 288px (w-72)
- All menu sections visible

### Small Screens (< 768px)

- Avatar only (hidden: name + role)
- Dropdown width: 288px (w-72)
- Same functionality, compact view

---

## 🎯 User Flows

### Login Flow

```
1. User clicks "Sign In" → /auth/login
2. Enters email/username + password
3. Success → Redirects to dashboard
4. UserMenu updates → Shows avatar + name
5. Dropdown shows dashboard links based on permissions
```

### Register Flow

```
1. User clicks "Get Started" → /auth/register
2. Fills form (name, email, username, password)
3. Submit → Success screen
4. User checks email → Clicks verification link
5. Redirects to /auth/verify-email → Success
6. User logs in → UserMenu appears
```

### Logout Flow

```
1. User clicks avatar → Dropdown opens
2. Clicks "Sign Out" → Loading spinner
3. POST /api/auth/logout
4. Cookie cleared
5. Redirect to home
6. UserMenu shows "Sign In" + "Get Started" buttons
```

---

## 🚀 Usage Examples

### Basic Implementation (Already Done)

```tsx
// In CircularNavbar.tsx
<div className="fixed top-6 right-6 z-50">
  <UserMenu />
</div>
```

### Custom Placement

```tsx
// In any layout
import { UserMenu } from "@/components/layout";

<header className="flex justify-between items-center p-4">
  <Logo />
  <UserMenu />
</header>;
```

### With Additional Menu Items

```tsx
// Extend UserMenu component
// Add custom menu sections in dropdown
<div className="px-2 py-2 border-b border-gray-100">
  <Link href="/custom-page">
    <CustomIcon />
    <span>Custom Feature</span>
  </Link>
</div>
```

---

## 🎊 Final Result

The UserMenu provides:

- ✅ Automatic user detection
- ✅ Role-based dashboard access
- ✅ Beautiful animations
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Security (HTTP-only cookies)
- ✅ Loading states
- ✅ Error handling
- ✅ Smooth transitions
- ✅ Professional appearance

**It's production-ready and fully integrated!** 🎉
