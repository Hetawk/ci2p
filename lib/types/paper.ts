// CI2P Lab Platform - Publication Types

import {
  Publication as PrismaPublication,
  PublicationType,
} from "@prisma/client";

// ============================================
// PUBLICATION TYPES
// ============================================

export interface Paper extends PrismaPublication {
  author: {
    id: string;
    profile: {
      fullName: string;
      orcidId?: string | null;
      avatar?: string | null;
    } | null;
  };
}

export interface PaperWithAuthor extends Paper {
  authorName: string;
  authorOrcid?: string;
}

export interface PaperFormData {
  title: string;
  abstract?: string;
  authors: PaperAuthor[];
  publicationType: PublicationType;
  journal?: string;
  conference?: string;
  publisher?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  year: number;
  month?: number;
  doi?: string;
  isbn?: string;
  url?: string;
  pdfFile?: File;
  customDescription?: string;
  customTags?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface PaperAuthor {
  name: string;
  orcid?: string;
  affiliation?: string;
  isCorresponding?: boolean;
}

export interface PaperFilter {
  search?: string;
  year?: number;
  type?: PublicationType;
  authorId?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  hasOrcid?: boolean;
}

export interface PaperStats {
  total: number;
  byType: Record<PublicationType, number>;
  byYear: Record<number, number>;
  featured: number;
  orcidSynced: number;
  citations: number;
  downloads: number;
}

// ============================================
// ORCID TYPES
// ============================================

export interface OrcidProfile {
  orcid: string;
  name: {
    givenName: string;
    familyName: string;
    creditName?: string;
  };
  bio?: string;
  emails: string[];
  affiliations: OrcidAffiliation[];
  works: OrcidWork[];
  lastSyncedAt?: Date;
}

export interface OrcidAffiliation {
  organization: string;
  department?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrcidWork {
  putCode: string;
  title: string;
  type: string;
  publicationDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  journal?: string;
  url?: string;
  doi?: string;
  citation?: {
    citationType: string;
    citation: string;
  };
}

export interface OrcidSyncResult {
  success: boolean;
  worksImported: number;
  worksUpdated: number;
  worksSkipped: number;
  errors: string[];
  lastSyncedAt: Date;
}

export interface OrcidAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  name: string;
  orcid: string;
}

// ============================================
// CITATION FORMATS
// ============================================

export enum CitationFormat {
  APA = "apa",
  MLA = "mla",
  CHICAGO = "chicago",
  IEEE = "ieee",
  HARVARD = "harvard",
  BIBTEX = "bibtex",
}

export interface Citation {
  format: CitationFormat;
  text: string;
}

// ============================================
// PUBLICATION DISPLAY
// ============================================

export interface PaperCardProps {
  paper: Paper;
  showActions?: boolean;
  showOrcidBadge?: boolean;
  showMetrics?: boolean;
  variant?: "default" | "compact" | "featured";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
  onTogglePublished?: (id: string, published: boolean) => void;
}

export interface PaperListProps {
  papers: Paper[];
  loading?: boolean;
  emptyMessage?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  pageSize?: number;
}

export interface FeaturedPapersProps {
  limit?: number;
  showReorder?: boolean;
  onReorder?: (papers: Paper[]) => void;
}
