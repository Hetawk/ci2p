"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  Server,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Resource = {
  id: string;
  name: string;
  description?: string;
  type: string;
  location?: string;
  status: string;
  isAvailable: boolean;
  createdAt: string;
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/resources");
        const result = await res.json();
        setResources(result?.data?.resources || []);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const columns: ColumnDef<Resource>[] = [
    {
      key: "name",
      label: "Resource Name",
      sortable: true,
      width: "w-1/3",
      render: (_, resource) => (
        <div>
          <div className="font-medium text-gray-900">{resource.name}</div>
          {resource.description && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
              {resource.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      width: "w-32",
      render: (type) => {
        const typeColors = {
          EQUIPMENT: "bg-blue-100 text-blue-700 border-blue-200",
          SOFTWARE: "bg-purple-100 text-purple-700 border-purple-200",
          FACILITY: "bg-green-100 text-green-700 border-green-200",
          DATASET: "bg-yellow-100 text-yellow-700 border-yellow-200",
        };
        return (
          <Badge
            variant="outline"
            className={`text-xs ${
              typeColors[String(type) as keyof typeof typeColors] || ""
            }`}
          >
            {String(type)}
          </Badge>
        );
      },
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      width: "w-32",
      render: (location) => (
        <div className="text-sm text-gray-700">{String(location || "N/A")}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      width: "w-28",
      render: (status) => {
        const statusColors = {
          OPERATIONAL: "bg-green-100 text-green-700 border-green-200",
          MAINTENANCE: "bg-yellow-100 text-yellow-700 border-yellow-200",
          OUT_OF_SERVICE: "bg-red-100 text-red-700 border-red-200",
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
      key: "isAvailable",
      label: "Availability",
      sortable: true,
      width: "w-28",
      render: (isAvailable) =>
        isAvailable ? (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            Available
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <XCircle className="w-4 h-4" />
            In Use
          </div>
        ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResources(resources.filter((r) => r.id !== id));
      } else {
        alert("Failed to delete resource");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete resource");
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
            <Server className="w-6 h-6" />
            Lab Resources
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage equipment, facilities, and lab resources
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/resources/bookings">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Bookings
            </Button>
          </Link>
          <Link href="/admin/resources/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Resources</div>
          <div className="text-2xl font-bold text-gray-900">
            {resources.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Available</div>
          <div className="text-2xl font-bold text-green-600">
            {resources.filter((r) => r.isAvailable).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">In Use</div>
          <div className="text-2xl font-bold text-blue-600">
            {resources.filter((r) => !r.isAvailable).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Operational</div>
          <div className="text-2xl font-bold text-purple-600">
            {resources.filter((r) => r.status === "OPERATIONAL").length}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={resources}
        columns={columns}
        searchPlaceholder="Search resources by name, type, location..."
        emptyMessage="No resources found"
        actions={(resource) => (
          <>
            <Link href={`/admin/resources/${resource.id}/edit`}>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDelete(resource.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />
    </div>
  );
}
