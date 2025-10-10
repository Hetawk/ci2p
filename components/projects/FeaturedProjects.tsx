"use client";

// Reusable Featured Projects Section
// Used in: Homepage, Projects page

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Project } from "@/lib/types";

interface FeaturedProjectsProps {
  projects: Project[];
  title?: string;
  showViewAll?: boolean;
}

export function FeaturedProjects({
  projects,
  title = "Featured Projects",
  showViewAll = true,
}: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-2">
              Cutting-edge research projects pushing the boundaries of AI
            </p>
          </div>

          {showViewAll && (
            <Button variant="outline" asChild>
              <Link href="/research/projects">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const tags = project.tags ? JSON.parse(project.tags as string) : [];
            const memberCount =
              project._count?.members || project.members?.length || 0;

            return (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Project Cover */}
                {project.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Status Badge */}
                    <Badge className="absolute top-4 right-4 bg-white/90 text-gray-900">
                      {project.status}
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <Link
                    href={`/research/projects/${project.slug}`}
                    className="group"
                  >
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                  </Link>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-gray-600 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 3).map((tag: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t pt-4">
                  {/* Team Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {memberCount} {memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.startDate).getFullYear()}</span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
