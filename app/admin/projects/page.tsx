"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  FolderOpen,
  Edit,
  Trash2,
  Plus,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  collaborators?: string;
  isPublished: boolean;
  createdAt: string;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const result = await res.json();
        setProjects(result?.data?.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const columns: ColumnDef<Project>[] = [
    {
      key: "title",
      label: "Project Title",
      sortable: true,
      width: "w-1/3",
      render: (_, project) => (
        <div>
          <div className="font-medium text-gray-900 line-clamp-2">
            {project.title}
          </div>
          {project.description && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
              {project.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      width: "w-28",
      render: (status) => {
        const statusColors = {
          ACTIVE: "bg-green-100 text-green-700 border-green-200",
          COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
          PLANNED: "bg-yellow-100 text-yellow-700 border-yellow-200",
          ON_HOLD: "bg-gray-100 text-gray-700 border-gray-200",
        };
        return (
          <Badge
            variant="outline"
            className={`text-xs ${
              statusColors[String(status) as keyof typeof statusColors] || ""
            }`}
          >
            {String(status).replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      width: "w-28",
      render: (date) =>
        date ? (
          <div className="text-sm flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(String(date)).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        ),
    },
    {
      key: "endDate",
      label: "End Date",
      sortable: true,
      width: "w-28",
      render: (date) =>
        date ? (
          <div className="text-sm flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(String(date)).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-sm text-gray-400">Ongoing</span>
        ),
    },
    {
      key: "collaborators",
      label: "Team",
      sortable: false,
      width: "w-24",
      render: (collaborators) => {
        const count = collaborators
          ? JSON.parse(String(collaborators)).length
          : 0;
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-3.5 h-3.5" />
            {count}
          </div>
        );
      },
    },
    {
      key: "isPublished",
      label: "Visibility",
      sortable: true,
      width: "w-24",
      render: (isPublished) => (
        <Badge
          variant={isPublished ? "default" : "secondary"}
          className="text-xs"
        >
          {isPublished ? "Public" : "Private"}
        </Badge>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-6 h-6" />
            Research Projects
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage research projects and collaborations
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Projects</div>
          <div className="text-2xl font-bold text-gray-900">
            {projects.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {projects.filter((p) => p.status === "ACTIVE").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-blue-600">
            {projects.filter((p) => p.status === "COMPLETED").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Public</div>
          <div className="text-2xl font-bold text-purple-600">
            {projects.filter((p) => p.isPublished).length}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={projects}
        columns={columns}
        searchPlaceholder="Search projects by title, description..."
        emptyMessage="No projects found"
        actions={(project) => (
          <>
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDelete(project.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />
    </div>
  );
}
