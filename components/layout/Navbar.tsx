"use client";

// CI2P Lab Platform - Main Navigation
// Modern, clean navbar with glassmorphism and smooth animations

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";
import {
  Menu,
  X,
  Home,
  FileText,
  Microscope,
  Users,
  BookOpen,
  Mail,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Research", href: "/research/projects", icon: Microscope },
  { name: "Publications", href: "/papers", icon: FileText },
  { name: "Team", href: "/team", icon: Users },
  { name: "About", href: "/about", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Mail },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logos - CI2P + UJN */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* CI2P Logo */}
              <div
                className={`relative w-11 h-11 rounded-lg transition-all group-hover:scale-110 p-1.5 ${
                  isScrolled
                    ? "bg-white shadow-md"
                    : "bg-white/95 shadow-lg shadow-white/20"
                }`}
              >
                <Image
                  src="/ci2p_logo.png"
                  alt="CI2P Lab"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>

              {/* UJN Logo */}
              <div
                className={`relative w-11 h-11 rounded-lg transition-all group-hover:scale-110 p-1.5 ${
                  isScrolled
                    ? "bg-white shadow-md"
                    : "bg-white/95 shadow-lg shadow-white/20"
                }`}
              >
                <Image
                  src="/ujn_logo.png"
                  alt="University of Jinan"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>

              <div>
                <h1
                  className={`text-xl font-bold transition-colors ${
                    isScrolled
                      ? "text-primary-900"
                      : "text-white drop-shadow-lg"
                  }`}
                >
                  CI2P Lab
                </h1>
                <p
                  className={`text-xs transition-colors ${
                    isScrolled
                      ? "text-primary-600"
                      : "text-blue-200 drop-shadow"
                  }`}
                >
                  University of Jinan
                </p>
                <p
                  className={`text-[10px] transition-colors ${
                    isScrolled
                      ? "text-gray-500"
                      : "text-blue-100/80 drop-shadow"
                  }`}
                >
                  Key Laboratory of Intelligent Computing
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu or Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/20"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Separator Line */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent"
          />
        )}
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : "100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden"
      >
        <div className="p-6 space-y-6 h-full overflow-y-auto">
          {/* Mobile Nav Links */}
          <div className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile User Menu */}
          <div className="pt-6 border-t">
            <UserMenu />
          </div>

          {/* Contact Info */}
          <div className="pt-6 border-t space-y-2">
            <p className="text-sm font-semibold text-gray-900">Contact Us</p>
            <p className="text-sm text-gray-600">
              University of Jinan
              <br />
              Key Laboratory of Intelligent Computing
              <br />
              Jinan, Shandong, China
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black z-40 lg:hidden"
        />
      )}
    </>
  );
}
