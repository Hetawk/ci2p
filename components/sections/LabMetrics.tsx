"use client";

// Lab Metrics/Stats Section
// Live stats showcase with animated counters

import { BookOpen, Users, Award, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface LabMetricsProps {
  publications?: number;
  members?: number;
  projects?: number;
  citations?: number;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay?: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  color,
  delay = 0,
}: StatCardProps) {
  const [count, setCount] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="relative group">
      {/* Gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300`}
      />

      <div className="relative p-8 text-center">
        {/* Icon */}
        <div
          className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Value */}
        <div className="text-5xl font-bold text-gray-900 mb-2 tabular-nums">
          {count}
          <span className="text-3xl">{suffix}</span>
        </div>

        {/* Label */}
        <div className="text-gray-600 font-medium uppercase tracking-wide text-sm">
          {label}
        </div>
      </div>
    </div>
  );
}

export function LabMetrics({
  publications = 0,
  members = 0,
  projects = 0,
  citations = 0,
}: LabMetricsProps) {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Research Impact
          </h2>
          <p className="text-xl text-gray-600">
            Making meaningful contributions to the scientific community
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="Publications"
            value={publications}
            suffix="+"
            color="from-blue-500 to-cyan-500"
            delay={0}
          />

          <StatCard
            icon={Users}
            label="Team Members"
            value={members}
            color="from-purple-500 to-pink-500"
            delay={200}
          />

          <StatCard
            icon={TrendingUp}
            label="Active Projects"
            value={projects}
            suffix="+"
            color="from-green-500 to-emerald-500"
            delay={400}
          />

          <StatCard
            icon={Award}
            label="Citations"
            value={citations}
            suffix="+"
            color="from-orange-500 to-red-500"
            delay={600}
          />
        </div>
      </div>
    </section>
  );
}
