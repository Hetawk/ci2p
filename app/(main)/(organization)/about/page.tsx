"use client";

import { motion } from "framer-motion";
import { Heart, Users, Target, Award, Globe, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-50 via-white to-accent-sky-50 overflow-hidden">
        {/* Animated background orbs */}
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-accent-cyan-400/20 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 border border-brand-100">
              <Heart className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                Our Story
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-display">
              About Her Promise Fulfilled
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming communities through education, empowerment, and
              opportunity
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <OrganizationContent />
    </main>
  );
}

function OrganizationContent() {
  return (
    <>
      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-sky-50 border border-brand-100"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-accent-sky-400 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To empower women and girls through education, mentorship, and
                opportunity, creating pathways to success and fostering a
                community where everyone can thrive.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed">
                A world where every woman and girl has access to the education,
                resources, and support needed to achieve their full potential
                and create lasting positive change.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Our Story
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Her Promise Fulfilled was born from a deep commitment to creating
              opportunities for women and girls. Founded with the belief that
              education and empowerment can transform lives, we&apos;ve grown
              into a movement that touches hearts and changes futures.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: "2020",
                title: "Founded",
                description:
                  "Started with a vision to empower women through education",
              },
              {
                year: "2022",
                title: "Growing Impact",
                description:
                  "Expanded programs reaching hundreds of beneficiaries",
              },
              {
                year: "2025",
                title: "Today",
                description:
                  "Continuing to transform lives and build stronger communities",
              },
            ].map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  }}
                >
                  <span className="text-2xl font-bold text-white">
                    {milestone.year}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {milestone.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {milestone.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Compassion",
                description: "Leading with empathy and understanding",
              },
              {
                icon: Users,
                title: "Community",
                description: "Building connections that empower",
              },
              {
                icon: Award,
                title: "Excellence",
                description: "Commitment to quality and impact",
              },
              {
                icon: Globe,
                title: "Inclusivity",
                description: "Creating space for everyone",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-brand-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-accent-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
