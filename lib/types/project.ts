// CI2P Lab Platform - Project Types

import {
  Project as PrismaProject,
  ProjectStatus,
  ProjectRole,
  ProjectMember as PrismaProjectMember,
} from "@prisma/client";

// ============================================
// PROJECT TYPES
// ============================================

export interface Project extends PrismaProject {
  members: ProjectMemberWithUser[];
  _count?: {
    members: number;
  };
}

export interface ProjectMemberWithUser extends PrismaProjectMember {
  user: {
    id: string;
    profile: {
      fullName: string;
      avatar?: string | null;
      title?: string | null;
    } | null;
  };
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  fundingSource?: string;
  fundingAmount?: number;
  grantNumber?: string;
  coverImage?: File | string;
  gallery?: (File | string)[];
  tags?: string[];
  keywords?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  members?: ProjectMemberInput[];
}

export interface ProjectMemberInput {
  userId: string;
  role: ProjectRole;
}

export interface ProjectFilter {
  search?: string;
  status?: ProjectStatus;
  memberId?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  startYear?: number;
}

export interface ProjectStats {
  total: number;
  byStatus: Record<ProjectStatus, number>;
  featured: number;
  activeFunding: number;
  totalFunding: number;
}

// ============================================
// PROJECT TIMELINE
// ============================================

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
  type: "milestone" | "publication" | "funding" | "achievement";
}

export interface ProjectTimeline {
  projectId: string;
  events: TimelineEvent[];
}

// ============================================
// PROJECT DISPLAY
// ============================================

export interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  showMembers?: boolean;
  variant?: "default" | "compact" | "featured";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  emptyMessage?: string;
  showFilters?: boolean;
  columns?: 2 | 3 | 4;
}

// ============================================
// TEAM TYPES
// ============================================

export interface TeamMember {
  id: string;
  fullName: string;
  chineseName?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  orcidId?: string;
  role: string; // UserRole
  showInTeam: boolean;
  teamOrder?: number;
  stats: {
    publicationCount: number;
    projectCount: number;
    citationCount: number;
    hIndex: number;
  };
  social: {
    website?: string;
    github?: string;
    linkedin?: string;
    googleScholar?: string;
  };
}

export interface TeamFilter {
  role?: string;
  showInTeam?: boolean;
  hasOrcid?: boolean;
}

export { ProjectStatus, ProjectRole };
