# Route Structure

## 📁 Organized Route Groups

```
app/
├── (main)/                           # Main route group
│   ├── layout.tsx                    # Shared layout (navbar, footer, viewMode state)
│   ├── page.tsx                      # Homepage (/)
│   │
│   ├── (patience)/                   # Patience-specific pages
│   │   └── portfolio/                # /portfolio - Patience's work showcase
│   │       └── page.tsx
│   │
│   ├── (organization)/               # Organization-specific pages
│   │   ├── programs/                 # /programs - Organization initiatives
│   │   │   └── page.tsx
│   │   ├── impact/                   # /impact - Impact stories & metrics
│   │   │   └── page.tsx
│   │   └── donate/                   # /donate - Donation page
│   │       └── page.tsx
│   │
│   └── (shared)/                     # Shared pages (work for both views)
│       ├── about/                    # /about - Dynamic based on viewMode
│       │   └── page.tsx
│       ├── blog/                     # /blog - Articles & updates
│       │   └── page.tsx
│       └── contact/                  # /contact - Contact forms
│           └── page.tsx
```

## 🎯 Route Organization Strategy

### **Route Groups** (folders with parentheses)

- Don't affect URL structure
- Used for organization and shared layouts
- `(main)` - Main site layout with navbar and footer
- `(patience)` - Patience Fero's personal pages
- `(organization)` - Her Promise Fulfilled organization pages
- `(shared)` - Pages that adapt to current viewMode

### **URL Structure**

All pages are accessible at the root level:

- `/` - Homepage
- `/about` - About page (adapts to viewMode)
- `/portfolio` - Patience's portfolio
- `/blog` - Blog posts
- `/contact` - Contact page (adapts to viewMode)
- `/programs` - Organization programs
- `/impact` - Impact stories
- `/donate` - Donation page

### **ViewMode State Management**

- Managed in `app/(main)/layout.tsx`
- Shared across all pages in the (main) group
- Based on URL hash: `#herpromise` = organization, default = patience
- Pages can access viewMode to show different content

## 🚀 Benefits

1. **Clean URLs**: No nested paths, all routes at root level
2. **Organized Code**: Clear separation between Patience and Organization pages
3. **Shared Layout**: Navbar and footer consistent across all pages
4. **Dynamic Content**: Shared pages (about, contact) adapt to viewMode
5. **Scalable**: Easy to add more pages to any group
6. **Type-Safe**: ViewMode type shared across all pages

## 📝 Adding New Pages

### Patience-specific page:

Create in `app/(main)/(patience)/new-page/page.tsx`

### Organization-specific page:

Create in `app/(main)/(organization)/new-page/page.tsx`

### Shared page (adapts to viewMode):

Create in `app/(main)/(shared)/new-page/page.tsx`
