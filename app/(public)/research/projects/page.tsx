"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/Pagination";
import {
  Rocket,
  Users,
  Tag,
  Search,
  TrendingUp,
  X,
  Loader2,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

// Types
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  status: string;
  startDate: string;
  endDate?: string | null;
  tags?: string; // JSON string
  keywords?: string;
  fundingSource?: string;
  fundingAmount?: number;
  grantNumber?: string;
  isFeatured: boolean;
  isPublished: boolean;
  views: number;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      profile: {
        fullName: string;
        avatar?: string;
        title?: string;
      } | null;
    };
  }>;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const PROJECTS_PER_PAGE = 9;

const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-700",
  PLANNING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  ACTIVE: "Active",
  PLANNING: "Planning",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "alphabetical"
  >("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: PROJECTS_PER_PAGE.toString(),
          sortBy: sortOrder,
        });

        if (searchQuery) params.append("search", searchQuery);
        if (selectedStatus !== "all") params.append("status", selectedStatus);
        if (selectedTags.length > 0) {
          selectedTags.forEach((tag) => params.append("tag", tag));
        }

        const response = await fetch(`/api/projects?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setProjects(data.data.projects || []);
          setPagination(data.data.pagination);
        } else {
          setError(data.error || "Failed to fetch projects");
        }
      } catch (err) {
        setError("An error occurred while fetching projects");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, searchQuery, selectedStatus, selectedTags, sortOrder]);

  // Fetch featured projects
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch("/api/projects?featured=true&limit=3");
        const data = await response.json();

        if (data.success) {
          setFeaturedProjects(data.data.projects || []);
        }
      } catch (err) {
        console.error("Error fetching featured projects:", err);
      }
    };

    fetchFeaturedProjects();
  }, []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    projects.forEach((project) => {
      if (project.tags) {
        try {
          const tags = JSON.parse(project.tags);
          tags.forEach((tag: string) => tagsSet.add(tag));
        } catch {
          // Ignore parse errors
        }
      }
    });
    return Array.from(tagsSet).sort();
  }, [projects]);

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  // Stats
  const totalProjects = pagination?.total || 0;
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, rgb(59 130 246 / 0.15) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary-500/20 rounded-2xl backdrop-blur-sm border border-primary-400/30">
                <Rocket className="w-8 h-8 text-primary-300" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Research Projects
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Explore our active research initiatives in AI, Machine Learning,
              and Computer Vision
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {totalProjects}
                </div>
                <div className="text-sm text-gray-300">Total Projects</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {activeProjects}
                </div>
                <div className="text-sm text-gray-300">Active</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {featuredProjects.length}
                </div>
                <div className="text-sm text-gray-300">Featured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Featured Projects
                </h2>
                <p className="text-gray-600">
                  Highlighted research initiatives
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  All Projects
                </h2>
                <p className="text-gray-600">
                  {totalProjects} {totalProjects === 1 ? "project" : "projects"}{" "}
                  found
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Status and Sort */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PLANNING">Planning</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as typeof sortOrder)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Filter by tags:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTags([]);
                    setCurrentPage(1);
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-3 text-gray-600">Loading projects...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-gray-600">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                  />
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const tags = getTagsArray(project.tags);
  const teamString = getTeamString(project.members);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/research/projects/${project.slug}`}>
        <Card
          className={`group overflow-hidden h-full hover:shadow-xl transition-all duration-300 ${
            featured ? "border-2 border-secondary-500" : ""
          }`}
        >
          {/* Cover Image */}
          {project.coverImage && (
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {featured && (
                <div className="absolute top-3 right-3 bg-secondary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge
                className={
                  STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]
                }
              >
                {STATUS_LABELS[project.status as keyof typeof STATUS_LABELS]}
              </Badge>
              {project.views > 0 && (
                <span className="text-xs text-gray-500">
                  {project.views} views
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3">
              {project.description}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-xs">{teamString}</span>
              </div>
              {project.fundingSource && (
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs">
                    {project.fundingSource.split(" ")[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// Helper functions
function getTagsArray(tagsJson?: string): string[] {
  if (!tagsJson) return [];
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
}

function getTeamString(members: Project["members"]) {
  if (!members || members.length === 0) return "No team members";
  const leads = members.filter(
    (m) => m.role === "LEAD" || m.role === "CO_LEAD"
  );
  if (leads.length > 0) {
    const leadNames = leads
      .map((m) => m.user.profile?.fullName || "Unknown")
      .join(", ");
    return `Led by ${leadNames}`;
  }
  return `${members.length} team member${members.length > 1 ? "s" : ""}`;
}
