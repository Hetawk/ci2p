"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export type ProjectFormMode = "create" | "edit";

export interface ProjectFormValues {
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  fundingSource: string;
  fundingAmount: string;
  grantNumber: string;
  tagsText: string;
  coverImage: string;
  keywords: string;
  isFeatured: boolean;
  isPublished: boolean;
}

interface ProjectFormProps {
  mode: ProjectFormMode;
  initialValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void>;
  onCancel?: () => void;
  saving: boolean;
  deleting?: boolean;
  error?: string | null;
}

const STATUS_OPTIONS = [
  "PLANNING",
  "ACTIVE",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
];

const DEFAULT_VALUES: ProjectFormValues = {
  title: "",
  description: "",
  status: "ACTIVE",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  fundingSource: "",
  fundingAmount: "",
  grantNumber: "",
  tagsText: "",
  coverImage: "",
  keywords: "",
  isFeatured: false,
  isPublished: true,
};

export function ProjectForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
  onCancel,
  saving,
  deleting = false,
  error,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(() => ({
    ...DEFAULT_VALUES,
    ...initialValues,
  }));

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = <K extends keyof ProjectFormValues>(
    key: K,
    value: ProjectFormValues[K]
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Project Info</h2>
          <p className="text-sm text-gray-500">
            Document the core details about this research project.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Project Title
            </label>
            <Input
              required
              value={values.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="Trusted AI for Medical Imaging"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              required
              rows={6}
              value={values.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              placeholder="Describe the project scope, goals, and expected outcomes..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={values.status}
              onChange={(event) => handleChange("status", event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Start Date
            </label>
            <Input
              type="date"
              value={values.startDate}
              onChange={(event) =>
                handleChange("startDate", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              End Date (optional)
            </label>
            <Input
              type="date"
              value={values.endDate}
              onChange={(event) => handleChange("endDate", event.target.value)}
            />
            <p className="text-xs text-gray-500">
              Leave blank for ongoing projects.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Funding Source
            </label>
            <Input
              value={values.fundingSource}
              onChange={(event) =>
                handleChange("fundingSource", event.target.value)
              }
              placeholder="National Natural Science Foundation of China"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Funding Amount (RMB)
            </label>
            <Input
              type="number"
              min="0"
              value={values.fundingAmount}
              onChange={(event) =>
                handleChange("fundingAmount", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Grant Number
            </label>
            <Input
              value={values.grantNumber}
              onChange={(event) =>
                handleChange("grantNumber", event.target.value)
              }
              placeholder="62076093"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <Input
              value={values.tagsText}
              onChange={(event) => handleChange("tagsText", event.target.value)}
              placeholder="medical imaging, trustworthy AI, explainability"
            />
            <p className="text-xs text-gray-500">
              Tags are used for filtering and search. Separate with commas.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Keywords (optional)
            </label>
            <Input
              value={values.keywords}
              onChange={(event) => handleChange("keywords", event.target.value)}
              placeholder="AI safety, anomaly detection"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <Input
              value={values.coverImage}
              onChange={(event) =>
                handleChange("coverImage", event.target.value)
              }
              placeholder="https://assets.ci2p.org/projects/project-cover.jpg"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Visibility</h2>
          <p className="text-sm text-gray-500">
            Decide how this project appears on the public site.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <Switch
              checked={values.isPublished}
              onCheckedChange={(checked) =>
                handleChange("isPublished", checked)
              }
            />
            <div>
              <div className="text-sm font-medium text-gray-900">Published</div>
              <p className="text-xs text-gray-500">
                Keep unpublished projects private to the admin panel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={values.isFeatured}
              onCheckedChange={(checked) => handleChange("isFeatured", checked)}
            />
            <div>
              <div className="text-sm font-medium text-gray-900">Featured</div>
              <p className="text-xs text-gray-500">
                Featured projects appear in hero sections and highlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        {mode === "edit" && onDelete ? (
          <Button
            type="button"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
            disabled={deleting || saving}
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete Project"
            )}
          </Button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onCancel?.()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving
              </span>
            ) : mode === "edit" ? (
              "Save Changes"
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ProjectForm;
