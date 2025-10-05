"use client";

import { User, Heart } from "lucide-react";

type ViewMode = "patience" | "organization";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ViewSwitcher({ viewMode, setViewMode }: ViewSwitcherProps) {
  const handleLeftClick = () => {
    setViewMode("patience");
    window.location.href = "/";
  };

  const handleRightClick = () => {
    setViewMode("organization");
    window.location.href = "/#herpromise";
  };

  return (
    <div
      className="fixed z-[9999]"
      style={{
        top: "1.5rem",
        left: "1.5rem",
        width: "80px",
        height: "80px",
        background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
        borderRadius: "50%",
        boxShadow:
          "0 10px 30px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        pointerEvents: "auto",
        position: "fixed",
        transition: "opacity 0.3s ease",
        opacity: 1,
      }}
    >
      {/* Vertical divider */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "1px",
          height: "50%",
          background:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
        }}
      />

      {/* Left half - Patience */}
      <div
        onClick={handleLeftClick}
        className="hover-left"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "50% 0 0 50%",
          transition: "background-color 0.3s ease",
          backgroundColor:
            viewMode === "patience"
              ? "rgba(255, 255, 255, 0.2)"
              : "transparent",
        }}
        onMouseEnter={(e) => {
          if (viewMode !== "patience") {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }
        }}
        onMouseLeave={(e) => {
          if (viewMode !== "patience") {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        <User
          className="w-5 h-5 text-white"
          style={{ position: "relative", zIndex: 10 }}
        />
      </div>

      {/* Right half - Organization */}
      <div
        onClick={handleRightClick}
        className="hover-right"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "0 50% 50% 0",
          transition: "background-color 0.3s ease",
          backgroundColor:
            viewMode === "organization"
              ? "rgba(255, 255, 255, 0.2)"
              : "transparent",
        }}
        onMouseEnter={(e) => {
          if (viewMode !== "organization") {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }
        }}
        onMouseLeave={(e) => {
          if (viewMode !== "organization") {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        <Heart
          className="w-5 h-5 text-white"
          style={{ position: "relative", zIndex: 10 }}
        />
      </div>
    </div>
  );
}
