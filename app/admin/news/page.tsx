"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  Newspaper,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Loader2,
} from "lucide-react";

type NewsArticle = {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  author?: string;
  views: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const result = await res.json();
        setNews(result?.data?.news || []);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const columns: ColumnDef<NewsArticle>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      width: "w-1/3",
      render: (_, article) => (
        <div>
          <div className="font-medium text-gray-900 line-clamp-2">
            {article.title}
          </div>
          {article.excerpt && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
              {article.excerpt}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      width: "w-32",
      render: (category) => {
        const categoryColors = {
          RESEARCH: "bg-blue-100 text-blue-700 border-blue-200",
          ACHIEVEMENT: "bg-green-100 text-green-700 border-green-200",
          EVENT: "bg-purple-100 text-purple-700 border-purple-200",
          ANNOUNCEMENT: "bg-yellow-100 text-yellow-700 border-yellow-200",
        };
        return (
          <Badge
            variant="outline"
            className={`text-xs ${
              categoryColors[String(category) as keyof typeof categoryColors] ||
              ""
            }`}
          >
            {String(category)}
          </Badge>
        );
      },
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
      width: "w-32",
      render: (author) => (
        <div className="text-sm text-gray-700">{String(author || "Admin")}</div>
      ),
    },
    {
      key: "publishedAt",
      label: "Published",
      sortable: true,
      width: "w-32",
      render: (date) =>
        date ? (
          <div className="text-sm flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(String(date)).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-sm text-gray-400">Not published</span>
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
    {
      key: "isPublished",
      label: "Status",
      sortable: true,
      width: "w-24",
      render: (isPublished) => (
        <Badge
          variant={isPublished ? "default" : "secondary"}
          className="text-xs"
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
      } else {
        alert("Failed to delete news article");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete news article");
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
            <Newspaper className="w-6 h-6" />
            News & Announcements
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage lab news and announcements
          </p>
        </div>
        <Link href="/admin/news/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add News
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Articles</div>
          <div className="text-2xl font-bold text-gray-900">{news.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {news.filter((n) => n.isPublished).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Drafts</div>
          <div className="text-2xl font-bold text-yellow-600">
            {news.filter((n) => !n.isPublished).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Views</div>
          <div className="text-2xl font-bold text-blue-600">
            {news.reduce((sum, n) => sum + (n.views || 0), 0)}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={news}
        columns={columns}
        searchPlaceholder="Search news by title, category, author..."
        emptyMessage="No news articles found"
        actions={(article) => (
          <>
            <Link href={`/admin/news/${article.id}/edit`}>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDelete(article.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      />
    </div>
  );
}
