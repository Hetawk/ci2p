"use client";

// Blockchain-Inspired Ledger Card Component
// Beautiful card with animated borders and interactive glow effects

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LedgerCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "secondary" | "accent";
  hoverable?: boolean;
  delay?: number;
}

export function LedgerCard({
  children,
  className = "",
  glowColor = "primary",
  hoverable = true,
  delay = 0,
}: LedgerCardProps) {
  const glowColors = {
    primary: "group-hover:shadow-primary-500/50",
    secondary: "group-hover:shadow-secondary-400/50",
    accent: "group-hover:shadow-accent-500/50",
  };

  const borderColors = {
    primary: "from-primary-500/50 via-primary-400/30 to-transparent",
    secondary: "from-secondary-400/50 via-secondary-300/30 to-transparent",
    accent: "from-accent-500/50 via-accent-400/30 to-transparent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("group relative", className)}
    >
      {/* Animated border gradient */}
      <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className={cn(
            "absolute inset-0 rounded-xl bg-gradient-to-r animate-pulse",
            borderColors[glowColor]
          )}
        />
      </div>

      {/* Corner accents */}
      <div className="absolute -top-px -left-px w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r",
            borderColors[glowColor]
          )}
        />
        <div
          className={cn(
            "absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b",
            borderColors[glowColor]
          )}
        />
      </div>

      <div className="absolute -bottom-px -right-px w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className={cn(
            "absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l",
            borderColors[glowColor]
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t",
            borderColors[glowColor]
          )}
        />
      </div>

      {/* Card content */}
      <div
        className={cn(
          "relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10",
          "transition-all duration-300",
          hoverable && "hover:bg-white/10 hover:border-white/20",
          hoverable && `hover:shadow-2xl ${glowColors[glowColor]}`
        )}
      >
        {children}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    </motion.div>
  );
}
