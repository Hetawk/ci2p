"use client";

// Adaptive Ledger Grid Background
// Automatically adjusts colors based on background (dark/light)

import { useEffect, useRef, useState } from "react";

interface AdaptiveLedgerGridProps {
  className?: string;
  cellSize?: number;
  interactive?: boolean;
  theme?: "dark" | "light" | "auto";
}

export function AdaptiveLedgerGrid({
  className = "",
  cellSize = 80,
  interactive = true,
  theme = "auto",
}: AdaptiveLedgerGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [detectedTheme, setDetectedTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Auto-detect background color if theme is auto
    if (theme === "auto") {
      const parent = canvas.parentElement;
      if (parent) {
        const bgColor = window.getComputedStyle(parent).backgroundColor;
        // Parse RGB values
        const rgb = bgColor.match(/\d+/g);
        if (rgb) {
          const r = parseInt(rgb[0]);
          const g = parseInt(rgb[1]);
          const b = parseInt(rgb[2]);
          // Calculate luminance
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setDetectedTheme(luminance > 0.5 ? "light" : "dark");
        }
      }
    }

    const activeTheme = theme === "auto" ? detectedTheme : theme;

    // Color schemes based on theme
    const colorScheme = {
      dark: {
        primary: "59, 130, 246", // Blue
        secondary: "6, 182, 212", // Cyan
        accent: "168, 85, 247", // Purple
        baseOpacity: 0.35,
        maxOpacity: 0.9,
        highlightOpacity: 0.4,
      },
      light: {
        primary: "30, 64, 175", // Darker blue for light bg
        secondary: "8, 145, 178", // Darker cyan
        accent: "126, 34, 206", // Darker purple
        baseOpacity: 0.25,
        maxOpacity: 0.6,
        highlightOpacity: 0.3,
      },
    };

    const colors = colorScheme[activeTheme];

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Draw ledger grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / cellSize);
      const rows = Math.ceil(canvas.height / cellSize);

      // Draw vertical lines with vibrant colors
      for (let i = 0; i <= cols; i++) {
        const x = i * cellSize;
        const distanceX = Math.abs(mousePos.x - x);

        const interactiveOpacity = interactive
          ? Math.max(colors.baseOpacity, colors.maxOpacity - distanceX / 300)
          : colors.baseOpacity;

        // Alternate between primary and secondary colors
        const colorRGB = i % 2 === 0 ? colors.secondary : colors.primary;
        ctx.strokeStyle = `rgba(${colorRGB}, ${interactiveOpacity})`;
        ctx.lineWidth = activeTheme === "light" ? 2 : 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = i * cellSize;
        const distanceY = Math.abs(mousePos.y - y);

        const interactiveOpacity = interactive
          ? Math.max(colors.baseOpacity, colors.maxOpacity - distanceY / 300)
          : colors.baseOpacity;

        const colorRGB = i % 2 === 0 ? colors.secondary : colors.primary;
        ctx.strokeStyle = `rgba(${colorRGB}, ${interactiveOpacity})`;
        ctx.lineWidth = activeTheme === "light" ? 2 : 1.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw cell highlights near mouse
      if (interactive && mousePos.x > 0 && mousePos.y > 0) {
        const cellX = Math.floor(mousePos.x / cellSize);
        const cellY = Math.floor(mousePos.y / cellSize);

        // Highlight cells in a radius
        for (let dx = -3; dx <= 3; dx++) {
          for (let dy = -3; dy <= 3; dy++) {
            const cx = (cellX + dx) * cellSize;
            const cy = (cellY + dy) * cellSize;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 3) {
              const opacity = (1 - distance / 3) * colors.highlightOpacity;

              // Draw cell highlight with gradient effect
              ctx.fillStyle = `rgba(${colors.primary}, ${opacity})`;
              ctx.fillRect(cx, cy, cellSize, cellSize);

              // Draw glow border
              ctx.strokeStyle = `rgba(${colors.accent}, ${opacity * 1.5})`;
              ctx.lineWidth = 2;
              ctx.strokeRect(cx, cy, cellSize, cellSize);
            }
          }
        }

        // Draw center cell with stronger highlight
        const centerX = cellX * cellSize;
        const centerY = cellY * cellSize;

        ctx.fillStyle = `rgba(${colors.primary}, ${colors.highlightOpacity})`;
        ctx.fillRect(centerX, centerY, cellSize, cellSize);

        ctx.strokeStyle = `rgba(${colors.accent}, 0.8)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX, centerY, cellSize, cellSize);
      }
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      drawGrid();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos, cellSize, interactive, theme, detectedTheme]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -100, y: -100 });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
