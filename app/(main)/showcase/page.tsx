"use client";

// CI2P Lab - Ledger Design Showcase
// Blockchain-inspired beautiful design system demonstration

import { motion } from "framer-motion";
import {
  LedgerGrid,
  LedgerCard,
  BlockchainDataFlow,
  LedgerTransaction,
} from "@/components/effects";
import { ProfessorNiuCard } from "@/components/team";
import {
  Cpu,
  Zap,
  Shield,
  GitBranch,
  Database,
  Network,
  Layers,
  Activity,
} from "lucide-react";

export default function LedgerShowcase() {
  const features = [
    {
      icon: Cpu,
      title: "Deep Learning",
      description:
        "Advanced neural network architectures for complex pattern recognition",
      color: "primary" as const,
    },
    {
      icon: Network,
      title: "Transfer Learning",
      description: "Efficient knowledge transfer across domains and tasks",
      color: "secondary" as const,
    },
    {
      icon: Shield,
      title: "Medical Imaging",
      description: "AI-powered diagnostic systems for healthcare applications",
      color: "accent" as const,
    },
    {
      icon: GitBranch,
      title: "Domain Adaptation",
      description: "Robust models that adapt to different data distributions",
      color: "primary" as const,
    },
    {
      icon: Database,
      title: "Metric Learning",
      description:
        "Learning optimal distance metrics for similarity-based tasks",
      color: "secondary" as const,
    },
    {
      icon: Layers,
      title: "Weakly Supervised",
      description: "Learning from limited or noisy annotations",
      color: "accent" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900/30 to-slate-900 relative overflow-hidden">
      {/* Blockchain Data Flow Background */}
      <BlockchainDataFlow className="opacity-30" />

      {/* Interactive Ledger Grid */}
      <div className="absolute inset-0 opacity-40">
        <LedgerGrid interactive={true} cellSize={80} />
      </div>

      {/* Transaction Animation */}
      <LedgerTransaction className="opacity-20" blockCount={3} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 text-transparent bg-clip-text">
                  Ledger Design System
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Blockchain-inspired design with beautiful interactive elements.
                Experience the future of academic research platforms.
              </p>

              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-primary-500 to-transparent"
              />
            </motion.div>
          </div>
        </section>

        {/* Professor Niu Profile */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12 text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Lab Director
              </h2>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full" />
            </motion.div>

            <ProfessorNiuCard />
          </div>
        </section>

        {/* Research Features Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Research Focus
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
                Cutting-edge computational intelligence and pattern recognition
              </p>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-secondary-500 via-accent-500 to-primary-500 rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <LedgerCard
                    key={feature.title}
                    glowColor={feature.color}
                    delay={0.7 + idx * 0.1}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`p-3 rounded-lg ${
                            feature.color === "primary"
                              ? "bg-primary-500/20"
                              : feature.color === "secondary"
                              ? "bg-secondary-500/20"
                              : "bg-accent-500/20"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              feature.color === "primary"
                                ? "text-primary-400"
                                : feature.color === "secondary"
                                ? "text-secondary-400"
                                : "text-accent-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar visualization */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400">
                            Research Impact
                          </span>
                          <span className="text-xs text-slate-400">
                            {85 + Math.floor(Math.random() * 15)}%
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${85 + Math.floor(Math.random() * 15)}%`,
                            }}
                            transition={{ duration: 1.5, delay: 1 + idx * 0.1 }}
                            className={`h-full rounded-full ${
                              feature.color === "primary"
                                ? "bg-gradient-to-r from-primary-500 to-primary-400"
                                : feature.color === "secondary"
                                ? "bg-gradient-to-r from-secondary-500 to-secondary-400"
                                : "bg-gradient-to-r from-accent-500 to-accent-400"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </LedgerCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Publications",
                  value: "80+",
                  icon: Database,
                  color: "primary" as const,
                },
                {
                  label: "Team Members",
                  value: "20+",
                  icon: Network,
                  color: "secondary" as const,
                },
                {
                  label: "Active Projects",
                  value: "15+",
                  icon: Activity,
                  color: "accent" as const,
                },
                {
                  label: "Citations",
                  value: "1200+",
                  icon: Zap,
                  color: "primary" as const,
                },
              ].map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <LedgerCard
                    key={metric.label}
                    glowColor={metric.color}
                    delay={1.5 + idx * 0.1}
                  >
                    <div className="p-8 text-center">
                      <Icon
                        className={`w-12 h-12 mx-auto mb-4 ${
                          metric.color === "primary"
                            ? "text-primary-400"
                            : metric.color === "secondary"
                            ? "text-secondary-400"
                            : "text-accent-400"
                        }`}
                      />
                      <div
                        className={`text-4xl font-bold mb-2 ${
                          metric.color === "primary"
                            ? "text-primary-400"
                            : metric.color === "secondary"
                            ? "text-secondary-400"
                            : "text-accent-400"
                        }`}
                      >
                        {metric.value}
                      </div>
                      <div className="text-slate-300 font-medium">
                        {metric.label}
                      </div>
                    </div>
                  </LedgerCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <LedgerCard glowColor="primary" delay={2}>
              <div className="p-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 2.2 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Join Our Research
                  </h2>
                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                    Explore cutting-edge computational intelligence research at
                    CI2P Lab. We&apos;re always looking for talented researchers
                    and collaborators.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all">
                      View Publications
                    </button>
                    <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-all">
                      Contact Us
                    </button>
                  </div>
                </motion.div>
              </div>
            </LedgerCard>
          </div>
        </section>
      </div>
    </div>
  );
}
