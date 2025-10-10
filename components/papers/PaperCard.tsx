"use client";

// CI2P Lab Platform - Reusable Paper Card Component
// Used in: Public papers list, Featured section, Dashboard, Admin panel

import Link from "next/link";
import { Calendar, ExternalLink, FileText, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaperCardProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PaperCard({
  paper,
  showActions = false,
  showOrcidBadge = true,
  showMetrics = true,
  variant = "default",
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
}: PaperCardProps) {
  const authorNames = JSON.parse((paper.authors as string) || "[]")
    .map((a: { name: string }) => a.name)
    .join(", ");

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg",
        variant === "featured" && "border-blue-500 border-2",
        variant === "compact" && "p-4",
        !paper.isPublished && "opacity-60"
      )}
    >
      <CardHeader className="space-y-2">
        {/* Title with ORCID Badge */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/papers/${paper.id}`} className="flex-1 group">
            <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
              {paper.title}
            </h3>
          </Link>

          {showOrcidBadge && paper.isFromOrcid && (
            <Badge
              variant="outline"
              className="shrink-0 bg-green-50 text-green-700 border-green-300"
            >
              <svg
                className="w-3 h-3 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416z" />
              </svg>
              ORCID
            </Badge>
          )}
        </div>

        {/* Authors */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="line-clamp-1">{authorNames}</span>
        </div>

        {/* Publication Info */}
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">
            {paper.publicationType.replace(/_/g, " ")}
          </Badge>

          {paper.year && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{paper.year}</span>
            </div>
          )}

          {paper.journal && (
            <span className="text-muted-foreground line-clamp-1">
              {paper.journal}
            </span>
          )}
        </div>
      </CardHeader>

      {/* Abstract Preview */}
      {variant !== "compact" && (paper.abstract || paper.customDescription) && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {paper.customDescription || paper.abstract}
          </p>
        </CardContent>
      )}

      {/* Footer with Actions/Metrics */}
      <CardFooter className="flex items-center justify-between border-t pt-4">
        {/* Metrics */}
        {showMetrics && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>📊 {paper.citations} citations</span>
            <span>👁️ {paper.views} views</span>
            {paper.pdfUrl && <span>📥 {paper.downloads} downloads</span>}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {paper.doi && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`https://doi.org/${paper.doi}`} target="_blank">
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          )}

          {paper.pdfUrl && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={paper.pdfUrl} target="_blank">
                <FileText className="w-4 h-4" />
              </Link>
            </Button>
          )}

          {/* Admin Actions */}
          {showActions && (
            <>
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(paper.id)}
                >
                  Edit
                </Button>
              )}

              {onToggleFeatured && (
                <Button
                  variant={paper.isFeatured ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleFeatured(paper.id, !paper.isFeatured)}
                >
                  {paper.isFeatured ? "★" : "☆"} Featured
                </Button>
              )}

              {onTogglePublished && (
                <Button
                  variant={paper.isPublished ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    onTogglePublished(paper.id, !paper.isPublished)
                  }
                >
                  {paper.isPublished ? "👁️" : "🔒"}{" "}
                  {paper.isPublished ? "Published" : "Unpublished"}
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to delete this publication?"
                      )
                    ) {
                      onDelete(paper.id);
                    }
                  }}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
