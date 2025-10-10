// CI2P Lab Platform - Main Type Exports

// Re-export all types
export * from "./paper";
export * from "./project";

// ============================================
// COMMON TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// ============================================
// USER & AUTH TYPES
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  role: string;
  profile?: {
    fullName: string;
    chineseName?: string;
    title?: string;
    bio?: string;
    avatar?: string;
    orcidId?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName: string;
  chineseName?: string;
  inviteToken: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface FormErrors {
  [key: string]: string | string[];
}

export interface FormState {
  errors?: FormErrors;
  message?: string;
  success?: boolean;
}

// ============================================
// RESOURCE TYPES
// ============================================

export interface Resource {
  id: string;
  name: string;
  description: string;
  type: string;
  isBookable: boolean;
  status: string;
  location?: string;
  imageUrl?: string;
}

export interface ResourceBooking {
  id: string;
  resourceId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  purpose: string;
  status: string;
  resource?: Resource;
}

// ============================================
// ANNOUNCEMENT TYPES
// ============================================

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  isPinned: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  views: number;
  createdAt: Date;
}

// ============================================
// METRICS TYPES
// ============================================

export interface LabMetric {
  id: string;
  metricKey: string;
  metricValue: string;
  displayLabel: string;
  description?: string;
  category?: string;
  order: number;
}

export interface DashboardStats {
  users: {
    total: number;
    researchers: number;
    students: number;
  };
  publications: {
    total: number;
    thisYear: number;
    featured: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  resources: {
    total: number;
    available: number;
  };
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}
