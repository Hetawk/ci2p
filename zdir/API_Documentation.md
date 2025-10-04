# Portfolio API Routes

Complete CRUD API for Patience Fero's Portfolio Management System

## Base URL

`/api/portfolio`

## Endpoints Overview

### Personal Information

- `GET /api/portfolio/personal-info` - Get personal information
- `PUT /api/portfolio/personal-info` - Update personal information

### Education

- `GET /api/portfolio/education` - Get all education records
- `POST /api/portfolio/education` - Create new education record
- `GET /api/portfolio/education/[id]` - Get single education record
- `PUT /api/portfolio/education/[id]` - Update education record
- `DELETE /api/portfolio/education/[id]` - Delete education record

### Awards

- `GET /api/portfolio/awards` - Get all awards
  - Query params: `?featured=true`, `?category=ACADEMIC`
- `POST /api/portfolio/awards` - Create new award
- `GET /api/portfolio/awards/[id]` - Get single award
- `PUT /api/portfolio/awards/[id]` - Update award
- `DELETE /api/portfolio/awards/[id]` - Delete award

### Experience

- `GET /api/portfolio/experience` - Get all experience records
  - Query params: `?type=LEADERSHIP`
- `POST /api/portfolio/experience` - Create new experience
- `GET /api/portfolio/experience/[id]` - Get single experience
- `PUT /api/portfolio/experience/[id]` - Update experience
- `DELETE /api/portfolio/experience/[id]` - Delete experience

### Skills

- `GET /api/portfolio/skills` - Get all skills
  - Query params: `?category=TECHNICAL`
- `POST /api/portfolio/skills` - Create new skill
- `GET /api/portfolio/skills/[id]` - Get single skill
- `PUT /api/portfolio/skills/[id]` - Update skill
- `DELETE /api/portfolio/skills/[id]` - Delete skill

### Languages

- `GET /api/portfolio/languages` - Get all languages
- `POST /api/portfolio/languages` - Create new language
- `GET /api/portfolio/languages/[id]` - Get single language
- `PUT /api/portfolio/languages/[id]` - Update language
- `DELETE /api/portfolio/languages/[id]` - Delete language

### Research

- `GET /api/portfolio/research` - Get all research projects
  - Query params: `?featured=true`
- `POST /api/portfolio/research` - Create new research
- `GET /api/portfolio/research/[id]` - Get single research
- `PUT /api/portfolio/research/[id]` - Update research
- `DELETE /api/portfolio/research/[id]` - Delete research

### Combined Data (Original)

- `GET /api/portfolio` - Get all portfolio data at once

## Response Formats

### Success Response

```json
{
  "id": "cuid",
  "field1": "value",
  "field2": "value",
  ...
}
```

### Error Response

```json
{
  "error": "Error message"
}
```

## Enums

### AwardType

- `ACADEMIC`
- `PUBLIC_SPEAKING`
- `TECHNICAL`
- `SPORTS`
- `LEADERSHIP`
- `CERTIFICATION`

### ExpType

- `LEADERSHIP`
- `PROFESSIONAL`
- `VOLUNTEER`
- `ENTREPRENEURSHIP`

### SkillType

- `RESEARCH`
- `ECONOMICS`
- `TECHNICAL`
- `COMMUNICATION`
- `LEADERSHIP`
- `LANGUAGES`

### SkillLevel

- `BASIC`
- `INTERMEDIATE`
- `ADVANCED`
- `FLUENT`
- `NATIVE`

## Usage Examples

### Fetch All Awards

```typescript
const response = await fetch("/api/portfolio/awards");
const awards = await response.json();
```

### Create New Education Entry

```typescript
const response = await fetch("/api/portfolio/education", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    degree: "Master of Applied Economics",
    institution: "Zhejiang Sci-Tech University",
    location: "Hangzhou, China",
    startDate: "2023",
    endDate: null,
    description: "Advancing expertise in economic policy analysis",
    order: 1,
  }),
});
const education = await response.json();
```

### Update Award

```typescript
const response = await fetch("/api/portfolio/awards/[id]", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    featured: true,
    order: 1,
  }),
});
const updated = await response.json();
```

### Delete Experience

```typescript
const response = await fetch("/api/portfolio/experience/[id]", {
  method: "DELETE",
});
const result = await response.json();
```

## Notes

- All endpoints return JSON responses
- HTTP status codes follow REST conventions:
  - 200: Success
  - 201: Created
  - 404: Not Found
  - 500: Server Error
- Authentication/Authorization should be implemented for write operations (POST, PUT, DELETE)
- The `order` field in all models controls the display order on the frontend
