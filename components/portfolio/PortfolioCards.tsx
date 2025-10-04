"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  gradient?: "blue" | "purple" | "cyan" | "neutral";
  hover?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className = "",
  gradient = "neutral",
  hover = true,
  delay = 0,
}: GlassCardProps) {
  const gradients = {
    blue: "from-blue-500/5 via-transparent to-cyan-500/5",
    purple: "from-purple-500/5 via-transparent to-pink-500/5",
    cyan: "from-cyan-500/5 via-transparent to-blue-500/5",
    neutral: "from-gray-50 via-white to-gray-50/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={hover ? { y: -4 } : {}}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${gradients[gradient]}
        backdrop-blur-sm
        border border-gray-200/50
        shadow-xl shadow-gray-900/5
        hover:shadow-2xl hover:shadow-gray-900/10
        hover:border-gray-300/50
        transition-all duration-300
        ${className}
      `}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBg?: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-100",
  delay = 0,
}: FeatureCardProps) {
  return (
    <GlassCard delay={delay} gradient="neutral">
      <div className="p-8">
        <div
          className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
        >
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </GlassCard>
  );
}

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  description?: string;
  location?: string;
  delay?: number;
}

export function TimelineItem({
  date,
  title,
  subtitle,
  description,
  location,
  delay = 0,
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50" />

      <GlassCard gradient="blue" hover={false}>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              {date}
            </span>
            {location && (
              <span className="text-sm text-gray-500">{location}</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-base font-medium text-blue-600 mb-2">{subtitle}</p>
          {description && (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

interface AwardBadgeProps {
  title: string;
  organization: string;
  date: string;
  category: string;
  featured?: boolean;
  delay?: number;
}

export function AwardBadge({
  title,
  organization,
  date,
  category,
  featured = false,
  delay = 0,
}: AwardBadgeProps) {
  const categoryColors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    ACADEMIC: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    PUBLIC_SPEAKING: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    TECHNICAL: {
      bg: "bg-cyan-100",
      text: "text-cyan-700",
      border: "border-cyan-200",
    },
    SPORTS: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
    },
    LEADERSHIP: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    CERTIFICATION: {
      bg: "bg-pink-100",
      text: "text-pink-700",
      border: "border-pink-200",
    },
  };

  const colors = categoryColors[category] || categoryColors.ACADEMIC;

  return (
    <GlassCard
      delay={delay}
      gradient={featured ? "purple" : "neutral"}
      className={featured ? "ring-2 ring-purple-500/20" : ""}
    >
      <div className="p-6">
        {featured && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full mb-4">
            <span>★</span>
            <span>Featured</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full border ${colors.border}`}
          >
            {category.replace(/_/g, " ")}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            {date}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 font-medium">{organization}</p>
      </div>
    </GlassCard>
  );
}

interface SkillPillProps {
  name: string;
  level?: string;
  category: string;
  delay?: number;
}

export function SkillPill({
  name,
  level,
  category,
  delay = 0,
}: SkillPillProps) {
  const categoryColors: Record<string, string> = {
    TECHNICAL: "from-blue-500 to-cyan-500",
    COMMUNICATION: "from-purple-500 to-pink-500",
    LEADERSHIP: "from-orange-500 to-red-500",
    RESEARCH: "from-green-500 to-emerald-500",
    ECONOMICS: "from-indigo-500 to-blue-500",
    LANGUAGES: "from-pink-500 to-rose-500",
  };

  const gradient = categoryColors[category] || categoryColors.TECHNICAL;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-2 px-4 py-2
        bg-gradient-to-r ${gradient}
        text-white font-semibold text-sm rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300
      `}
    >
      <span>{name}</span>
      {level && <span className="text-xs opacity-90">{level}</span>}
    </motion.div>
  );
}
