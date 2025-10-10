"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Users,
  Calendar,
  Tag,
  ArrowLeft,
  ExternalLink,
  Building2,
  Award,
  GitBranch,
  CheckCircle2,
  Loader2,
  AlertCircle,
  DollarSign,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

// Project type based on API response
interface ProjectMember {
  id: string;
  role: string;
  user: {
    id: string;
    email: string;
    profile: {
      fullName: string;
      avatar: string | null;
      title: string | null;
      bio: string | null;
    } | null;
  };
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  fundingSource: string | null;
  fundingAmount: number | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  tags: string[];
  gallery: string[];
  publications: string[];
  objectives: string | null;
  methodology: string | null;
  isPublished: boolean;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.id as string;

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/projects/${projectId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch project");
        }

        setProject(data.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 mx-auto text-primary-600 animate-spin" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <h1 className="text-2xl font-bold text-gray-900">
            {error === "Project not found"
              ? "Project Not Found"
              : "Error Loading Project"}
          </h1>
          <p className="text-gray-600">
            {error || "The project you're looking for doesn't exist."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push("/research/projects")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Status badge configuration
  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    ACTIVE: {
      label: "Active",
      color: "bg-green-100 text-green-700 border-green-300",
      icon: CheckCircle2,
    },
    PLANNING: {
      label: "Planning",
      color: "bg-blue-100 text-blue-700 border-blue-300",
      icon: Target,
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-gray-100 text-gray-700 border-gray-300",
      icon: Award,
    },
    ON_HOLD: {
      label: "On Hold",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      icon: Calendar,
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-100 text-red-700 border-red-300",
      icon: AlertCircle,
    },
  };

  const status = statusConfig[project.status] || statusConfig.ACTIVE;
  const StatusIcon = status.icon;

  // Get team leads
  const leads = project.members.filter(
    (m) => m.role === "LEAD" || m.role === "CO_LEAD"
  );
  const researchers = project.members.filter((m) => m.role === "RESEARCHER");

  // Calculate project duration
  const startDate = new Date(project.startDate);
  const endDate = project.endDate ? new Date(project.endDate) : new Date();
  const durationMonths = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/research/projects"
              className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Projects
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 line-clamp-1">{project.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Cover Image */}
      {project.coverImage && (
        <div className="relative h-96 w-full">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-7xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                {project.title}
              </motion.h1>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header (if no cover image) */}
            {!project.coverImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h1>
              </motion.div>
            )}

            {/* Status and Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2">
                <Badge className={`${status.color} border`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
                {project.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-blue-50 border-blue-200"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Overview
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </Card>
            </motion.div>

            {/* Objectives */}
            {project.objectives && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary-600" />
                    Objectives
                  </h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.objectives}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Methodology */}
            {project.methodology && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GitBranch className="w-6 h-6 text-primary-600" />
                    Methodology
                  </h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.methodology}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Publications */}
            {project.publications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary-600" />
                    Publications
                  </h2>
                  <ul className="space-y-2">
                    {project.publications.map((pub, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{pub}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {/* Team Members */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary-600" />
                  Team Members
                </h2>

                {/* Leads */}
                {leads.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Project Leads
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {leads.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                        >
                          {member.user.profile?.avatar ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${member.user.profile.avatar})`,
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                              <Users className="w-6 h-6 text-primary-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {member.user.profile?.fullName ||
                                member.user.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              {member.role === "LEAD"
                                ? "Principal Investigator"
                                : "Co-Lead"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Researchers */}
                {researchers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Research Team
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {researchers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-2 rounded-lg border border-gray-200"
                        >
                          {member.user.profile?.avatar ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${member.user.profile.avatar})`,
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Users className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <p className="text-sm text-gray-900 truncate">
                            {member.user.profile?.fullName || member.user.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 sticky top-8">
                <h3 className="font-bold text-gray-900 mb-4">Project Info</h3>
                <div className="space-y-4">
                  {/* Timeline */}
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Timeline</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {new Date(project.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Present"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {durationMonths} months
                      {project.status === "ACTIVE" && " (Ongoing)"}
                    </p>
                  </div>

                  {/* Funding */}
                  {project.fundingSource && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-medium">Funding</span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {project.fundingSource}
                      </p>
                      {project.fundingAmount && (
                        <p className="text-sm font-semibold text-primary-600 mt-1">
                          ${(project.fundingAmount / 1000000).toFixed(1)}M
                        </p>
                      )}
                    </div>
                  )}

                  {/* Team Size */}
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Team Size</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {project.members.length} member
                      {project.members.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    {project.websiteUrl && (
                      <Button
                        onClick={() =>
                          window.open(project.websiteUrl!, "_blank")
                        }
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Project Website
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        onClick={() =>
                          window.open(project.githubUrl!, "_blank")
                        }
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <GitBranch className="w-4 h-4 mr-2" />
                        View on GitHub
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Gallery */}
            {project.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {project.gallery.map((image, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <Image
                          src={image}
                          alt={`${project.title} - Image ${idx + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
