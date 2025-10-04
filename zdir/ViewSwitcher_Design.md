# ViewSwitcher Design Documentation

## Overview

The new ViewSwitcher is a compact, circular split button that serves as a logo-like element for switching between Patience Fero's personal view and Her Promise Fulfilled organization view.

## Design Features

### Visual Design

- **Shape**: Circular button (64px × 64px) split vertically into two halves
- **Left Half**: Patience Fero (User icon)
- **Right Half**: Her Promise Fulfilled (Heart icon)
- **Style**: Glassmorphism with backdrop blur, gradient overlays, and subtle animations

### Positioning Behavior

- **Default Position**: Fixed at top-left corner (1.5rem from top, 1.5rem from left)
- **On Scroll**: Scales down slightly (85%) but stays in the same position
- **Navbar Alignment**: Navbar positions itself to the right of the ViewSwitcher with a 1rem gap

### Interactive Elements

1. **Click Areas**: Each half is independently clickable
2. **Active State**: The active side shows a gradient background (brand gradient for Patience, cyan gradient for Organization)
3. **Hover Tooltip**: Shows current view name on hover
4. **Icons**: User icon (left) and Heart icon (right) with color changes based on active state

### Color Coding

- **Patience (Left)**: Brand gradient (brand-400 to brand-500) when active
- **Organization (Right)**: Accent gradient (accent-sky-400 to accent-cyan-400) when active
- **Inactive**: Gray icons that transition to white when active

### Spacing Layout

```
[ViewSwitcher (64px)] [1rem gap] [Navbar (starts here)]
│                                 │
└─ Left: 1.5rem                  └─ Left: 6.5rem (when scrolled)
                                    Center (default)
```

### Responsive Behavior

- When **not scrolled**:
  - ViewSwitcher: Top-left corner at full size
  - Navbar: Centered horizontally
- When **scrolled** (>50px):
  - ViewSwitcher: Top-left corner at 85% scale
  - Navbar: Moves to align next to ViewSwitcher (left: 6.5rem) at 90% scale

## User Experience

- **Minimal Space**: Takes only 64px width, much smaller than the previous pill-shaped buttons
- **Always Visible**: Fixed position ensures it's always accessible
- **Logo-Like**: Acts as a visual identity marker for the site
- **Smooth Transitions**: Spring animations for all state changes
- **Clear Feedback**: Visual indicators show which view is active

## Implementation Files

- `/components/layout/ViewSwitcher.tsx` - Main component
- `/app/(main)/layout.tsx` - Integration point
- `/components/layout/CircularNavbar.tsx` - Updated positioning
- `/components/sections/Hero.tsx` - Removed old switch buttons

## Technical Details

- Uses Framer Motion for smooth animations
- Shares viewMode state with layout and navbar
- Implements scroll detection with useScroll hook
- layoutId for smooth active state transitions
- Fully accessible with aria-labels
