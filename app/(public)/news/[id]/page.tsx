"use client";

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
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";

// Author type
interface Author {
  name: string;
  avatar: string;
  role: string;
}

// News Article type
interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  publishDate: string;
  readTime: number;
  author: Author;
  tags: string[];
  relatedArticles?: string[];
}

// Mock news data
const mockNews: Record<string, NewsArticle> = {
  "1": {
    id: "1",
    title: "CI2P Lab Receives Major Grant for AI Research in Healthcare",
    excerpt:
      "Our lab has been awarded a 3-year grant from the National Science Foundation to advance AI applications in medical imaging.",
    content: `
# Grant Overview

We are thrilled to announce that the CI2P Lab has been awarded a prestigious 3-year grant from the National Science Foundation (NSF) totaling $2.5 million. This significant funding will enable us to advance our research in artificial intelligence applications for healthcare, specifically focusing on medical image analysis and diagnostic support systems.

## Research Focus Areas

The grant will support several key research initiatives:

### 1. Advanced Medical Image Segmentation
We will develop novel deep learning architectures for automated segmentation of medical images, with a focus on retinal imaging and early disease detection. This work builds upon our recent publications in IEEE Transactions on Medical Imaging.

### 2. Explainable AI for Clinical Decision Support
A critical component of the project involves creating interpretable AI models that can explain their diagnostic decisions to healthcare professionals. This addresses one of the major barriers to AI adoption in clinical settings.

### 3. Multi-Modal Learning Systems
We will explore how to combine different types of medical data (imaging, electronic health records, genomics) to create more accurate and comprehensive diagnostic tools.

## Team Expansion

This grant will enable us to:
- Hire 2 postdoctoral researchers
- Support 4 PhD students
- Establish collaborations with leading medical institutions
- Upgrade our computational infrastructure

## Timeline and Milestones

**Year 1 (2024-2025):** Foundation and infrastructure setup
- Recruit research team
- Establish clinical partnerships
- Develop initial prototypes

**Year 2 (2025-2026):** Algorithm development and validation
- Conduct clinical trials
- Publish research findings
- Present at major conferences

**Year 3 (2026-2027):** Translation and deployment
- Develop deployable systems
- Technology transfer activities
- Sustainability planning

## Impact and Vision

Professor Sijie Niu, Principal Investigator, stated: "This grant represents a tremendous opportunity to push the boundaries of AI in healthcare. Our goal is not just to publish papers, but to create technologies that can actually improve patient outcomes and make healthcare more accessible."

The research outcomes will be open-sourced and made available to the broader research community, ensuring maximum impact and fostering collaboration across institutions.

## Acknowledgments

We thank the NSF for their confidence in our research vision and our university for their continued support. We also acknowledge our clinical partners who will be instrumental in translating this research into practice.

Stay tuned for updates as we embark on this exciting research journey!
    `,
    coverImage: "/utils/deep-learning-simulation.jpg",
    category: "Research",
    publishDate: "2024-10-05",
    readTime: 5,
    author: {
      name: "Prof. Sijie Niu",
      avatar: "/SJ.jpg",
      role: "Principal Investigator",
    },
    tags: [
      "Grant",
      "NSF",
      "Healthcare AI",
      "Medical Imaging",
      "Research Funding",
    ],
    relatedArticles: ["2", "3"],
  },
  // Add more articles as needed
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();

  const articleId = params.id as string;
  const article = mockNews[articleId];

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Newspaper className="w-16 h-16 mx-auto text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">
            Article Not Found
          </h1>
          <p className="text-gray-600">
            The article you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/news")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const text = article.title;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
    } else if (navigator.share) {
      await navigator.share({ title: text, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/news"
              className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              News
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 line-clamp-1">
              {article.category}
            </span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <Badge className="bg-secondary-500 text-white">
              {article.category}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(article.publishDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{article.readTime} min read</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-white">
                  {article.author.name}
                </div>
                <div className="text-sm text-gray-400">
                  {article.author.role}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative w-full h-[400px] lg:h-[500px]">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-primary-600"
            >
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </motion.article>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-6 space-y-6"
            >
              {/* Share Card */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share Article
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleShare("linkedin")}
                  >
                    <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                    LinkedIn
                  </Button>
                </div>
              </Card>

              {/* Author Card */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  About the Author
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {article.author.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {article.author.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
