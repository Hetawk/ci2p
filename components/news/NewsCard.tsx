"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: Date;
  readTime: string;
  tags: string[];
}

interface NewsCardProps {
  article: NewsArticle;
  index: number;
  variant?: "default" | "featured";
}

export function NewsCard({
  article,
  index,
  variant = "default",
}: NewsCardProps) {
  const isFeatured = variant === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/news/${article.id}`}>
        <Card
          className={`group relative overflow-hidden bg-white hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 border border-gray-200 hover:border-primary-300 cursor-pointer ${
            isFeatured ? "md:flex md:flex-row" : ""
          }`}
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-secondary-500/0 to-purple-500/0 group-hover:from-primary-500/5 group-hover:via-secondary-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />

          {/* Cover Image */}
          {article.coverImage && (
            <div
              className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${
                isFeatured ? "md:w-2/5 h-64 md:h-auto" : "w-full h-48"
              }`}
            >
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary-600 text-white shadow-lg">
                  {article.category}
                </Badge>
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className={`relative p-6 space-y-4 ${isFeatured ? "md:w-3/5" : ""}`}
          >
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} read</span>
              </div>
            </div>

            {/* Title */}
            <h3
              className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 ${
                isFeatured ? "text-2xl" : "text-xl"
              }`}
            >
              {article.title}
            </h3>

            {/* Excerpt */}
            <p
              className={`text-gray-600 ${
                isFeatured ? "line-clamp-3" : "line-clamp-2"
              }`}
            >
              {article.excerpt}
            </p>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {/* Author */}
              <div className="flex items-center gap-2">
                {article.author.avatar ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {article.author.name}
                </span>
              </div>

              {/* Read More */}
              <div className="flex items-center gap-1 text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Read more</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
