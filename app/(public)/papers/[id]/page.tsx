"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Quote,
  ExternalLink,
  Download,
  Share2,
  ArrowLeft,
  Award,
  Building2,
  Loader2,
  AlertCircle,
  Eye,
  FileDown,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Paper } from "@/lib/types/paper";

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBibtex, setShowBibtex] = useState(false);

  const paperId = params.id as string;

  // Fetch paper data
  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/papers/${paperId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch paper");
        }

        setPaper(data.data);

        // Increment view count after successful fetch
        await fetch(`/api/papers/${paperId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "incrementViews" }),
        });
      } catch (err) {
        console.error("Error fetching paper:", err);
        setError(err instanceof Error ? err.message : "Failed to load paper");
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [paperId]);

  // Generate BibTeX citation
  const generateBibtex = () => {
    if (!paper) return "";
    const firstAuthor =
      Array.isArray(paper.authors) && paper.authors[0]
        ? typeof paper.authors[0] === "string"
          ? paper.authors[0]
          : paper.authors[0].name
        : paper.author?.profile?.fullName || "Unknown";
    const authorLastName =
      firstAuthor.split(" ").pop()?.toLowerCase() || "unknown";

    return `@article{${authorLastName}${paper.year},
  title={${paper.title}},
  author={${
    Array.isArray(paper.authors)
      ? paper.authors
          .map((a: string | { name: string }) =>
            typeof a === "string" ? a : a.name
          )
          .join(" and ")
      : firstAuthor
  }},
  journal={${paper.journal || ""}},
  year={${paper.year}},
  volume={${paper.volume || ""}},
  number={${paper.issue || ""}},
  pages={${paper.pages || ""}},${paper.doi ? `\n  doi={${paper.doi}},` : ""}
}`;
  };

  const handleCopyBibtex = () => {
    const bibtex = generateBibtex();
    if (bibtex) {
      navigator.clipboard.writeText(bibtex);
      // You could add a toast notification here
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: paper?.title,
        text: `Check out this paper: ${paper?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Add toast notification
    }
  };

  const handleDownload = async () => {
    if (paper?.pdfUrl) {
      // Increment downloads
      await fetch(`/api/papers/${paperId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementDownloads" }),
      });

      // Open PDF in new tab
      window.open(paper.pdfUrl, "_blank");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 mx-auto text-primary-600 animate-spin" />
          <p className="text-gray-600">Loading paper details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <h1 className="text-2xl font-bold text-gray-900">
            {error === "Paper not found"
              ? "Paper Not Found"
              : "Error Loading Paper"}
          </h1>
          <p className="text-gray-600">
            {error || "The paper you're looking for doesn't exist."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push("/papers")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Papers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/papers"
              className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Papers
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 line-clamp-1">{paper.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Paper Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 bg-gradient-to-br from-white to-blue-50/30">
                <div className="space-y-4">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary-600 text-white">
                      {paper.publicationType?.replace("_", " ") ||
                        "JOURNAL ARTICLE"}
                    </Badge>
                    {paper.citations > 0 && (
                      <Badge
                        variant="outline"
                        className="border-green-600 text-green-700"
                      >
                        {paper.citations} Citations
                      </Badge>
                    )}
                    {paper.isFeatured && (
                      <Badge
                        variant="outline"
                        className="border-yellow-600 text-yellow-700"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {paper.views && (
                      <Badge
                        variant="outline"
                        className="border-blue-600 text-blue-700"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {paper.views} Views
                      </Badge>
                    )}
                    {paper.downloads && (
                      <Badge
                        variant="outline"
                        className="border-purple-600 text-purple-700"
                      >
                        <FileDown className="w-3 h-3 mr-1" />
                        {paper.downloads} Downloads
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {paper.title}
                  </h1>

                  {/* Authors */}
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {Array.isArray(paper.authors) &&
                      paper.authors.length > 0 ? (
                        paper.authors.map(
                          (author: string | { name: string }, idx: number) => (
                            <span key={idx} className="text-gray-700">
                              {typeof author === "string"
                                ? author
                                : author.name}
                              {idx < paper.authors.length - 1 && ","}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-gray-700">
                          {paper.author?.profile?.fullName || "Unknown Author"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Journal Info */}
                  {paper.journal && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{paper.journal}</span>
                      {paper.year && (
                        <>
                          <span>•</span>
                          <span>{paper.year}</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  {paper.createdAt && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>
                        Added:{" "}
                        {new Date(paper.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {/* DOI */}
                  {paper.doi && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        DOI: {paper.doi}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Abstract */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Quote className="w-6 h-6 text-primary-600" />
                  Abstract
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {paper.abstract}
                </p>
              </Card>
            </motion.div>

            {/* Keywords/Tags */}
            {paper.customTags && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Keywords
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {paper.customTags
                      .split(",")
                      .map((keyword: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-blue-50 border-blue-200 text-blue-700"
                        >
                          {keyword.trim()}
                        </Badge>
                      ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* BibTeX Citation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Citation</h2>
                  <Button
                    onClick={() => setShowBibtex(!showBibtex)}
                    variant="outline"
                    size="sm"
                  >
                    {showBibtex ? "Hide" : "Show"} BibTeX
                  </Button>
                </div>
                {showBibtex && (
                  <div className="space-y-2">
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generateBibtex()}</code>
                    </pre>
                    <Button
                      onClick={handleCopyBibtex}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Copy BibTeX
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 sticky top-8">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {paper.pdfUrl && (
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-primary-600 hover:bg-primary-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Paper
                  </Button>
                  {paper.doi && (
                    <Button
                      onClick={() =>
                        window.open(`https://doi.org/${paper.doi}`, "_blank")
                      }
                      variant="outline"
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Publisher
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Author Info */}
            {paper.author?.profile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Corresponding Author
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {paper.author.profile?.avatar ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${paper.author.profile.avatar})`,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {paper.author.profile?.fullName || "Unknown Author"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Corresponding Author
                        </p>
                      </div>
                    </div>
                    {paper.author.profile?.orcidId && (
                      <a
                        href={`https://orcid.org/${paper.author.profile.orcidId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View ORCID Profile
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Paper Metrics</h3>
                <div className="space-y-3">
                  {paper.citations > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Citations</span>
                      <span className="font-semibold text-gray-900">
                        {paper.citations}
                      </span>
                    </div>
                  )}
                  {paper.views && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Views</span>
                      <span className="font-semibold text-gray-900">
                        {paper.views}
                      </span>
                    </div>
                  )}
                  {paper.downloads && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Downloads</span>
                      <span className="font-semibold text-gray-900">
                        {paper.downloads}
                      </span>
                    </div>
                  )}
                  {paper.year && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Year</span>
                      <span className="font-semibold text-gray-900">
                        {paper.year}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
