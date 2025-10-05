"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface PublishToggleProps {
  id: string;
  published: boolean;
  endpoint: string; // e.g., "/api/portfolio/skills"
  onToggle?: (published: boolean) => void;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function PublishToggle({
  id,
  published: initialPublished,
  endpoint,
  onToggle,
  showLabel = true,
  size = "md",
}: PublishToggleProps) {
  const [published, setPublished] = useState(initialPublished);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (newPublished: boolean) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newPublished }),
      });

      if (!response.ok) {
        throw new Error("Failed to update published status");
      }

      setPublished(newPublished);
      onToggle?.(newPublished);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      // Revert on error
      setPublished(!newPublished);
    } finally {
      setIsUpdating(false);
    }
  };

  const sizeClasses = {
    sm: "text-xs gap-1.5",
    md: "text-sm gap-2",
  };

  return (
    <div
      className={`flex items-center ${sizeClasses[size]} ${
        isUpdating ? "opacity-50" : ""
      }`}
    >
      {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
      {!isUpdating && (
        <>
          {published ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </>
      )}
      <Switch
        checked={published}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
      />
      {showLabel && (
        <span
          className={`font-medium ${
            published ? "text-green-600" : "text-gray-500"
          }`}
        >
          {published ? "Published" : "Unpublished"}
        </span>
      )}
    </div>
  );
}
