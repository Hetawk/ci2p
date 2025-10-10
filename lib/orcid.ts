// CI2P Lab Platform - ORCID Integration Service

import {
  OrcidProfile,
  OrcidWork,
  OrcidSyncResult,
  OrcidAuthResponse,
} from "@/lib/types";

const ORCID_API_URL = process.env.ORCID_API_URL || "https://pub.orcid.org/v3.0";
const ORCID_CLIENT_ID = process.env.ORCID_CLIENT_ID || "";
const ORCID_CLIENT_SECRET = process.env.ORCID_CLIENT_SECRET || "";
const ORCID_REDIRECT_URI = process.env.ORCID_REDIRECT_URI || "";

/**
 * ORCID Service for managing ORCID API integration
 * Handles OAuth authentication, profile fetching, and publication syncing
 */
export class OrcidService {
  /**
   * Generate ORCID OAuth authorization URL
   */
  static getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: ORCID_CLIENT_ID,
      response_type: "code",
      scope: "/read-limited /activities/update",
      redirect_uri: ORCID_REDIRECT_URI,
      state,
    });

    const baseUrl = ORCID_API_URL.replace("/v3.0", "");
    return `${baseUrl}/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string): Promise<OrcidAuthResponse> {
    const params = new URLSearchParams({
      client_id: ORCID_CLIENT_ID,
      client_secret: ORCID_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: ORCID_REDIRECT_URI,
    });

    const baseUrl = ORCID_API_URL.replace("/v3.0", "");
    const response = await fetch(`${baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`ORCID token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch ORCID profile information
   */
  static async fetchProfile(
    orcidId: string,
    accessToken: string
  ): Promise<OrcidProfile> {
    const response = await fetch(`${ORCID_API_URL}/${orcidId}/person`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
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
   * Fetch ORCID works (publications)
   */
  static async fetchWorks(
    orcidId: string,
    accessToken: string
  ): Promise<OrcidWork[]> {
    const response = await fetch(`${ORCID_API_URL}/${orcidId}/works`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
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
   * Sync ORCID works to database publications
   * Returns sync result with counts
   */
  static async syncWorksToPublications(
    userId: string,
    orcidId: string,
    accessToken: string,
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
      // Fetch works from ORCID
      const works = await this.fetchWorks(orcidId, accessToken);

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
}
