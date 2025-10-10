"use client";

// Reusable Featured Papers Section
// Used in: Homepage, Papers page, Research page

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaperCard } from "./PaperCard";
import type { Paper } from "@/lib/types";

interface FeaturedPapersProps {
  papers: Paper[];
  title?: string;
  showViewAll?: boolean;
  columns?: 2 | 3;
}

export function FeaturedPapers({
  papers,
  title = "Featured Publications",
  showViewAll = true,
  columns = 3,
}: FeaturedPapersProps) {
  if (papers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-2">
              Our latest research contributions to the field
            </p>
          </div>

          {showViewAll && (
            <Button variant="outline" asChild>
              <Link href="/papers">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Papers Grid */}
        <div
          className={`grid gap-6 ${
            columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              variant="featured"
              showOrcidBadge
              showMetrics
            />
          ))}
        </div>
      </div>
    </section>
  );
}
