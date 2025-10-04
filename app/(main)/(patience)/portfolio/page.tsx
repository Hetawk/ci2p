"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Heart,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-50 via-white to-accent-purple-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-purple-100 rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 border border-brand-100">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                Portfolio
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-accent-purple-600 to-accent-sky-600 bg-clip-text text-transparent">
              Patience Fero
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Scholar • Speaker • Social Entrepreneur
            </p>

            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Welcome to my portfolio. Here you&apos;ll find information about
              my academic journey, achievements, and the work I&apos;m
              passionate about—empowering communities and creating lasting
              impact through education and leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: "About Me",
                description:
                  "Learn about my background, education, and journey",
                href: "/portfolio/about",
                color: "brand",
              },
              {
                icon: Award,
                title: "Achievements",
                description:
                  "Awards, recognitions, and milestones I&apos;ve reached",
                href: "/portfolio/about#awards",
                color: "accent-purple",
              },
              {
                icon: Heart,
                title: "Her Promise Fulfilled",
                description:
                  "The organization I founded to empower young women",
                href: "/#herpromise",
                color: "accent-sky",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer border border-gray-100">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-brand-600 font-medium group-hover:gap-3 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Stats */}
      <section className="py-20 bg-gradient-to-br from-brand-50/50 to-accent-purple-50/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Impact at a Glance
            </h2>
            <p className="text-lg text-gray-600">
              Creating meaningful change through dedication and service
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "2+", label: "Years Leadership" },
              { value: "3+", label: "Major Awards" },
              { value: "100+", label: "Lives Impacted" },
              { value: "1", label: "Non-Profit Founded" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="text-4xl font-bold text-brand-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <GraduationCap className="w-16 h-16 text-brand-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Let&apos;s Connect
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Interested in collaboration, speaking engagements, or learning
              more about my work? I&apos;d love to hear from you.
            </p>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-accent-purple-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all">
                <span>Get in Touch</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
