import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Edit,
  Trash2,
  Plus,
  Star,
  Eye,
  Calendar,
  ExternalLink,
} from "lucide-react";

// Mark this page as dynamic (not static)
export const dynamic = "force-dynamic";

async function getPublications() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/papers`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch publications");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching publications:", error);
    return [];
  }
}

function PublicationCard({
  paper,
}: {
  paper: {
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
    tags?: string;
  };
}) {
  const venue = paper.journal || paper.conference || "Unknown Venue";
  const tags = paper.tags ? JSON.parse(paper.tags) : [];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={paper.isPublished ? "default" : "secondary"}>
                {paper.isPublished ? "Published" : "Draft"}
              </Badge>
              {paper.isFeatured && (
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-700"
                >
                  <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                  Featured
                </Badge>
              )}
              <Badge variant="outline">{paper.publicationType}</Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              {paper.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {paper.authors}
            </p>
            <p className="text-sm text-muted-foreground">
              {venue} • {paper.year}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/papers/${paper.id}/edit`}>
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
              {paper.views} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(paper.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {paper.doi && (
              <Link href={`https://doi.org/${paper.doi}`} target="_blank">
                <Button size="sm" variant="ghost">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  DOI
                </Button>
              </Link>
            )}
            <Link href={`/papers/${paper.id}`} target="_blank">
              <Button size="sm" variant="ghost">
                View Public
              </Button>
            </Link>
          </div>
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

async function PublicationsList() {
  const papers = await getPublications();

  return (
    <div className="space-y-4">
      {papers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No publications yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first research paper.
            </p>
            <Link href="/admin/papers/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Publication
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        papers.map(
          (paper: {
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
            tags?: string;
          }) => <PublicationCard key={paper.id} paper={paper} />
        )
      )}
    </div>
  );
}

export default function AdminPapersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
          <p className="text-muted-foreground">
            Manage research papers, articles, and conference proceedings
          </p>
        </div>
        <Link href="/admin/papers/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Publication
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          All Papers
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

      <Suspense fallback={<div>Loading publications...</div>}>
        <PublicationsList />
      </Suspense>
    </div>
  );
}
