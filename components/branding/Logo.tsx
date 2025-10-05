"use client";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 80, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient
          id="logoGradient"
          x1="0"
          y1="0"
          x2="80"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main Circle Background */}
      <circle
        cx="40"
        cy="40"
        r="38"
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />

      {/* Vertical Divider */}
      <line
        x1="40"
        y1="20"
        x2="40"
        y2="60"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
      />

      {/* Left Side - User Icon (Patience) */}
      <g transform="translate(20, 30)">
        {/* Head */}
        <circle cx="0" cy="0" r="4" fill="white" />
        {/* Body */}
        <path
          d="M -5 10 Q -5 5, 0 5 Q 5 5, 5 10 L 5 15 Q 5 17, 3 17 L -3 17 Q -5 17, -5 15 Z"
          fill="white"
        />
      </g>

      {/* Right Side - Heart Icon (Her Promise) */}
      <g transform="translate(60, 32)">
        <path
          d="M 0 5 C 0 5, -2 0, -5 0 C -8 0, -9 2, -9 4 C -9 7, -7 9, 0 14 C 7 9, 9 7, 9 4 C 9 2, 8 0, 5 0 C 2 0, 0 5, 0 5 Z"
          fill="white"
        />
      </g>

      {/* Outer Ring for polish */}
      <circle
        cx="40"
        cy="40"
        r="38"
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
      />
    </svg>
  );
}

// Favicon version (simpler, optimized for small sizes)
export function LogoFavicon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="faviconGradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Background Circle */}
      <circle cx="16" cy="16" r="15" fill="url(#faviconGradient)" />

      {/* Vertical Divider */}
      <line
        x1="16"
        y1="8"
        x2="16"
        y2="24"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.5"
      />

      {/* Left - User Icon */}
      <g transform="translate(8, 12)">
        <circle cx="0" cy="0" r="2" fill="white" />
        <path
          d="M -2.5 5 Q -2.5 2.5, 0 2.5 Q 2.5 2.5, 2.5 5 L 2.5 7 Q 2.5 8, 1.5 8 L -1.5 8 Q -2.5 8, -2.5 7 Z"
          fill="white"
        />
      </g>

      {/* Right - Heart Icon */}
      <g transform="translate(24, 13)">
        <path
          d="M 0 2.5 C 0 2.5, -1 0, -2.5 0 C -4 0, -4.5 1, -4.5 2 C -4.5 3.5, -3.5 4.5, 0 7 C 3.5 4.5, 4.5 3.5, 4.5 2 C 4.5 1, 4 0, 2.5 0 C 1 0, 0 2.5, 0 2.5 Z"
          fill="white"
        />
      </g>
    </svg>
  );
}
