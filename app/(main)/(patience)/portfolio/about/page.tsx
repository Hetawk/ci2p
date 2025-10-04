"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  GraduationCap,
  Trophy,
  Briefcase,
  Heart,
  Sparkles,
  Award,
} from "lucide-react";

export default function PatienceAboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-50 via-white to-accent-sky-50 overflow-hidden">
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
                About Patience
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-accent-purple-600 to-accent-sky-600 bg-clip-text text-transparent">
              Patience Fero
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A passionate scholar, award-winning speaker, and social
              entrepreneur dedicated to empowering communities through education
              and leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Profile Photo Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400 via-accent-purple-400 to-accent-sky-400 rounded-3xl blur-2xl opacity-20 animate-pulse" />
              <div className="relative bg-gradient-to-br from-brand-100 via-accent-purple-50 to-accent-sky-50 p-2 rounded-3xl">
                <Image
                  src="/ID_photo.jpg"
                  alt="Patience Fero"
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Patience Fero
              </h2>
              <p className="text-lg text-brand-600 font-medium mb-4">
                Applied Economics Scholar • Social Entrepreneur • Speaker
              </p>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Currently pursuing a Master&apos;s degree in Applied Economics
                while leading impactful initiatives that empower young women and
                communities across Africa.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Education Timeline */}
      <section className="py-20 bg-gradient-to-br from-brand-50/50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4 border border-brand-100">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                Academic Journey
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Education</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A strong academic foundation driving positive change
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Master's Degree */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-8 border-l-4 border-brand-400"
            >
              <div className="absolute -left-3 top-0 w-6 h-6 bg-brand-500 rounded-full border-4 border-white shadow-lg" />
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Master&apos;s in Applied Economics
                    </h3>
                    <p className="text-brand-600 font-medium text-lg">
                      Zhejiang Sci-Tech University, China
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
                    2023 - Present
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Advancing expertise in economic policy analysis, development
                  economics, and research methodologies to drive sustainable
                  development initiatives.
                </p>
              </div>
            </motion.div>

            {/* Bachelor's Degree */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative pl-8 border-l-4 border-accent-purple-400"
            >
              <div className="absolute -left-3 top-0 w-6 h-6 bg-accent-purple-500 rounded-full border-4 border-white shadow-lg" />
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Bachelor&apos;s in Computer Science
                    </h3>
                    <p className="text-accent-purple-600 font-medium text-lg">
                      ISU Niger Campus, Cameroon
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-accent-purple-100 text-accent-purple-700 rounded-full text-sm font-medium">
                    2019 - 2023
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Built a strong foundation in technology, problem-solving, and
                  analytical thinking while developing leadership skills and
                  social impact initiatives.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-50 to-accent-sky-50 rounded-full mb-4 border border-brand-100">
              <Trophy className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                Recognition
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Awards & Achievements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Excellence recognized at national and international levels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Trophy,
                color: "brand",
                title: "Grand Prize",
                subtitle: "Public Speaking Competition",
                description:
                  "First place at the ISU Cameroon Public Speaking Competition 2022",
              },
              {
                icon: Award,
                color: "accent-purple",
                title: "Third Prize",
                subtitle: "National Final Competition",
                description:
                  "Recognized for outstanding leadership and presentation skills",
              },
              {
                icon: Heart,
                color: "accent-sky",
                title: "ISU President",
                subtitle: "Student Leadership",
                description:
                  "Led the International Student Union with vision and impact",
              },
            ].map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br from-${award.color}-100 to-${award.color}-200 rounded-2xl flex items-center justify-center mb-6`}
                >
                  <award.icon className={`w-7 h-7 text-${award.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {award.title}
                </h3>
                <p className={`text-${award.color}-600 font-medium mb-3`}>
                  {award.subtitle}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {award.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="py-20 bg-gradient-to-br from-accent-sky-50/50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4 border border-accent-sky-200">
              <Briefcase className="w-4 h-4 text-accent-sky-600" />
              <span className="text-sm font-medium text-accent-sky-700">
                Impact & Leadership
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Experience Highlights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Creating meaningful change through leadership and service
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                role: "Founder & Director",
                organization: "Her Promise Fulfilled",
                period: "2021 - Present",
                description:
                  "Leading a non-profit organization dedicated to empowering young African women through education, mentorship, and skills development programs.",
                color: "brand",
              },
              {
                role: "President",
                organization: "International Student Union (ISU)",
                period: "2022 - 2023",
                description:
                  "Led student governance, fostered community engagement, and championed student welfare initiatives across campus.",
                color: "accent-purple",
              },
              {
                role: "Academic Tutor",
                organization: "Community Education Programs",
                period: "2020 - 2023",
                description:
                  "Provided personalized tutoring and mentorship to underprivileged students, helping them achieve academic excellence.",
                color: "accent-sky",
              },
            ].map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {exp.role}
                    </h3>
                    <p className={`text-${exp.color}-600 font-medium text-lg`}>
                      {exp.organization}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 bg-${exp.color}-100 text-${exp.color}-700 rounded-full text-sm font-medium`}
                  >
                    {exp.period}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
