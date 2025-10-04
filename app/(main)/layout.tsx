"use client";

import { useState, useEffect } from "react";
import CircularNavbar from "@/components/layout/CircularNavbar";
import { Footer } from "@/components/layout/Footer";

export type ViewMode = "patience" | "organization";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("patience");

  // Handle hash-based routing for view mode
  useEffect(() => {
    // Read hash on mount
    const hash = window.location.hash.slice(1);
    if (hash === "herpromise" || hash === "organization") {
      setViewMode("organization");
    } else {
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

  // Update URL hash when viewMode changes
  useEffect(() => {
    if (viewMode === "organization") {
      if (window.location.hash !== "#herpromise") {
        window.history.replaceState(null, "", "#herpromise");
      }
    }
  }, [viewMode]);

  return (
    <>
      <CircularNavbar viewMode={viewMode} setViewMode={setViewMode} />
      {children}
      <Footer />
    </>
  );
}
