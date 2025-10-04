"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowDown, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "patience" | "organization";

interface HeroProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function Hero({ viewMode, setViewMode }: HeroProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to reposition switch buttons
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient - Blue theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-sky-50">
        <div className="absolute inset-0 bg-pattern-grid opacity-40" />
      </div>

      {/* Floating orbs - Blue gradient theme */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl animate-glow"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent-cyan-400/20 rounded-full blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent-sky-400/15 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* View Mode Toggle Switch - Repositions on scroll */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              top: isScrolled ? "1.5rem" : "1.5rem",
              left: isScrolled ? "1.5rem" : "50%",
              x: isScrolled ? 0 : "-50%",
              scale: isScrolled ? 0.9 : 1, // Slightly smaller when scrolled
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-50"
          >
            <div
              className={`relative rounded-full inline-flex items-center shadow-2xl transition-all duration-300 ${
                isScrolled ? "p-0.5 gap-0.5" : "p-1 gap-1"
              }`}
            >
              {/* Enhanced glassmorphism background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-full border border-white/40" />

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-50/30 to-transparent rounded-full" />

              {/* Content */}
              <div className="relative flex items-center gap-1">
                <button
                  onClick={() => {
                    setViewMode("patience");
                    window.history.pushState(null, "", "/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`
                  relative px-5 py-2 rounded-full font-medium text-sm transition-all duration-300
                  flex items-center gap-1.5
                  ${
                    viewMode === "patience"
                      ? "text-white"
                      : "text-gray-600 hover:text-brand-600"
                  }
                `}
                >
                  {viewMode === "patience" && (
                    <motion.div
                      layoutId="activeView"
                      className="absolute inset-0 gradient-primary rounded-full"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <User className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Patience Fero</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode("organization");
                    window.location.hash = "herpromise";
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`
                  relative px-5 py-2 rounded-full font-medium text-sm transition-all duration-300
                  flex items-center gap-1.5
                  ${
                    viewMode === "organization"
                      ? "text-white"
                      : "text-gray-600 hover:text-brand-600"
                  }
                `}
                >
                  {viewMode === "organization" && (
                    <motion.div
                      layoutId="activeView"
                      className="absolute inset-0 gradient-primary rounded-full"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <Heart className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Her Promise Fulfilled</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Content based on View Mode */}
          <AnimatePresence mode="wait">
            {viewMode === "patience" ? (
              <motion.div
                key="patience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Name */}
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold font-display">
                  <span className="block text-gray-900">Patience</span>
                  <span className="block text-gradient">Fero</span>
                </h1>

                {/* Tagline */}
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 font-light max-w-3xl mx-auto">
                  Scholar <span className="text-brand-600">•</span> Leader{" "}
                  <span className="text-brand-600">•</span> Social Entrepreneur
                </p>

                {/* Description */}
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Master&apos;s student in Applied Economics at Zhejiang
                  Sci-Tech University, passionate about advancing research,
                  fostering innovation, and empowering communities through
                  education and social impact.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="organization"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Organization Name */}
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold font-display">
                  <span className="block text-gray-900">Her Promise</span>
                  <span className="block text-gradient">Fulfilled</span>
                </h1>

                {/* Tagline */}
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 font-light max-w-3xl mx-auto">
                  Educate <span className="text-accent-cyan-600">•</span>{" "}
                  Empower <span className="text-accent-cyan-600">•</span>{" "}
                  Transform
                </p>

                {/* Description */}
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  A nonprofit organization dedicated to empowering underserved
                  communities through education, mentorship, and sustainable
                  development programs that create lasting impact.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {viewMode === "patience" ? (
              <>
                <Button
                  size="lg"
                  className="gradient-primary text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    const element = document.getElementById("content");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More About Me
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-full border-2 border-brand-600 text-brand-600 hover:bg-brand-50 transition-all duration-300 hover:scale-105"
                  onClick={() => setViewMode("organization")}
                >
                  View Her Promise
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="gradient-secondary text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    const element = document.getElementById("content");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More About Us
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-full border-2 border-accent-cyan-600 text-accent-cyan-600 hover:bg-accent-cyan-50 transition-all duration-300 hover:scale-105"
                  onClick={() => setViewMode("patience")}
                >
                  View Patience Profile
                </Button>
              </>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="pt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-flex flex-col items-center gap-2 text-gray-500"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
