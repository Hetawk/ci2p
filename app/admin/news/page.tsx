import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";

// Mark this page as dynamic (not static)
export const dynamic = "force-dynamic";

async function getNews() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }
    const result = await res.json();
    // Extract news array from nested data structure
    return result?.data?.news || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

function NewsCard({
  article,
}: {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    publishedAt?: string;
    isPublished: boolean;
    isFeatured: boolean;
    views: number;
    author: { profile: { fullName: string } };
    createdAt: string;
    tags?: string;
  };
}) {
  const tags = article.tags ? JSON.parse(article.tags) : [];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={article.isPublished ? "default" : "secondary"}>
                {article.isPublished ? "Published" : "Draft"}
              </Badge>
              {article.isFeatured && (
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-700"
                >
                  Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">
              {article.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              By {article.author.profile.fullName}
            </p>
            {article.excerpt && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {article.excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/news/${article.id}/edit`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="sm" variant="destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.views} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : "Not published"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>
          <Link href={`/news/${article.slug}`} target="_blank">
            <Button size="sm" variant="ghost">
              View Public
            </Button>
          </Link>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 5).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function NewsList() {
  const news = await getNews();

  return (
    <div className="space-y-4">
      {news.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No news articles yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by publishing your first news article.
            </p>
            <Link href="/admin/news/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add News Article
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        news.map(
          (article: {
            id: string;
            title: string;
            slug: string;
            excerpt?: string;
            content: string;
            publishedAt?: string;
            isPublished: boolean;
            isFeatured: boolean;
            views: number;
            author: { profile: { fullName: string } };
            createdAt: string;
            tags?: string;
          }) => <NewsCard key={article.id} article={article} />
        )
      )}
    </div>
  );
}

export default function AdminNewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News & Updates</h1>
          <p className="text-muted-foreground">
            Manage lab news, announcements, and blog posts
          </p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add News Article
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          All Articles
        </Button>
        <Button variant="ghost" size="sm">
          Published
        </Button>
        <Button variant="ghost" size="sm">
          Drafts
        </Button>
        <Button variant="ghost" size="sm">
          Featured
        </Button>
      </div>

      <Suspense fallback={<div>Loading news...</div>}>
        <NewsList />
      </Suspense>
    </div>
  );
}
