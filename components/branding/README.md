# Branding Assets

## Logo Component

The logo is a circular split design that represents both Patience Fero (left side with user icon) and Her Promise Fulfilled (right side with heart icon).

### Usage

```tsx
import { Logo, LogoFavicon } from "@/components/branding";

// Full logo (default 80x80)
<Logo />

// Custom size
<Logo size={120} />

// With custom className
<Logo size={60} className="hover:scale-110 transition-transform" />

// Favicon version (optimized for small sizes)
<LogoFavicon size={32} />
```

## Design Details

- **Colors**: Blue gradient from `#3b82f6` to `#06b6d4`
- **Shape**: Circular with vertical divider
- **Left Side**: User icon representing Patience Fero
- **Right Side**: Heart icon representing Her Promise Fulfilled
- **Style**: Modern, clean, with glassmorphism effects

## Favicon Files

The favicon is automatically served from `app/ci2p_logo.png` and supports:

- Modern SVG favicon (scalable)
- Traditional ICO format
- Apple Touch Icon
- PWA manifest support

## Generating Additional Sizes

If you need PNG versions of the favicon:

1. Install sharp: `npm install --save-dev sharp`
2. Run the generator: `node scripts/generate-favicon.js`

This will generate:

- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
