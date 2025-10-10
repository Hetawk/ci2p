// CI2P Lab Platform - ORCID Integration Service (Simplified Public API)
// No OAuth or API keys required - just use ORCID IDs!

import { OrcidProfile, OrcidWork, OrcidSyncResult } from "@/lib/types";

const ORCID_PUBLIC_API_URL =
  process.env.ORCID_PUBLIC_API_URL || "https://pub.orcid.org/v3.0";

/**
 * ORCID Service for fetching public researcher data
 * Uses ORCID's public API - no authentication needed!
 * Just provide an ORCID ID like "0000-0002-1825-0097"
 */
export class OrcidService {
  /**
   * Fetch ORCID profile information using public API (no auth required!)
   * @param orcidId - ORCID identifier (e.g., "0000-0002-1825-0097")
   */
  static async fetchProfile(orcidId: string): Promise<OrcidProfile> {
    const response = await fetch(`${ORCID_PUBLIC_API_URL}/${orcidId}/person`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ORCID profile: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      orcid: orcidId,
      name: {
        givenName: data.name?.["given-names"]?.value || "",
        familyName: data.name?.["family-name"]?.value || "",
        creditName: data.name?.["credit-name"]?.value || undefined,
      },
      bio: data.biography?.content || undefined,
      emails: data.emails?.email?.map((e: any) => e.email) || [],
      affiliations: this.parseAffiliations(data),
      works: [], // Fetched separately
    };
  }

  /**
   * Fetch ORCID works (publications) using public API
   * @param orcidId - ORCID identifier
   */
  static async fetchWorks(orcidId: string): Promise<OrcidWork[]> {
    const response = await fetch(`${ORCID_PUBLIC_API_URL}/${orcidId}/works`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ORCID works: ${response.statusText}`);
    }

    const data = await response.json();
    const works: OrcidWork[] = [];

    // ORCID returns summary, need to fetch details for each work
    if (data.group) {
      for (const group of data.group) {
        const workSummary = group["work-summary"]?.[0];
        if (workSummary) {
          works.push(this.parseWork(workSummary));
        }
      }
    }

    return works;
  }

  /**
   * Fetch complete profile with works in one call
   * @param orcidId - ORCID identifier
   */
  static async fetchCompleteProfile(orcidId: string): Promise<OrcidProfile> {
    const [profile, works] = await Promise.all([
      this.fetchProfile(orcidId),
      this.fetchWorks(orcidId),
    ]);

    return {
      ...profile,
      works,
    };
  }

  /**
   * Parse ORCID work summary into our format
   */
  private static parseWork(workSummary: any): OrcidWork {
    const title = workSummary.title?.title?.value || "Untitled";
    const type = workSummary.type || "OTHER";
    const putCode = workSummary["put-code"]?.toString() || "";

    let publicationDate: OrcidWork["publicationDate"] = undefined;
    if (workSummary["publication-date"]) {
      publicationDate = {
        year: workSummary["publication-date"].year?.value,
        month: workSummary["publication-date"].month?.value,
        day: workSummary["publication-date"].day?.value,
      };
    }

    const journal = workSummary["journal-title"]?.value || undefined;
    const doi = workSummary["external-ids"]?.["external-id"]?.find(
      (id: any) => id["external-id-type"] === "doi"
    )?.[" external-id-value"];

    const url = workSummary.url?.value || undefined;

    return {
      putCode,
      title,
      type,
      publicationDate,
      journal,
      url,
      doi,
    };
  }

  /**
   * Parse ORCID affiliations
   */
  private static parseAffiliations(data: any): any[] {
    const affiliations: any[] = [];

    // Employment
    if (data.activities?.employments?.["affiliation-group"]) {
      for (const group of data.activities.employments["affiliation-group"]) {
        const emp = group.summaries?.[0]?.["employment-summary"];
        if (emp) {
          affiliations.push({
            organization: emp.organization?.name || "",
            department: emp["department-name"] || undefined,
            role: emp["role-title"] || undefined,
            startDate: this.formatDate(emp["start-date"]),
            endDate: emp["end-date"]
              ? this.formatDate(emp["end-date"])
              : undefined,
          });
        }
      }
    }

    return affiliations;
  }

  /**
   * Format ORCID date
   */
  private static formatDate(date: any): string | undefined {
    if (!date) return undefined;
    const year = date.year?.value;
    const month = date.month?.value?.padStart(2, "0");
    return month ? `${year}-${month}` : year;
  }

  /**
   * Sync ORCID works to database publications (simplified - no OAuth needed!)
   * @param userId - User ID in our database
   * @param orcidId - User's ORCID ID
   * @param prisma - Prisma client instance
   */
  static async syncWorksToPublications(
    userId: string,
    orcidId: string,
    prisma: any
  ): Promise<OrcidSyncResult> {
    const result: OrcidSyncResult = {
      success: false,
      worksImported: 0,
      worksUpdated: 0,
      worksSkipped: 0,
      errors: [],
      lastSyncedAt: new Date(),
    };

    try {
      // Fetch works from ORCID public API
      const works = await this.fetchWorks(orcidId);

      for (const work of works) {
        try {
          // Check if work already exists
          const existing = await prisma.publication.findUnique({
            where: { orcidWorkId: work.putCode },
          });

          const publicationData = this.workToPublication(work, userId, orcidId);

          if (existing) {
            // Update existing
            await prisma.publication.update({
              where: { id: existing.id },
              data: {
                ...publicationData,
                orcidSyncedAt: new Date(),
              },
            });
            result.worksUpdated++;
          } else {
            // Create new
            await prisma.publication.create({
              data: {
                ...publicationData,
                authorId: userId,
                isFromOrcid: true,
                orcidSyncedAt: new Date(),
              },
            });
            result.worksImported++;
          }
        } catch (error: any) {
          result.errors.push(
            `Failed to sync work ${work.title}: ${error.message}`
          );
          result.worksSkipped++;
        }
      }

      // Update profile sync timestamp
      await prisma.profile.update({
        where: { userId },
        data: { orcidSyncedAt: new Date() },
      });

      result.success = result.errors.length === 0;
      return result;
    } catch (error: any) {
      result.errors.push(`ORCID sync failed: ${error.message}`);
      return result;
    }
  }

  /**
   * Convert ORCID work to Publication data
   */
  private static workToPublication(
    work: OrcidWork,
    userId: string,
    orcidId: string
  ): any {
    return {
      title: work.title,
      orcidWorkId: work.putCode,
      orcidData: JSON.stringify(work),
      publicationType: this.mapWorkType(work.type),
      year: work.publicationDate?.year || new Date().getFullYear(),
      month: work.publicationDate?.month || null,
      doi: work.doi || null,
      url: work.url || null,
      journal: work.journal || null,
      authors: JSON.stringify([{ name: "Loading...", orcid: orcidId }]), // Placeholder
      isPublished: true,
    };
  }

  /**
   * Map ORCID work type to our PublicationType enum
   */
  private static mapWorkType(orcidType: string): string {
    const typeMap: Record<string, string> = {
      JOURNAL_ARTICLE: "JOURNAL_ARTICLE",
      CONFERENCE_PAPER: "CONFERENCE_PAPER",
      BOOK_CHAPTER: "BOOK_CHAPTER",
      BOOK: "BOOK",
      PATENT: "PATENT",
      DISSERTATION: "THESIS",
      PREPRINT: "PREPRINT",
      REPORT: "TECHNICAL_REPORT",
      POSTER: "POSTER",
    };

    return typeMap[orcidType] || "OTHER";
  }

  /**
   * Validate ORCID ID format
   * Format: XXXX-XXXX-XXXX-XXXX (e.g., 0000-0002-1825-0097)
   */
  static validateOrcidId(orcidId: string): boolean {
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/;
    return orcidRegex.test(orcidId);
  }

  /**
   * Extract ORCID ID from various formats
   * Handles: full URLs, iDs with/without dashes, etc.
   */
  static normalizeOrcidId(input: string): string | null {
    // Remove whitespace
    input = input.trim();

    // Extract from URL if provided
    const urlMatch = input.match(/orcid\.org\/(\d{4}-\d{4}-\d{4}-\d{3}[0-9X])/);
    if (urlMatch) return urlMatch[1];

    // Check if already in correct format
    if (this.validateOrcidId(input)) return input;

    // Try to format if only digits provided
    const digitsOnly = input.replace(/[^0-9X]/gi, "");
    if (digitsOnly.length === 16) {
      const formatted = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(
        4,
        8
      )}-${digitsOnly.slice(8, 12)}-${digitsOnly.slice(12, 16)}`;
      if (this.validateOrcidId(formatted)) return formatted;
    }

    return null;
  }
}
