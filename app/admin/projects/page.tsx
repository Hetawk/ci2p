import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderOpen,
  Edit,
  Trash2,
  Plus,
  Star,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";

// Mark this page as dynamic (not static)
export const dynamic = "force-dynamic";

async function getProjects() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/projects`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch projects");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

function ProjectCard({
  project,
}: {
  project: {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: string;
    startDate: string;
    endDate?: string;
    fundingSource?: string;
    fundingAmount?: number;
    isFeatured: boolean;
    isPublished: boolean;
    members?: {
      id: string;
      role: string;
      user: { profile: { fullName: string } };
    }[];
    tags?: string;
  };
}) {
  const tags = project.tags ? JSON.parse(project.tags) : [];
  const memberCount = project.members?.length || 0;

  const statusColors = {
    PLANNING: "bg-gray-500",
    ACTIVE: "bg-green-500",
    ON_HOLD: "bg-yellow-500",
    COMPLETED: "bg-blue-500",
    CANCELLED: "bg-red-500",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={`${
                  statusColors[project.status as keyof typeof statusColors] ||
                  "bg-gray-500"
                } text-white border-none`}
              >
                {project.status}
              </Badge>
              {project.isFeatured && (
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-700"
                >
                  <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                  Featured
                </Badge>
              )}
              <Badge variant={project.isPublished ? "default" : "secondary"}>
                {project.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              {project.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="sm" variant="destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(project.startDate).getFullYear()} -{" "}
              {project.endDate
                ? new Date(project.endDate).getFullYear()
                : "Present"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{memberCount} team members</span>
          </div>
          {project.fundingSource && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                <DollarSign className="w-4 h-4" />
                <span className="truncate">
                  {project.fundingSource}
                  {project.fundingAmount &&
                    ` • ¥${project.fundingAmount.toLocaleString()}`}
                </span>
              </div>
            </>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 5).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 5} more
              </Badge>
            )}
          </div>
        )}
        <div className="flex justify-end mt-4">
          <Link href={`/research/projects/${project.slug}`} target="_blank">
            <Button size="sm" variant="ghost">
              View Public Page
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

async function ProjectsList() {
  const projects = await getProjects();

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by creating your first research project.
            </p>
            <Link href="/admin/projects/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        projects.map(
          (project: {
            id: string;
            title: string;
            slug: string;
            description: string;
            status: string;
            startDate: string;
            endDate?: string;
            fundingSource?: string;
            fundingAmount?: number;
            isFeatured: boolean;
            isPublished: boolean;
            members?: {
              id: string;
              role: string;
              user: { profile: { fullName: string } };
            }[];
            tags?: string;
          }) => <ProjectCard key={project.id} project={project} />
        )
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage research projects, funding, and team members
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          All Projects
        </Button>
        <Button variant="ghost" size="sm">
          Active
        </Button>
        <Button variant="ghost" size="sm">
          Completed
        </Button>
        <Button variant="ghost" size="sm">
          Featured
        </Button>
      </div>

      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}
