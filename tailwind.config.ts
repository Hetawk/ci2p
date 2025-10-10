import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================
        // CI2P LAB BRAND COLORS
        // Modern Tech-Inspired Palette
        // ============================================

        // Primary: Deep Tech Blue (Intelligence & Innovation)
        primary: {
          50: "#eff6ff", // Ice blue - backgrounds
          100: "#dbeafe", // Sky blue - subtle highlights
          200: "#bfdbfe", // Light blue - cards
          300: "#93c5fd", // Soft blue - hover states
          400: "#60a5fa", // Medium blue - interactive
          500: "#3b82f6", // PRIMARY - main brand color
          600: "#2563eb", // Deep blue - emphasis
          700: "#1d4ed8", // Dark blue - headings
          800: "#1e40af", // Navy blue - text
          900: "#1e3a8a", // Deep navy - dark mode
          950: "#172554", // Darkest - backgrounds
        },

        // Secondary: Cyber Cyan (Data & Computing)
        secondary: {
          50: "#ecfeff", // Ice cyan
          100: "#cffafe", // Light cyan
          200: "#a5f3fc", // Sky cyan
          300: "#67e8f9", // Bright cyan
          400: "#22d3ee", // Vibrant cyan
          500: "#06b6d4", // SECONDARY - accent color
          600: "#0891b2", // Deep cyan
          700: "#0e7490", // Dark cyan
          800: "#155e75", // Navy cyan
          900: "#164e63", // Darkest cyan
        },

        // Accent: Electric Purple (AI & Machine Learning)
        accent: {
          50: "#faf5ff", // Lavender
          100: "#f3e8ff", // Light purple
          200: "#e9d5ff", // Soft purple
          300: "#d8b4fe", // Medium purple
          400: "#c084fc", // Bright purple
          500: "#a855f7", // ACCENT - AI/ML highlight
          600: "#9333ea", // Deep purple
          700: "#7e22ce", // Dark purple
          800: "#6b21a8", // Rich purple
          900: "#581c87", // Darkest purple
        },
        // Success: Emerald Green (Achievements & Success)
        success: {
          50: "#ecfdf5", // Mint
          100: "#d1fae5", // Light green
          200: "#a7f3d0", // Soft green
          300: "#6ee7b7", // Medium green
          400: "#34d399", // Bright green
          500: "#10b981", // SUCCESS - positive actions
          600: "#059669", // Deep green
          700: "#047857", // Dark green
          800: "#065f46", // Forest green
          900: "#064e3b", // Darkest green
        },

        // Warning: Amber Orange (Alerts & Attention)
        warning: {
          50: "#fffbeb", // Cream
          100: "#fef3c7", // Light amber
          200: "#fde68a", // Soft amber
          300: "#fcd34d", // Medium amber
          400: "#fbbf24", // Bright amber
          500: "#f59e0b", // WARNING - attention needed
          600: "#d97706", // Deep amber
          700: "#b45309", // Dark amber
          800: "#92400e", // Brown amber
          900: "#78350f", // Darkest amber
        },

        // Danger: Red (Errors & Critical)
        danger: {
          50: "#fef2f2", // Pink tint
          100: "#fee2e2", // Light red
          200: "#fecaca", // Soft red
          300: "#fca5a5", // Medium red
          400: "#f87171", // Bright red
          500: "#ef4444", // DANGER - errors
          600: "#dc2626", // Deep red
          700: "#b91c1c", // Dark red
          800: "#991b1b", // Crimson
          900: "#7f1d1d", // Darkest red
        },

        // Neutral: Modern Grays (Text & Backgrounds)
        neutral: {
          50: "#fafafa", // Almost white
          100: "#f5f5f5", // Light gray
          200: "#e5e5e5", // Soft gray
          300: "#d4d4d4", // Medium gray
          400: "#a3a3a3", // Gray
          500: "#737373", // NEUTRAL - default text
          600: "#525252", // Dark gray
          700: "#404040", // Charcoal
          800: "#262626", // Deep charcoal
          900: "#171717", // Almost black
          950: "#0a0a0a", // Pure black
        },
        // ============================================
        // SHADCN UI COMPATIBILITY
        // ============================================
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        // ============================================
        // CI2P LAB GRADIENTS
        // Professional Tech-Inspired Backgrounds
        // ============================================

        // Primary Gradients
        "gradient-primary":
          "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
        "gradient-primary-soft":
          "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",

        // Secondary Gradients (Cyber Cyan)
        "gradient-secondary":
          "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
        "gradient-cyber":
          "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #a855f7 100%)",

        // Hero Backgrounds
        "gradient-hero":
          "linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #1e3a8a 100%)",
        "gradient-hero-light":
          "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #93c5fd 100%)",

        // Dashboard Backgrounds
        "gradient-dash": "linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)",
        "gradient-dash-dark":
          "linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)",

        // Card Backgrounds
        "gradient-card":
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        "gradient-card-hover":
          "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,197,253,0.05) 100%)",

        // Accent Gradients
        "gradient-ai":
          "linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #d8b4fe 100%)",
        "gradient-success":
          "linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)",
        "gradient-warning":
          "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)",

        // Mesh Gradients (Modern)
        "gradient-mesh":
          "radial-gradient(at 40% 20%, #3b82f6 0%, transparent 50%), radial-gradient(at 80% 0%, #06b6d4 0%, transparent 50%), radial-gradient(at 0% 50%, #a855f7 0%, transparent 50%)",

        // Utility
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["'Fira Code'", "ui-monospace", "monospace"],
      },

      // ============================================
      // BOX SHADOWS - Depth & Elevation
      // ============================================
      boxShadow: {
        "glow-sm": "0 0 10px rgba(59, 130, 246, 0.3)",
        glow: "0 0 20px rgba(59, 130, 246, 0.4)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.5)",
        "glow-primary": "0 0 30px rgba(59, 130, 246, 0.6)",
        "glow-secondary": "0 0 30px rgba(6, 182, 212, 0.6)",
        "glow-accent": "0 0 30px rgba(168, 85, 247, 0.6)",
        card: "0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        "card-hover":
          "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
        elevated: "0 20px 50px rgba(0, 0, 0, 0.15)",
      },

      // ============================================
      // SPACING - Consistent Layout
      // ============================================
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ============================================
      // TYPOGRAPHY - Professional Scales
      // ============================================
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["2rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.5rem", { lineHeight: "2.75rem" }],
        "5xl": ["3rem", { lineHeight: "3.25rem" }],
        "6xl": ["3.75rem", { lineHeight: "4rem" }],
        "7xl": ["4.5rem", { lineHeight: "4.75rem" }],
        "8xl": ["6rem", { lineHeight: "6.25rem" }],
        "9xl": ["8rem", { lineHeight: "8.25rem" }],
      },

      // ============================================
      // Z-INDEX - Layering System
      // ============================================
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      animation: {
        // ============================================
        // CI2P LAB ANIMATIONS
        // Smooth, Professional, Tech-Inspired
        // ============================================

        // Entrance Animations
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "fade-in-down": "fadeInDown 0.8s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "slide-left": "slideLeft 0.6s ease-out",
        "slide-right": "slideRight 0.6s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
        "zoom-in": "zoomIn 0.5s ease-out",

        // Continuous Animations
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",

        // Glow Effects
        glow: "glow 2s ease-in-out infinite",
        "glow-primary": "glowPrimary 2s ease-in-out infinite",
        "glow-secondary": "glowSecondary 2s ease-in-out infinite",
        "glow-accent": "glowAccent 2s ease-in-out infinite",

        // Rotation
        "spin-slow": "spin 8s linear infinite",
        "spin-slower": "spin 12s linear infinite",
        "spin-reverse": "spinReverse 8s linear infinite",

        // Shimmer Effect
        shimmer: "shimmer 2s infinite",
        "shimmer-slow": "shimmer 3s infinite",

        // Wave Effect
        wave: "wave 1.5s ease-in-out infinite",

        // Typing Effect
        typing: "typing 3.5s steps(40, end), blink 0.75s step-end infinite",

        // Gradient Animation
        "gradient-x": "gradientX 3s ease infinite",
        "gradient-y": "gradientY 3s ease infinite",
        "gradient-xy": "gradientXY 3s ease infinite",
      },
      keyframes: {
        // Fade Animations
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        // Slide Animations
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },

        // Scale Animations
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },

        // Float Animation
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },

        // Glow Animations
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.8)" },
        },
        glowPrimary: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.6)",
          },
        },
        glowSecondary: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(6, 182, 212, 0.8), 0 0 80px rgba(6, 182, 212, 0.6)",
          },
        },
        glowAccent: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.6)",
          },
        },

        // Spin Reverse
        spinReverse: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },

        // Shimmer Effect
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },

        // Wave Effect
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(20deg)" },
          "75%": { transform: "rotate(-20deg)" },
        },

        // Typing Effect
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },

        // Gradient Animations
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        gradientY: {
          "0%, 100%": { backgroundPosition: "50% 0%" },
          "50%": { backgroundPosition: "50% 100%" },
        },
        gradientXY: {
          "0%, 100%": { backgroundPosition: "0% 0%" },
          "25%": { backgroundPosition: "100% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "75%": { backgroundPosition: "0% 100%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
