import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GlobalLedgerBackground } from "@/components/effects";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CI2P Research Lab - University of Jinan",
  description:
    "Key Laboratory of Intelligent Computing Technology. Research excellence in Machine Learning, Artificial Intelligence, and Image Processing.",
  keywords: [
    "CI2P",
    "Research Lab",
    "University of Jinan",
    "Machine Learning",
    "Artificial Intelligence",
    "Image Processing",
    "Intelligent Computing",
  ],
  icons: {
    icon: "/ci2p_logo.png",
    apple: "/logo-192x192.png",
    shortcut: "/ci2p_logo.png",
  },
  openGraph: {
    title: "CI2P Research Lab - University of Jinan",
    description:
      "Key Laboratory of Intelligent Computing Technology. Research excellence in Machine Learning, AI, and Image Processing.",
    type: "website",
    locale: "en_US",
    siteName: "CI2P Research Lab",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-gradient-to-br from-slate-900 via-primary-900/10 to-slate-900`}
      >
        {/* Global Ledger Background - Visible across all pages */}
        <GlobalLedgerBackground
          showDataFlow={true}
          gridOpacity={0.5}
          dataFlowOpacity={0.25}
        />{" "}
        {/* Main Content - Positioned above background */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
