"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/sections/Hero";

export type ViewMode = "patience" | "organization";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("patience");

  // Sync with hash changes
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === "herpromise" || hash === "organization") {
      setViewMode("organization");
    } else {
      setViewMode("patience");
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash === "herpromise" || newHash === "organization") {
        setViewMode("organization");
      } else {
        setViewMode("patience");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <main className="min-h-screen">
      <Hero viewMode={viewMode} />

      {/* Content Section - Target for scroll */}
      <section
        id="content"
        className="py-20 bg-gradient-to-b from-white to-brand-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              {viewMode === "patience"
                ? "Welcome to Patience Fero's World"
                : "Empowering Communities Through Her Promise Fulfilled"}
            </h2>
            <p className="text-gray-600 text-lg">
              Dynamic content based on your selection will appear here.
              Introduction, Quick Stats, Featured Achievements, and more!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
