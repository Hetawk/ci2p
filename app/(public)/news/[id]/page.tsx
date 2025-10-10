"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

// News Article type based on API response
interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  tags: string[];
  gallery: string[];
  isPinned: boolean;
  isPublished: boolean;
  views: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const articleId = params.id as string;

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/news/${articleId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch article");
        }

        setArticle(data.data);

        // Increment view count after successful fetch
        await fetch(`/api/news/${articleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "incrementViews" }),
        });
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 mx-auto text-primary-600 animate-spin" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <h1 className="text-2xl font-bold text-gray-900">
            {error === "News article not found"
              ? "Article Not Found"
              : "Error Loading Article"}
          </h1>
          <p className="text-gray-600">
            {error || "The article you're looking for doesn't exist."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push("/news")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Category colors
  const categoryColors: Record<string, string> = {
    LAB_NEWS: "bg-blue-100 text-blue-700 border-blue-300",
    PUBLICATION: "bg-green-100 text-green-700 border-green-300",
    AWARD: "bg-yellow-100 text-yellow-700 border-yellow-300",
    EVENT: "bg-purple-100 text-purple-700 border-purple-300",
    SEMINAR: "bg-pink-100 text-pink-700 border-pink-300",
    CONFERENCE: "bg-indigo-100 text-indigo-700 border-indigo-300",
    COLLABORATION: "bg-orange-100 text-orange-700 border-orange-300",
  };

  const categoryColor =
    categoryColors[article.category] || categoryColors.LAB_NEWS;

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.excerpt || `Read: ${article.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Add toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/news"
              className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              News
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 line-clamp-1">{article.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <article className="space-y-8">
          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              {/* Category and Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge className={`${categoryColor} border`}>
                  <Newspaper className="w-3 h-3 mr-1" />
                  {article.category.replace("_", " ")}
                </Badge>
                {article.isPinned && (
                  <Badge className="bg-red-100 text-red-700 border-red-300 border">
                    Pinned
                  </Badge>
                )}
                {article.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="bg-gray-50">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(
                      article.publishedAt || article.createdAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{article.views} views</span>
                </div>
              </div>

              {/* Share Button */}
              <div className="flex gap-3">
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Cover Image */}
          {article.coverImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative w-full aspect-video rounded-xl overflow-hidden"
            >
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 lg:p-12">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 
                  prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-8
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-6
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:my-4 prose-ul:list-disc prose-ul:list-inside
                  prose-ol:my-4 prose-ol:list-decimal prose-ol:list-inside
                  prose-li:text-gray-700 prose-li:mb-2
                  prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-blockquote:border-l-4 prose-blockquote:border-primary-600 
                  prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
              >
                {/* Render content with basic markdown-like formatting */}
                {article.content.split("\n").map((paragraph, idx) => {
                  // Headers
                  if (paragraph.startsWith("# ")) {
                    return <h1 key={idx}>{paragraph.substring(2)}</h1>;
                  }
                  if (paragraph.startsWith("## ")) {
                    return <h2 key={idx}>{paragraph.substring(3)}</h2>;
                  }
                  if (paragraph.startsWith("### ")) {
                    return <h3 key={idx}>{paragraph.substring(4)}</h3>;
                  }
                  // Bullet points
                  if (paragraph.startsWith("- ")) {
                    return <li key={idx}>{paragraph.substring(2)}</li>;
                  }
                  // Empty lines
                  if (paragraph.trim() === "") {
                    return <br key={idx} />;
                  }
                  // Regular paragraphs
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>
            </Card>
          </motion.div>

          {/* Gallery */}
          {article.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Gallery
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {article.gallery.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={image}
                        alt={`${article.title} - Gallery ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between pt-8 border-t border-gray-200"
          >
            <Button onClick={() => router.push("/news")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </motion.div>
        </article>
      </div>
    </div>
  );
}
