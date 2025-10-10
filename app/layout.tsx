import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo-192x192.png",
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
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
