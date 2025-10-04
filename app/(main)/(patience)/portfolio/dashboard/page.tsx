"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  Award,
  Briefcase,
  Sparkles,
  Languages,
  Lightbulb,
  TrendingUp,
  Calendar,
  Star,
} from "lucide-react";

interface DashboardStats {
  personalInfo: boolean;
  education: number;
  awards: number;
  experience: number;
  skills: number;
  languages: number;
  research: number;
  featuredAwards: number;
  featuredResearch: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/portfolio");
      const data = await response.json();

      setStats({
        personalInfo: !!data.personalInfo,
        education: data.education?.length || 0,
        awards: data.awards?.length || 0,
        experience: data.experience?.length || 0,
        skills: data.skills?.length || 0,
        languages: data.languages?.length || 0,
        research: data.research?.length || 0,
        featuredAwards:
          data.awards?.filter((a: { featured: boolean }) => a.featured)
            .length || 0,
        featuredResearch:
          data.research?.filter((r: { featured: boolean }) => r.featured)
            .length || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: User,
      label: "Personal Info",
      value: stats?.personalInfo ? "Complete" : "Incomplete",
      color: "from-blue-500 to-cyan-500",
      href: "/portfolio/dashboard/personal-info",
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: stats?.education || 0,
      color: "from-purple-500 to-pink-500",
      href: "/portfolio/dashboard/education",
    },
    {
      icon: Award,
      label: "Awards",
      value: stats?.awards || 0,
      color: "from-orange-500 to-red-500",
      href: "/portfolio/dashboard/awards",
    },
    {
      icon: Briefcase,
      label: "Experience",
      value: stats?.experience || 0,
      color: "from-green-500 to-emerald-500",
      href: "/portfolio/dashboard/experience",
    },
    {
      icon: Sparkles,
      label: "Skills",
      value: stats?.skills || 0,
      color: "from-indigo-500 to-blue-500",
      href: "/portfolio/dashboard/skills",
    },
    {
      icon: Languages,
      label: "Languages",
      value: stats?.languages || 0,
      color: "from-pink-500 to-rose-500",
      href: "/portfolio/dashboard/languages",
    },
    {
      icon: Lightbulb,
      label: "Research",
      value: stats?.research || 0,
      color: "from-teal-500 to-cyan-500",
      href: "/portfolio/dashboard/research",
    },
    {
      icon: Star,
      label: "Featured Items",
      value: (stats?.featuredAwards || 0) + (stats?.featuredResearch || 0),
      color: "from-amber-500 to-yellow-500",
      href: "/portfolio/dashboard",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-600">
          Manage your portfolio content and track your achievements
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.a
              key={card.label}
              href={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-slate-200/50"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              ></div>

              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-slate-600 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>
            </motion.a>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/portfolio/dashboard/awards"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-md transition-all group"
          >
            <Award className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">Add Award</p>
              <p className="text-xs text-slate-600">Add new achievement</p>
            </div>
          </a>
          <a
            href="/portfolio/dashboard/experience"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-all group"
          >
            <Briefcase className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Add Experience
              </p>
              <p className="text-xs text-slate-600">Log new role</p>
            </div>
          </a>
          <a
            href="/portfolio/dashboard/research"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-md transition-all group"
          >
            <Lightbulb className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Add Research
              </p>
              <p className="text-xs text-slate-600">Document project</p>
            </div>
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Getting Started
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Complete Personal Info
              </p>
              <p className="text-xs text-slate-600">
                Add your profile details, bio, and contact information
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Add Your Achievements
              </p>
              <p className="text-xs text-slate-600">
                Document your awards, certifications, and accomplishments
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Feature Your Best Work
              </p>
              <p className="text-xs text-slate-600">
                Mark items as &quot;featured&quot; to highlight them on your
                portfolio
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
