"use client";

// Global Ledger Background
// Provides blockchain-inspired grid background across entire site with adaptive colors

import { AdaptiveLedgerGrid } from "./AdaptiveLedgerGrid";
import { BlockchainDataFlow } from "./BlockchainDataFlow";

interface GlobalLedgerBackgroundProps {
  showDataFlow?: boolean;
  gridOpacity?: number;
  dataFlowOpacity?: number;
  theme?: "dark" | "light" | "auto";
}

export function GlobalLedgerBackground({
  showDataFlow = true,
  gridOpacity = 0.5,
  dataFlowOpacity = 0.25,
  theme = "auto",
}: GlobalLedgerBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Blockchain Data Flow - Subtle Background */}
      {showDataFlow && (
        <div style={{ opacity: dataFlowOpacity }}>
          <BlockchainDataFlow nodeCount={20} connectionDistance={180} />
        </div>
      )}

      {/* Adaptive Interactive Ledger Grid */}
      <div style={{ opacity: gridOpacity }}>
        <AdaptiveLedgerGrid interactive={true} cellSize={80} theme={theme} />
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/5 pointer-events-none" />
    </div>
  );
}
