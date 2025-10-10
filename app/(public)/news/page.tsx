"use client";

import { useState, useMemo } from "react";
import { NewsCard } from "@/components/news";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/Pagination";
import {
  Newspaper,
  Search,
  Calendar,
  TrendingUp,
  X,
} from "lucide-react";

// Mock news data
const mockNews = [
  {
    id: "1",
    title: "CI2P Lab Receives National Science Foundation Grant for AI Research",
    excerpt: "Our lab has been awarded a prestigious NSF grant to advance research in artificial intelligence and machine learning applications in medical imaging.",
    content: "Full article content...",
    coverImage: "/utils/deep-learning-simulation.jpg",
    category: "Research",
    author: {
      name: "Prof. Sijie Niu",
      avatar: "/SJ.jpg",
    },
    publishedAt: new Date("2024-09-15"),
    readTime: "5 min",
    tags: ["AI", "Research Grant", "Medical Imaging"],
  },
  {
    id: "2",
    title: "New Paper Published in IEEE Transactions on Medical Imaging",
    excerpt: "Our latest research on deep learning for medical image segmentation has been accepted for publication in a top-tier journal.",
    content: "Full article content...",
    coverImage: "/utils/dnn_flow.jpg",
    category: "Publications",
    author: {
      name: "Zhang Wei",
      avatar: undefined,
    },
    publishedAt: new Date("2024-08-22"),
    readTime: "3 min",
    tags: ["Deep Learning", "Medical Imaging", "Publication"],
  },
  {
    id: "3",
    title: "Lab Members Present at CVPR 2024",
    excerpt: "Three of our research papers were accepted at CVPR 2024, and team members traveled to Seattle to present their work.",
    content: "Full article content...",
    coverImage: "/utils/machine_learning_robot.jpg",
    category: "Events",
    author: {
      name: "Li Ming",
      avatar: undefined,
    },
    publishedAt: new Date("2024-06-18"),
    readTime: "4 min",
    tags: ["Conference", "CVPR", "Computer Vision"],
  },
  {
    id: "4",
    title: "Welcoming New Graduate Students to CI2P Lab",
    excerpt: "We are excited to welcome five new master's students who will be joining our research team this semester.",
    content: "Full article content...",
    coverImage: "/team/research-team-outdoor.jpg",
    category: "Team",
    author: {
      name: "Prof. Sijie Niu",
      avatar: "/SJ.jpg",
    },
    publishedAt: new Date("2024-09-01"),
    readTime: "2 min",
    tags: ["Team", "Students", "Welcome"],
  },
  {
    id: "5",
    title: "Collaboration with Stanford University on Medical AI",
    excerpt: "CI2P Lab announces new collaboration with Stanford University's Medical AI group to advance diagnostic imaging research.",
    content: "Full article content...",
    coverImage: "/utils/dnn.jpg",
    category: "Collaboration",
    author: {
      name: "Prof. Sijie Niu",
      avatar: "/SJ.jpg",
    },
    publishedAt: new Date("2024-07-10"),
    readTime: "6 min",
    tags: ["Collaboration", "Stanford", "Medical AI"],
  },
  {
    id: "6",
    title: "Lab Workshop: Introduction to Deep Learning",
    excerpt: "Successfully conducted a two-day workshop on deep learning fundamentals for undergraduate students interested in AI research.",
    content: "Full article content...",
    coverImage: "/team/workshop.jpg",
    category: "Events",
    author: {
      name: "Wang Fang",
      avatar: undefined,
    },
    publishedAt: new Date("2024-05-25"),
    readTime: "3 min",
    tags: ["Workshop", "Education", "Deep Learning"],
  },
  // Add more news articles
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `news-${i + 7}`,
    title: `Lab Update ${i + 7}: Advancing Research in AI and Machine Learning`,
    excerpt: `This week, our team made significant progress on multiple research projects. Read about our latest developments and upcoming events.`,
    content: "Full article content...",
    coverImage: i % 2 === 0 ? "/utils/deep-learning-simulation.jpg" : undefined,
    category: i % 3 === 0 ? "Research" : i % 3 === 1 ? "Events" : "Team",
    author: {
      name: i % 2 === 0 ? "Prof. Sijie Niu" : "Lab Team",
      avatar: i % 2 === 0 ? "/SJ.jpg" : undefined,
    },
    publishedAt: new Date(`2024-0${(i % 6) + 1}-${10 + i}`),
    readTime: `${3 + (i % 3)} min`,
    tags: ["Updates", "Research", "AI"],
  })),
];

const NEWS_PER_PAGE = 9;

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockNews.map((n) => n.category)));
    return ["all", ...cats.sort()];
  }, []);

  // Filter news
  const filteredNews = useMemo(() => {
    return mockNews.filter((article) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = article.title.toLowerCase().includes(query);
        const excerptMatch = article.excerpt.toLowerCase().includes(query);
        const tagsMatch = article.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        if (!titleMatch && !excerptMatch && !tagsMatch) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && article.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
    return filteredNews.slice(startIndex, startIndex + NEWS_PER_PAGE);
  }, [filteredNews, currentPage]);

  // Featured news (latest)
  const featuredNews = mockNews[0];

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

        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary-500/20 rounded-2xl backdrop-blur-sm border border-primary-400/30">
                <Newspaper className="w-8 h-8 text-primary-300" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Lab <span className="text-secondary-400">News</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest research, events, and achievements from
              CI2P Lab
            </p>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured News</h2>
              <p className="text-gray-600">Latest update from the lab</p>
            </div>
          </div>

          <NewsCard article={featuredNews} index={0} variant="featured" />
        </div>
      </section>

      {/* All News Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">All News</h2>
              <p className="text-gray-600">
                {filteredNews.length}{" "}
                {filteredNews.length === 1 ? "article" : "articles"} found
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-8">
            {/* Search and Category */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-primary-600"
                        : "border-gray-300 hover:border-primary-500"
                    }
                  >
                    {category === "all" ? "All" : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "all") && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  >
                    Search: {searchQuery}
                    <X className="w-3 h-3 ml-2" />
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 cursor-pointer"
                    onClick={() => setSelectedCategory("all")}
                  >
                    Category: {selectedCategory}
                    <X className="w-3 h-3 ml-2" />
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* News Grid */}
          {paginatedNews.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedNews.map((article, index) => (
                  <NewsCard key={article.id} article={article} index={index} />
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
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No news found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
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
