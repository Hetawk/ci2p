"use client";

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
} from "lucide-react";
import { motion } from "framer-motion";

// Project type
interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  coverImage?: string;
  status: string;
  startDate: string;
  endDate: string | null;
  tags: string[];
  team: Array<{ name: string; role: string; avatar?: string }>;
  funding: string;
  fundingAmount?: string;
  objectives: string[];
  achievements: string[];
  publications?: string[];
  collaborators?: string[];
  githubUrl?: string;
  websiteUrl?: string;
}

// Mock projects data
const mockProjects: Record<string, Project> = {
  "1": {
    id: "1",
    title: "Deep Learning for Medical Image Segmentation",
    description:
      "Advanced deep learning techniques for accurate segmentation of medical images, focusing on retinal imaging and lesion detection.",
    fullDescription: `
This comprehensive research project focuses on developing state-of-the-art deep learning algorithms for automated medical image segmentation, with particular emphasis on retinal imaging and early disease detection.

## Project Overview

Medical image segmentation is a critical component in computer-aided diagnosis systems. Our project aims to develop robust, accurate, and interpretable deep learning models that can assist healthcare professionals in detecting and diagnosing various medical conditions from imaging data.

## Research Methodology

We employ a multi-faceted approach combining:

1. **Novel Architecture Development**: Creating custom neural network architectures optimized for medical imaging tasks
2. **Transfer Learning**: Leveraging pre-trained models and adapting them to medical imaging domains
3. **Data Augmentation**: Developing domain-specific augmentation techniques to improve model robustness
4. **Interpretability**: Implementing attention mechanisms and visualization tools to understand model decisions

## Current Progress

The project is currently in its second year and has achieved several significant milestones. We have successfully developed and validated three novel architectures that outperform existing state-of-the-art methods on multiple benchmark datasets.
    `,
    coverImage: "/utils/deep-learning-simulation.jpg",
    status: "active",
    startDate: "2023-01",
    endDate: null,
    tags: ["Deep Learning", "Medical Imaging", "Segmentation", "AI"],
    team: [
      {
        name: "Prof. Sijie Niu",
        role: "Principal Investigator",
        avatar: "/SJ.jpg",
      },
      { name: "Zhang Wei", role: "PhD Student" },
      { name: "Li Ming", role: "PhD Student" },
      { name: "Wang Fang", role: "Research Assistant" },
    ],
    funding: "National Science Foundation",
    fundingAmount: "$2.5M",
    objectives: [
      "Develop novel deep learning architectures for medical image segmentation",
      "Create large-scale annotated datasets for training and validation",
      "Establish clinical partnerships for real-world validation",
      "Publish research findings in top-tier conferences and journals",
      "Deploy models in clinical settings for practical evaluation",
    ],
    achievements: [
      "Published 5 papers in top-tier conferences (CVPR, MICCAI)",
      "Achieved 95% accuracy on DRIVE retinal vessel segmentation dataset",
      "Established partnerships with 3 major hospitals",
      "Graduated 2 PhD students",
      "Open-sourced code repository with 500+ GitHub stars",
    ],
    publications: [
      "Deep Learning for Retinal Image Segmentation (IEEE TMI 2024)",
      "Attention-Based U-Net for Medical Imaging (CVPR 2024)",
      "Transfer Learning in Medical Image Analysis (MICCAI 2023)",
    ],
    collaborators: [
      "Stanford Medical School",
      "Mayo Clinic",
      "Beijing University Hospital",
    ],
    githubUrl: "https://github.com/ci2plab/medical-segmentation",
    websiteUrl: "#",
  },
  // Add more projects as needed
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.id as string;
  const project = mockProjects[projectId];

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Rocket className="w-16 h-16 mx-auto text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">
            Project Not Found
          </h1>
          <p className="text-gray-600">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.push("/research/projects")}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const isActive = project.status === "active";
  const projectDuration = project.endDate
    ? `${project.startDate} - ${project.endDate}`
    : `${project.startDate} - Present`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Breadcrumb */}
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 overflow-hidden">
        {project.coverImage && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="relative container mx-auto max-w-7xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Status Badge */}
            <Badge
              className={
                isActive ? "bg-green-600 text-white" : "bg-gray-600 text-white"
              }
            >
              {isActive ? "Active Project" : "Completed"}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-200 max-w-3xl">
              {project.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5" />
                <span>{projectDuration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5" />
                <span>{project.team.length} Team Members</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Building2 className="w-5 h-5" />
                <span>{project.funding}</span>
              </div>
              {project.fundingAmount && (
                <div className="flex items-center gap-2 text-secondary-400 font-semibold">
                  <Award className="w-5 h-5" />
                  <span>{project.fundingAmount}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Full Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Project Overview
                </h2>
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                />
              </Card>
            </motion.div>

            {/* Objectives */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <GitBranch className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Research Objectives
                  </h2>
                </div>
                <ul className="space-y-3">
                  {project.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary-600">
                            {idx + 1}
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Key Achievements
                  </h2>
                </div>
                <ul className="space-y-3">
                  {project.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Publications */}
            {project.publications && project.publications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Related Publications
                  </h2>
                  <ul className="space-y-2">
                    {project.publications.map((pub, idx) => (
                      <li
                        key={idx}
                        className="text-gray-700 pl-4 border-l-2 border-primary-200"
                      >
                        {pub}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">
                    Research Areas
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 sticky top-6">
                <h3 className="font-bold text-gray-900 mb-4">Project Links</h3>
                <div className="space-y-3">
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={project.githubUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Code
                      </Link>
                    </Button>
                  )}
                  {project.websiteUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={project.websiteUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Project Website
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Team Members */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Team Members
                  </h4>
                  <div className="space-y-3">
                    {project.team.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {member.avatar ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                            <Image
                              src={member.avatar}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collaborators */}
                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Collaborators
                    </h4>
                    <ul className="space-y-2">
                      {project.collaborators.map((collab, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          {collab}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
