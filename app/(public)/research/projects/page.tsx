"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/Pagination";
import {
  Rocket,
  Users,
  Tag,
  Search,
  TrendingUp,
  X,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

// Project type
interface Project {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  status: string;
  startDate: string;
  endDate: string | null;
  tags: string[];
  team: string[];
  funding: string;
  isFeatured: boolean;
}

// Mock projects data
const mockProjects = [
  {
    id: "1",
    title: "Deep Learning for Medical Image Segmentation",
    description:
      "Advanced deep learning techniques for accurate segmentation of medical images, focusing on retinal imaging and lesion detection.",
    coverImage: "/utils/deep-learning-simulation.jpg",
    status: "active",
    startDate: "2023-01",
    endDate: null,
    tags: ["Deep Learning", "Medical Imaging", "Segmentation"],
    team: ["Prof. Sijie Niu", "Zhang Wei", "Li Ming"],
    funding: "National Science Foundation",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Weakly Supervised Learning for Remote Sensing",
    description:
      "Novel approaches to hyperspectral image classification using weakly supervised learning with limited labeled data.",
    coverImage: "/utils/machine_learning_robot.jpg",
    status: "active",
    startDate: "2023-06",
    endDate: null,
    tags: ["Remote Sensing", "Weakly Supervised", "Classification"],
    team: ["Prof. Sijie Niu", "Wang Fang", "Chen Jing"],
    funding: "Provincial Research Grant",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Transfer Learning for Cross-Domain Applications",
    description:
      "Exploring transfer learning techniques to improve performance across different domains with minimal adaptation.",
    coverImage: "/utils/dnn_flow.jpg",
    status: "active",
    startDate: "2024-01",
    endDate: null,
    tags: ["Transfer Learning", "Domain Adaptation", "AI"],
    team: ["Prof. Sijie Niu", "Liu Yang", "Zhao Lei"],
    funding: "NSFC Grant",
    isFeatured: true,
  },
  {
    id: "4",
    title: "Computer Vision for Autonomous Systems",
    description:
      "Development of robust computer vision algorithms for autonomous navigation and object detection in complex environments.",
    coverImage: "/utils/dnn.jpg",
    status: "active",
    startDate: "2023-09",
    endDate: null,
    tags: ["Computer Vision", "Autonomous Systems", "Object Detection"],
    team: ["Wu Hua", "Zhou Xin", "Xu Min"],
    funding: "Industry Partnership",
    isFeatured: false,
  },
  {
    id: "5",
    title: "Natural Language Processing for Healthcare",
    description:
      "Applying NLP techniques to extract insights from medical records and improve patient care through automated analysis.",
    coverImage: undefined,
    status: "completed",
    startDate: "2022-03",
    endDate: "2023-12",
    tags: ["NLP", "Healthcare", "Medical Records"],
    team: ["Sun Qiang", "Ma Li", "Gao Ting"],
    funding: "Healthcare Research Fund",
    isFeatured: false,
  },
  // Add more mock projects
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `proj-${i + 6}`,
    title: `Research Project ${i + 6}: Advanced AI and ML Applications`,
    description: `This project explores innovative applications of machine learning and artificial intelligence in solving real-world problems. Focus areas include optimization, pattern recognition, and intelligent systems.`,
    coverImage: i % 2 === 0 ? "/utils/deep-learning-simulation.jpg" : undefined,
    status: i % 3 === 0 ? "completed" : "active",
    startDate: `202${2 + (i % 3)}-${String((i % 12) + 1).padStart(2, "0")}`,
    endDate: i % 3 === 0 ? `202${3 + (i % 3)}-12` : null,
    tags: ["Machine Learning", "AI", "Research"],
    team: [`Researcher ${i + 1}`, `Researcher ${i + 2}`],
    funding: i % 2 === 0 ? "NSFC" : "University Grant",
    isFeatured: false,
  })),
];

const PROJECTS_PER_PAGE = 9;

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Filter projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = project.title.toLowerCase().includes(query);
        const descMatch = project.description.toLowerCase().includes(query);
        const tagsMatch = project.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        if (!titleMatch && !descMatch && !tagsMatch) return false;
      }

      // Status filter
      if (selectedStatus !== "all" && project.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Featured projects
  const featuredProjects = mockProjects.filter((p) => p.isFeatured).slice(0, 3);

  // Stats
  const activeProjects = mockProjects.filter(
    (p) => p.status === "active"
  ).length;
  const completedProjects = mockProjects.filter(
    (p) => p.status === "completed"
  ).length;

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
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary-500/20 rounded-2xl backdrop-blur-sm border border-primary-400/30">
                <Rocket className="w-8 h-8 text-primary-300" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Research <span className="text-secondary-400">Projects</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Explore our cutting-edge research projects in AI, Machine
              Learning, and Computer Vision
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {mockProjects.length}
                </div>
                <div className="text-sm text-gray-300">Total Projects</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {activeProjects}
                </div>
                <div className="text-sm text-gray-300">Active</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {completedProjects}
                </div>
                <div className="text-sm text-gray-300">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Featured Projects
                </h2>
                <p className="text-gray-600">
                  Highlighted research initiatives
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">All Projects</h2>
              <p className="text-gray-600">
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? "project" : "projects"} found
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects..."
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

              {/* Status Filter */}
              <div className="flex gap-2">
                {["all", "active", "completed"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    onClick={() => setSelectedStatus(status)}
                    className={
                      selectedStatus === status
                        ? "bg-primary-600"
                        : "border-gray-300 hover:border-primary-500"
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {paginatedProjects.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
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
              <Rocket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("all");
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

// Project Card Component
function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/research/projects/${project.id}`}>
        <Card
          className={`group relative overflow-hidden bg-white hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 border border-gray-200 hover:border-primary-300 cursor-pointer h-full ${
            featured ? "border-2 border-primary-200" : ""
          }`}
        >
          {/* Cover Image */}
          {project.coverImage && (
            <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 right-4">
                <Badge
                  className={
                    project.status === "active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 text-white"
                  }
                >
                  {project.status === "active" ? "Active" : "Completed"}
                </Badge>
              </div>
            </div>
          )}

          <div className="p-6 space-y-4">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{project.team.length} members</span>
              </div>
              <div className="flex items-center gap-1 text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Details</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
