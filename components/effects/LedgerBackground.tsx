"use client";

// Unified Ledger Background System
// Combines CSS grid pattern + BlockchainDataFlow animation
// Can be controlled per-section with opacity overrides

import { BlockchainDataFlow } from "./BlockchainDataFlow";

interface LedgerBackgroundProps {
  // Theme determines colors
  variant?: "light" | "dark" | "subtle";

  // Blockchain animation settings
  nodeCount?: number;
  nodeSpeed?: number;
  nodeOpacity?: number;
  connectionDistance?: number;

  // Grid pattern settings
  gridOpacity?: number;
  showGrid?: boolean;

  // Overall control
  className?: string;
  disabled?: boolean;
}

export function LedgerBackground({
  variant = "subtle",
  nodeCount = 20,
  nodeSpeed = 0.6,
  nodeOpacity = 0.3,
  connectionDistance = 180,
  gridOpacity = 1,
  showGrid = true,
  className = "",
  disabled = false,
}: LedgerBackgroundProps) {
  if (disabled) return null;

  // Grid class based on variant
  const gridClass = showGrid ? `ledger-${variant}` : "";

  // Adjust grid opacity with inline style
  const gridStyle =
    showGrid && gridOpacity !== 1 ? { opacity: gridOpacity } : undefined;

  return (
    <>
      {/* Static Grid Pattern */}
      {showGrid && (
        <div
          className={`absolute inset-0 ${gridClass} pointer-events-none`}
          style={gridStyle}
          aria-hidden="true"
        />
      )}

      {/* Animated Blockchain Nodes */}
      <BlockchainDataFlow
        className={`absolute inset-0 pointer-events-none ${className}`}
        nodeCount={nodeCount}
        connectionDistance={connectionDistance}
        speed={nodeSpeed}
        opacity={nodeOpacity}
      />
    </>
  );
}

// Preset configurations for common use cases
export const LedgerPresets = {
  // Hero section - dramatic with visible nodes
  hero: {
    variant: "dark" as const,
    nodeCount: 35,
    nodeSpeed: 0.8,
    nodeOpacity: 0.6,
    connectionDistance: 200,
    gridOpacity: 0.3,
    showGrid: true,
  },

  // Light sections - subtle on white/light backgrounds
  light: {
    variant: "subtle" as const,
    nodeCount: 20,
    nodeSpeed: 0.6,
    nodeOpacity: 0.25,
    connectionDistance: 180,
    gridOpacity: 0.8,
    showGrid: true,
  },

  // Dark sections - bright nodes on dark backgrounds
  dark: {
    variant: "dark" as const,
    nodeCount: 25,
    nodeSpeed: 0.6,
    nodeOpacity: 0.4,
    connectionDistance: 180,
    gridOpacity: 0.5,
    showGrid: true,
  },

  // Minimal - just nodes, no grid
  minimal: {
    variant: "subtle" as const,
    nodeCount: 15,
    nodeSpeed: 0.5,
    nodeOpacity: 0.2,
    connectionDistance: 150,
    showGrid: false,
  },

  // None - disable all effects
  none: {
    disabled: true,
  },
};

// Helper component for sections to easily control their ledger
interface SectionLedgerProps {
  preset?: keyof typeof LedgerPresets;
  override?: Partial<LedgerBackgroundProps>;
}

export function SectionLedger({
  preset = "light",
  override = {},
}: SectionLedgerProps) {
  const presetConfig = LedgerPresets[preset];
  const finalConfig = { ...presetConfig, ...override };

  return <LedgerBackground {...finalConfig} />;
}
