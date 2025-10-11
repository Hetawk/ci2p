import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Users, FileText, FolderOpen } from "lucide-react";

// Mark this page as dynamic (not static)
export const dynamic = "force-dynamic";

async function getAnalytics() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const [usersRes, papersRes, projectsRes, newsRes] = await Promise.all([
      fetch(`${baseUrl}/api/users`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/papers`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/projects`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/news`, { cache: "no-store" }),
    ]);

    const usersData = await usersRes.json();
    const papersData = await papersRes.json();
    const projectsData = await projectsRes.json();
    const newsData = await newsRes.json();

    // Extract arrays from nested data structures
    const users = usersData.users || [];
    const papers = papersData?.data?.papers || [];
    const projects = projectsData?.data?.projects || [];
    const news = newsData?.data?.news || [];

    // Calculate total views
    const paperViews = papers.reduce(
      (sum: number, p: { views: number }) => sum + (p.views || 0),
      0
    );
    const newsViews = news.reduce(
      (sum: number, n: { views: number }) => sum + (n.views || 0),
      0
    );

    return {
      totalUsers: users.length || 0,
      totalPapers: papers.length || 0,
      totalProjects: projects.length || 0,
      totalNews: news.length || 0,
      totalViews: paperViews + newsViews,
      topPapers: papers
        .sort(
          (a: { views: number }, b: { views: number }) =>
            (b.views || 0) - (a.views || 0)
        )
        .slice(0, 5),
      topNews: news
        .sort(
          (a: { views: number }, b: { views: number }) =>
            (b.views || 0) - (a.views || 0)
        )
        .slice(0, 5),
    };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return {
      totalUsers: 0,
      totalPapers: 0,
      totalProjects: 0,
      totalNews: 0,
      totalViews: 0,
      topPapers: [],
      topNews: [],
    };
  }
}

async function AnalyticsDashboard() {
  const analytics = await getAnalytics();

  const stats = [
    {
      title: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      trend: "+12% from last month",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Team Members",
      value: analytics.totalUsers,
      icon: Users,
      trend: "Active researchers",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Publications",
      value: analytics.totalPapers,
      icon: FileText,
      trend: "Research outputs",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Projects",
      value: analytics.totalProjects,
      icon: FolderOpen,
      trend: "Ongoing research",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Viewed Publications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topPapers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No publication data yet
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.topPapers.map(
                  (
                    paper: { id: string; title: string; views: number },
                    index: number
                  ) => (
                    <div key={paper.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {paper.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {paper.views} views
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Viewed News
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topNews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No news data yet</p>
            ) : (
              <div className="space-y-4">
                {analytics.topNews.map(
                  (
                    article: { id: string; title: string; views: number },
                    index: number
                  ) => (
                    <div key={article.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views} views
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track lab performance, views, and engagement metrics
        </p>
      </div>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}
