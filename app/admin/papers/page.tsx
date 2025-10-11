"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  FileText,
  Edit,
  Trash2,
  Plus,
  Star,
  Eye,
  ExternalLink,
  Loader2,
} from "lucide-react";

type Paper = {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  conference?: string;
  year: number;
  publicationType: string;
  doi?: string;
  views: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
};

export default function AdminPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch("/api/papers");
        const result = await res.json();
        setPapers(result?.data?.papers || []);
      } catch (error) {
        console.error("Failed to fetch papers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const columns: ColumnDef<Paper>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      width: "w-1/3",
      render: (_, paper) => (
        <div>
          <div className="font-medium text-gray-900 line-clamp-2">
            {paper.title}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {paper.authors.split(",")[0]}
            {paper.authors.split(",").length > 1 ? ", et al." : ""}
          </div>
        </div>
      ),
    },
    {
      key: "venue",
      label: "Venue",
      sortable: true,
      render: (_, paper) => (
        <div className="text-sm">
          {paper.journal || paper.conference || "N/A"}
        </div>
      ),
    },
    {
      key: "year",
      label: "Year",
      sortable: true,
      width: "w-20",
      render: (year) => (
        <div className="text-sm font-medium">{String(year)}</div>
      ),
    },
    {
      key: "publicationType",
      label: "Type",
      sortable: true,
      width: "w-28",
      render: (type) => (
        <Badge variant="outline" className="text-xs">
          {String(type)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      width: "w-32",
      render: (_, paper) => (
        <div className="flex flex-col gap-1">
          <Badge
            variant={paper.isPublished ? "default" : "secondary"}
            className="text-xs w-fit"
          >
            {paper.isPublished ? "Published" : "Draft"}
          </Badge>
          {paper.isFeatured && (
            <Badge
              variant="outline"
              className="text-xs w-fit border-yellow-500 text-yellow-700"
            >
              <Star className="w-2.5 h-2.5 mr-1 fill-yellow-500" />
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "views",
      label: "Views",
      sortable: true,
      width: "w-20",
      render: (views) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Eye className="w-3.5 h-3.5" />
          {String(views || 0)}
        </div>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this paper?")) return;

    try {
      const res = await fetch(`/api/papers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPapers(papers.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete paper");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete paper");
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
            <FileText className="w-6 h-6" />
            Publications
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage research papers and publications
          </p>
        </div>
        <Link href="/admin/papers/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Publication
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Papers</div>
          <div className="text-2xl font-bold text-gray-900">
            {papers.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {papers.filter((p) => p.isPublished).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Featured</div>
          <div className="text-2xl font-bold text-yellow-600">
            {papers.filter((p) => p.isFeatured).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Views</div>
          <div className="text-2xl font-bold text-blue-600">
            {papers.reduce((sum, p) => sum + (p.views || 0), 0)}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={papers}
        columns={columns}
        searchPlaceholder="Search papers by title, author, venue..."
        emptyMessage="No publications found"
        actions={(paper) => (
          <>
            {paper.doi && (
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
            <Link href={`/admin/papers/${paper.id}/edit`}>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDelete(paper.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />
    </div>
  );
}
