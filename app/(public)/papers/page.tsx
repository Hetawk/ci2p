"use client";

import { useState, useEffect, useMemo } from "react";
import { PaperCard, PaperFilters } from "@/components/papers";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/Pagination";
import {
  BookOpen,
  TrendingUp,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Paper } from "@/lib/types/paper";

// Types
interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const PAPERS_PER_PAGE = 12;

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [featuredPapers, setFeaturedPapers] = useState<Paper[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "citations">(
    "newest"
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch papers from API
  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query params
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: PAPERS_PER_PAGE.toString(),
          sortBy: sortOrder,
        });

        if (searchQuery) params.append("search", searchQuery);
        if (selectedYear !== "all") params.append("year", selectedYear);
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);

        const response = await fetch(`/api/papers?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setPapers(data.data.papers || []);
          setPagination(data.data.pagination);
        } else {
          setError(data.error || "Failed to fetch papers");
        }
      } catch (err) {
        setError("An error occurred while fetching papers");
        console.error("Error fetching papers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [currentPage, searchQuery, selectedYear, selectedCategory, sortOrder]);

  // Fetch featured papers separately (only once)
  useEffect(() => {
    const fetchFeaturedPapers = async () => {
      try {
        const response = await fetch("/api/papers?featured=true&limit=3");
        const data = await response.json();

        if (data.success) {
          setFeaturedPapers(data.data.papers || []);
        }
      } catch (err) {
        console.error("Error fetching featured papers:", err);
      }
    };

    fetchFeaturedPapers();
  }, []);

  // Extract available years and categories from papers
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(papers.map((p) => p.year.toString())));
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }, [papers]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.publicationType)));
  }, [papers]);

  // Stats
  const totalPapers = pagination?.total || 0;
  const totalCitations = papers.reduce((sum, p) => sum + p.citations, 0);

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
                <BookOpen className="w-8 h-8 text-primary-300" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Publications
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Explore our research contributions in Machine Learning, AI,
              Medical Image Analysis, and Computer Vision
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {totalPapers}
                </div>
                <div className="text-sm text-gray-300">Publications</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {totalCitations}
                </div>
                <div className="text-sm text-gray-300">Citations</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {featuredPapers.length}
                </div>
                <div className="text-sm text-gray-300">Featured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Papers */}
      {featuredPapers.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Featured Publications
                </h2>
                <p className="text-gray-600">
                  Highlighted research contributions
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PaperCard
                    paper={paper}
                    variant="featured"
                    showOrcidBadge
                    showMetrics
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Papers Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                All Publications
              </h2>
              <p className="text-gray-600">
                {totalPapers} {totalPapers === 1 ? "paper" : "papers"} found
              </p>
            </div>
          </div>

          {/* Filters */}
          <PaperFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            availableYears={availableYears}
            availableCategories={availableCategories}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-3 text-gray-600">
                Loading publications...
              </span>
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

          {/* Papers Grid */}
          {!loading && !error && papers.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {papers.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PaperCard paper={paper} showOrcidBadge showMetrics />
                  </motion.div>
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
          {!loading && !error && papers.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No publications found
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
