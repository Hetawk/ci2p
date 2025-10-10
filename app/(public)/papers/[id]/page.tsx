"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Calendar,
  Quote,
  ExternalLink,
  Download,
  Share2,
  ArrowLeft,
  Award,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

// Author type
interface Author {
  name: string;
  affiliation: string;
  orcid?: string;
}

// Paper type
interface Paper {
  id: string;
  title: string;
  authors: Author[];
  abstract: string;
  journal: string;
  year: number;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  citations: number;
  publicationType: string;
  keywords: string[];
  pdfUrl: string;
  bibtex: string;
  relatedPapers: string[];
  publishedDate: string;
  isFeatured: boolean;
  isPublished: boolean;
}

// Mock paper data - Replace with API call
const mockPapers: Record<string, Paper> = {
  "1": {
    id: "1",
    title:
      "Deep Learning Approaches for Retinal Image Segmentation: A Comprehensive Review",
    authors: [
      {
        name: "Sijie Niu",
        affiliation: "University of Jinan",
        orcid: "0000-0001-2345-6789",
      },
      { name: "Zhang Wei", affiliation: "University of Jinan" },
      { name: "Li Ming", affiliation: "Tsinghua University" },
    ],
    abstract:
      "This paper presents a comprehensive review of deep learning techniques applied to retinal image segmentation. We analyze various architectures including U-Net, Mask R-CNN, and recent transformer-based models. Our study covers datasets, evaluation metrics, and performance comparisons across different methodologies. We also discuss challenges in medical image segmentation and future research directions in this rapidly evolving field.",
    journal: "IEEE Transactions on Medical Imaging",
    year: 2024,
    volume: "43",
    issue: "2",
    pages: "234-256",
    doi: "10.1109/TMI.2024.1234567",
    citations: 45,
    publicationType: "JOURNAL_ARTICLE",
    keywords: [
      "Deep Learning",
      "Medical Imaging",
      "Retinal Segmentation",
      "U-Net",
      "Computer Vision",
      "Healthcare AI",
    ],
    pdfUrl: "/papers/deep-learning-retinal-segmentation.pdf",
    bibtex: `@article{niu2024deep,
  title={Deep Learning Approaches for Retinal Image Segmentation: A Comprehensive Review},
  author={Niu, Sijie and Wei, Zhang and Ming, Li},
  journal={IEEE Transactions on Medical Imaging},
  volume={43},
  number={2},
  pages={234--256},
  year={2024},
  publisher={IEEE}
}`,
    relatedPapers: ["2", "3"],
    publishedDate: "2024-02-15",
    isFeatured: true,
    isPublished: true,
  },
  // Add more mock papers as needed
};

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showBibtex, setShowBibtex] = useState(false);

  const paperId = params.id as string;
  const paper = mockPapers[paperId];

  // If paper not found
  if (!paper) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Paper Not Found</h1>
          <p className="text-gray-600">
            The paper you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/papers")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Papers
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(paper.bibtex);
    // You could add a toast notification here
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: paper.title,
        text: `Check out this paper: ${paper.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Add toast notification
    }
  };

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
                      {paper.publicationType.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-green-600 text-green-700"
                    >
                      {paper.citations} Citations
                    </Badge>
                    {paper.isFeatured && (
                      <Badge
                        variant="outline"
                        className="border-yellow-600 text-yellow-700"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Featured
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
                      {paper.authors.map((author: Author, idx: number) => (
                        <span key={idx} className="text-gray-700">
                          {author.orcid ? (
                            <Link
                              href={`https://orcid.org/${author.orcid}`}
                              target="_blank"
                              className="hover:text-primary-600 underline"
                            >
                              {author.name}
                            </Link>
                          ) : (
                            author.name
                          )}
                          {idx < paper.authors.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Journal Info */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{paper.journal}</span>
                    <span>•</span>
                    <span>
                      Vol. {paper.volume}, No. {paper.issue}
                    </span>
                    <span>•</span>
                    <span>{paper.year}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>
                      Published:{" "}
                      {new Date(paper.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Quote className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Abstract</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {paper.abstract}
                </p>
              </Card>
            </motion.div>

            {/* Keywords */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((keyword: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* BibTeX */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Citation</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBibtex(!showBibtex)}
                  >
                    {showBibtex ? "Hide" : "Show"} BibTeX
                  </Button>
                </div>
                {showBibtex && (
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {paper.bibtex}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
                      onClick={handleCopyBibtex}
                    >
                      Copy
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 sticky top-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {paper.pdfUrl && (
                    <Button
                      className="w-full bg-primary-600 hover:bg-primary-700"
                      asChild
                    >
                      <Link href={paper.pdfUrl} target="_blank">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Link>
                    </Button>
                  )}
                  {paper.doi && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Publisher
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* DOI */}
                {paper.doi && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">DOI</div>
                    <Link
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      className="text-primary-600 hover:text-primary-700 text-sm break-all"
                    >
                      {paper.doi}
                    </Link>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Citations</span>
                    <span className="font-semibold text-gray-900">
                      {paper.citations}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Year</span>
                    <span className="font-semibold text-gray-900">
                      {paper.year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pages</span>
                    <span className="font-semibold text-gray-900">
                      {paper.pages}
                    </span>
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
