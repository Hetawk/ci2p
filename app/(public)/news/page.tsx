"use client";

import { useState, useEffect, useMemo } from "react";
import { NewsCard } from "@/components/news";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/Pagination";
import {
  Newspaper,
  Search,
  TrendingUp,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

// Types
interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  tags?: string; // JSON string
  publishedAt: string;
  isPinned: boolean;
  views: number;
  authorId: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const NEWS_PER_PAGE = 12;

const CATEGORY_LABELS: Record<string, string> = {
  LAB_NEWS: "Lab News",
  PUBLICATION: "Publication",
  AWARD: "Award",
  EVENT: "Event",
  SEMINAR: "Seminar",
  RECRUITMENT: "Recruitment",
  COLLABORATION: "Collaboration",
  MEDIA: "Media Coverage",
  OTHER: "Other",
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [pinnedNews, setPinnedNews] = useState<NewsArticle[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: NEWS_PER_PAGE.toString(),
          sortBy: sortOrder,
        });

        if (searchQuery) params.append("search", searchQuery);
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);
        if (selectedTags.length > 0) {
          selectedTags.forEach((tag) => params.append("tag", tag));
        }

        const response = await fetch(`/api/news?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setNews(data.data.news || []);
          setPagination(data.data.pagination);
        } else {
          setError(data.error || "Failed to fetch news");
        }
      } catch (err) {
        setError("An error occurred while fetching news");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, searchQuery, selectedCategory, selectedTags, sortOrder]);

  // Fetch pinned news separately
  useEffect(() => {
    const fetchPinnedNews = async () => {
      try {
        // Note: Need to implement pinned filter in API
        const response = await fetch("/api/news?limit=3&sortBy=newest");
        const data = await response.json();

        if (data.success) {
          const pinned = (data.data.news || []).filter(
            (n: NewsArticle) => n.isPinned
          );
          setPinnedNews(pinned.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching pinned news:", err);
      }
    };

    fetchPinnedNews();
  }, []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    news.forEach((article) => {
      if (article.tags) {
        try {
          const tags = JSON.parse(article.tags);
          tags.forEach((tag: string) => tagsSet.add(tag));
        } catch {
          // Ignore parse errors
        }
      }
    });
    return Array.from(tagsSet).sort();
  }, [news]);

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  // Stats
  const totalNews = pagination?.total || 0;
  const totalViews = news.reduce((sum, n) => sum + n.views, 0);

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
                <Newspaper className="w-8 h-8 text-primary-300" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Lab News
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest news, publications, and events from
              CI2P Lab
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {totalNews}
                </div>
                <div className="text-sm text-gray-300">Articles</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {totalViews}
                </div>
                <div className="text-sm text-gray-300">Total Views</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {pinnedNews.length}
                </div>
                <div className="text-sm text-gray-300">Pinned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pinned News */}
      {pinnedNews.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Pinned News
                </h2>
                <p className="text-gray-600">
                  Important updates and announcements
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <NewsCard
                    article={
                      article as unknown as Parameters<
                        typeof NewsCard
                      >[0]["article"]
                    }
                    index={index}
                    variant="featured"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">All News</h2>
                <p className="text-gray-600">
                  {totalNews} {totalNews === 1 ? "article" : "articles"} found
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
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Category and Sort */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Categories</option>
                {Object.keys(CATEGORY_LABELS).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
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
              </select>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
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
              <span className="ml-3 text-gray-600">Loading news...</span>
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

          {/* News Grid */}
          {!loading && !error && news.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <NewsCard
                      article={
                        article as unknown as Parameters<
                          typeof NewsCard
                        >[0]["article"]
                      }
                      index={index}
                    />
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
          {!loading && !error && news.length === 0 && (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No news found
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
