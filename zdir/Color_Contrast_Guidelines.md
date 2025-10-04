# Color Contrast Guidelines for Her Promise Fulfilled

## Brand Colors

Our primary brand color is **Blue** with cyan/sky blue accents.

### Color Palette

**Primary Brand Blue:**

- `#3b82f6` (brand-500) - Main brand color
- `#2563eb` (brand-600) - Darker blue for hover states
- `#60a5fa` (brand-400) - Lighter blue for backgrounds

**Accent Colors:**

- `#06b6d4` (cyan-500) - Primary cyan accent
- `#0ea5e9` (sky-500) - Sky blue accent
- `#14b8a6` (teal-500) - Teal accent

**Gradient Combinations:**

```css
/* Primary gradient - use most often */
background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);

/* Alternative gradients */
background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%);
background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
```

## Text Color Guidelines

### ✅ GOOD Combinations (High Contrast)

**On White Backgrounds:**

- Text: `text-gray-900` (#111827) - Main headings
- Text: `text-gray-800` (#1f2937) - Subheadings
- Text: `text-gray-700` (#374151) - Body text
- Text: `text-gray-600` (#4b5563) - Secondary text
- Links: `text-brand-600` (#2563eb)

**On Colored Backgrounds:**

- On blue/cyan gradients: `text-white` (#ffffff)
- On brand-50/100: `text-gray-900` or `text-gray-800`
- On gray-50: `text-gray-900` or `text-gray-800`

### ❌ AVOID These Combinations (Poor Contrast)

- ~~White text on white/light backgrounds~~
- ~~Light gray text on white backgrounds (text-gray-300 or lighter)~~
- ~~text-brand-300 or lighter on white backgrounds~~

## Component Styling Best Practices

### Cards

```jsx
// White card with proper border
<div className="bg-white shadow-md border border-brand-200 rounded-xl p-6">
  <h3 className="text-gray-900 font-bold mb-2">Title</h3>
  <p className="text-gray-700">Body text</p>
</div>
```

### Buttons

```jsx
// Primary button with gradient
<button
  className="text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl"
  style={{ background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" }}
>
  Button Text
</button>

// Secondary button
<button className="bg-white text-brand-600 border-2 border-brand-500 font-semibold py-3 px-6 rounded-lg hover:bg-brand-50">
  Button Text
</button>
```

### Icon Circles

```jsx
// Gradient circle with white icon
<div
  className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
  style={{ background: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)" }}
>
  <Icon className="w-6 h-6 text-white" />
</div>
```

### Sections

```jsx
// White section
<section className="py-20 bg-white">

// Light gray section (for contrast)
<section className="py-20 bg-gradient-to-b from-gray-50 to-white">

// Brand tinted section (very subtle)
<section className="py-20 bg-gradient-to-br from-brand-50 via-white to-accent-sky-50">
```

## Common Issues & Fixes

### Issue 1: White text on white background

**Problem:** Using `text-white` or very light colors on white/light backgrounds
**Solution:** Use `text-gray-900`, `text-gray-800`, or `text-gray-700` instead

### Issue 2: Icons not visible

**Problem:** White icons on white backgrounds or using Tailwind gradient classes that don't render
**Solution:**

- Always use inline `style` prop for gradients on icon backgrounds
- Ensure icons use `text-white` on colored backgrounds

### Issue 3: Low contrast text

**Problem:** Using `text-gray-400` or lighter on white backgrounds
**Solution:** Use `text-gray-600` or darker for body text

### Issue 4: Gradient classes not working

**Problem:** Using Tailwind classes like `from-brand-500` without proper configuration
**Solution:** Use inline styles with explicit hex colors:

```jsx
style={{ background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" }}
```

## Accessibility Standards

- **Minimum contrast ratio:** 4.5:1 for normal text
- **Minimum contrast ratio:** 3:1 for large text (18pt+)
- **Links:** Should be distinguishable from regular text (use brand-600)
- **Focus states:** Always visible and high contrast

## Quick Reference

**Main Text Colors:**

- Headings: `text-gray-900`
- Body: `text-gray-700`
- Secondary: `text-gray-600`
- Links: `text-brand-600`

**Background Colors:**

- Pure white: `bg-white`
- Light gray: `bg-gray-50`
- Very light: `bg-gradient-to-b from-gray-50 to-white`

**Border Colors:**

- Subtle: `border-gray-200`
- Brand: `border-brand-200`
- Bold: `border-brand-500`

**Shadow:**

- Light: `shadow-md`
- Medium: `shadow-lg`
- Heavy: `shadow-xl`

---

**Remember:** When in doubt, test contrast! Dark text on light backgrounds, light text on dark backgrounds.
