"use client";

// Blockchain Data Flow Animation
// Simulates blockchain transaction flow with animated nodes and connections

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: number[];
}

interface DataFlowProps {
  className?: string;
  nodeCount?: number;
  connectionDistance?: number;
  speed?: number;
  opacity?: number;
}

export function BlockchainDataFlow({
  className = "",
  nodeCount = 30,
  connectionDistance = 180,
  speed = 1,
  opacity = 1,
}: DataFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Create nodes with brighter, more visible colors
    const nodes: Node[] = [];
    const colors = [
      "rgba(59, 130, 246, 1)", // primary-500 - full opacity
      "rgba(6, 182, 212, 1)", // secondary-500 - full opacity
      "rgba(168, 85, 247, 1)", // accent-500 - full opacity
    ];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8 * speed,
        vy: (Math.random() - 0.5) * 0.8 * speed,
        radius: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [],
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)"; // fade effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      nodes.forEach((node) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        // Find connections
        node.connections = [];
        nodes.forEach((other, idx) => {
          if (node === other) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            node.connections.push(idx);

            // Draw connection line with vibrant cyan color
            const lineOpacity =
              (1 - distance / connectionDistance) * 0.7 * opacity;
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineOpacity})`; // Cyan
            ctx.lineWidth = 2; // Even thicker lines
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Draw node with enhanced visibility
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw stronger glow with larger radius
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2); // Increased from +3 to +6
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          node.radius,
          node.x,
          node.y,
          node.radius + 6
        );
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(0.5, node.color.replace("1)", "0.5)"));
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animationId);
    };
  }, [nodeCount, connectionDistance, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
