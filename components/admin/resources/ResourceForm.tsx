"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export type ResourceFormMode = "create" | "edit";

export interface ResourceFormValues {
  name: string;
  description: string;
  type: string;
  location: string;
  capacity: string;
  status: string;
  isBookable: boolean;
  isPublished: boolean;
  modelNumber: string;
  manufacturer: string;
  purchaseDate: string;
  imageUrl: string;
  manualUrl: string;
}

interface ResourceFormProps {
  mode: ResourceFormMode;
  initialValues?: Partial<ResourceFormValues>;
  onSubmit: (values: ResourceFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void>;
  onCancel?: () => void;
  saving: boolean;
  deleting?: boolean;
  error?: string | null;
}

const RESOURCE_TYPES = [
  "COMPUTER",
  "GPU",
  "SOFTWARE",
  "LAB_EQUIPMENT",
  "MEETING_ROOM",
  "DATASET",
  "OTHER",
];

const RESOURCE_STATUSES = [
  "AVAILABLE",
  "IN_USE",
  "MAINTENANCE",
  "RESERVED",
  "RETIRED",
];

const DEFAULT_VALUES: ResourceFormValues = {
  name: "",
  description: "",
  type: "COMPUTER",
  location: "",
  capacity: "",
  status: "AVAILABLE",
  isBookable: true,
  isPublished: true,
  modelNumber: "",
  manufacturer: "",
  purchaseDate: "",
  imageUrl: "",
  manualUrl: "",
};

export function ResourceForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
  onCancel,
  saving,
  deleting = false,
  error,
}: ResourceFormProps) {
  const [values, setValues] = useState<ResourceFormValues>(() => ({
    ...DEFAULT_VALUES,
    ...initialValues,
  }));

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = <K extends keyof ResourceFormValues>(
    key: K,
    value: ResourceFormValues[K]
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
      <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Resource Details
          </h2>
          <p className="text-sm text-gray-500">
            Describe the resource and configure its availability to lab members.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input
              required
              value={values.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="High-Performance GPU Workstation"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              required
              rows={4}
              value={values.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              placeholder="Provide key details, capabilities, and usage notes."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={values.type}
              onChange={(event) => handleChange("type", event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={values.status}
              onChange={(event) => handleChange("status", event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {RESOURCE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <Input
              value={values.location}
              onChange={(event) => handleChange("location", event.target.value)}
              placeholder="CI2P Lab, Room 401"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Capacity (optional)
            </label>
            <Input
              type="number"
              min={0}
              value={values.capacity}
              onChange={(event) => handleChange("capacity", event.target.value)}
              placeholder="Number of seats available"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Model Number
            </label>
            <Input
              value={values.modelNumber}
              onChange={(event) =>
                handleChange("modelNumber", event.target.value)
              }
              placeholder="RTX-8000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Manufacturer
            </label>
            <Input
              value={values.manufacturer}
              onChange={(event) =>
                handleChange("manufacturer", event.target.value)
              }
              placeholder="NVIDIA"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <Input
              type="date"
              value={values.purchaseDate}
              onChange={(event) =>
                handleChange("purchaseDate", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Image URL
            </label>
            <Input
              value={values.imageUrl}
              onChange={(event) => handleChange("imageUrl", event.target.value)}
              placeholder="https://assets.ci2p.org/resources/gpu.jpg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Manual URL
            </label>
            <Input
              value={values.manualUrl}
              onChange={(event) =>
                handleChange("manualUrl", event.target.value)
              }
              placeholder="https://assets.ci2p.org/resources/gpu-manual.pdf"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <Switch
              checked={values.isBookable}
              onCheckedChange={(checked) => handleChange("isBookable", checked)}
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Allow bookings
              </div>
              <p className="text-xs text-gray-500">
                Enables scheduling for this resource through the booking system.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={values.isPublished}
              onCheckedChange={(checked) =>
                handleChange("isPublished", checked)
              }
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Visible in listings
              </div>
              <p className="text-xs text-gray-500">
                Hide a resource temporarily without removing it from the
                database.
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
            variant="outline"
            className="border border-red-500 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
            disabled={deleting || saving}
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Removing
              </span>
            ) : (
              "Delete Resource"
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
                <Loader2 className="h-4 w-4 animate-spin" /> Saving
              </span>
            ) : mode === "edit" ? (
              "Save Changes"
            ) : (
              "Create Resource"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ResourceForm;
