"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProjectForm, {
  ProjectFormValues,
} from "@/components/admin/projects/ProjectForm";

interface ApiProject {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate?: string | null;
  fundingSource?: string | null;
  fundingAmount?: number | null;
  grantNumber?: string | null;
  tags?: string[];
  keywords?: string | null;
  coverImage?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ApiProject | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Failed to load project");
        }
        const payload = await response.json();
        setProject(payload.data as ApiProject);
      } catch (err) {
        console.error("Error loading project", err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const buildInitialValues = (): Partial<ProjectFormValues> | undefined => {
    if (!project) return undefined;

    return {
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate
        ? project.startDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      fundingSource: project.fundingSource ?? "",
      fundingAmount: project.fundingAmount?.toString() ?? "",
      grantNumber: project.grantNumber ?? "",
      tagsText: (project.tags || []).join(", "),
      keywords: project.keywords ?? "",
      coverImage: project.coverImage ?? "",
      isFeatured: project.isFeatured,
      isPublished: project.isPublished,
    } satisfies ProjectFormValues;
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    setSaving(true);
    setError(null);

    try {
      const tags = values.tagsText
        .split(/\r?\n|,/)
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          status: values.status,
          startDate: values.startDate || null,
          endDate: values.endDate || null,
          funding: {
            source: values.fundingSource || null,
            amount: values.fundingAmount
              ? Number.parseFloat(values.fundingAmount)
              : null,
            grantNumber: values.grantNumber || null,
          },
          tags: tags.length ? JSON.stringify(tags) : null,
          keywords: values.keywords || null,
          coverImage: values.coverImage || null,
          isFeatured: values.isFeatured,
          isPublished: values.isPublished,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to update project");
      }

      router.push("/admin/projects");
    } catch (err) {
      console.error("Error updating project", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project? This cannot be undone.")) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to delete project");
      }

      router.push("/admin/projects");
    } catch (err) {
      console.error("Error deleting project", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto rounded-md border border-amber-200 bg-amber-50 px-4 py-6 text-center text-amber-700">
        {error || "Project not found."}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-sm text-gray-600">
          Update project metadata, funding, and publication settings.
        </p>
      </div>

      <ProjectForm
        mode="edit"
        initialValues={buildInitialValues()}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onCancel={() => router.back()}
        saving={saving}
        deleting={deleting}
        error={error}
      />
    </div>
  );
}
