"use client";

import { useState, useEffect } from "react";
import CircularNavbar from "@/components/layout/CircularNavbar";
import { ViewSwitcher } from "@/components/layout/ViewSwitcher";
import { Hero } from "@/components/sections/Hero";
import { Footer } from "@/components/layout/Footer";

export type ViewMode = "patience" | "organization";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("patience");

  // Handle hash-based routing
  useEffect(() => {
    // Read hash on mount
    const hash = window.location.hash.slice(1); // Remove the '#'
    if (hash === "herpromise" || hash === "organization") {
      setViewMode("organization");
    } else {
      // No hash or patience hash = patience view (default)
      setViewMode("patience");
    }

    // Listen for hash changes (for browser back/forward)
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

  // Update URL hash when viewMode changes (but not on initial load for patience)
  useEffect(() => {
    if (viewMode === "organization") {
      if (window.location.hash !== "#herpromise") {
        window.history.replaceState(null, "", "#herpromise");
      }
    }
    // Don't force hash for patience view - allow root path
  }, [viewMode]);

  return (
    <main className="min-h-screen">
      <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
      <CircularNavbar viewMode={viewMode} setViewMode={setViewMode} />
      <Hero viewMode={viewMode} />

      {/* Content Section - Target for scroll */}
      <section
        id="content"
        className="py-20 bg-gradient-to-b from-white to-brand-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Content Coming Soon...
            </h2>
            <p className="text-gray-600 text-lg">
              Dynamic content based on your selection will appear here.
              Introduction, Quick Stats, Featured Achievements, and more!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
