"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaperForm, {
  PaperFormValues,
} from "@/components/admin/papers/PaperForm";

export default function CreatePaperPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError("Please provide at least one author.");
        setSaving(false);
        return;
      }

      const response = await fetch("/api/papers", {
        method: "POST",
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
        throw new Error(payload?.error || "Failed to create publication");
      }

      router.push("/admin/papers");
    } catch (err) {
      console.error("Error creating publication", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Publication
        </h1>
        <p className="text-sm text-gray-600">
          Add a new research paper or publication to the CI2P database.
        </p>
      </div>

      <PaperForm
        mode="create"
        saving={saving}
        error={error}
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
