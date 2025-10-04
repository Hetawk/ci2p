"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Mail, Linkedin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  explore: [
    { name: "About Me", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Awards & Recognition", href: "/portfolio/awards" },
    { name: "Research", href: "/portfolio/research" },
  ],
  herPromise: [
    { name: "About the Organization", href: "/her-promise-fulfilled/about" },
    { name: "Programs", href: "/her-promise-fulfilled/programs" },
    { name: "Impact Stories", href: "/her-promise-fulfilled/impact" },
    { name: "Get Involved", href: "/her-promise-fulfilled/get-involved" },
  ],
  connect: [
    { name: "Contact Me", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Newsletter", href: "#newsletter" },
  ],
};

const socialLinks = [
  {
    name: "Email",
    href: "mailto:feropatience@gmail.com",
    icon: Mail,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/patiefero",
    icon: Linkedin,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-brand-900 to-gray-900 text-white">
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
            className="fill-white"
          />
        </svg>
      </div>

      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand section */}
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <h3 className="text-2xl font-bold font-display text-gradient bg-gradient-to-r from-brand-400 to-accent-cyan-400 bg-clip-text">
                  Patience Fero
                </h3>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed">
                Scholar, Leader, and Social Entrepreneur dedicated to advancing
                research and empowering communities through education and
                innovation.
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
                    className="p-2 rounded-full glass-dark hover:bg-brand-500/20 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Explore links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Explore</h4>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-brand-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Her Promise Fulfilled links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent-cyan-400" />
                Her Promise Fulfilled
              </h4>
              <ul className="space-y-3">
                {footerLinks.herPromise.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-accent-cyan-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-3">
                {footerLinks.connect.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-brand-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 rounded-lg glass-dark border border-white/10">
                <p className="text-sm text-gray-300 mb-2">Location</p>
                <p className="text-white font-medium">Hangzhou, China</p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10 mb-8" />

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} Patience Fero. All rights reserved. Built with{" "}
              <Heart className="inline w-4 h-4 text-accent-cyan-400" /> and
              purpose.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-brand-400 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-brand-400 transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
