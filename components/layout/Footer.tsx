"use client";

// CI2P Lab Platform - Footer
// Modern footer with lab information, quick links, and social connections

import Link from "next/link";
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
    <footer className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-gray-50"
          />
        </svg>
      </div>

      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand section */}
            <div className="space-y-4">
              <Link href="/" className="inline-block group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-lg backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Microscope className="w-6 h-6 text-secondary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-accent-400">
                      CI2P Lab
                    </h3>
                    <p className="text-xs text-gray-400">University of Jinan</p>
                  </div>
                </div>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed">
                Advancing research in Machine Learning, Artificial Intelligence,
                and Image Processing. Key Laboratory of Intelligent Computing
                Technology.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-white/10 hover:bg-secondary-500/30 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Research Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-secondary-400" />
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

            {/* About Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-400" />
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

            {/* Contact & Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-400" />
                Get in Touch
              </h4>
              <ul className="space-y-3">
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
              <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur">
                <p className="text-sm text-gray-300 mb-2 font-semibold">
                  Location
                </p>
                <p className="text-white text-sm font-medium">
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
