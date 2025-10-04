import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Award,
  Briefcase,
  Sparkles,
  Languages,
  Lightbulb,
} from "lucide-react";

export default function PortfolioDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { href: "/portfolio/dashboard", icon: LayoutDashboard, label: "Overview" },
    {
      href: "/portfolio/dashboard/personal-info",
      icon: User,
      label: "Personal Info",
    },
    {
      href: "/portfolio/dashboard/education",
      icon: GraduationCap,
      label: "Education",
    },
    { href: "/portfolio/dashboard/awards", icon: Award, label: "Awards" },
    {
      href: "/portfolio/dashboard/experience",
      icon: Briefcase,
      label: "Experience",
    },
    { href: "/portfolio/dashboard/skills", icon: Sparkles, label: "Skills" },
    {
      href: "/portfolio/dashboard/languages",
      icon: Languages,
      label: "Languages",
    },
    {
      href: "/portfolio/dashboard/research",
      icon: Lightbulb,
      label: "Research",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-xl z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">Portfolio</h1>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200/50">
          <Link
            href="/portfolio"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:scale-105 transition-all"
          >
            View Portfolio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
