import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Server,
  Users,
  Newspaper,
  Settings,
  BarChart3,
  LogOut,
  Home,
} from "lucide-react";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    // Fetch full user data from database
    if (payload?.userId) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
          profile: {
            select: {
              fullName: true,
              avatar: true,
            },
          },
        },
      });

      if (user) {
        return {
          ...payload,
          fullName: user.profile?.fullName,
          avatar: user.profile?.avatar,
        };
      }
    }

    return payload;
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Only SUPER_ADMIN and ADMIN can access admin panel
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    redirect("/login");
  }

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Overview",
      href: "/admin/overview",
      icon: LayoutDashboard,
    },
    {
      name: "Publications",
      href: "/admin/papers",
      icon: FileText,
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: FolderOpen,
    },
    {
      name: "Resources",
      href: "/admin/resources",
      icon: Server,
    },
    {
      name: "Team Members",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "News",
      href: "/admin/news",
      icon: Newspaper,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b">
            <div className="w-8 h-8 relative">
              <Image
                src="/ci2p_logo.png"
                alt="CI2P Lab Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg">CI2P Admin</h1>
              <p className="text-xs text-muted-foreground">Research Lab</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              {"avatar" in user && user.avatar ? (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar}
                    alt={
                      "fullName" in user && user.fullName
                        ? user.fullName
                        : "User"
                    }
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {"fullName" in user && user.fullName
                      ? user.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : user.email?.[0]?.toUpperCase() || "A"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {"fullName" in user && user.fullName
                    ? user.fullName
                    : user.email || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : user.role === "ADMIN"
                    ? "Admin"
                    : user.role}
                </p>
              </div>
            </div>
            <Link
              href="/api/auth/logout"
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
