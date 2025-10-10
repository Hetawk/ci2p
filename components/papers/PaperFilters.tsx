"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  Filter,
  BookOpen,
  Calendar,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaperFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortOrder: "newest" | "oldest" | "citations";
  onSortOrderChange: (order: "newest" | "oldest" | "citations") => void;
  availableYears: string[];
  availableCategories: string[];
}

export function PaperFilters({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortOrderChange,
  availableYears,
  availableCategories,
}: PaperFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedYear !== "all") count++;
    if (selectedCategory !== "all") count++;
    if (searchQuery) count++;
    return count;
  }, [selectedYear, selectedCategory, searchQuery]);

  const clearAllFilters = () => {
    onSearchChange("");
    onYearChange("all");
    onCategoryChange("all");
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search papers by title, author, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="h-12 px-6 border-gray-300 hover:border-primary-500 hover:bg-primary-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-primary-600 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 border-gray-200 bg-gradient-to-br from-slate-50 to-blue-50/30">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Publication Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white"
                  >
                    <option value="all">All Categories</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    {sortOrder === "newest" ? (
                      <SortDesc className="w-4 h-4" />
                    ) : (
                      <SortAsc className="w-4 h-4" />
                    )}
                    Sort By
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) =>
                      onSortOrderChange(
                        e.target.value as "newest" | "oldest" | "citations"
                      )
                    }
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="citations">Most Cited</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge
              variant="secondary"
              className="px-3 py-1 bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer"
              onClick={() => onSearchChange("")}
            >
              Search: {searchQuery}
              <X className="w-3 h-3 ml-2" />
            </Badge>
          )}
          {selectedYear !== "all" && (
            <Badge
              variant="secondary"
              className="px-3 py-1 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 cursor-pointer"
              onClick={() => onYearChange("all")}
            >
              Year: {selectedYear}
              <X className="w-3 h-3 ml-2" />
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge
              variant="secondary"
              className="px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
              onClick={() => onCategoryChange("all")}
            >
              Category: {selectedCategory.replace(/_/g, " ")}
              <X className="w-3 h-3 ml-2" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
