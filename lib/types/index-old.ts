// CI2P Lab Platform - Main Type Exports

// Re-export all types
export * from "./paper";
export * from "./project";

// ============================================
// COMMON TYPES
// ============================================

export interface ApiResponse<T = any> {
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
  category: string;
  impact?: string;
  active: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  image?: string;
  featured: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: Date;
}

export interface ImpactMetric {
  id: string;
  label: string;
  value: number;
  icon?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Newsletter {
  id: string;
  email: string;
  name?: string;
  active: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  skills?: string;
  resumeUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CONTACTED";
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
