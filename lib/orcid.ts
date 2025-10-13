// CI2P Lab Platform - ORCID Integration Service (Simplified Public API)
// No OAuth or API keys required - just use ORCID IDs!

/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: This file uses 'any' types for external ORCID API responses
// which have complex, dynamic structures

import {
  OrcidProfile,
  OrcidWork,
  OrcidSyncResult,
  OrcidEmployment,
  OrcidEducation,
  OrcidFunding,
  OrcidPeerReview,
} from "@/lib/types";

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
    const data = await this.fetchOrcidJson(orcidId, "person", 86400);

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
      employment: [],
      education: [],
      funding: [],
      peerReviews: [],
    };
  }

  /**
   * Fetch ORCID works (publications) using public API
   * @param orcidId - ORCID identifier
   */
  static async fetchWorks(orcidId: string): Promise<OrcidWork[]> {
    const data = await this.fetchOrcidJson(orcidId, "works", 3600);
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
   * Robust version: continues even if some sections fail
   */
  static async fetchCompleteProfile(orcidId: string): Promise<OrcidProfile> {
    console.log(`[OrcidService] Fetching complete profile for ${orcidId}`);

    // Fetch profile first (required)
    const profile = await this.fetchProfile(orcidId);
    console.log(`[OrcidService] Basic profile fetched for ${orcidId}`);

    // Fetch all other sections with error handling
    const [works, employment, education, funding, peerReviews] =
      await Promise.all([
        this.fetchWorks(orcidId).catch((err) => {
          console.warn(`Failed to fetch ORCID works for ${orcidId}:`, err);
          return [];
        }),
        this.fetchEmployment(orcidId).catch((err) => {
          console.warn(`Failed to fetch ORCID employment for ${orcidId}:`, err);
          return [];
        }),
        this.fetchEducation(orcidId).catch((err) => {
          console.warn(`Failed to fetch ORCID education for ${orcidId}:`, err);
          return [];
        }),
        this.fetchFunding(orcidId).catch((err) => {
          console.warn(`Failed to fetch ORCID funding for ${orcidId}:`, err);
          return [];
        }),
        this.fetchPeerReviews(orcidId).catch((err) => {
          console.warn(
            `Failed to fetch ORCID peer reviews for ${orcidId}:`,
            err
          );
          return [];
        }),
      ]);

    console.log(`[OrcidService] Complete profile assembled for ${orcidId}:`, {
      works: works.length,
      employment: employment.length,
      education: education.length,
      funding: funding.length,
      peerReviews: peerReviews.length,
    });

    return {
      ...profile,
      works,
      employment,
      education,
      funding,
      peerReviews,
    };
  }

  /**
   * Fetch employment records from ORCID public API
   */
  static async fetchEmployment(orcidId: string): Promise<OrcidEmployment[]> {
    const data = await this.fetchWithFallback(
      orcidId,
      "employments",
      "employment"
    );
    return this.parseAffiliationSummaries<OrcidEmployment>(data, "employment");
  }

  /**
   * Fetch education history from ORCID public API
   */
  static async fetchEducation(orcidId: string): Promise<OrcidEducation[]> {
    const data = await this.fetchWithFallback(
      orcidId,
      "educations",
      "education"
    );
    return this.parseAffiliationSummaries<OrcidEducation>(data, "education");
  }

  /**
   * Fetch funding records from ORCID public API
   */
  static async fetchFunding(orcidId: string): Promise<OrcidFunding[]> {
    const data = await this.fetchWithFallback(orcidId, "fundings", "funding");
    return this.parseFundingSummaries(data);
  }

  /**
   * Fetch peer review activity from ORCID public API
   */
  static async fetchPeerReviews(orcidId: string): Promise<OrcidPeerReview[]> {
    try {
      const data = await this.fetchOrcidJson(orcidId, "peer-reviews", 3600);
      return this.parsePeerReviewSummaries(data);
    } catch (error: any) {
      // Many ORCID profiles don't have peer review data
      if (error instanceof Error && /404/.test(error.message)) {
        console.warn(`No peer review data available for ORCID ${orcidId}`);
        return [];
      }
      throw error;
    }
  }

  private static async fetchOrcidJson(
    orcidId: string,
    endpoint: string,
    revalidateSeconds: number
  ): Promise<any> {
    const response = await fetch(
      `${ORCID_PUBLIC_API_URL}/${orcidId}/${endpoint}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: revalidateSeconds },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ORCID ${endpoint}: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  private static async fetchWithFallback(
    orcidId: string,
    primaryEndpoint: string,
    fallbackEndpoint: string
  ): Promise<any> {
    try {
      return await this.fetchOrcidJson(orcidId, primaryEndpoint, 3600);
    } catch (error: any) {
      // Some ORCID profiles expose singular endpoints instead of plural
      if (error instanceof Error && /404/.test(error.message)) {
        try {
          return await this.fetchOrcidJson(orcidId, fallbackEndpoint, 3600);
        } catch (fallbackError: any) {
          // If both fail with 404, return empty data structure
          if (
            fallbackError instanceof Error &&
            /404/.test(fallbackError.message)
          ) {
            console.warn(
              `No ${primaryEndpoint} or ${fallbackEndpoint} data available for ORCID ${orcidId}`
            );
            return null;
          }
          throw fallbackError;
        }
      }
      throw error;
    }
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
    )?.["external-id-value"];

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

  private static parseAffiliationSummaries<
    T extends OrcidEmployment | OrcidEducation
  >(data: any, type: "employment" | "education"): T[] {
    const records: T[] = [];

    if (!data) {
      return records;
    }

    const summaryKey = `${type}-summary`;

    const handleEntry = (entry: any) => {
      const summary = entry?.[summaryKey] ?? entry;
      if (!summary) return;

      const organization = summary.organization?.name || "";
      if (!organization) return;

      const base = {
        id: summary["put-code"]?.toString() || `${type}-${Math.random()}`,
        organization,
        department: summary["department-name"] || undefined,
        role: summary["role-title"] || undefined,
        startDate: this.formatDate(summary["start-date"]),
        endDate: this.formatDate(summary["end-date"]),
      };

      if (type === "employment") {
        const employment: OrcidEmployment = {
          ...base,
          city: summary.organization?.address?.city || undefined,
          country: summary.organization?.address?.country || undefined,
        };
        records.push(employment as T);
      } else {
        const education: OrcidEducation = {
          id: base.id,
          institution: organization,
          department: base.department,
          role: base.role,
          degree: summary["degree-name"] || undefined,
          startDate: base.startDate,
          endDate: base.endDate,
        };
        records.push(education as T);
      }
    };

    if (Array.isArray(data["affiliation-group"])) {
      for (const group of data["affiliation-group"]) {
        const summaries = group?.summaries || [];
        for (const entry of summaries) {
          handleEntry(entry);
        }
      }
    }

    if (Array.isArray(data.summaries)) {
      for (const entry of data.summaries) {
        handleEntry(entry);
      }
    }

    if (data[summaryKey]) {
      handleEntry({ [summaryKey]: data[summaryKey] });
    }

    return records;
  }

  private static parseFundingSummaries(data: any): OrcidFunding[] {
    const records: OrcidFunding[] = [];
    if (!data) return records;

    const handleSummary = (summary: any) => {
      if (!summary) return;
      const record: OrcidFunding = {
        id: summary["put-code"]?.toString() || `funding-${Math.random()}`,
        title: summary.title?.title?.value || "Untitled Grant",
        type: summary.type || undefined,
        organization: summary.organization?.name || undefined,
        amount: summary.amount?.value || undefined,
        currency: summary.amount?.["currency-code"] || undefined,
        startDate: this.formatDate(summary["start-date"]),
        endDate: this.formatDate(summary["end-date"]),
      };
      records.push(record);
    };

    if (Array.isArray(data.group)) {
      for (const group of data.group) {
        const summaries = group["funding-summary"] || [];
        if (Array.isArray(summaries)) {
          summaries.forEach(handleSummary);
        }
      }
    }

    if (Array.isArray(data["funding-summary"])) {
      data["funding-summary"].forEach(handleSummary);
    } else if (data["funding-summary"]) {
      handleSummary(data["funding-summary"]);
    }

    if (Array.isArray(data)) {
      data.forEach(handleSummary);
    }

    return records;
  }

  private static parsePeerReviewSummaries(data: any): OrcidPeerReview[] {
    const records: OrcidPeerReview[] = [];
    if (!data || !Array.isArray(data.group)) return records;

    for (const group of data.group) {
      const externalIds = group["external-ids"]?.["external-id"] || [];
      let issn: string | undefined;

      for (const ext of externalIds) {
        if (
          ext["external-id-type"] === "issn" ||
          ext["external-id-type"] === "peer-review"
        ) {
          issn = (ext["external-id-value"] || "").replace("issn:", "");
        }
      }

      const peerGroup = group["peer-review-group"] || [];
      for (const reviewGroup of peerGroup) {
        const summaries = reviewGroup["peer-review-summary"] || [];
        for (const summary of summaries) {
          const record: OrcidPeerReview = {
            id: summary["put-code"]?.toString() || `review-${Math.random()}`,
            title:
              summary["review-group-id"]?.replace("issn:", "") ||
              summary["reviewer-role"] ||
              "Peer Review",
            role: summary["reviewer-role"] || undefined,
            organization:
              summary["convening-organization"]?.name ||
              summary.source?.["source-name"]?.value ||
              undefined,
            completionDate: this.formatDate(summary["completion-date"]),
            url: summary["review-url"]?.value || undefined,
            status: summary.source?.["source-name"]?.value || undefined,
            issn,
          };

          if (!record.url && summary["external-ids"]) {
            const reviewExt = summary["external-ids"]["external-id"] || [];
            for (const ext of reviewExt) {
              if (ext["external-id-url"]?.value) {
                record.url = ext["external-id-url"].value;
              }
            }
          }

          records.push(record);
        }
      }
    }

    return records;
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
