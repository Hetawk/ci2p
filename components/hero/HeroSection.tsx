"use client";

// CI2P Lab Platform - Hero Section
// Main landing page hero with video background, team carousel, particle effects

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users, Microscope } from "lucide-react";

interface TeamMember {
  id: string;
  fullName: string;
  title: string | null;
  avatar: string | null;
  teamOrder?: number | null;
}

interface HeroSectionProps {
  teamMembers?: TeamMember[];
  stats?: {
    publications: number;
    projects: number;
    members: number;
  };
}

export function HeroSection({ teamMembers = [], stats }: HeroSectionProps) {
  const [currentMember, setCurrentMember] = useState(0);

  // Auto-rotate team carousel
  useEffect(() => {
    if (teamMembers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMember((prev) => (prev + 1) % teamMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-20"
        >
          <source src="/assets/lab-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
      </div>

      {/* Hexagonal Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hexagons"
              x="0"
              y="0"
              width="50"
              height="43.4"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#hexagons)"
            className="text-blue-500"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Text Content */}
          <div className="space-y-8 text-white">
            {/* Lab Logo/Badge */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                <Image
                  src="/ci2p-logo.png"
                  alt="CI2P Lab"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CI2P Research Lab</h1>
                <p className="text-sm text-blue-200">
                  Key Laboratory of Intelligent Computing Technology
                </p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Advancing
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Intelligent Computing
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl">
                Research excellence in Machine Learning, Artificial
                Intelligence, and Image Processing at University of Jinan
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link href="/research/projects">
                  <Microscope className="w-5 h-5 mr-2" />
                  Our Research
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/papers">
                  <FileText className="w-5 h-5 mr-2" />
                  Publications
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/team">
                  <Users className="w-5 h-5 mr-2" />
                  Our Team
                </Link>
              </Button>
            </div>

            {/* Live Stats */}
            {stats && (
              <div className="flex gap-8 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold text-blue-400">
                    {stats.publications}+
                  </div>
                  <div className="text-sm text-gray-400">Publications</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {stats.projects}+
                  </div>
                  <div className="text-sm text-gray-400">Active Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">
                    {stats.members}
                  </div>
                  <div className="text-sm text-gray-400">Team Members</div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Team Member Carousel */}
          {teamMembers.length > 0 && (
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Decorative Ring */}
                <div className="absolute inset-0 -m-8 rounded-full border-2 border-blue-500/30 animate-spin-slow" />
                <div className="absolute inset-0 -m-16 rounded-full border border-cyan-500/20 animate-spin-slower" />

                {/* Member Card */}
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl w-80 transition-all duration-500">
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex justify-center">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-xl">
                        <Image
                          src={
                            teamMembers[currentMember].avatar || "/prof-niu.jpg"
                          }
                          alt={teamMembers[currentMember].fullName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-bold text-white">
                        {teamMembers[currentMember].fullName}
                      </h3>
                      <p className="text-blue-300">
                        {teamMembers[currentMember].title}
                      </p>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center gap-2">
                      {teamMembers.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentMember(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentMember
                              ? "bg-blue-500 w-8"
                              : "bg-white/30 hover:bg-white/50"
                          }`}
                          aria-label={`View team member ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
