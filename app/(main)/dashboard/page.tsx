"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function HerPromiseDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Heart className="w-10 h-10 text-pink-500" />
          Her Promise Dashboard
        </h1>
        <p className="text-slate-600">
          Manage programs, members, events, and content for Her Promise
        </p>
      </motion.div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-slate-200/50 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Coming Soon</h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
          The Her Promise dashboard is currently under development. This will be
          your central hub for managing:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="p-6 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/50">
            <Heart className="w-8 h-8 text-pink-500 mb-3 mx-auto" />
            <h3 className="font-semibold text-slate-900 mb-2">Programs</h3>
            <p className="text-sm text-slate-600">
              Manage mentorship programs and initiatives
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200/50">
            <Users className="w-8 h-8 text-purple-500 mb-3 mx-auto" />
            <h3 className="font-semibold text-slate-900 mb-2">Members</h3>
            <p className="text-sm text-slate-600">
              Track membership and participant data
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50">
            <Calendar className="w-8 h-8 text-blue-500 mb-3 mx-auto" />
            <h3 className="font-semibold text-slate-900 mb-2">Events</h3>
            <p className="text-sm text-slate-600">
              Schedule and manage organization events
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200/50">
            <FileText className="w-8 h-8 text-cyan-500 mb-3 mx-auto" />
            <h3 className="font-semibold text-slate-900 mb-2">Content</h3>
            <p className="text-sm text-slate-600">
              Update website content and blog posts
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/#herpromise"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            Visit Her Promise Website
          </Link>
        </div>
      </motion.div>

      {/* Portfolio Dashboard Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50"
      >
        <p className="text-slate-700 mb-3">
          <strong>Looking for the Portfolio Dashboard?</strong>
        </p>
        <Link
          href="/portfolio/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-600 font-medium hover:shadow-md transition-all"
        >
          Go to Portfolio Dashboard →
        </Link>
      </motion.div>
    </div>
  );
}
