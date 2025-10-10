"use client";

// CI2P Lab Platform - Footer
// Modern footer with lab information, quick links, and social connections

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  FileText,
  Users,
  Microscope,
  BookOpen,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const footerLinks = {
  research: [
    { name: "Publications", href: "/papers", icon: FileText },
    { name: "Projects", href: "/research/projects", icon: Microscope },
    { name: "Research Areas", href: "/about#research", icon: BookOpen },
  ],
  about: [
    { name: "About Lab", href: "/about", icon: BookOpen },
    { name: "Our Team", href: "/team", icon: Users },
    { name: "News & Updates", href: "/news", icon: FileText },
  ],
  resources: [
    { name: "Contact Us", href: "/contact", icon: Mail },
    { name: "Join Our Lab", href: "/register", icon: Users },
    { name: "Collaborations", href: "/about#collaborate", icon: Microscope },
  ],
};

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/ci2p-lab",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/ci2p-lab",
    icon: Linkedin,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ci2p_lab",
    icon: Twitter,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white mt-20">
      {/* Modern Ledger-style Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
      <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary-400 to-transparent" />

      <div className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand section - Modern Card Design */}
            <div className="space-y-6">
              <Link href="/" className="inline-block group">
                {/* Dual Logo Display */}
                <div className="flex items-center gap-3 mb-4">
                  {/* CI2P Logo Card */}
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow p-2">
                    <Image
                      src="/ci2p_logo.png"
                      alt="CI2P Lab"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  {/* UJN Logo Card */}
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow p-2">
                    <Image
                      src="/ujn_logo.png"
                      alt="University of Jinan"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-accent-400 mb-1">
                    CI2P Research Lab
                  </h3>
                  <p className="text-sm text-gray-400">University of Jinan</p>
                </div>
              </Link>

              {/* Description Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Advancing research in Machine Learning, Artificial
                  Intelligence, and Image Processing. Key Laboratory of
                  Intelligent Computing Technology.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-lg bg-white/10 hover:bg-secondary-500/30 transition-colors duration-300 border border-white/5"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Research Links - Card Style */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-secondary-400/30 transition-colors">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary-500/20">
                  <Microscope className="w-5 h-5 text-secondary-400" />
                </div>
                Research
              </h4>
              <ul className="space-y-3">
                {footerLinks.research.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-secondary-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                      >
                        <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* About Links - Card Style */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-accent-400/30 transition-colors">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent-500/20">
                  <BookOpen className="w-5 h-5 text-accent-400" />
                </div>
                About Us
              </h4>
              <ul className="space-y-3">
                {footerLinks.about.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-accent-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                      >
                        <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact & Resources - Card Style */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary-400/30 transition-colors">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary-500/20">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                Get in Touch
              </h4>
              <ul className="space-y-3 mb-6">
                {footerLinks.resources.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-primary-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                      >
                        <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Location Card */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-400/20">
                <p className="text-xs text-primary-300 mb-2 font-semibold uppercase tracking-wider">
                  Location
                </p>
                <p className="text-white text-sm font-medium leading-relaxed">
                  University of Jinan
                  <br />
                  Jinan, Shandong, China
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {currentYear} CI2P Research Lab, University of Jinan. All
                rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
                <span>•</span>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <span>•</span>
                <Link
                  href="/papers"
                  className="hover:text-white transition-colors"
                >
                  Publications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
