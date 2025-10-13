"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ResourceForm, {
  type ResourceFormValues,
} from "@/components/admin/resources/ResourceForm";
import { Button } from "@/components/ui/button";
import { Server } from "lucide-react";

export default function AdminCreateResourcePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ResourceFormValues) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          type: values.type,
          status: values.status,
          location: values.location || null,
          capacity: values.capacity ? Number(values.capacity) : null,
          isBookable: values.isBookable,
          isPublished: values.isPublished,
          modelNumber: values.modelNumber || null,
          manufacturer: values.manufacturer || null,
          purchaseDate: values.purchaseDate || null,
          imageUrl: values.imageUrl || null,
          manualUrl: values.manualUrl || null,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to create resource");
      }

      router.push("/admin/resources");
    } catch (err) {
      console.error("Error creating resource", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Server className="h-6 w-6" />
            Add Resource
          </h1>
          <p className="text-sm text-gray-600">
            Register equipment, facilities, or software for lab members to use.
          </p>
        </div>
        <Link href="/admin/resources">
          <Button variant="outline" className="border border-gray-300">
            Cancel
          </Button>
        </Link>
      </div>

      <ResourceForm
        mode="create"
        saving={saving}
        error={error}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/resources")}
      />
    </div>
  );
}
