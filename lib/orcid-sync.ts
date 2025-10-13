/**
 * ORCID Sync Service
 * Synchronizes ORCID publications to the database for editability and performance
 */

import { prisma } from "@/lib/prisma";
import { OrcidService } from "@/lib/orcid";

/**
 * Sync a single user's ORCID publications to the database
 */
export async function syncUserOrcidPublications(userId: string) {
  try {
    // Get user with profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user?.profile?.orcidId || !user.profile.orcidEnabled) {
      return {
        success: false,
        message: "User does not have ORCID enabled",
      };
    }

    // Fetch ORCID works
    const orcidWorks = await OrcidService.fetchWorks(user.profile.orcidId);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const work of orcidWorks) {
      try {
        // Check if publication already exists (by DOI or ORCID put-code)
        const existingByDoi = work.doi
          ? await prisma.publication.findFirst({
              where: {
                doi: work.doi,
                authorId: userId,
              },
            })
          : null;

        const existingByOrcidId = await prisma.publication.findFirst({
          where: {
            orcidWorkId: work.putCode,
            authorId: userId,
          },
        });

        const existing = existingByDoi || existingByOrcidId;

        if (existing) {
          // Update existing publication if it's from ORCID (don't overwrite manual entries)
          if (existing.isFromOrcid) {
            // Ensure year and month are integers
            const yearValue = work.publicationDate?.year
              ? parseInt(String(work.publicationDate.year), 10)
              : new Date().getFullYear();

            const monthValue = work.publicationDate?.month
              ? parseInt(String(work.publicationDate.month), 10)
              : null;

            await prisma.publication.update({
              where: { id: existing.id },
              data: {
                title: work.title,
                journal: work.journal || null,
                year: yearValue,
                month: monthValue,
                doi: work.doi || null,
                url: work.url || null,
                publicationType: mapOrcidTypeToPublicationType(work.type),
                orcidSyncedAt: new Date(),
                orcidData: JSON.stringify(work),
              },
            });
            updated++;
          } else {
            // Manual entry exists, just mark it as synced with ORCID
            await prisma.publication.update({
              where: { id: existing.id },
              data: {
                orcidWorkId: work.putCode,
                orcidSyncedAt: new Date(),
              },
            });
            skipped++;
          }
        } else {
          // Create new publication from ORCID
          // Authors format: use profile fullName as fallback
          const authorsData = user.profile?.fullName
            ? JSON.stringify([{ name: user.profile.fullName }])
            : JSON.stringify([{ name: "Unknown Author" }]);

          // Ensure year and month are integers (not strings)
          const yearValue = work.publicationDate?.year
            ? parseInt(String(work.publicationDate.year), 10)
            : new Date().getFullYear();

          const monthValue = work.publicationDate?.month
            ? parseInt(String(work.publicationDate.month), 10)
            : null;

          await prisma.publication.create({
            data: {
              authorId: userId,
              title: work.title,
              abstract: null, // ORCID doesn't provide abstracts
              authors: authorsData,
              publicationType: mapOrcidTypeToPublicationType(work.type),
              journal: work.journal || null,
              year: yearValue,
              month: monthValue,
              doi: work.doi || null,
              url: work.url || null,
              orcidWorkId: work.putCode,
              isFromOrcid: true,
              orcidSyncedAt: new Date(),
              orcidData: JSON.stringify(work),
              isPublished: true,
              isFeatured: false,
            },
          });
          created++;
        }
      } catch (error) {
        console.error(`Failed to sync ORCID work ${work.putCode}:`, error);
        // Continue with next work
      }
    }

    // Update profile sync timestamp
    await prisma.profile.update({
      where: { userId },
      data: { orcidSyncedAt: new Date() },
    });

    return {
      success: true,
      stats: {
        total: orcidWorks.length,
        created,
        updated,
        skipped,
      },
    };
  } catch (error) {
    console.error("Failed to sync ORCID publications:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sync all users' ORCID publications
 */
export async function syncAllUsersOrcidPublications() {
  const users = await prisma.user.findMany({
    where: {
      profile: {
        orcidId: { not: null },
        orcidEnabled: true,
      },
    },
    include: { profile: true },
  });

  const results = [];
  for (const user of users) {
    const result = await syncUserOrcidPublications(user.id);
    results.push({
      userId: user.id,
      email: user.email,
      ...result,
    });
  }

  return results;
}

/**
 * Map ORCID publication type to our PublicationType enum
 */
function mapOrcidTypeToPublicationType(
  orcidType: string
):
  | "JOURNAL_ARTICLE"
  | "CONFERENCE_PAPER"
  | "BOOK_CHAPTER"
  | "BOOK"
  | "PATENT"
  | "THESIS"
  | "PREPRINT"
  | "TECHNICAL_REPORT"
  | "POSTER"
  | "OTHER" {
  const typeMap: Record<
    string,
    | "JOURNAL_ARTICLE"
    | "CONFERENCE_PAPER"
    | "BOOK_CHAPTER"
    | "BOOK"
    | "PATENT"
    | "THESIS"
    | "PREPRINT"
    | "TECHNICAL_REPORT"
    | "POSTER"
  > = {
    "journal-article": "JOURNAL_ARTICLE",
    "conference-paper": "CONFERENCE_PAPER",
    "conference-abstract": "CONFERENCE_PAPER",
    "book-chapter": "BOOK_CHAPTER",
    book: "BOOK",
    "edited-book": "BOOK",
    patent: "PATENT",
    thesis: "THESIS",
    dissertation: "THESIS",
    preprint: "PREPRINT",
    "working-paper": "PREPRINT",
    report: "TECHNICAL_REPORT",
    poster: "POSTER",
  };

  return typeMap[orcidType.toLowerCase()] || "OTHER";
}
