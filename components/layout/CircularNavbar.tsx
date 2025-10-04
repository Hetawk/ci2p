"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { patienceNavItems, organizationNavItems } from "./navConfig";

type ViewMode = "patience" | "organization";

interface CircularNavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function CircularNavbar({
  viewMode,
  setViewMode,
}: CircularNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Get dynamic nav items based on view mode
  const navItems =
    viewMode === "patience" ? patienceNavItems : organizationNavItems;

  // Detect scroll to reposition navbar
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        top: isScrolled ? "1.5rem" : "5rem", // top-6 when scrolled, top-20 initially (below switch buttons)
        left: isScrolled ? "auto" : "50%",
        right: isScrolled ? "1.5rem" : "auto",
        x: isScrolled ? 0 : "-50%",
        scale: isScrolled ? 0.9 : 1, // Slightly smaller when scrolled
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed z-40"
    >
      <div
        className={`relative rounded-full shadow-2xl transition-all duration-300 ${
          isScrolled ? "px-3 py-1.5" : "px-5 py-2.5"
        }`}
      >
        {/* Enhanced glassmorphism background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-full border border-white/40 shadow-inner" />

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/30 to-transparent rounded-full" />

        {/* Content */}
        <div className="relative flex items-center gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.action === "home"
                ? viewMode === "patience"
                : item.action === "toggle"
                ? viewMode === "organization"
                : false;
            // All items are always enabled since navbar is on the side
            const isEnabled = true;

            // Render toggle button (switches between views)
            if (item.action === "toggle") {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    const newMode =
                      viewMode === "patience" ? "organization" : "patience";
                    setViewMode(newMode);

                    if (newMode === "patience") {
                      window.history.pushState(null, "", "/");
                    } else {
                      window.location.hash = "herpromise";
                    }

                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-full
                      transition-all duration-300 cursor-pointer
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 hover:text-brand-600"
                      }
                    `}
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 gradient-primary rounded-full"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}

                  {/* Icon */}
                  <Icon className="w-5 h-5 relative z-10" />

                  {/* Text label */}
                  <span className="text-sm font-medium whitespace-nowrap relative z-10">
                    {item.name}
                  </span>
                </button>
              );
            }

            // Render home button
            if (item.action === "home") {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setViewMode("patience");
                    window.history.pushState(null, "", "/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-full
                      transition-all duration-300 cursor-pointer
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 hover:text-brand-600"
                      }
                    `}
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 gradient-primary rounded-full"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}

                  {/* Icon */}
                  <Icon className="w-5 h-5 relative z-10" />

                  {/* Text label */}
                  <span className="text-sm font-medium whitespace-nowrap relative z-10">
                    {item.name}
                  </span>
                </button>
              );
            }

            // Render regular navigation items
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (!isEnabled) {
                    e.preventDefault();
                    return;
                  }
                }}
                className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-full
                    transition-all duration-300
                    ${
                      isEnabled
                        ? "text-gray-700 hover:text-brand-600 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed opacity-50"
                    }
                  `}
              >
                {/* Icon */}
                <Icon className="w-5 h-5 relative z-10" />

                {/* Text label */}
                <span className="text-sm font-medium whitespace-nowrap relative z-10">
                  {item.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
