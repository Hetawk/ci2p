// CI2P Research Lab - Homepage
// University of Jinan - Key Laboratory of Intelligent Computing Technology

import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedPapers } from "@/components/papers/FeaturedPapers";
import { FeaturedProjects } from "@/components/projects/FeaturedProjects";
import { ResearchAreas } from "@/components/sections/ResearchAreas";
import { LabMetrics } from "@/components/sections/LabMetrics";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

// Revalidate every hour
export const revalidate = 3600;

async function getHomePageData() {
  try {
    // Fetch all data in parallel
    const [
      teamMembers,
      stats,
      featuredPapers,
      featuredProjects,
      totalCitations,
    ] = await Promise.all([
      // Team members for hero carousel
      prisma.profile.findMany({
        where: {
          showInTeam: true,
          user: { active: true },
        },
        select: {
          id: true,
          fullName: true,
          title: true,
          avatar: true,
          teamOrder: true,
        },
        orderBy: { teamOrder: "asc" },
        take: 5,
      }),

      // Get basic stats
      Promise.all([
        prisma.publication.count({ where: { isPublished: true } }),
        prisma.project.count({
          where: { status: "ACTIVE", isPublished: true },
        }),
        prisma.user.count({ where: { active: true } }),
      ]).then(([publications, projects, members]) => ({
        publications,
        projects,
        members,
      })),

      // Featured publications
      prisma.publication.findMany({
        where: {
          isFeatured: true,
          isPublished: true,
        },
        include: {
          author: {
            select: {
              id: true,
              profile: {
                select: {
                  fullName: true,
                  orcidId: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { featuredOrder: "asc" },
        take: 6,
      }),

      // Featured projects
      prisma.project.findMany({
        where: {
          isFeatured: true,
          isPublished: true,
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  profile: {
                    select: {
                      fullName: true,
                      avatar: true,
                      title: true,
                    },
                  },
                },
              },
            },
            take: 3,
          },
          _count: {
            select: { members: true },
          },
        },
        orderBy: { featuredOrder: "asc" },
        take: 3,
      }),

      // Total citations
      prisma.publication
        .aggregate({
          where: { isPublished: true },
          _sum: { citations: true },
        })
        .then((result) => result._sum.citations || 0),
    ]);

    return {
      teamMembers,
      stats: {
        ...stats,
        citations: totalCitations,
      },
      featuredPapers,
      featuredProjects,
    };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    // Return empty data on error
    return {
      teamMembers: [],
      stats: { publications: 0, projects: 0, members: 0, citations: 0 },
      featuredPapers: [],
      featuredProjects: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <main className="min-h-screen">
      {/* Hero Section with Video Background */}
      <HeroSection teamMembers={data.teamMembers} stats={data.stats} />

      {/* Research Areas */}
      <ResearchAreas />

      {/* Lab Impact Metrics */}
      <LabMetrics
        publications={data.stats.publications}
        members={data.stats.members}
        projects={data.stats.projects}
        citations={data.stats.citations}
      />

      {/* Featured Publications */}
      {data.featuredPapers.length > 0 && (
        <FeaturedPapers papers={data.featuredPapers} />
      )}

      {/* Featured Projects */}
      {data.featuredProjects.length > 0 && (
        <FeaturedProjects projects={data.featuredProjects} />
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
