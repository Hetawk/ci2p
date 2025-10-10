"use client";

// Blockchain-Inspired Ledger Grid Background
// Interactive grid that responds to mouse movement with beautiful animations

import { useEffect, useRef, useState } from "react";

interface LedgerGridProps {
  className?: string;
  cellSize?: number;
  interactive?: boolean;
}

export function LedgerGrid({
  className = "",
  cellSize = 60,
  interactive = true,
}: LedgerGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

        // Base opacity calculation - more visible now
        const baseOpacity = 0.35; // Increased from 0.25
        const interactiveOpacity = interactive
          ? Math.max(0.4, 0.9 - distanceX / 300)
          : baseOpacity;

        // Use cyan/blue gradient for better visibility
        const color =
          i % 2 === 0
            ? `rgba(6, 182, 212, ${interactiveOpacity})` // secondary-500 cyan
            : `rgba(59, 130, 246, ${interactiveOpacity})`; // primary-500 blue

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5; // Slightly thicker for visibility
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines with vibrant colors
      for (let i = 0; i <= rows; i++) {
        const y = i * cellSize;
        const distanceY = Math.abs(mousePos.y - y);

        // Base opacity calculation
        const baseOpacity = 0.35;
        const interactiveOpacity = interactive
          ? Math.max(0.4, 0.9 - distanceY / 300)
          : baseOpacity;

        // Alternate colors for visual interest
        const color =
          i % 2 === 0
            ? `rgba(6, 182, 212, ${interactiveOpacity})` // secondary-500 cyan
            : `rgba(59, 130, 246, ${interactiveOpacity})`; // primary-500 blue

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
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
              const opacity = (1 - distance / 3) * 0.3;

              // Draw cell highlight with gradient effect
              ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`; // primary-500
              ctx.fillRect(cx, cy, cellSize, cellSize);

              // Draw glow border
              ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 1.5})`; // secondary-500
              ctx.lineWidth = 2;
              ctx.strokeRect(cx, cy, cellSize, cellSize);
            }
          }
        }

        // Draw center cell with stronger highlight
        const centerX = cellX * cellSize;
        const centerY = cellY * cellSize;

        ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
        ctx.fillRect(centerX, centerY, cellSize, cellSize);

        ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
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
  }, [mousePos, cellSize, interactive]);

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
