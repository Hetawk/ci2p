"use client";

// Ledger Transaction Animation
// Blockchain-style data blocks flowing across the screen

import { useEffect, useRef } from "react";

interface DataBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  data: string;
  color: string;
  opacity: number;
}

interface LedgerTransactionProps {
  className?: string;
  blockCount?: number;
}

export function LedgerTransaction({
  className = "",
  blockCount = 5,
}: LedgerTransactionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const blocks: DataBlock[] = [];
    const colors = [
      "rgb(59, 130, 246)", // primary-500
      "rgb(6, 182, 212)", // secondary-500
      "rgb(168, 85, 247)", // accent-500
    ];

    // Create initial blocks
    for (let i = 0; i < blockCount; i++) {
      blocks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 80 + Math.random() * 40,
        height: 40 + Math.random() * 20,
        speed: 0.3 + Math.random() * 0.5,
        data: `0x${Math.random().toString(16).substr(2, 8)}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.6 + Math.random() * 0.4,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blocks.forEach((block) => {
        // Move block
        block.x += block.speed;

        // Reset if off screen
        if (block.x > canvas.width + block.width) {
          block.x = -block.width;
          block.y = Math.random() * canvas.height;
          block.data = `0x${Math.random().toString(16).substr(2, 8)}`;
        }

        // Draw connecting line
        ctx.strokeStyle = `rgba(148, 163, 184, 0.2)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, block.y + block.height / 2);
        ctx.lineTo(canvas.width, block.y + block.height / 2);
        ctx.stroke();

        // Draw block
        ctx.fillStyle = `${block.color.replace(
          ")",
          `, ${block.opacity * 0.1})`
        )}`;
        ctx.fillRect(block.x, block.y, block.width, block.height);

        // Draw border
        ctx.strokeStyle = `${block.color.replace(")", `, ${block.opacity})`)}`;
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.width, block.height);

        // Draw corner markers
        const cornerSize = 8;
        ctx.strokeStyle = `${block.color.replace(")", `, ${block.opacity})`)}`;
        ctx.lineWidth = 2;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(block.x, block.y + cornerSize);
        ctx.lineTo(block.x, block.y);
        ctx.lineTo(block.x + cornerSize, block.y);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(block.x + block.width - cornerSize, block.y);
        ctx.lineTo(block.x + block.width, block.y);
        ctx.lineTo(block.x + block.width, block.y + cornerSize);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(block.x, block.y + block.height - cornerSize);
        ctx.lineTo(block.x, block.y + block.height);
        ctx.lineTo(block.x + cornerSize, block.y + block.height);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(block.x + block.width - cornerSize, block.y + block.height);
        ctx.lineTo(block.x + block.width, block.y + block.height);
        ctx.lineTo(block.x + block.width, block.y + block.height - cornerSize);
        ctx.stroke();

        // Draw text
        ctx.font = "12px monospace";
        ctx.fillStyle = `${block.color.replace(")", `, ${block.opacity})`)}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          block.data,
          block.x + block.width / 2,
          block.y + block.height / 2
        );
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animationId);
    };
  }, [blockCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
