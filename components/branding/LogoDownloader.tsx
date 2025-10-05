"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { Download, CheckCircle } from "lucide-react";

interface DownloadButtonProps {
  size: number;
  label: string;
}

function DownloadButton({ size, label }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const downloadAsPNG = async () => {
    setDownloading(true);

    try {
      // Create a temporary container
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      // Render the logo SVG
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", size.toString());
      svg.setAttribute("height", size.toString());
      svg.setAttribute("viewBox", "0 0 80 80");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

      // Add the SVG content (matching Logo component)
      svg.innerHTML = `
        <defs>
          <linearGradient id="logoGradient-${size}" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#06b6d4" />
          </linearGradient>
          <filter id="glow-${size}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="40" cy="40" r="38" fill="url(#logoGradient-${size})" filter="url(#glow-${size})" />
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

      container.appendChild(svg);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create canvas and convert to PNG
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, size, size);

        // Convert canvas to PNG blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `logo-${size}x${size}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setDownloading(false);
            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 2000);
          }
        }, "image/png");

        URL.revokeObjectURL(svgUrl);
        document.body.removeChild(container);
      };

      img.src = svgUrl;
    } catch (error) {
      console.error("Download failed:", error);
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={downloadAsPNG}
      disabled={downloading || downloaded}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm
        ${
          downloaded
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {downloaded ? (
        <>
          <CheckCircle className="w-4 h-4" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>{downloading ? "Downloading..." : label}</span>
        </>
      )}
    </button>
  );
}

function ICODownloadButton() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const downloadAsICO = async () => {
    setDownloading(true);

    try {
      // Create multiple PNG images for multi-resolution ICO
      const icoSizes = [16, 32, 48];
      const pngDataUrls: { size: number; data: string }[] = [];

      // Generate PNG data for each size
      for (const size of icoSizes) {
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        document.body.appendChild(container);

        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", size.toString());
        svg.setAttribute("height", size.toString());
        svg.setAttribute("viewBox", "0 0 80 80");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        svg.innerHTML = `
          <defs>
            <linearGradient id="logoGradient-ico-${size}" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#06b6d4" />
            </linearGradient>
            <filter id="glow-ico-${size}" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="40" cy="40" r="38" fill="url(#logoGradient-ico-${size})" filter="url(#glow-ico-${size})" />
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

        container.appendChild(svg);

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Convert to PNG data URL
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx?.drawImage(img, 0, 0, size, size);
            const dataUrl = canvas.toDataURL("image/png");
            pngDataUrls.push({ size, data: dataUrl });
            URL.revokeObjectURL(svgUrl);
            document.body.removeChild(container);
            resolve(null);
          };
          img.src = svgUrl;
        });
      }

      // Create ICO file from PNG data
      const icoBlob = await createICOFromPNGs(pngDataUrls);
      const url = URL.createObjectURL(icoBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "favicon.ico";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (error) {
      console.error("ICO download failed:", error);
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={downloadAsICO}
      disabled={downloading || downloaded}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-sm
        ${
          downloaded
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {downloaded ? (
        <>
          <CheckCircle className="w-5 h-5" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>
            {downloading ? "Generating ICO..." : "Download ICO (16, 32, 48)"}
          </span>
        </>
      )}
    </button>
  );
}

// Helper function to create ICO file from PNG data URLs
async function createICOFromPNGs(
  pngDataUrls: { size: number; data: string }[]
): Promise<Blob> {
  // ICO file format specification
  const numImages = pngDataUrls.length;

  // Convert data URLs to raw PNG data
  const pngBuffers = await Promise.all(
    pngDataUrls.map(async ({ data }) => {
      const base64Data = data.split(",")[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    })
  );

  // Calculate total file size
  const headerSize = 6; // ICONDIR header
  const entrySize = 16 * numImages; // ICONDIRENTRY for each image
  const totalSize =
    headerSize +
    entrySize +
    pngBuffers.reduce((sum, buf) => sum + buf.length, 0);

  // Create ICO file buffer
  const icoBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(icoBuffer);
  const uint8View = new Uint8Array(icoBuffer);

  let offset = 0;

  // Write ICONDIR header
  view.setUint16(offset, 0, true); // Reserved (must be 0)
  offset += 2;
  view.setUint16(offset, 1, true); // Type (1 = ICO)
  offset += 2;
  view.setUint16(offset, numImages, true); // Number of images
  offset += 2;

  // Write ICONDIRENTRY for each image
  let imageOffset = headerSize + entrySize;
  for (let i = 0; i < numImages; i++) {
    const size = pngDataUrls[i].size;
    const imageData = pngBuffers[i];

    view.setUint8(offset, size === 256 ? 0 : size); // Width (0 = 256)
    offset += 1;
    view.setUint8(offset, size === 256 ? 0 : size); // Height (0 = 256)
    offset += 1;
    view.setUint8(offset, 0); // Color palette (0 = no palette)
    offset += 1;
    view.setUint8(offset, 0); // Reserved
    offset += 1;
    view.setUint16(offset, 1, true); // Color planes
    offset += 2;
    view.setUint16(offset, 32, true); // Bits per pixel
    offset += 2;
    view.setUint32(offset, imageData.length, true); // Size of image data
    offset += 4;
    view.setUint32(offset, imageOffset, true); // Offset to image data
    offset += 4;

    imageOffset += imageData.length;
  }

  // Write image data
  for (const imageData of pngBuffers) {
    uint8View.set(imageData, offset);
    offset += imageData.length;
  }

  return new Blob([icoBuffer], { type: "image/x-icon" });
}

export function LogoDownloader() {
  const sizes = [
    { size: 16, label: "16x16 (Favicon)" },
    { size: 32, label: "32x32 (Favicon)" },
    { size: 48, label: "48x48" },
    { size: 64, label: "64x64" },
    { size: 120, label: "120x120" },
    { size: 180, label: "180x180 (Apple)" },
    { size: 192, label: "192x192 (Android)" },
    { size: 512, label: "512x512 (Android)" },
  ];

  const downloadSVG = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "512");
    svg.setAttribute("height", "512");
    svg.setAttribute("viewBox", "0 0 80 80");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    svg.innerHTML = `
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#logoGradient)" filter="url(#glow)" />
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
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* SVG Download */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Download SVG (Vector)
        </h2>
        <p className="text-gray-600 mb-4">
          Scalable vector format - best for print and web
        </p>
        <button
          onClick={downloadSVG}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:shadow-lg shadow-sm"
        >
          <Download className="w-5 h-5" />
          <span>Download SVG</span>
        </button>
      </div>

      {/* PNG Downloads */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Download PNG (Raster)
        </h2>
        <p className="text-gray-600 mb-6">Click any size to download as PNG</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sizes.map(({ size, label }) => (
            <div
              key={size}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Logo size={32} />
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </div>
              <DownloadButton size={size} label="PNG" />
            </div>
          ))}
        </div>
      </div>

      {/* ICO Download */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Download ICO (Favicon)
        </h2>
        <p className="text-gray-600 mb-4">
          Multi-resolution ICO file for browser favicons (includes 16x16, 32x32,
          48x48)
        </p>
        <div className="flex items-center gap-4">
          <ICODownloadButton />
          <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Perfect for use as{" "}
              <code className="bg-white px-1 rounded">favicon.ico</code> in your
              website root
            </span>
          </div>
        </div>
      </div>

      {/* Download All */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Quick Tip</h2>
        <p className="text-gray-700">
          Click the buttons above to download individual files. Each PNG will be
          downloaded with the correct dimensions and optimized for its use case
          (favicon, app icons, etc.). The ICO file contains multiple resolutions
          in a single file for maximum browser compatibility.
        </p>
      </div>
    </div>
  );
}
