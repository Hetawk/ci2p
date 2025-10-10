# API Implementation Summary

## Overview

This document summarizes the comprehensive CRUD API implementations for the CI2P Lab platform. All APIs include proper authentication, authorization, validation, and error handling.

## Completed APIs

### 1. Papers API ✅

**Base Route**: `/app/api/papers/route.ts`

- **GET** `/api/papers` - List publications with filtering, search, pagination
  - Query params: `page`, `limit`, `search`, `year`, `category`, `sortBy`, `featured`
  - Returns paginated list with author details
  - Parses JSON authors field
- **POST** `/api/papers` - Create new publication
  - Authentication: Required (RESEARCHER or SUPER_ADMIN)
  - Validates required fields: title, abstract, authors, year
  - Auto-assigns authorId from authenticated user
  - Updates user's publicationCount
  - Handles authors as array or string

**Individual Route**: `/app/api/papers/[id]/route.ts`

- **GET** `/api/papers/[id]` - Get single publication

  - Returns full publication with author profile
  - Parses authors JSON

- **PUT** `/api/papers/[id]` - Update publication

  - Authentication: Required
  - Authorization: Owner or Admin
  - Validates ownership before update
  - Supports partial updates

- **DELETE** `/api/papers/[id]` - Delete publication
  - Authentication: Required
  - Authorization: Owner or SUPER_ADMIN
  - Decrements user's publicationCount
- **PATCH** `/api/papers/[id]` - Toggle operations
  - Actions: `toggleFeatured`, `togglePublished`, `incrementViews`, `incrementDownloads`
  - Authentication: Required
  - Authorization: Owner or Admin

**Key Features**:

- JWT token verification via cookies ("auth-token")
- Role-based access control
- Input validation
- Profile count synchronization
- JSON field parsing (authors)
- Proper error handling with status codes

---

### 2. Projects API ✅

**Base Route**: `/app/api/projects/route.ts`

- **GET** `/api/projects` - List projects with filtering

  - Query params: `page`, `limit`, `search`, `status`, `tag`, `sortBy`, `featured`
  - Includes team members with user profiles
  - Returns member count

- **POST** `/api/projects` - Create new project
  - Authentication: Required (RESEARCHER or SUPER_ADMIN)
  - Validates: title, description (required)
  - Auto-generates slug from title
  - Creates ProjectMember with role "LEAD" for creator
  - Updates user's projectCount
  - Handles funding as object (source, amount, grantNumber)

**Individual Route**: `/app/api/projects/[id]/route.ts`

- **GET** `/api/projects/[id]` - Get project by ID or slug

  - Returns full project with all members
  - Parses JSON fields: tags, gallery, publications

- **PUT** `/api/projects/[id]` - Update project

  - Authentication: Required
  - Authorization: Project LEAD/CO_LEAD or SUPER_ADMIN
  - Checks ProjectMember role
  - Updates slug if title changes
  - Handles nested funding object

- **DELETE** `/api/projects/[id]` - Delete project

  - Authentication: Required
  - Authorization: SUPER_ADMIN only
  - Cascade deletes ProjectMembers (via Prisma schema)

- **PATCH** `/app/api/projects/[id]` - Toggle/update operations
  - Actions: `toggleFeatured`, `togglePublished`, `updateStatus`, `incrementViews`
  - `updateStatus` requires `value` parameter
  - Authentication: Required
  - Authorization: Project LEAD/CO_LEAD or SUPER_ADMIN

**Key Features**:

- Slug generation and uniqueness
- Project role validation (LEAD, CO_LEAD, RESEARCHER, STUDENT, COLLABORATOR)
- Member relationship management
- Status enum handling (PLANNING, ACTIVE, COMPLETED, ON_HOLD, CANCELLED)
- Funding structure support
- JSON field parsing

---

### 3. News/Announcements API ✅

**Base Route**: `/app/api/news/route.ts`

- **GET** `/api/news` - List announcements

  - Query params: `page`, `limit`, `search`, `category`, `tag`, `sortBy`
  - Filters by published status
  - Search across title, excerpt, content
  - Returns: id, title, slug, excerpt, cover, category, tags, pinned, publishedAt, views

- **POST** `/api/news` - Create announcement
  - Authentication: Required (RESEARCHER or SUPER_ADMIN)
  - Validates: title, excerpt, content (required)
  - Auto-generates unique slug with collision handling
  - Default category: LAB_NEWS
  - Default publishedAt: now

**Individual Route**: `/app/api/news/[id]/route.ts`

- **GET** `/api/news/[id]` - Get announcement by ID or slug

  - Parses JSON: tags, gallery

- **PUT** `/api/news/[id]` - Update announcement

  - Authentication: Required
  - Authorization: Author or Admin (SUPER_ADMIN/RESEARCHER)
  - Updates slug if title changes
  - Handles publishedAt date

- **DELETE** `/api/news/[id]` - Delete announcement

  - Authentication: Required
  - Authorization: Author or SUPER_ADMIN

- **PATCH** `/api/news/[id]` - Toggle operations
  - Actions: `togglePinned`, `togglePublished`, `incrementViews`
  - Authentication: Required
  - Authorization: Author or Admin

**Key Features**:

- Uses `Announcement` Prisma model
- Slug uniqueness enforcement with counter
- Pin functionality for important news
- Category enum: LAB_NEWS, PUBLICATION, AWARD, EVENT, SEMINAR, RECRUITMENT, COLLABORATION, MEDIA, OTHER
- View tracking

---

## Authentication & Authorization Pattern

All APIs follow this security pattern:

### 1. **Authentication Check**

\`\`\`typescript
const token = request.cookies.get("auth-token")?.value;
if (!token) {
return NextResponse.json(
{ success: false, error: "Unauthorized" },
{ status: 401 }
);
}

const payload = await verifyToken(token);
if (!payload?.userId) {
return NextResponse.json(
{ success: false, error: "Invalid token" },
{ status: 401 }
);
}
\`\`\`

### 2. **Authorization Checks**

**Role-Based**:

- `SUPER_ADMIN` - Full access to all operations
- `RESEARCHER` - Can create/edit own content
- `STUDENT` - Limited access
- `GUEST` - Read-only

**Ownership-Based**:
\`\`\`typescript
const isOwner = resource.authorId === payload.userId;
const isAdmin = payload.role === "SUPER_ADMIN";

if (!isOwner && !isAdmin) {
return NextResponse.json(
{ success: false, error: "Forbidden" },
{ status: 403 }
);
}
\`\`\`

**Project-Specific**:
\`\`\`typescript
const isProjectLead = project.members.some(
m => m.userId === payload.userId &&
["LEAD", "CO_LEAD"].includes(m.role)
);
\`\`\`

---

## Response Format

All APIs use consistent response structure:

### Success Response

\`\`\`json
{
"success": true,
"data": { ... }
}
\`\`\`

### Success with Pagination

\`\`\`json
{
"success": true,
"data": {
"items": [ ... ],
"pagination": {
"page": 1,
"limit": 12,
"total": 45,
"totalPages": 4,
"hasNextPage": true,
"hasPreviousPage": false
}
}
}
\`\`\`

### Error Response

\`\`\`json
{
"success": false,
"error": "Error message"
}
\`\`\`

**HTTP Status Codes**:

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Validation

### Papers

- **Required**: title, abstract, authors, year
- **Optional**: journal, conference, volume, issue, pages, doi, url, pdfUrl, citations, publicationType, customTags, isFeatured, isPublished
- **Types**:
  - authors: JSON string or array
  - year: integer
  - citations: integer (default 0)
  - publicationType: enum (default "JOURNAL_ARTICLE")

### Projects

- **Required**: title, description
- **Optional**: status, startDate, endDate, funding, tags, coverImage, isFeatured, isPublished
- **Types**:
  - status: enum (default "ACTIVE")
  - startDate: Date (default now)
  - endDate: Date | null
  - funding: object { source?, amount?, grantNumber? }
  - tags: JSON string or array
  - slug: auto-generated from title

### News

- **Required**: title, excerpt, content
- **Optional**: coverImage, category, tags, publishedAt, isPublished, gallery, isPinned
- **Types**:
  - category: enum (default "LAB_NEWS")
  - publishedAt: Date (default now)
  - tags: JSON string or array
  - gallery: JSON string or array
  - slug: auto-generated with uniqueness check

---

## JSON Field Handling

Several models store arrays as JSON text:

**Papers**:

- `authors` - Array of author objects

**Projects**:

- `tags` - Array of tag strings
- `gallery` - Array of image URLs
- `publications` - Array of publication IDs

**News**:

- `tags` - Array of tag strings
- `gallery` - Array of image URLs

**Pattern**:
\`\`\`typescript
// On Create/Update
const dataToStore = typeof input === "string"
? input
: JSON.stringify(input);

// On Read
const dataToReturn = {
...record,
fieldName: record.fieldName ? JSON.parse(record.fieldName) : []
};
\`\`\`

---

## Profile Count Synchronization

**Papers API**:

- **POST**: Increments `profile.publicationCount`
- **DELETE**: Decrements `profile.publicationCount`

**Projects API**:

- **POST**: Increments `profile.projectCount`
- Note: Delete doesn't decrement (projects are rarely deleted, usually archived)

Pattern:
\`\`\`typescript
await prisma.profile.update({
where: { userId: payload.userId },
data: {
publicationCount: {
increment: 1, // or decrement: 1
},
},
});
\`\`\`

---

## Next Steps

### Still TODO:

1. **Resources API** - Equipment catalog and bookings
2. **Users/Profile API** - User management, profile updates
3. **Upload API** - File uploads (avatars, PDFs)
4. **Auth API Verification** - Ensure login/register/reset work
5. **ORCID API** - OAuth integration
6. **Dashboard Management Pages** - Frontend for CRUD operations
7. **Admin Panel** - User management interface

### Testing Checklist:

- [ ] Test all authentication flows
- [ ] Verify authorization rules (owner vs admin)
- [ ] Test pagination on all list endpoints
- [ ] Verify JSON field parsing
- [ ] Test slug generation and uniqueness
- [ ] Verify profile count updates
- [ ] Test error handling (invalid IDs, missing fields)
- [ ] Test PATCH operations (toggles, increments)

---

## Technical Notes

### Dependencies

- Next.js 14+ App Router
- Prisma ORM with MySQL
- JWT authentication (lib/jwt.ts)
- Cookie-based sessions ("auth-token")

### Database Schema

All models are defined in `prisma/schema.prisma`:

- Publication (papers)
- Project (projects)
- ProjectMember (project team)
- Announcement (news/announcements)
- User (authentication)
- Profile (user profiles)

### Performance Considerations

- All list endpoints support pagination
- Indexes on frequently queried fields (slug, status, category, isFeatured, isPublished)
- Full-text search indexes on content fields
- Selective field inclusion on list queries

### Security

- All write operations require authentication
- Role-based and ownership-based authorization
- Input validation on all endpoints
- SQL injection prevention via Prisma
- XSS prevention via JSON response format

---

## API Usage Examples

### Create a Paper

\`\`\`bash
curl -X POST http://localhost:3000/api/papers \\
-H "Cookie: auth-token=YOUR_JWT_TOKEN" \\
-H "Content-Type: application/json" \\
-d '{
"title": "Deep Learning for Medical Imaging",
"abstract": "This paper presents...",
"authors": ["John Doe", "Jane Smith"],
"year": 2024,
"journal": "Nature Medicine",
"doi": "10.1234/example",
"publicationType": "JOURNAL_ARTICLE"
}'
\`\`\`

### List Projects with Filtering

\`\`\`bash
curl "http://localhost:3000/api/projects?page=1&limit=12&status=ACTIVE&featured=true"
\`\`\`

### Toggle Paper Featured Status

\`\`\`bash
curl -X PATCH http://localhost:3000/api/papers/paper-id-here \\
-H "Cookie: auth-token=YOUR_JWT_TOKEN" \\
-H "Content-Type: application/json" \\
-d '{"action": "toggleFeatured"}'
\`\`\`

---

**Last Updated**: 2024
**Status**: ✅ Core CRUD APIs Complete (Papers, Projects, News)
