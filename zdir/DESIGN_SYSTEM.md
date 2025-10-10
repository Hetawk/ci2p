# CI2P Lab Design System

## 🎨 Color Palette Guide

This document explains our professional, tech-inspired color system and how to use it consistently across the platform.

---

## Primary Color System

### 🔵 Primary Blue - Intelligence & Innovation

**Main brand color** - Use for primary actions, headings, and brand elements

```tsx
// Usage Examples:
className = "bg-primary-500"; // Main blue background
className = "text-primary-700"; // Dark blue text
className = "border-primary-400"; // Medium blue border
className = "hover:bg-primary-600"; // Hover state

// Gradient
className = "bg-gradient-primary"; // Blue gradient background
```

**Scale:**

- `50-200`: Backgrounds, subtle highlights
- `400-500`: Interactive elements, **main brand color**
- `600-800`: Emphasis, headings, text
- `900-950`: Dark mode, deep backgrounds

---

### 🌊 Secondary Cyan - Data & Computing

**Accent color** - Use for secondary actions, data visualization, computing elements

```tsx
// Usage Examples:
className = "bg-secondary-500"; // Cyan background
className = "text-secondary-600"; // Deep cyan text
className = "border-secondary-400"; // Vibrant cyan border

// Gradient
className = "bg-gradient-secondary"; // Cyan gradient
className = "bg-gradient-cyber"; // Cyber gradient (cyan to purple)
```

---

### ⚡ Accent Purple - AI & Machine Learning

**AI/ML highlight** - Use for AI features, machine learning content, special emphasis

```tsx
// Usage Examples:
className = "bg-accent-500"; // Purple background
className = "text-accent-600"; // Deep purple text
className = "border-accent-400"; // Bright purple border

// Gradient
className = "bg-gradient-ai"; // AI gradient (purple tones)
```

---

### ✅ Success Green - Achievements & Success

**Positive actions** - Use for success messages, achievements, completed states

```tsx
// Usage Examples:
className = "bg-success-500"; // Green background
className = "text-success-700"; // Dark green text
className = "border-success-400"; // Bright green border

// Gradient
className = "bg-gradient-success"; // Success gradient
```

---

### ⚠️ Warning Amber - Alerts & Attention

**Attention needed** - Use for warnings, important notices, pending states

```tsx
// Usage Examples:
className = "bg-warning-500"; // Amber background
className = "text-warning-700"; // Dark amber text
className = "border-warning-400"; // Bright amber border

// Gradient
className = "bg-gradient-warning"; // Warning gradient
```

---

### 🔴 Danger Red - Errors & Critical

**Errors** - Use for error messages, destructive actions, critical alerts

```tsx
// Usage Examples:
className = "bg-danger-500"; // Red background
className = "text-danger-700"; // Dark red text
className = "border-danger-400"; // Bright red border
```

---

### ⚪ Neutral Gray - Text & Backgrounds

**Default text** - Use for body text, borders, backgrounds

```tsx
// Usage Examples:
className = "bg-neutral-50"; // Light background
className = "text-neutral-700"; // Body text
className = "border-neutral-300"; // Default borders
className = "text-neutral-500"; // Muted text
```

---

## Gradient System

### Hero & Landing Pages

```tsx
className = "bg-gradient-hero"; // Dark hero background
className = "bg-gradient-hero-light"; // Light hero background
className = "bg-gradient-mesh"; // Modern mesh gradient
```

### Dashboard

```tsx
className = "bg-gradient-dash"; // Light dashboard background
className = "bg-gradient-dash-dark"; // Dark dashboard background
```

### Cards

```tsx
className = "bg-gradient-card"; // Card background
className = "hover:bg-gradient-card-hover"; // Card hover effect
```

---

## Animation System

### Entrance Animations

```tsx
className = "animate-fade-in"; // Simple fade in
className = "animate-fade-in-up"; // Fade in from bottom
className = "animate-slide-up"; // Slide up
className = "animate-scale-in"; // Scale in
className = "animate-zoom-in"; // Zoom in effect
```

### Continuous Animations

```tsx
className = "animate-float"; // Floating effect
className = "animate-float-slow"; // Slower float
className = "animate-pulse-slow"; // Slow pulse
className = "animate-spin-slow"; // Slow rotation
```

### Glow Effects

```tsx
className = "animate-glow"; // Blue glow pulse
className = "animate-glow-primary"; // Primary color glow
className = "animate-glow-secondary"; // Cyan glow
className = "animate-glow-accent"; // Purple glow
```

### Special Effects

```tsx
className = "animate-shimmer"; // Shimmer effect
className = "animate-gradient-x"; // Horizontal gradient animation
className = "animate-wave"; // Wave motion
```

---

## Box Shadow System

### Standard Shadows

```tsx
className = "shadow-card"; // Card elevation
className = "shadow-card-hover"; // Card hover elevation
className = "shadow-elevated"; // High elevation
```

### Glow Shadows

```tsx
className = "shadow-glow"; // Blue glow shadow
className = "shadow-glow-primary"; // Primary glow
className = "shadow-glow-secondary"; // Cyan glow
className = "shadow-glow-accent"; // Purple glow
```

---

## Usage Examples

### Hero Section

```tsx
<section className="bg-gradient-hero text-white">
  <h1 className="text-6xl font-bold animate-fade-in-up">CI2P Research Lab</h1>
  <p className="text-primary-200 animate-fade-in-down">
    Advancing Intelligent Computing
  </p>
</section>
```

### Paper Card

```tsx
<div
  className="bg-white shadow-card hover:shadow-card-hover 
                border border-neutral-200 rounded-lg p-6
                transition-all duration-300 animate-fade-in"
>
  <h3 className="text-primary-700 font-semibold">Publication Title</h3>
  <p className="text-neutral-600">Abstract text...</p>
  <span className="text-secondary-500">ORCID Verified</span>
</div>
```

### Button States

```tsx
// Primary Action
<button className="bg-primary-500 hover:bg-primary-600
                   text-white shadow-glow-primary">
  Research Projects
</button>

// Secondary Action
<button className="bg-secondary-500 hover:bg-secondary-600
                   text-white shadow-glow-secondary">
  Publications
</button>

// AI/ML Feature
<button className="bg-accent-500 hover:bg-accent-600
                   text-white shadow-glow-accent">
  AI Analysis
</button>

// Success Action
<button className="bg-success-500 hover:bg-success-600
                   text-white">
  Save
</button>

// Danger Action
<button className="bg-danger-500 hover:bg-danger-600
                   text-white">
  Delete
</button>
```

### Status Badges

```tsx
// Published
<span className="bg-success-100 text-success-700 border-success-300">
  Published
</span>

// Pending
<span className="bg-warning-100 text-warning-700 border-warning-300">
  Under Review
</span>

// Draft
<span className="bg-neutral-100 text-neutral-700 border-neutral-300">
  Draft
</span>

// ORCID Verified
<span className="bg-secondary-100 text-secondary-700 border-secondary-300">
  ORCID Verified
</span>
```

### Floating Elements

```tsx
<div className="animate-float shadow-glow-primary">
  <img src="/ci2p_logo.png" alt="CI2P Lab" />
</div>
```

### Glowing Cards

```tsx
<div
  className="bg-gradient-card shadow-glow 
                hover:shadow-glow-primary
                animate-fade-in-up"
>
  Featured Research
</div>
```

---

## Best Practices

### 1. **Consistency**

- Always use semantic color names (`primary`, `secondary`, `success`, etc.)
- Never hardcode hex values in components

### 2. **Hierarchy**

- Use `primary-700/800` for headings
- Use `neutral-600/700` for body text
- Use `neutral-400/500` for muted text

### 3. **Contrast**

- Ensure text has sufficient contrast with backgrounds
- Use darker shades (600-800) on light backgrounds
- Use lighter shades (50-300) on dark backgrounds

### 4. **Hover States**

- Always increase shade by 100 for hover states
- Example: `bg-primary-500 hover:bg-primary-600`

### 5. **Gradients**

- Use gradients sparingly for emphasis
- Prefer solid colors for interactive elements

### 6. **Animations**

- Use entrance animations for initial load
- Use continuous animations sparingly
- Prefer subtle transitions for interactive states

---

## Updating the Color System

To change the entire color scheme, edit **one place**: `tailwind.config.ts`

```typescript
// Example: Change primary color from blue to green
primary: {
  500: "#10b981", // Change this to your new color
  // Update all other shades accordingly
}
```

All components using `bg-primary-500` will automatically update! ✨

---

## Dark Mode Support

Add dark mode variants using the `dark:` prefix:

```tsx
<div
  className="bg-white dark:bg-neutral-900 
                text-neutral-900 dark:text-neutral-100"
>
  Content
</div>
```

---

**Remember:** The goal is beautiful, professional, consistent design. Use this system to maintain visual harmony across the entire platform! 🎨✨
