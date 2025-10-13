"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectForm, {
  ProjectFormValues,
} from "@/components/admin/projects/ProjectForm";

export default function CreateProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ProjectFormValues) => {
    setSaving(true);
    setError(null);

    try {
      const tags = values.tagsText
        .split(/\r?\n|,/)
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await fetch("/api/projects", {
        method: "POST",
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
        throw new Error(payload?.error || "Failed to create project");
      }

      router.push("/admin/projects");
    } catch (err) {
      console.error("Error creating project", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Project</h1>
        <p className="text-sm text-gray-600">
          Register a new research initiative for the CI2P team.
        </p>
      </div>

      <ProjectForm
        mode="create"
        saving={saving}
        error={error}
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
