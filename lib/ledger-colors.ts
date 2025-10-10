// Color Utility Functions for Ledger Visibility
// Automatically calculates optimal ledger colors based on background

/**
 * Parse CSS color string to RGB values
 */
export function parseColor(
  color: string
): { r: number; g: number; b: number } | null {
  // Handle rgb/rgba format
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }

  // Handle hex format
  const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16),
    };
  }

  return null;
}

/**
 * Calculate relative luminance (WCAG formula)
 * Returns value between 0 (darkest) and 1 (lightest)
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  // Convert to 0-1 range
  const [rs, gs, bs] = [r / 255, g / 255, b / 255];

  // Apply gamma correction
  const [R, G, B] = [rs, gs, bs].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  // Calculate luminance using WCAG formula
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate contrast ratio between two colors (WCAG)
 */
export function calculateContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if background is light or dark
 */
export function isLightBackground(r: number, g: number, b: number): boolean {
  const luminance = calculateLuminance(r, g, b);
  return luminance > 0.5;
}

/**
 * Get optimal ledger colors based on background luminance
 */
export function getOptimalLedgerColors(bgColor: string): {
  primary: string;
  secondary: string;
  accent: string;
  baseOpacity: number;
  maxOpacity: number;
  lineWidth: number;
  theme: "light" | "dark";
} {
  const rgb = parseColor(bgColor);

  if (!rgb) {
    // Default to dark theme if color parsing fails
    return {
      primary: "59, 130, 246",
      secondary: "6, 182, 212",
      accent: "168, 85, 247",
      baseOpacity: 0.4,
      maxOpacity: 0.9,
      lineWidth: 1.5,
      theme: "dark",
    };
  }

  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  const isLight = luminance > 0.5;

  if (isLight) {
    // Light background - use darker, more saturated colors with higher opacity
    return {
      primary: "30, 64, 175", // Dark blue (primary-800)
      secondary: "8, 145, 178", // Dark cyan (secondary-600)
      accent: "126, 34, 206", // Dark purple (accent-700)
      baseOpacity: 0.6, // Significantly increased for visibility
      maxOpacity: 0.9, // Increased for strong mouse interaction
      lineWidth: 2.5, // Thicker lines for better visibility
      theme: "light",
    };
  } else {
    // Dark background - use brighter colors
    return {
      primary: "96, 165, 250", // Bright blue (primary-400)
      secondary: "34, 211, 238", // Bright cyan (secondary-400)
      accent: "192, 132, 252", // Bright purple (accent-400)
      baseOpacity: 0.4,
      maxOpacity: 0.9,
      lineWidth: 1.5,
      theme: "dark",
    };
  }
}

/**
 * Get contrasting color for text/elements on a background
 */
export function getContrastingColor(bgColor: string): "light" | "dark" {
  const rgb = parseColor(bgColor);
  if (!rgb) return "dark";

  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.5 ? "dark" : "light";
}

/**
 * Adjust opacity based on color contrast
 * Higher contrast = can use lower opacity
 * Lower contrast = need higher opacity for visibility
 */
export function calculateOptimalOpacity(
  bgColor: string,
  ledgerColor: string
): number {
  const bgRgb = parseColor(bgColor);
  const ledgerRgb = parseColor(ledgerColor);

  if (!bgRgb || !ledgerRgb) return 0.5;

  const bgLuminance = calculateLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const ledgerLuminance = calculateLuminance(
    ledgerRgb.r,
    ledgerRgb.g,
    ledgerRgb.b
  );

  const contrast = calculateContrastRatio(bgLuminance, ledgerLuminance);

  // WCAG AAA requires 7:1 for text, but we can be more lenient for decorative elements
  // Adjust opacity to ensure at least 3:1 contrast
  if (contrast >= 7) return 0.3; // High contrast - can use low opacity
  if (contrast >= 4.5) return 0.4; // Good contrast
  if (contrast >= 3) return 0.5; // Minimum acceptable
  return 0.7; // Low contrast - need higher opacity
}

/**
 * Get background color of an element or its nearest colored ancestor
 */
export function getBackgroundColor(element: HTMLElement): string {
  let current: HTMLElement | null = element;

  while (current) {
    const bg = window.getComputedStyle(current).backgroundColor;

    // Check if background is not transparent
    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
      return bg;
    }

    current = current.parentElement;
  }

  // Default to body background or white
  return (
    window.getComputedStyle(document.body).backgroundColor ||
    "rgb(255, 255, 255)"
  );
}

/**
 * Generate gradient colors based on base color
 */
export function generateGradientColors(baseColor: string): {
  start: string;
  middle: string;
  end: string;
} {
  const rgb = parseColor(baseColor);

  if (!rgb) {
    return {
      start: baseColor,
      middle: baseColor,
      end: baseColor,
    };
  }

  const isLight = isLightBackground(rgb.r, rgb.g, rgb.b);

  if (isLight) {
    // For light backgrounds, create darker gradient
    return {
      start: `rgb(${Math.max(0, rgb.r - 20)}, ${Math.max(
        0,
        rgb.g - 20
      )}, ${Math.max(0, rgb.b - 20)})`,
      middle: baseColor,
      end: `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(
        0,
        rgb.g - 40
      )}, ${Math.max(0, rgb.b - 40)})`,
    };
  } else {
    // For dark backgrounds, create lighter gradient
    return {
      start: `rgb(${Math.min(255, rgb.r + 20)}, ${Math.min(
        255,
        rgb.g + 20
      )}, ${Math.min(255, rgb.b + 20)})`,
      middle: baseColor,
      end: `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(
        255,
        rgb.g + 40
      )}, ${Math.min(255, rgb.b + 40)})`,
    };
  }
}

/**
 * Color presets for common Tailwind CSS colors
 */
export const LEDGER_COLOR_PRESETS = {
  // White backgrounds
  "rgb(255, 255, 255)": {
    primary: "30, 64, 175",
    secondary: "8, 145, 178",
    accent: "126, 34, 206",
    baseOpacity: 0.6, // Increased
    maxOpacity: 0.9, // Increased
    lineWidth: 2.5, // Thicker
    theme: "light" as const,
  },
  // Slate backgrounds
  "rgb(248, 250, 252)": {
    // slate-50
    primary: "30, 58, 138",
    secondary: "7, 89, 133",
    accent: "107, 33, 168",
    baseOpacity: 0.6, // Increased
    maxOpacity: 0.85, // Increased
    lineWidth: 2.5, // Thicker
    theme: "light" as const,
  },
  // Gray backgrounds
  "rgb(249, 250, 251)": {
    // gray-50
    primary: "31, 41, 55",
    secondary: "17, 94, 89",
    accent: "109, 40, 217",
    baseOpacity: 0.6, // Increased
    maxOpacity: 0.9, // Increased
    lineWidth: 2.5, // Thicker
    theme: "light" as const,
  },
  // Blue tinted backgrounds
  "rgb(239, 246, 255)": {
    // blue-50
    primary: "29, 78, 216",
    secondary: "7, 89, 133",
    accent: "109, 40, 217",
    baseOpacity: 0.4,
    maxOpacity: 0.8,
    lineWidth: 2,
    theme: "light" as const,
  },
  // Dark backgrounds
  "rgb(15, 23, 42)": {
    // slate-900
    primary: "96, 165, 250",
    secondary: "34, 211, 238",
    accent: "192, 132, 252",
    baseOpacity: 0.4,
    maxOpacity: 0.9,
    lineWidth: 1.5,
    theme: "dark" as const,
  },
};

/**
 * Get ledger colors with preset fallback
 */
export function getLedgerColorsWithPresets(bgColor: string) {
  // Check if we have a preset for this color
  if (LEDGER_COLOR_PRESETS[bgColor as keyof typeof LEDGER_COLOR_PRESETS]) {
    return LEDGER_COLOR_PRESETS[bgColor as keyof typeof LEDGER_COLOR_PRESETS];
  }

  // Otherwise calculate optimal colors
  return getOptimalLedgerColors(bgColor);
}
