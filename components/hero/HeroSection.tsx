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

  // Ticker content - Lab information and research areas
  const tickerItems = [
    { text: "CI2P Research Lab", highlight: true },
    { text: "University of Jinan", highlight: false },
    { text: "Key Laboratory of Intelligent Computing", highlight: false },
    { text: "Machine Learning & Deep Learning", highlight: false },
    { text: "Artificial Intelligence Research", highlight: false },
    { text: "Computer Vision & Image Processing", highlight: false },
    { text: "Natural Language Processing", highlight: false },
    { text: "Data Science & Analytics", highlight: false },
    { text: "Intelligent Computing Technology", highlight: false },
  ];

  // Auto-rotate team carousel
  useEffect(() => {
    if (teamMembers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMember((prev) => (prev + 1) % teamMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  // Control video playback - limit to 15 seconds
  useEffect(() => {
    // Use a small delay to ensure video element is in DOM
    const timer = setTimeout(() => {
      const video = document.querySelector("video");
      if (video) {
        // Set up time limit handler
        const handleTimeUpdate = () => {
          if (video.currentTime >= 15) {
            video.currentTime = 0; // Reset to start
            video.play(); // Continue playing
          }
        };

        // Add event listener
        video.addEventListener("timeupdate", handleTimeUpdate);

        // Ensure video plays
        video.play().catch((error) => {
          console.log("Video autoplay prevented:", error);
        });

        // Store cleanup function
        return () => {
          video.removeEventListener("timeupdate", handleTimeUpdate);
        };
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="object-cover w-full h-full opacity-40"
          onLoadedMetadata={(e) => {
            const video = e.currentTarget;
            video.currentTime = 0; // Start from beginning
          }}
        >
          <source src="/videos/lab-bg.mp4" type="video/mp4" />
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
            className="text-secondary-500"
          />
        </svg>
      </div>

      {/* Particle Effect - DISABLED */}
      {/* <ParticleEffect
        particleCount={40}
        particleColor="rgba(6, 182, 212, 0.4)"
        className="z-0 opacity-60"
      /> */}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="w-full space-y-12">
          {/* Scrolling Ticker - Lab Information & Research Areas */}
          <div className="relative overflow-hidden animate-fade-in group max-w-6xl mx-auto">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-900/10 to-transparent backdrop-blur-sm" />

            {/* Top Line - Gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
            <div className="absolute top-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent" />

            {/* Gradient fade edges for smooth appearance */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

            {/* Ticker Content */}
            <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] py-6">
              {/* Repeat content for seamless loop */}
              {[...Array(2)].map((_, repeatIndex) => (
                <div key={repeatIndex} className="flex items-center">
                  {tickerItems.map((item, index) => (
                    <div
                      key={`${repeatIndex}-${index}`}
                      className="flex items-center"
                    >
                      <span
                        className={`px-6 transition-colors ${
                          item.highlight
                            ? "text-xl font-bold text-white drop-shadow-lg"
                            : "text-lg text-gray-200 font-medium"
                        }`}
                      >
                        {item.text}
                      </span>
                      {/* Separator - Beautiful dot with glow */}
                      <span className="text-secondary-400 text-2xl px-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                        •
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom Line - Gradient */}
            <div className="absolute bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left: Text Content */}
            <div className="space-y-8 text-white">
              {/* Main Heading */}
              <div
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Advancing
                  <span className="block text-white bg-clip-text bg-gradient-to-r from-secondary-400 via-accent-400 to-primary-400 animate-gradient">
                    Intelligent Computing
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                  Research excellence in Machine Learning, Artificial
                  Intelligence, and Image Processing at University of Jinan
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-wrap gap-4 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  asChild
                >
                  <Link href="/research/projects">
                    <Microscope className="w-5 h-5 mr-2" />
                    Our Research
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-900 shadow-lg transition-all"
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
                  className="border-2 border-secondary-400 text-secondary-400 hover:bg-secondary-400 hover:text-white shadow-lg transition-all"
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
                <div
                  className="flex gap-8 pt-8 border-t border-white/20 animate-fade-in"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="group cursor-default">
                    <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500 group-hover:scale-110 transition-transform">
                      {stats.publications}+
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Publications
                    </div>
                  </div>
                  <div className="group cursor-default">
                    <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-secondary-500 group-hover:scale-110 transition-transform">
                      {stats.projects}+
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Active Projects
                    </div>
                  </div>
                  <div className="group cursor-default">
                    <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-500 group-hover:scale-110 transition-transform">
                      {stats.members}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Team Members
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Team Member Carousel */}
            {teamMembers.length > 0 && (
              <div
                className="hidden lg:flex items-center justify-center animate-fade-in"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="relative">
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 -m-8 rounded-full border-2 border-primary-500/30 animate-spin-slow" />
                  <div className="absolute inset-0 -m-16 rounded-full border border-secondary-500/20 animate-spin-slower" />

                  {/* Member Card */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl w-80 transition-all duration-500 hover:scale-105">
                    <div className="space-y-6">
                      {/* Avatar */}
                      {/* Avatar */}
                      <div className="flex justify-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary-500/70 to-secondary-500/70 shadow-xl shadow-primary-500/20">
                          <Image
                            src={teamMembers[currentMember].avatar || "/SJ.jpg"}
                            alt={teamMembers[currentMember].fullName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>{" "}
                      {/* Info */}
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-white">
                          {teamMembers[currentMember].fullName}
                        </h3>
                        <p className="text-secondary-300">
                          {teamMembers[currentMember].title ||
                            "Research Member"}
                        </p>
                      </div>
                      {/* Carousel Indicators */}
                      <div className="flex justify-center gap-2 pt-2">
                        {teamMembers.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentMember(idx)}
                            className={`rounded-full transition-all ${
                              idx === currentMember
                                ? "bg-secondary-500 w-8 h-2 shadow-lg shadow-secondary-500/50"
                                : "bg-white/30 w-2 h-2 hover:bg-white/50"
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
