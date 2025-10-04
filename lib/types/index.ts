// TypeScript types and interfaces

export interface User {
  id: string;
  email: string;
  name?: string;
  password: string;
  role: "USER" | "ADMIN";
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: Date;
  authorId: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
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
