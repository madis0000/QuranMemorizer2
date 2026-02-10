import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Cache API responses
        urlPattern: /^https:\/\/api\.alquran\.cloud\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "quran-api-cache",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          },
        },
      },
      {
        // Cache audio files
        urlPattern: /^https:\/\/.*\.(mp3|wav|ogg)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "audio-cache",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
          rangeRequests: true,
        },
      },
      {
        // Cache fonts
        urlPattern: /^https:\/\/.*\.(woff|woff2|ttf|otf)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "font-cache",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        // Cache images
        urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Standalone output for Docker deployment
  output: "standalone",

  // Use webpack bundler (required for PWA plugin)
  // The PWA plugin uses webpack, not Turbopack
  turbopack: {},

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "framer-motion",
      "ts-fsrs",
    ],
  },
};

export default withPWA(nextConfig);
