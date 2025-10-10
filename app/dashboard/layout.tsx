import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import {
  Home,
  FileText,
  FolderOpen,
  User,
  Settings,
  Award,
  LogOut,
  Bell,
} from "lucide-react";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login");
  }

  const navigation = [
    {
      name: "Home",
      href: "/dashboard/home",
      icon: Home,
    },
    {
      name: "My Papers",
      href: "/dashboard/papers",
      icon: FileText,
    },
    {
      name: "My Projects",
      href: "/dashboard/projects",
      icon: FolderOpen,
    },
    {
      name: "Awards",
      href: "/dashboard/awards",
      icon: Award,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">CI</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">My Dashboard</h1>
              <p className="text-xs text-muted-foreground">Researcher Portal</p>
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
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-medium">
                  {user.email?.[0].toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-4 h-4 text-gray-600" />
              </button>
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
