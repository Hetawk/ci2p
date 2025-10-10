"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Rocket,
  Award,
  TrendingUp,
  Calendar,
  Users,
  ExternalLink,
  Plus,
  Bell,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Mock user data - Replace with actual session data
const mockUser = {
  id: "1",
  fullName: "Dr. John Doe",
  email: "john.doe@ujn.edu.cn",
  role: "RESEARCHER",
  avatar: "/team/default-avatar.jpg",
  title: "PhD Student",
  stats: {
    papers: 12,
    projects: 3,
    citations: 145,
    hIndex: 8,
  },
};

// Mock recent activity
const recentActivity = [
  {
    id: "1",
    type: "paper",
    title: "Your paper was accepted to CVPR 2024",
    time: "2 hours ago",
    icon: BookOpen,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: "2",
    type: "project",
    title: "New collaborator joined Medical Imaging project",
    time: "5 hours ago",
    icon: Users,
    color: "text-green-600 bg-green-100",
  },
  {
    id: "3",
    type: "award",
    title: "Received Outstanding Research Award",
    time: "1 day ago",
    icon: Award,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: "4",
    type: "citation",
    title: "Your paper received 5 new citations",
    time: "2 days ago",
    icon: TrendingUp,
    color: "text-purple-600 bg-purple-100",
  },
];

// Mock upcoming events
const upcomingEvents = [
  {
    id: "1",
    title: "Lab Meeting",
    date: "2024-10-12",
    time: "10:00 AM",
    location: "Room 301",
  },
  {
    id: "2",
    title: "Paper Submission Deadline",
    date: "2024-10-15",
    time: "11:59 PM",
    location: "CVPR 2025",
  },
  {
    id: "3",
    title: "Research Seminar",
    date: "2024-10-18",
    time: "2:00 PM",
    location: "Auditorium",
  },
];

// Mock recent papers
const recentPapers = [
  {
    id: "1",
    title: "Deep Learning for Medical Image Segmentation",
    status: "published",
    citations: 45,
    journal: "IEEE TMI",
    year: 2024,
  },
  {
    id: "2",
    title: "Attention Mechanisms in Computer Vision",
    status: "under-review",
    journal: "CVPR 2025",
    year: 2024,
  },
];

export default function DashboardHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                <Image
                  src={mockUser.avatar}
                  alt={mockUser.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Welcome back, {mockUser.fullName.split(" ")[1]}!
                </h1>
                <p className="text-gray-300">{mockUser.title} • {mockUser.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-blue-600">+2 this month</Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{mockUser.stats.papers}</div>
              <div className="text-sm text-gray-600">Publications</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-600 rounded-xl">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-600">Active</Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{mockUser.stats.projects}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-purple-600">+15 this week</Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{mockUser.stats.citations}</div>
              <div className="text-sm text-gray-600">Citations</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-600 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-yellow-600">Top 10%</Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{mockUser.stats.hIndex}</div>
              <div className="text-sm text-gray-600">H-Index</div>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/dash/papers/new">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Add Paper</span>
                  </Button>
                </Link>
                <Link href="/dash/projects/new">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <Rocket className="w-6 h-6" />
                    <span className="text-sm">New Project</span>
                  </Button>
                </Link>
                <Link href="/dash/profile/edit">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Edit Profile</span>
                  </Button>
                </Link>
                <Link href="/dash/profile/orcid/connect">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <ExternalLink className="w-6 h-6" />
                    <span className="text-sm">ORCID Sync</span>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Papers */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Publications</h2>
                <Link href="/dash/papers">
                  <Button variant="ghost" size="sm">
                    View All
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{paper.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{paper.journal}</span>
                          <span>•</span>
                          <span>{paper.year}</span>
                          {paper.citations && (
                            <>
                              <span>•</span>
                              <span>{paper.citations} citations</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={
                          paper.status === "published"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-600 text-white"
                        }
                      >
                        {paper.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{event.title}</h3>
                    <p className="text-xs text-gray-600 mb-1">{event.time}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Profile Completion */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50">
              <h3 className="font-bold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-sm text-gray-600 mb-4">
                80% complete. Add your ORCID to reach 100%!
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: "80%" }} />
              </div>
              <Link href="/dash/profile/orcid/connect">
                <Button className="w-full bg-primary-600 hover:bg-primary-700" size="sm">
                  Connect ORCID
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
