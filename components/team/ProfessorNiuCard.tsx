"use client";

// Professor Niu Profile Card
// Beautiful profile card for Prof. Sijie Niu with ledger design

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  GraduationCap,
  Building2,
  MapPin,
  ExternalLink,
  Award,
  BookOpen,
  Users,
} from "lucide-react";
import { LedgerCard } from "@/components/effects/LedgerCard";

export function ProfessorNiuCard() {
  const interests = [
    "Weakly Supervised Learning",
    "Semi-Supervised Learning",
    "Webly Supervised Learning",
    "Transfer Learning",
    "Domain Adaptation",
    "Metric Learning",
    "Medical Image Analysis",
  ];

  const links = [
    {
      label: "Google Scholar",
      url: "https://scholar.google.com.hk/citations?user=tRi0nMcAAAAJ&hl=zh-en",
      icon: BookOpen,
    },
    {
      label: "ORCID",
      url: "https://orcid.org/0000-0002-1401-9859",
      icon: Award,
    },
    {
      label: "ResearchGate",
      url: "https://www.researchgate.net/profile/Sijie_Niu",
      icon: Users,
    },
    { label: "GitHub", url: "https://github.com/sjniu", icon: ExternalLink },
  ];

  return (
    <LedgerCard glowColor="primary" className="max-w-4xl mx-auto">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative w-48 h-48 mx-auto lg:mx-0">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-full h-full bg-white rounded-2xl p-2">
                <Image
                  src="/SJ.jpg"
                  alt="Prof. Sijie Niu"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Profile Info */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Prof. Sijie Niu
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-2 text-secondary-400 text-lg"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Associate Professor</span>
              </motion.div>
            </div>

            {/* Institution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-2"
            >
              <div className="flex items-start gap-2 text-slate-300">
                <Building2 className="w-5 h-5 mt-1 text-primary-400" />
                <div>
                  <p className="font-medium">Computational Intelligence Lab</p>
                  <p className="text-sm">
                    School of Information Science and Engineering
                  </p>
                  <p className="text-sm">University of Jinan</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-5 h-5 mt-1 text-secondary-400" />
                <p className="text-sm">
                  No. 336, West Road of Nan Xinzhuang, 250022, Jinan, China
                </p>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <a
                href="mailto:sjniu@hotmail.com"
                className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/50 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">sjniu@hotmail.com</span>
              </a>
              <span className="text-slate-400 text-sm">0531-82767569</span>
            </motion.div>
          </div>
        </div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full" />
            About
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Associate Professor at the School of Information Science and
            Engineering, University of Jinan, and a member of CI2P LAB.
            Completed post-doctoral research with Prof. Dinggang Shen in the
            IDEA LAB at UNC. Received BS (2007) and PhD (2016) under the
            supervision of Prof. Qiang Chen.
          </p>
        </motion.div>

        {/* Research Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-secondary-500 to-accent-500 rounded-full" />
            Research Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, idx) => (
              <motion.span
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + idx * 0.05 }}
                className="px-4 py-2 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/30 rounded-lg text-sm text-slate-300 hover:border-primary-500/50 hover:bg-primary-500/20 transition-all"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Academic Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <div className="flex flex-wrap gap-3">
            {links.map((link, idx) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + idx * 0.1 }}
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary-400/50 rounded-lg transition-all group"
                  >
                    <Icon className="w-4 h-4 text-secondary-400 group-hover:text-secondary-300 transition-colors" />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-secondary-400 transition-colors" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </LedgerCard>
  );
}
