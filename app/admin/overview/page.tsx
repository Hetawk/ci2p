import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import {
  Users,
  FileText,
  FolderOpen,
  Server,
  Newspaper,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
} from "lucide-react";

// Mark this page as dynamic (not static)
export const dynamic = "force-dynamic";

async function getStats() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const [usersRes, papersRes, projectsRes, resourcesRes, newsRes] =
      await Promise.all([
        fetch(`${baseUrl}/api/users`, { cache: "no-store" }),
        fetch(`${baseUrl}/api/papers`, { cache: "no-store" }),
        fetch(`${baseUrl}/api/projects`, { cache: "no-store" }),
        fetch(`${baseUrl}/api/resources`, { cache: "no-store" }),
        fetch(`${baseUrl}/api/news`, { cache: "no-store" }),
      ]);

    const usersData = await usersRes.json();
    const papersData = await papersRes.json();
    const projectsData = await projectsRes.json();
    const resourcesData = await resourcesRes.json();
    const newsData = await newsRes.json();

    // Extract data from API response structures
    // Users API returns: { users: [...], pagination: {...} }
    // Papers API returns: { success: true, data: { papers: [...], pagination: {...} } }
    // Projects API returns: { success: true, data: { projects: [...], pagination: {...} } }
    // Resources API returns: { success: true, data: { resources: [...], pagination: {...} } }
    // News API returns: { success: true, data: { news: [...], pagination: {...} } }

    return {
      users: usersData.users?.length || 0,
      papers: papersData.data?.papers?.length || 0,
      projects: projectsData.data?.projects?.length || 0,
      resources: resourcesData.data?.resources?.length || 0,
      news: newsData.data?.news?.length || 0,
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return { users: 0, papers: 0, projects: 0, resources: 0, news: 0 };
  }
}

async function getPendingBookings() {
  try {
    // Query database directly instead of HTTP call (server component can't send cookies)
    const bookings = await prisma.resourceBooking.findMany({
      where: {
        status: "PENDING",
      },
      take: 5, // Limit to 5 most recent
      orderBy: {
        startTime: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
        resource: {
          select: {
            name: true,
          },
        },
      },
    });
    return bookings;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
}

async function getRecentActivity() {
  // Mock recent activity - in production, you'd have an activity log
  return [
    {
      id: 1,
      action: "New publication added",
      user: "Prof. Sijie Niu",
      timestamp: "2 hours ago",
      type: "paper",
    },
    {
      id: 2,
      action: "Resource booking approved",
      user: "Zhang Mengjiao",
      timestamp: "5 hours ago",
      type: "booking",
    },
    {
      id: 3,
      action: "Project status updated",
      user: "Xu Muhao",
      timestamp: "1 day ago",
      type: "project",
    },
    {
      id: 4,
      action: "New team member added",
      user: "Admin",
      timestamp: "2 days ago",
      type: "user",
    },
  ];
}

async function StatsCards() {
  const stats = await getStats();

  const cards = [
    {
      title: "Team Members",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Publications",
      value: stats.papers,
      icon: FileText,
      href: "/admin/papers",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      href: "/admin/projects",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Resources",
      value: stats.resources,
      icon: Server,
      href: "/admin/resources",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "News Articles",
      value: stats.news,
      icon: Newspaper,
      href: "/admin/news",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  View all {card.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

async function PendingBookings() {
  const bookings = await getPendingBookings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Resource Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending bookings</p>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {booking.resource?.name || "Resource"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.user?.profile?.fullName || "Unknown User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(booking.startTime).toLocaleDateString()} -{" "}
                    {new Date(booking.endTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {bookings.length > 5 && (
              <Link href="/admin/resources">
                <Button variant="outline" className="w-full">
                  View All Bookings ({bookings.length})
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function RecentActivity() {
  const activities = await getRecentActivity();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-1">
                {activity.type === "paper" && (
                  <FileText className="h-4 w-4 text-green-600" />
                )}
                {activity.type === "booking" && (
                  <Clock className="h-4 w-4 text-orange-600" />
                )}
                {activity.type === "project" && (
                  <FolderOpen className="h-4 w-4 text-purple-600" />
                )}
                {activity.type === "user" && (
                  <Users className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  by {activity.user} • {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    {
      title: "Add Publication",
      href: "/admin/papers/new",
      icon: FileText,
      description: "Create a new research paper",
    },
    {
      title: "Add Project",
      href: "/admin/projects/new",
      icon: FolderOpen,
      description: "Start a new research project",
    },
    {
      title: "Add Resource",
      href: "/admin/resources/new",
      icon: Server,
      description: "Add lab equipment or resource",
    },
    {
      title: "Add Team Member",
      href: "/admin/users/new",
      icon: Users,
      description: "Invite a new team member",
    },
    {
      title: "Publish News",
      href: "/admin/news/new",
      icon: Newspaper,
      description: "Create a news article",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 hover:bg-muted"
                >
                  <div className="flex items-start gap-3 text-left">
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back, Professor Niu! Here&apos;s what&apos;s happening in CI2P
          Research Lab.
        </p>
      </div>

      <Suspense fallback={<div>Loading statistics...</div>}>
        <StatsCards />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<div>Loading bookings...</div>}>
          <PendingBookings />
        </Suspense>

        <Suspense fallback={<div>Loading activity...</div>}>
          <RecentActivity />
        </Suspense>
      </div>

      <QuickActions />
    </div>
  );
}
