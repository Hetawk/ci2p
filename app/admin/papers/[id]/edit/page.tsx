"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import PaperForm, {
  PaperFormValues,
} from "@/components/admin/papers/PaperForm";

interface ApiPaper {
  id: string;
  title: string;
  abstract: string | null;
  authors: Array<Record<string, unknown>> | string;
  publicationType: string;
  journal?: string | null;
  conference?: string | null;
  year: number;
  month?: number | null;
  doi?: string | null;
  url?: string | null;
  pdfUrl?: string | null;
  customTags?: string | null;
  citations?: number | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export default function EditPaperPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paper, setPaper] = useState<ApiPaper | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`/api/papers/${params.id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Failed to load publication");
        }
        const payload = await response.json();
        setPaper(payload.data as ApiPaper);
      } catch (err) {
        console.error("Error loading publication", err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [params.id]);

  const buildFormValues = (): Partial<PaperFormValues> | undefined => {
    if (!paper) return undefined;

    let authorsText = "";
    if (Array.isArray(paper.authors)) {
      authorsText = paper.authors
        .map((author) => {
          if (author && typeof author === "object") {
            const value = (author as Record<string, unknown>).name;
            if (typeof value === "string") return value;
          }
          if (typeof author === "string") return author;
          return "";
        })
        .filter(Boolean)
        .join(", ");
    } else if (typeof paper.authors === "string") {
      authorsText = paper.authors;
    }

    return {
      title: paper.title,
      abstract: paper.abstract ?? "",
      publicationType: paper.publicationType,
      authorsText,
      journal: paper.journal ?? "",
      conference: paper.conference ?? "",
      year: String(paper.year ?? new Date().getFullYear()),
      month: paper.month ? String(paper.month) : "",
      doi: paper.doi ?? "",
      url: paper.url ?? "",
      pdfUrl: paper.pdfUrl ?? "",
      customTags: paper.customTags ?? "",
      citations: String(paper.citations ?? 0),
      isFeatured: paper.isFeatured,
      isPublished: paper.isPublished,
    } satisfies PaperFormValues;
  };

  const handleSubmit = async (values: PaperFormValues) => {
    setSaving(true);
    setError(null);
    try {
      const authors = values.authorsText
        .split(/\r?\n|,/)
        .map((author) => author.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      if (!authors.length) {
        throw new Error("Please provide at least one author.");
      }

      const response = await fetch(`/api/papers/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: values.title,
          abstract: values.abstract,
          authors,
          publicationType: values.publicationType,
          journal: values.journal || null,
          conference: values.conference || null,
          year: Number(values.year),
          month: values.month ? Number(values.month) : null,
          doi: values.doi || null,
          url: values.url || null,
          pdfUrl: values.pdfUrl || null,
          citations: values.citations ? Number(values.citations) : 0,
          customTags: values.customTags || null,
          isFeatured: values.isFeatured,
          isPublished: values.isPublished,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to update publication");
      }

      router.push("/admin/papers");
    } catch (err) {
      console.error("Error updating publication", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this publication? This cannot be undone.")) return;

    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/papers/${params.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to delete publication");
      }

      router.push("/admin/papers");
    } catch (err) {
      console.error("Error deleting publication", err);
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

  if (!paper) {
    return (
      <div className="max-w-2xl mx-auto rounded-md border border-amber-200 bg-amber-50 px-4 py-6 text-center text-amber-700">
        {error || "Publication not found."}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Publication</h1>
        <p className="text-sm text-gray-600">
          Update metadata and visibility for this research output.
        </p>
      </div>

      <PaperForm
        mode="edit"
        initialValues={buildFormValues()}
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
