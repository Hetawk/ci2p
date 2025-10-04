"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Heart,
  ArrowRight,
  BookOpen,
  Briefcase,
  Globe,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  GlassCard,
  FeatureCard,
  TimelineItem,
  AwardBadge,
  SkillPill,
} from "@/components/portfolio/PortfolioCards";

interface PortfolioData {
  personalInfo: any;
  education: any[];
  awards: any[];
  experience: any[];
  skills: any[];
  languages: any[];
  research: any[];
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading portfolio:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading portfolio...</p>
        </div>
      </main>
    );
  }

  const featuredAwards = portfolio?.awards.filter((a) => a.featured) || [];
  const skillsByCategory =
    portfolio?.skills.reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {}) || {};

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-gray-200/50"
            >
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome to My Portfolio
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {portfolio?.personalInfo?.fullName || "Patience Fero"}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 font-medium"
            >
              Scholar • Speaker • Social Entrepreneur
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <GlassCard gradient="blue" hover={false}>
                <div className="p-8">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {portfolio?.personalInfo?.bio?.split("\n\n")[0] ||
                      "Welcome to my portfolio. Here you'll find information about my academic journey, achievements, and the work I'm passionate about."}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Explore My Journey
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: "About Me",
                description:
                  "Learn about my background, education, and journey",
                href: "/portfolio/about",
                gradient: "blue",
                iconColor: "text-blue-600",
                iconBg: "bg-blue-100",
              },
              {
                icon: Award,
                title: "Achievements",
                description:
                  "Awards, recognitions, and milestones I've reached",
                href: "/portfolio/about#awards",
                gradient: "purple" as const,
                iconColor: "text-purple-600",
                iconBg: "bg-purple-100",
              },
              {
                icon: Heart,
                title: "Her Promise Fulfilled",
                description:
                  "The organization I founded to empower young women",
                href: "/#herpromise",
                gradient: "cyan" as const,
                iconColor: "text-cyan-600",
                iconBg: "bg-cyan-100",
              },
            ].map((item, index) => (
              <Link key={index} href={item.href}>
                <FeatureCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  iconColor={item.iconColor}
                  iconBg={item.iconBg}
                  delay={index * 0.1}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Education Timeline */}
      {portfolio?.education && portfolio.education.length > 0 && (
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  Academic Excellence
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Education
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Building a strong foundation through continuous learning
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {portfolio.education.map((edu, index) => (
                <TimelineItem
                  key={edu.id}
                  date={`${edu.startDate} - ${edu.endDate || "Present"}`}
                  title={edu.degree}
                  subtitle={edu.institution}
                  description={edu.description}
                  location={edu.location}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Awards */}
      {featuredAwards.length > 0 && (
        <section className="py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">
                  Recognition & Excellence
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Awards
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Honored achievements and recognitions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredAwards.map((award, index) => (
                <AwardBadge
                  key={award.id}
                  title={award.title}
                  organization={award.organization}
                  date={award.date}
                  category={award.category}
                  featured={award.featured}
                  delay={index * 0.1}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link href="/portfolio/about#awards">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-white hover:shadow-xl transition-all">
                  <span>View All Awards</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Skills Showcase */}
      {Object.keys(skillsByCategory).length > 0 && (
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
                <Target className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-semibold text-cyan-700">
                  Expertise & Capabilities
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Skills & Competencies
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A diverse skill set spanning multiple domains
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto space-y-12">
              {Object.entries(skillsByCategory).map(
                ([category, skills]: [string, any], catIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIndex * 0.1 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      {category.replace(/_/g, " ")}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill: any, index: number) => (
                        <SkillPill
                          key={skill.id}
                          name={skill.name}
                          level={skill.level}
                          category={skill.category}
                          delay={index * 0.05}
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Experience Highlight */}
      {portfolio?.experience && portfolio.experience.length > 0 && (
        <section className="py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">
                  Professional Journey
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Leadership & Impact
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Making a difference through dedicated service
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {portfolio.experience.slice(0, 4).map((exp, index) => (
                <GlassCard key={exp.id} delay={index * 0.1} gradient="neutral">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        {exp.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {exp.role}
                    </h3>
                    <p className="text-base font-medium text-orange-600 mb-3">
                      {exp.organization}
                    </p>
                    {exp.location && (
                      <p className="text-sm text-gray-500 mb-3">
                        {exp.location}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link href="/portfolio/about#experience">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-white hover:shadow-xl transition-all">
                  <span>View Full Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Languages */}
      {portfolio?.languages && portfolio.languages.length > 0 && (
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-4">
                <Globe className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-semibold text-pink-700">
                  Global Communication
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Languages
              </h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              {portfolio.languages.map((lang, index) => (
                <SkillPill
                  key={lang.id}
                  name={lang.name}
                  level={lang.level}
                  category="LANGUAGES"
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20">
        <div className="container-custom">
          <GlassCard gradient="purple" hover={false}>
            <div className="p-12">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  {
                    value: portfolio?.education?.length || "0",
                    label: "Degrees",
                    icon: GraduationCap,
                  },
                  {
                    value: portfolio?.awards?.length || "0",
                    label: "Awards & Certifications",
                    icon: Award,
                  },
                  {
                    value: portfolio?.experience?.length || "0",
                    label: "Leadership Roles",
                    icon: Briefcase,
                  },
                  {
                    value: portfolio?.languages?.length || "0",
                    label: "Languages",
                    icon: Globe,
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <stat.icon className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      {stat.value}+
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container-custom">
          <GlassCard gradient="cyan" hover={false}>
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <TrendingUp className="w-16 h-16 text-cyan-600 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Let's Connect
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Interested in collaboration, speaking engagements, or learning
                more about my work? I'd love to hear from you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/portfolio/about">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border border-gray-300 hover:shadow-xl hover:scale-105 transition-all">
                    <BookOpen className="w-5 h-5" />
                    <span>View Full Profile</span>
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all">
                    <span>Get in Touch</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
