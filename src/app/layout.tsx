import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/lib/providers/query-provider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QuranMemorizer - AI-Powered Quran Memorization",
    template: "%s | QuranMemorizer",
  },
  description:
    "A comprehensive Quran memorization web application featuring AI-powered voice recognition, real-time mistake detection, and gamified learning experiences.",
  keywords: [
    "Quran",
    "Memorization",
    "Hifz",
    "Islamic",
    "AI",
    "Voice Recognition",
    "Tarteel",
    "Arabic",
  ],
  authors: [{ name: "QuranMemorizer" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QuranMemorizer",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0F5F2" },
    { media: "(prefers-color-scheme: dark)", color: "#080F0B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Arabic fonts for Quran display */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Scheherazade+New:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <ThemeProvider>
            <LocaleProvider>{children}</LocaleProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
