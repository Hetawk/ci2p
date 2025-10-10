# ORCID Integration - Simplified Approach 🎉

## ✅ No OAuth Required!

We use ORCID's **public API** which doesn't require any authentication, API keys, or OAuth setup. Just provide an ORCID ID and fetch the data!

## 🚀 Quick Start

### 1. Environment Setup (Optional)

```bash
# .env
ORCID_PUBLIC_API_URL="https://pub.orcid.org/v3.0"
```

That's it! No client IDs, secrets, or redirect URIs needed.

### 2. Usage Examples

#### Fetch Researcher Profile

```typescript
import { OrcidService } from "@/lib/orcid";

// Just provide the ORCID ID!
const profile = await OrcidService.fetchProfile("0000-0002-1825-0097");

console.log(profile.name); // { givenName: 'John', familyName: 'Doe', ... }
console.log(profile.bio);
console.log(profile.affiliations);
```

#### Fetch Publications

```typescript
const works = await OrcidService.fetchWorks("0000-0002-1825-0097");

works.forEach((work) => {
  console.log(work.title);
  console.log(work.doi);
  console.log(work.year);
});
```

#### Fetch Complete Profile (Profile + Works)

```typescript
const completeProfile = await OrcidService.fetchCompleteProfile(
  "0000-0002-1825-0097"
);

console.log(completeProfile.name);
console.log(completeProfile.works); // All publications
```

#### Sync to Database

```typescript
import { prisma } from "@/lib/prisma";
import { OrcidService } from "@/lib/orcid";

const result = await OrcidService.syncWorksToPublications(
  "user-id-123",
  "0000-0002-1825-0097",
  prisma
);

console.log(`Imported: ${result.worksImported}`);
console.log(`Updated: ${result.worksUpdated}`);
console.log(`Errors: ${result.errors}`);
```

### 3. Helper Functions

#### Validate ORCID ID

```typescript
const isValid = OrcidService.validateOrcidId("0000-0002-1825-0097");
// Returns: true
```

#### Normalize ORCID Input

```typescript
// Works with various formats
OrcidService.normalizeOrcidId("https://orcid.org/0000-0002-1825-0097");
OrcidService.normalizeOrcidId("0000-0002-1825-0097");
OrcidService.normalizeOrcidId("0000000218250097"); // Adds dashes

// All return: '0000-0002-1825-0097'
```

## 📋 Component Integration

### Profile Input Form

```typescript
"use client";

import { useState } from "react";
import { OrcidService } from "@/lib/orcid";

export function OrcidInput() {
  const [orcidId, setOrcidId] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const normalized = OrcidService.normalizeOrcidId(orcidId);
      if (!normalized) {
        alert("Invalid ORCID ID");
        return;
      }

      const data = await OrcidService.fetchCompleteProfile(normalized);
      setProfile(data);
    } catch (error) {
      alert("Failed to fetch ORCID data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter ORCID ID (e.g., 0000-0002-1825-0097)"
        value={orcidId}
        onChange={(e) => setOrcidId(e.target.value)}
      />
      <button onClick={handleFetch} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Profile"}
      </button>

      {profile && (
        <div>
          <h3>
            {profile.name.givenName} {profile.name.familyName}
          </h3>
          <p>{profile.bio}</p>
          <p>Publications: {profile.works.length}</p>
        </div>
      )}
    </div>
  );
}
```

### Server-Side Data Fetching

```typescript
// app/(public)/team/[id]/page.tsx
import { OrcidService } from "@/lib/orcid";
import { prisma } from "@/lib/prisma";

export default async function ResearcherPage({
  params,
}: {
  params: { id: string };
}) {
  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { profile: true },
  });

  // Fetch live ORCID data (if user has ORCID)
  let orcidData = null;
  if (user?.profile?.orcidId) {
    try {
      orcidData = await OrcidService.fetchCompleteProfile(user.profile.orcidId);
    } catch (error) {
      console.error("Failed to fetch ORCID data:", error);
    }
  }

  return (
    <div>
      <h1>{user.profile?.fullName}</h1>

      {orcidData && (
        <div>
          <h2>Recent Publications</h2>
          {orcidData.works.map((work) => (
            <div key={work.putCode}>
              <h3>{work.title}</h3>
              <p>
                {work.journal} ({work.publicationDate?.year})
              </p>
              {work.doi && (
                <a href={`https://doi.org/${work.doi}`}>DOI: {work.doi}</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🎯 Benefits

✅ **Simple** - No OAuth flow, no tokens, no complications
✅ **Fast** - Direct API calls, cached for 24 hours
✅ **Public** - Only fetches publicly available data
✅ **Free** - No API limits or rate restrictions
✅ **Reliable** - Official ORCID public API

## 📊 Data Available

### Profile Data

- Name (given name, family name, credit name)
- Biography
- Email addresses (if public)
- Affiliations (employment, education)
- Research interests
- Keywords

### Works (Publications)

- Title
- Type (journal article, conference paper, etc.)
- Publication date
- Journal/Conference name
- DOI
- External URLs
- Authors
- Abstract (if available)

## 🔄 Auto-Sync Strategy

### Option 1: Manual Sync (Recommended)

Users click "Sync with ORCID" button to manually update their publications.

### Option 2: Scheduled Sync

Run a cron job daily to update all users with ORCID IDs:

```typescript
// app/api/cron/sync-orcid/route.ts
import { OrcidService } from "@/lib/orcid";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.profile.findMany({
    where: {
      orcidId: { not: null },
      orcidEnabled: true,
    },
    include: { user: true },
  });

  for (const profile of users) {
    try {
      await OrcidService.syncWorksToPublications(
        profile.userId,
        profile.orcidId!,
        prisma
      );
    } catch (error) {
      console.error(`Sync failed for ${profile.orcidId}:`, error);
    }
  }

  return Response.json({ synced: users.length });
}
```

### Option 3: On-Demand Refresh

Fetch live data on page load (with Next.js caching):

```typescript
// Revalidate every hour
const orcidData = await OrcidService.fetchWorks(orcidId);
```

## 🎨 UI Components Needed

1. **ORCID Input Field** - For profile setup
2. **ORCID Badge** - Visual indicator on publications
3. **Sync Button** - Manual sync trigger
4. **Sync Status** - Show last sync time
5. **Publication List** - Display ORCID works

## 🚀 Next Steps

1. ✅ Update `.env.example` with simplified config
2. ✅ Create simplified ORCID service
3. ⏳ Add ORCID input to profile form
4. ⏳ Create sync button component
5. ⏳ Build ORCID badge component
6. ⏳ Test with real ORCID IDs

## 📝 Example ORCID IDs for Testing

- `0000-0002-1825-0097` - Sample researcher
- `0000-0001-5109-3700` - Another sample
- `0000-0002-9079-593X` - Note the X at the end (valid)

Test at: https://orcid.org/0000-0002-1825-0097

---

**Much simpler than OAuth! 🎉**
