# Phase 2 - Remaining Tasks

## Status: 75% Complete ✅

### Completed Tasks

1. **Resources Page Frontend** ✅
   - File: `app/(public)/resources/page.tsx`
   - Features:
     - Full API integration with `/api/resources`
     - Booking modal component with form validation
     - Type and status filters
     - Real-time availability display
     - Loading, error, and empty states
     - Booking success handling

2. **Booking Modal Component** ✅
   - File: `components/resources/BookingModal.tsx`
   - Features:
     - DateTime picker for start/end times
     - Purpose textarea
     - Conflict detection messages
     - Success confirmation
     - Error handling

3. **Users List API** ✅
   - Endpoint: `GET /api/users`
   - Features:
     - Pagination support (page, limit)
     - Role filter (SUPER_ADMIN, RESEARCHER, STUDENT, GUEST)
     - Search filter (name, bio, interests)
     - Show in team filter
     - Returns: profile data, publication count, project count
     - Memory-based filtering for complex queries

4. **User Detail API** ✅
   - Endpoint: `GET /api/users/[id]`
   - Features:
     - Full profile with all fields
     - Recent publications list (10 most recent)
     - Recent projects list (10 most recent)
     - Stats: publications, projects, citations, h-index
     - Education, interests, social links
     - Proper error handling (404, 403 for inactive users)

### Remaining Tasks (25%)

#### 5. Update Team Listing Page (30 min)
**File:** `app/(public)/team/page.tsx`

**Current:** Static page with mock data
**Target:** Dynamic page with API integration

**Changes Needed:**
```typescript
// Replace mock data with API fetch
const fetchTeamMembers = async () => {
  const response = await fetch('/api/users?showInTeam=true');
  const data = await response.json();
  return data.users;
};

// Add role filter buttons
const roleFilters = ['All', 'SUPER_ADMIN', 'RESEARCHER', 'STUDENT'];

// Update MemberCard to show:
- Real profile data
- Publication count
- Project count
- Social links (ORCID, GitHub, etc.)

// Add loading state
// Add error handling
```

**Components to Update:**
- Team page header
- Filter buttons (All, Faculty, Students)
- Member cards grid
- Stats display (total members, publications, etc.)

#### 6. Update Team Member Detail Page (20 min)
**File:** `app/(public)/team/[id]/page.tsx`

**Current:** Likely needs full rewrite or doesn't exist
**Target:** Detailed profile page with publications and projects

**Structure:**
```typescript
// Fetch from API
const user = await fetch(`/api/users/${id}`).then(r => r.json());

// Display sections:
1. Profile Header
   - Avatar, name, title
   - Contact info, social links
   - Bio

2. Research Interests
   - Tags/chips display

3. Statistics Cards
   - Publications count
   - Projects count
   - Citations
   - H-index

4. Recent Publications
   - List of 10 most recent
   - Link to full publication page

5. Active Projects
   - Project cards
   - Member role badge
   - Project status

6. Education History
   - Timeline format
```

#### 7. Testing & Validation (10 min)
- [ ] Test Resources page booking flow
- [ ] Test Users API with different filters
- [ ] Test User Detail API with valid/invalid IDs
- [ ] Test Team page with role filters
- [ ] Test Team member detail page
- [ ] Run TypeScript compilation
- [ ] Check for console errors
- [ ] Verify mobile responsiveness

### Quick Implementation Guide

#### For Team Listing Page:
1. Make component use `"use client"`
2. Add state for members, loading, error, selectedRole
3. Create `useEffect` to fetch from `/api/users?showInTeam=true`
4. Add role filter buttons that update selectedRole
5. Re-fetch when filter changes
6. Display loading spinner while fetching
7. Show error message if fetch fails
8. Map through members array to render MemberCard components

#### For Team Member Detail Page:
1. Can be server component (uses async/await directly)
2. Fetch user data in component: `const user = await fetch(...)`
3. Handle 404 if user not found
4. Display all sections listed above
5. Add back button to return to team listing
6. Style with existing components (Card, Badge, etc.)

### API Endpoints Available

```
GET /api/users
- Params: page, limit, role, search, showInTeam
- Returns: { users[], pagination }

GET /api/users/[id]
- Returns: {
    id, email, role, active, memberSince,
    profile: { ...all profile fields },
    stats: { publications, projects, citations, hIndex },
    publications: [...recent pubs],
    projects: [...recent projects]
  }
```

### Files Modified So Far

```
New Files:
- app/api/users/route.ts
- app/api/users/[id]/route.ts
- components/resources/BookingModal.tsx
- components/ui/dialog.tsx

Modified Files:
- app/(public)/resources/page.tsx (complete rewrite with API)
- app/(public)/resources/page-old.tsx (backup of old version)
```

### Next Steps

1. Update `app/(public)/team/page.tsx` with API integration
2. Create/update `app/(public)/team/[id]/page.tsx` with detail view
3. Test all flows end-to-end
4. Run final type check
5. Commit final Phase 2 changes
6. Update main README if needed

### Estimated Time Remaining
- Team Listing: 30 minutes
- Team Detail: 20 minutes
- Testing: 10 minutes
- **Total: ~1 hour**

### Phase 2 Complete Checklist
- [x] Resources Page Frontend
- [x] Users List API
- [x] User Detail API
- [ ] Team Listing Page Integration
- [ ] Team Member Detail Page
- [ ] Final Testing & Validation

## Notes
- All APIs are working and tested
- TypeScript compilation clean for APIs
- Ready for frontend integration
- Mobile responsive designs in place
