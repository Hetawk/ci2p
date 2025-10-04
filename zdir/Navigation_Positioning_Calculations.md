# Navigation Layout Calculation & Analysis

## Component Dimensions

### ViewSwitcher

- **Width**: 64px (4rem / w-16)
- **Height**: 64px (4rem / h-16)
- **Border**: 2px solid brand-400
- **Total visual width**: 64px

### CircularNavbar

- **Items**: 6 navigation items
- **Item padding (not scrolled)**: px-4 py-2 = 16px left + 16px right = 32px per item
- **Item padding (scrolled)**: px-3 py-1.5 = 12px left + 12px right = 24px per item
- **Gap between items**: gap-0.5 = 2px
- **Icon**: 20px (w-5 h-5)
- **Text**: ~60-100px (varies by text length)
- **Average item width**: ~120px per item (icon + text + padding)
- **Container padding (not scrolled)**: px-5 py-2.5 = 20px left + 20px right = 40px
- **Container padding (scrolled)**: px-3 py-1.5 = 12px left + 12px right = 24px
- **Estimated total navbar width (not scrolled)**: 6 items × 120px + 40px padding + 10px gaps = ~770px (~48rem)
- **Estimated total navbar width (scrolled)**: 6 items × 100px + 24px padding + 10px gaps = ~634px (~40rem)

## Positioning States

### State 1: NOT SCROLLED (Default - Centered)

#### Navbar:

- `left: 50%`
- `x: -50%` (translateX)
- **Result**: Perfectly centered horizontally
- **Actual position**: Center of navbar at center of screen

#### ViewSwitcher:

- `left: calc(50% - 16rem)` = `left: calc(50% - 256px)`
- **Problem**: This positions it 256px to the LEFT of screen center
- **Gap from navbar**: Need to calculate based on navbar width

**Correct Calculation for ViewSwitcher (not scrolled):**

```
Navbar center: 50%
Navbar left edge: 50% - (navbarWidth/2) = 50% - 385px = 50% - 24rem

ViewSwitcher should be: (Navbar left edge) - (gap) - (ViewSwitcher width)
= (50% - 24rem) - 1rem - 4rem
= 50% - 29rem
```

### State 2: SCROLLED (Split)

#### Navbar:

- `left: auto`
- `right: 1.5rem` (24px from right edge)
- `scale: 0.9`
- **Scaled width**: ~634px × 0.9 = ~570px
- **Result**: Navbar aligned to right corner

#### ViewSwitcher:

- `left: 1.5rem` (24px from left edge)
- `scale: 0.85`
- **Scaled width**: 64px × 0.85 = ~54px
- **Result**: ViewSwitcher aligned to left corner

## Screen Size Considerations

### Viewport Assumptions:

- **Desktop**: 1920px wide (most common)
- **Laptop**: 1440px wide
- **Tablet**: 1024px wide

### Centered Layout (Not Scrolled):

```
Screen: |------------------------------------------|
        |                                          |
        |    [VS]  gap  [========Navbar========]   |
        |                                          |
        |------------------------------------------|
```

### Split Layout (Scrolled):

```
Screen: |------------------------------------------|
        |                                          |
        [VS]                            [Navbar]  |
        |                                          |
        |------------------------------------------|
```

## Current Issues

1. **ViewSwitcher Position (Not Scrolled)**:

   - Current: `calc(50% - 16rem)` = `calc(50% - 256px)`
   - This puts it at: Screen_center - 256px
   - Navbar left edge is at: Screen_center - ~385px
   - **Gap between them**: 385px - 256px = 129px (8rem) ✓ Good spacing!
   - **BUT**: On smaller screens (<1200px), ViewSwitcher might go off-screen left

2. **Z-Index**:

   - ViewSwitcher: z-[100] ✓
   - Navbar: z-40 ✓
   - ViewSwitcher is on top ✓

3. **Visibility Issues**:
   - White background with blue border should be visible ✓
   - Fixed positioning ✓
   - Opacity animates from 0 to 1 ✓

## Recommended Fix

### Option 1: Safe Positioning (Always Visible)

```tsx
// ViewSwitcher - keep it simple and always visible
left: isScrolled ? "1.5rem" : "max(1.5rem, calc(50% - 29rem))";
```

This ensures:

- Never goes off-screen on small displays
- Positions nicely to the left of navbar on large displays

### Option 2: Responsive Positioning

Use Tailwind responsive classes:

```tsx
className={`fixed top-6 z-[100] ${
  isScrolled
    ? "left-6"
    : "left-6 lg:left-[calc(50%-29rem)]"
}`}
```

### Option 3: Dynamic Calculation (Most Accurate)

Calculate navbar width in useEffect and position accordingly.

## Final Positioning Solution

Based on calculations, the ViewSwitcher at `calc(50% - 16rem)` should be visible on screens wider than ~1024px. For smaller screens, we need a fallback.

**Recommended values:**

- Not scrolled: `left: max(1.5rem, calc(50% - 25rem))` - This ensures 1rem gap from navbar
- Scrolled: `left: 1.5rem`
