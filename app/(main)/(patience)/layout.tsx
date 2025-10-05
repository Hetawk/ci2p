"use client";

import { usePathname } from "next/navigation";
import CircularNavbar from "@/components/layout/CircularNavbar";
import { ViewSwitcher } from "@/components/layout/ViewSwitcher";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { ViewMode } from "../layout";

export default function PatienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard");
  const [viewMode, setViewMode] = useState<ViewMode>("patience");

  // If it's a dashboard route, render without main navigation
  if (isDashboard) {
    return <>{children}</>;
  }

  // Otherwise, render with full navigation
  return (
    <>
      <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
      <CircularNavbar viewMode={viewMode} setViewMode={setViewMode} />
      {children}
      <Footer />
    </>
  );
}
