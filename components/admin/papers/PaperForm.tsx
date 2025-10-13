"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export type PaperFormMode = "create" | "edit";

export interface PaperFormValues {
  title: string;
  abstract: string;
  publicationType: string;
  authorsText: string;
  journal: string;
  conference: string;
  year: string;
  month: string;
  doi: string;
  url: string;
  pdfUrl: string;
  customTags: string;
  citations: string;
  isFeatured: boolean;
  isPublished: boolean;
}

interface PaperFormProps {
  mode: PaperFormMode;
  initialValues?: Partial<PaperFormValues>;
  onSubmit: (values: PaperFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void>;
  onCancel?: () => void;
  saving: boolean;
  deleting?: boolean;
  error?: string | null;
}

const PUBLICATION_TYPES = [
  "JOURNAL_ARTICLE",
  "CONFERENCE_PAPER",
  "BOOK_CHAPTER",
  "BOOK",
  "PATENT",
  "THESIS",
  "PREPRINT",
  "TECHNICAL_REPORT",
  "POSTER",
  "OTHER",
];

const MONTH_OPTIONS = [
  { value: "", label: "Unknown" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DEFAULT_VALUES: PaperFormValues = {
  title: "",
  abstract: "",
  publicationType: "JOURNAL_ARTICLE",
  authorsText: "",
  journal: "",
  conference: "",
  year: new Date().getFullYear().toString(),
  month: "",
  doi: "",
  url: "",
  pdfUrl: "",
  customTags: "",
  citations: "0",
  isFeatured: false,
  isPublished: true,
};

export function PaperForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
  onCancel,
  saving,
  deleting = false,
  error,
}: PaperFormProps) {
  const [values, setValues] = useState<PaperFormValues>(() => ({
    ...DEFAULT_VALUES,
    ...initialValues,
  }));

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 70 }, (_, index) =>
      (currentYear - index).toString()
    );
  }, []);

  const handleChange = <K extends keyof PaperFormValues>(
    key: K,
    value: PaperFormValues[K]
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
      <div className="space-y-6">
        <section className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Publication Details
            </h2>
            <p className="text-sm text-gray-500">
              Provide the essential information for this publication. Authors
              can be entered as a comma or newline separated list.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                required
                value={values.title}
                onChange={(event) => handleChange("title", event.target.value)}
                placeholder="Deep Learning for Medical Imaging"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Abstract
              </label>
              <Textarea
                required
                value={values.abstract}
                onChange={(event) =>
                  handleChange("abstract", event.target.value)
                }
                rows={6}
                placeholder="Summarize the publication in a few paragraphs..."
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Authors
              </label>
              <Textarea
                required
                value={values.authorsText}
                onChange={(event) =>
                  handleChange("authorsText", event.target.value)
                }
                rows={4}
                placeholder={"Sijie Niu, Dinggang Shen\nEnoch Dongbo"}
              />
              <p className="text-xs text-gray-500">
                Separate authors with commas or new lines. Additional metadata
                like affiliations can be handled after saving.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Publication Type
              </label>
              <select
                value={values.publicationType}
                onChange={(event) =>
                  handleChange(
                    "publicationType",
                    event.target.value as PaperFormValues["publicationType"]
                  )
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {PUBLICATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Journal / Venue
              </label>
              <Input
                value={values.journal}
                onChange={(event) =>
                  handleChange("journal", event.target.value)
                }
                placeholder="IEEE Transactions on Medical Imaging"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Conference (optional)
              </label>
              <Input
                value={values.conference}
                onChange={(event) =>
                  handleChange("conference", event.target.value)
                }
                placeholder="CVPR 2025"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <select
                required
                value={values.year}
                onChange={(event) => handleChange("year", event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Month</label>
              <select
                value={values.month}
                onChange={(event) => handleChange("month", event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {MONTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">DOI</label>
              <Input
                value={values.doi}
                onChange={(event) => handleChange("doi", event.target.value)}
                placeholder="10.1109/TNNLS.2022.3167188"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Article URL
              </label>
              <Input
                value={values.url}
                onChange={(event) => handleChange("url", event.target.value)}
                placeholder="https://doi.org/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                PDF URL
              </label>
              <Input
                value={values.pdfUrl}
                onChange={(event) => handleChange("pdfUrl", event.target.value)}
                placeholder="https://assets.ci2p.org/papers/...pdf"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Citations
              </label>
              <Input
                type="number"
                min={0}
                value={values.citations}
                onChange={(event) =>
                  handleChange("citations", event.target.value)
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Custom Tags (comma separated)
              </label>
              <Input
                value={values.customTags}
                onChange={(event) =>
                  handleChange("customTags", event.target.value)
                }
                placeholder="medical imaging, deep learning"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Publication Visibility
            </h2>
            <p className="text-sm text-gray-500">
              Control how this publication is displayed across the site.
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
                <div className="text-sm font-medium text-gray-900">
                  Published
                </div>
                <p className="text-xs text-gray-500">
                  Unpublished items stay private within the dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={values.isFeatured}
                onCheckedChange={(checked) =>
                  handleChange("isFeatured", checked)
                }
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Featured
                </div>
                <p className="text-xs text-gray-500">
                  Featured works appear in highlighted sections.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

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
              "Delete Publication"
            )}
          </Button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="border border-gray-300"
            onClick={() => onCancel?.()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="border border-blue-600"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving
              </span>
            ) : mode === "edit" ? (
              "Save Changes"
            ) : (
              "Create Publication"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default PaperForm;
