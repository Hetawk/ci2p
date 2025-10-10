"use client";

import { useState, useMemo } from "react";
import { PaperCard, PaperFilters } from "@/components/papers";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/Pagination";
import { BookOpen, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

// Mock data - Replace with actual API call
const mockPapers = [
  {
    id: "1",
    title:
      "Deep Learning Approaches for Medical Image Segmentation: A Comprehensive Review",
    abstract:
      "This paper provides a comprehensive review of deep learning techniques applied to medical image segmentation, focusing on recent advances in convolutional neural networks and transformer architectures.",
    authors: JSON.stringify([
      { name: "Sijie Niu", orcid: "0000-0002-1401-9859" },
      { name: "Qiang Chen" },
      { name: "Li Wang" },
    ]),
    publicationType: "JOURNAL_ARTICLE" as const,
    journal: "IEEE Transactions on Medical Imaging",
    year: 2024,
    doi: "10.1109/TMI.2024.123456",
    citations: 45,
    views: 1250,
    downloads: 380,
    isFromOrcid: true,
    isPublished: true,
    isFeatured: true,
    pdfUrl: "/papers/paper1.pdf",
    customDescription:
      "Featured research on medical image analysis using deep learning.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    userId: "user1",
  },
  {
    id: "2",
    title: "Weakly Supervised Learning for Remote Sensing Image Classification",
    abstract:
      "We propose a novel weakly supervised learning framework for hyperspectral image classification with limited labeled data.",
    authors: JSON.stringify([
      { name: "Sijie Niu", orcid: "0000-0002-1401-9859" },
      { name: "Zhang Wei" },
    ]),
    publicationType: "CONFERENCE_PAPER" as const,
    journal: "CVPR 2024",
    year: 2024,
    doi: "10.1109/CVPR.2024.789",
    citations: 28,
    views: 890,
    downloads: 245,
    isFromOrcid: true,
    isPublished: true,
    isFeatured: true,
    pdfUrl: null,
    customDescription: null,
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-20"),
    userId: "user1",
  },
  {
    id: "3",
    title: "Transfer Learning for Cross-Domain Pattern Recognition",
    abstract:
      "This work explores transfer learning techniques for improving pattern recognition performance across different domains.",
    authors: JSON.stringify([
      { name: "Li Ming" },
      { name: "Sijie Niu", orcid: "0000-0002-1401-9859" },
    ]),
    publicationType: "JOURNAL_ARTICLE" as const,
    journal: "Pattern Recognition Letters",
    year: 2023,
    doi: "10.1016/j.patrec.2023.456",
    citations: 67,
    views: 1450,
    downloads: 420,
    isFromOrcid: true,
    isPublished: true,
    isFeatured: false,
    pdfUrl: "/papers/paper3.pdf",
    customDescription: null,
    createdAt: new Date("2023-11-10"),
    updatedAt: new Date("2023-11-10"),
    userId: "user1",
  },
  // Add more mock papers for pagination testing
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `mock-${i + 4}`,
    title: `Research Paper ${
      i + 4
    }: Advanced Topics in Machine Learning and AI`,
    abstract: `This paper explores various aspects of machine learning including neural networks, optimization algorithms, and practical applications in real-world scenarios. Paper number ${
      i + 4
    } in our collection.`,
    authors: JSON.stringify([
      { name: "Sijie Niu", orcid: "0000-0002-1401-9859" },
      { name: `Co-Author ${i + 1}` },
    ]),
    publicationType:
      i % 2 === 0
        ? ("JOURNAL_ARTICLE" as const)
        : ("CONFERENCE_PAPER" as const),
    journal:
      i % 2 === 0
        ? "International Journal of AI Research"
        : `Conference ${2020 + (i % 5)}`,
    year: 2024 - (i % 5),
    doi: `10.1234/journal.${2024 - (i % 5)}.${i + 4}`,
    citations: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 2000),
    downloads: Math.floor(Math.random() * 500),
    isFromOrcid: true,
    isPublished: true,
    isFeatured: false,
    pdfUrl: i % 3 === 0 ? `/papers/paper${i + 4}.pdf` : null,
    customDescription: null,
    createdAt: new Date(`${2024 - (i % 5)}-${(i % 12) + 1}-15`),
    updatedAt: new Date(`${2024 - (i % 5)}-${(i % 12) + 1}-15`),
    userId: "user1",
  })),
];

const PAPERS_PER_PAGE = 12;

export default function PapersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "citations">(
    "newest"
  );

  // Extract unique years and categories
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(mockPapers.map((p) => p.year.toString())));
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }, []);

  const availableCategories = useMemo(() => {
    const categories = Array.from(
      new Set(mockPapers.map((p) => p.publicationType))
    );
    return categories.sort();
  }, []);

  // Filter and sort papers
  const filteredPapers = useMemo(() => {
    const filtered = mockPapers.filter((paper) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = paper.title.toLowerCase().includes(query);
        const authorMatch = paper.authors.toLowerCase().includes(query);
        const abstractMatch = paper.abstract?.toLowerCase().includes(query);
        if (!titleMatch && !authorMatch && !abstractMatch) return false;
      }

      // Year filter
      if (selectedYear !== "all" && paper.year.toString() !== selectedYear) {
        return false;
      }

      // Category filter
      if (
        selectedCategory !== "all" &&
        paper.publicationType !== selectedCategory
      ) {
        return false;
      }

      return paper.isPublished;
    });

    // Sort papers
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.year - a.year;
      } else if (sortOrder === "oldest") {
        return a.year - b.year;
      } else {
        return b.citations - a.citations;
      }
    });

    return filtered;
  }, [searchQuery, selectedYear, selectedCategory, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredPapers.length / PAPERS_PER_PAGE);
  const paginatedPapers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAPERS_PER_PAGE;
    return filteredPapers.slice(startIndex, startIndex + PAPERS_PER_PAGE);
  }, [filteredPapers, currentPage]);

  // Featured papers
  const featuredPapers = useMemo(() => {
    return mockPapers.filter((p) => p.isFeatured && p.isPublished).slice(0, 3);
  }, []);

  // Stats
  const totalPapers = mockPapers.filter((p) => p.isPublished).length;
  const totalCitations = mockPapers.reduce((sum, p) => sum + p.citations, 0);

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
                    // @ts-expect-error - Mock data type mismatch
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
                {filteredPapers.length}{" "}
                {filteredPapers.length === 1 ? "paper" : "papers"} found
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

          {/* Papers Grid */}
          {paginatedPapers.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {paginatedPapers.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PaperCard
                      // @ts-expect-error - Mock data type mismatch
                      paper={paper}
                      showOrcidBadge
                      showMetrics
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    hasNextPage={currentPage < totalPages}
                    hasPreviousPage={currentPage > 1}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No papers found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedYear("all");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
