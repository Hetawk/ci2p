"use client";

// Section Ledger Wrapper
// Wraps sections with adaptive ledger background

import { ReactNode } from "react";
import { AdaptiveLedgerGrid } from "./AdaptiveLedgerGrid";

interface SectionLedgerWrapperProps {
  children: ReactNode;
  theme?: "dark" | "light" | "auto";
  className?: string;
  gridOpacity?: number;
  showGrid?: boolean;
}

export function SectionLedgerWrapper({
  children,
  theme = "auto",
  className = "",
  gridOpacity = 0.4,
  showGrid = true,
}: SectionLedgerWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Adaptive Ledger Grid for this section */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ opacity: gridOpacity }}
        >
          <AdaptiveLedgerGrid interactive={true} cellSize={60} theme={theme} />
        </div>
      )}

      {/* Section Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
