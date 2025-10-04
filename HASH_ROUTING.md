# Hash-Based Routing System

## Overview

The application uses hash-based routing **only for toggling between Patience's profile and Her Promise Fulfilled organization** on the homepage. This provides a seamless single-page experience for the dual-purpose homepage while maintaining shareable URLs. Other pages (About, Portfolio, Blog, Contact) use normal Next.js navigation.

## How It Works

### URL Patterns

- `http://localhost:3000/#patience` - Shows Patience Fero's profile (default)
- `http://localhost:3000/#herpromise` - Shows Her Promise Fulfilled organization
- `http://localhost:3000/` - Defaults to Patience's profile

### Navigation Items

**Hash-Based (Stay on homepage):**

- **Home** → `#patience` - Shows Patience's profile
- **Her Promise** → `#herpromise` - Toggles to organization view

**Normal Navigation (Go to separate pages):**

- **About** → `/about` - Navigates to About page
- **Portfolio** → `/portfolio` - Navigates to Portfolio page
- **Blog** → `/blog` - Navigates to Blog page
- **Contact** → `/contact` - Navigates to Contact page

## Benefits

1. **Seamless Homepage Toggle**: Switching between Patience and Her Promise is instant and smooth
2. **Shareable Links**: Share direct links to either view (`#patience` or `#herpromise`)
3. **Normal Page Navigation**: Other sections work as expected with full page routes
4. **Browser History**: Back/forward buttons work correctly
5. **Smooth Transitions**: Framer Motion animations work seamlessly on the homepage

## Technical Implementation

### 1. Page Component (`app/page.tsx`)

- Reads hash on mount and sets initial view mode
- Listens for `hashchange` events for browser back/forward
- Updates URL hash when view mode changes

### 2. Circular Navbar (`components/layout/CircularNavbar.tsx`)

- All items use hash links (`<a href="#...">`)
- Clicking items updates the hash and scrolls to top
- No page navigation occurs

### 3. Hero Component (`components/sections/Hero.tsx`)

- Toggle buttons update both state and URL hash
- Ensures consistency between UI and URL

## Usage Examples

### Share Organization Link

```
Send this link: https://yoursite.com/#herpromise
User clicks it → Organization view loads directly
```

### Share Profile Link

```
Send this link: https://yoursite.com/#patience
User clicks it → Patience's profile loads directly
```

### In-App Navigation

- Click any navbar item → Updates hash, stays on page
- Click toggle in Hero → Updates hash, changes view
- Use browser back/forward → Hash changes, view updates

## Future Enhancements

When you implement the other sections (About, Portfolio, Blog, Contact):

- Add corresponding hash handlers in `app/page.tsx`
- Create section components that respond to the hash
- Consider using `IntersectionObserver` to update hash based on scroll position
