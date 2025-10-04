"use client";

import { motion } from "framer-motion";
import { Users, Target, Globe, Sparkles } from "lucide-react";

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
      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Her Promise Fulfilled is a nonprofit organization dedicated to
              empowering single mothers, widows, children, and disadvantaged
              families through education, economic support, and community
              development.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We provide targeted programs that support vulnerable individuals
              with tools for self-reliance and personal growth. Through
              education, economic empowerment, and holistic community
              engagement, we work to break cycles of poverty and restore hope.
            </p>
          </motion.div>

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
                To empower single mothers, widows, children, and disadvantaged
                families through comprehensive education programs, economic
                support initiatives, and community development that foster
                self-reliance, dignity, and sustainable growth.
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
                A world where vulnerable families have access to quality
                education, economic opportunities, and supportive communities
                that enable them to break free from poverty cycles and build
                prosperous, hopeful futures.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            <p className="text-gray-600 max-w-3xl mx-auto">
              Founded in 2025, Her Promise Fulfilled is built on three pillars
              of transformation, each designed to create lasting change in the
              lives of vulnerable families.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Education Support",
                description:
                  "Providing access to quality education for children and skills training for adults to unlock opportunities and build brighter futures.",
                gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              },
              {
                icon: Target,
                title: "Economic Empowerment",
                description:
                  "Equipping single mothers and widows with vocational training, micro-financing, and entrepreneurship support for financial independence.",
                gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              },
              {
                icon: Users,
                title: "Community Development",
                description:
                  "Building strong, supportive communities through mentorship programs, support groups, and holistic family development initiatives.",
                gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              },
            ].map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-brand-200">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ background: area.gradient }}
                  >
                    <area.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
