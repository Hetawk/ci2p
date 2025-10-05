"use client";

import { useState } from "react";
import { Logo, LogoFavicon, LogoDownloader } from "@/components/branding";
import Link from "next/link";
import { ArrowLeft, Download, CheckCircle, AlertCircle } from "lucide-react";

export default function LogoPage() {
  const [converting, setConverting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFaviconPNGs = async () => {
    setConverting(true);
    setError(null);
    setSuccess(false);

    try {
      const sizes = [16, 32, 48];
      const canvases = await Promise.all(
        sizes.map((size) => createCanvasFromSVG(size))
      );

      for (let i = 0; i < canvases.length; i++) {
        const canvas = canvases[i];
        const size = sizes[i];

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `favicon-${size}x${size}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      }

      setSuccess(true);
      setConverting(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to generate favicon. Please try again.");
      setConverting(false);
      console.error(err);
    }
  };

  const createCanvasFromSVG = (size: number): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", size.toString());
      svg.setAttribute("height", size.toString());
      svg.setAttribute("viewBox", "0 0 80 80");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

      svg.innerHTML = `
        <defs>
          <linearGradient id="logoGradient-${size}" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="38" fill="url(#logoGradient-${size})" />
        <line x1="40" y1="20" x2="40" y2="60" stroke="rgba(255, 255, 255, 0.3)" stroke-width="1" />
        <g transform="translate(20, 30)">
          <circle cx="0" cy="0" r="4" fill="white" />
          <path d="M -5 10 Q -5 5, 0 5 Q 5 5, 5 10 L 5 15 Q 5 17, 3 17 L -3 17 Q -5 17, -5 15 Z" fill="white" />
        </g>
        <g transform="translate(60, 32)">
          <path d="M 0 5 C 0 5, -2 0, -5 0 C -8 0, -9 2, -9 4 C -9 7, -7 9, 0 14 C 7 9, 9 7, 9 4 C 9 2, 8 0, 5 0 C 2 0, 0 5, 0 5 Z" fill="white" />
        </g>
        <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1" />
      `;

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(svgUrl);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = svgUrl;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Logo & Branding Assets
            </h1>
            <p className="text-gray-600">
              Unified branding for Patience Fero & Her Promise Fulfilled
            </p>
          </div>
        </div>

        {/* Quick Favicon Generator */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ⚡ Quick Favicon Generator
          </h2>
          <p className="text-gray-700 mb-6">
            Generate favicon PNG files (16x16, 32x32, 48x48) with one click.
            Then convert to .ico using{" "}
            <a
              href="https://convertio.co/png-ico/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              convertio.co
            </a>
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Favicon files generated! Check your downloads folder.</span>
            </div>
          )}

          <button
            onClick={generateFaviconPNGs}
            disabled={converting}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:shadow-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>
              {converting ? "Generating..." : "Generate Favicon PNGs"}
            </span>
          </button>
        </div>

        {/* Logo Downloads */}
        <LogoDownloader />

        {/* Logo Variations */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Logo Variations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="text-center space-y-2">
              <Logo size={40} />
              <p className="text-sm text-gray-600">40px</p>
            </div>
            <div className="text-center space-y-2">
              <Logo size={60} />
              <p className="text-sm text-gray-600">60px</p>
            </div>
            <div className="text-center space-y-2">
              <Logo size={80} />
              <p className="text-sm text-gray-600">80px (default)</p>
            </div>
            <div className="text-center space-y-2">
              <Logo size={120} />
              <p className="text-sm text-gray-600">120px</p>
            </div>
          </div>
        </div>

        {/* Favicon Versions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Favicon Versions
          </h2>
          <div className="flex gap-8 items-center justify-center">
            <div className="text-center space-y-2">
              <div className="inline-block p-4 bg-gray-100 rounded">
                <LogoFavicon size={16} />
              </div>
              <p className="text-sm text-gray-600">16px</p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-block p-4 bg-gray-100 rounded">
                <LogoFavicon size={32} />
              </div>
              <p className="text-sm text-gray-600">32px</p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-block p-4 bg-gray-100 rounded">
                <LogoFavicon size={48} />
              </div>
              <p className="text-sm text-gray-600">48px</p>
            </div>
          </div>
        </div>

        {/* Dark Background */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">
            On Dark Background
          </h2>
          <div className="flex gap-8 items-center justify-center">
            <Logo size={60} />
            <Logo size={80} />
            <Logo size={100} />
          </div>
        </div>

        {/* Design Details */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Design Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-gradient-to-r from-[#3b82f6] to-[#06b6d4]"></div>
                  <div>
                    <p className="text-sm font-medium">#3b82f6 → #06b6d4</p>
                    <p className="text-xs text-gray-600">Blue Gradient</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Symbolism</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <strong>Left (User):</strong> Patience Fero - Personal Brand
                </li>
                <li>
                  <strong>Right (Heart):</strong> Her Promise Fulfilled -
                  Organization
                </li>
                <li>
                  <strong>Circle:</strong> Unity and wholeness
                </li>
                <li>
                  <strong>Divider:</strong> Dual identity, balanced approach
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📝 Usage Guidelines
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">📱 Favicons</h3>
              <p className="text-sm">
                Use 16x16 and 32x32 for browser favicons. Convert to .ico using{" "}
                <a
                  href="https://convertio.co/png-ico/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  convertio.co
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🍎 Apple Touch Icon</h3>
              <p className="text-sm">Use 180x180 for iOS home screen icons</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🤖 Android Icons</h3>
              <p className="text-sm">
                Use 192x192 and 512x512 for Android app icons
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">💼 General Use</h3>
              <p className="text-sm">
                Use 48x48, 64x64, or 120x120 for websites and documents
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎨 Vector (SVG)</h3>
              <p className="text-sm">
                Use SVG for unlimited scaling - perfect for print and
                high-resolution displays
              </p>
            </div>
          </div>
        </div>

        {/* Usage Code */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Usage</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`import { Logo, LogoFavicon } from "@/components/branding";

// Full logo
<Logo />

// Custom size
<Logo size={120} />

// Favicon version
<LogoFavicon size={32} />`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
