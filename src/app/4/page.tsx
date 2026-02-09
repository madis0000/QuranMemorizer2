import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Globe,
  Headphones,
  LogIn,
  Mic,
  Repeat,
  Sparkles,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                       */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions with pixel-perfect layout matching your physical Mushaf. Madinah, IndoPak, and more.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Dual-engine system with Web Speech API and Whisper Arabic Quran model. Automatic fallback.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Trained on 700M+ reviews. 30% fewer repetitions for the same retention vs. SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time coaching with color-coded rules, audio analysis, and animated pronunciation visuals.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "Full hide, first letter, random blank, translation recall, audio recall, reverse recall, and more.",
  },
  {
    icon: Trophy,
    title: "50+ Achievements & Leagues",
    description:
      "Five competitive tiers, daily challenges, streak multipliers, and a Garden of Jannah to grow.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description:
      "Ayah-by-ayah following with word-level highlighting. Adjustable speed and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device. IndexedDB persistence with background sync when you reconnect.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "604-page mastery heatmap, fluency metrics, accuracy trends, and AI-generated study recommendations.",
  },
];

const stats = [
  { value: "114", label: "Surahs" },
  { value: "6,236", label: "Ayahs" },
  { value: "7+", label: "Editions" },
  { value: "100+", label: "Translations" },
];

const mushafLines = [
  "\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064E\u0647\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
  "\u0671\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F \u0644\u0650\u0644\u0651\u064E\u0647\u0650 \u0631\u064E\u0628\u0651\u0650 \u0671\u0644\u0652\u0639\u064E\u0640\u0670\u0644\u064E\u0645\u0650\u064A\u0646\u064E",
  "\u0671\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
  "\u0645\u064E\u0640\u0670\u0644\u0650\u0643\u0650 \u064A\u064E\u0648\u0652\u0645\u0650 \u0671\u0644\u062F\u0651\u0650\u064A\u0646\u0650",
];

const footerLinks = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Tajweed", href: "/tajweed" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function RoyalTealSplitPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-teal-200">
      {/* ==================== NAVIGATION (transparent overlay) ==================== */}
      <nav className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm transition-colors group-hover:bg-white/20">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">
              QuranMemorizer
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-teal-100 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              <Link href="/login">
                <LogIn className="mr-1.5 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-orange-500 font-semibold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-300"
            >
              <Link href="/register">
                <UserPlus className="mr-1.5 h-4 w-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO (Split Layout) ==================== */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden lg:min-h-[92vh]">
        {/* Left panel - deep teal */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#134E4A] via-[#0F3D3A] to-[#0A2B29] lg:w-[55%]" />

        {/* Right panel - light teal */}
        <div className="absolute right-0 top-0 hidden h-full w-[45%] bg-gradient-to-br from-teal-50 to-teal-100/40 lg:block" />

        {/* Organic wave SVG divider */}
        <div
          className="pointer-events-none absolute bottom-0 left-[50%] top-0 hidden w-[10%] lg:block"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 120 1000"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M70 0 C70 0, 20 120, 50 220 C80 320, 10 420, 60 520 C110 620, 20 720, 55 820 C90 920, 40 980, 70 1000 L0 1000 L0 0Z"
              fill="#134E4A"
            />
          </svg>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left content */}
            <div className="pt-24 lg:pt-0">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-4 py-1.5 text-sm text-teal-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
                </span>
                Now available &mdash; 100% free
              </div>

              <h1 className="text-balance mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Memorize
                <br />
                the Quran
                <br />
                <span className="text-orange-400">with AI</span>
              </h1>

              <p className="mb-8 max-w-md text-lg leading-relaxed text-teal-100/50">
                AI-powered voice recognition, FSRS-6 spaced repetition,
                real-time Tajweed coaching, page-accurate Mushaf, and deep
                gamification &mdash; all in one free app.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="group bg-orange-500 px-8 text-base font-semibold text-white shadow-xl shadow-orange-500/30 hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-300"
                >
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-teal-400/25 px-8 text-base text-teal-100 hover:bg-teal-400/10 focus-visible:ring-2 focus-visible:ring-teal-300"
                >
                  <Link href="/quran">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Open Mushaf
                  </Link>
                </Button>
              </div>

              {/* Stats integrated into hero left panel */}
              <div className="mt-14 grid grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="text-xs text-teal-300/40">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Mushaf preview mockup */}
            <div className="hidden items-center justify-center lg:flex">
              <div className="relative">
                {/* Glow behind card */}
                <div
                  className="absolute -inset-6 rounded-3xl bg-teal-500/10 blur-2xl"
                  aria-hidden="true"
                />

                {/* Device frame */}
                <div className="relative w-80 rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl">
                  {/* Top bar */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-teal-700">
                      Surah Al-Fatiha
                    </span>
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-200" />
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-200" />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-5 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent" />

                  {/* Arabic lines */}
                  <div className="space-y-5" dir="rtl">
                    {mushafLines.map((line, i) => (
                      <p
                        key={i}
                        className="text-center text-xl leading-loose text-teal-900"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Bottom bar */}
                  <div className="mt-6 flex items-center justify-center gap-1.5">
                    <div className="h-1 w-8 rounded-full bg-teal-400" />
                    <div className="h-1 w-8 rounded-full bg-teal-100" />
                    <div className="h-1 w-8 rounded-full bg-teal-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES (horizontal layout) ==================== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-700">
              Features
            </p>
            <h2 className="text-balance mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Memorize
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-500">
              Modern technology meets traditional Hifz wisdom.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group flex gap-4 rounded-xl p-5 transition-colors hover:bg-teal-50"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800 transition-colors group-hover:bg-teal-200">
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-semibold text-gray-900">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-gradient-to-br from-[#134E4A] to-[#0A2B29] py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance mb-4 text-3xl font-bold text-white sm:text-4xl">
            Begin Your Memorization Journey
          </h2>
          <p className="mb-10 text-lg text-teal-100/50">
            Join thousands of Muslims worldwide building a deeper relationship
            with the Quran &mdash; completely free.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="group bg-orange-500 px-10 text-base font-semibold text-white shadow-xl shadow-orange-500/30 hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-300"
            >
              <Link href="/register">
                Get Started Free
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/15 px-10 text-base text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            >
              <Link href="/quran">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse the Quran
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#134E4A]">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">
                QuranMemorizer
              </span>
            </Link>

            <nav
              className="flex flex-wrap items-center gap-6"
              aria-label="Footer"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded text-sm text-gray-400 transition-colors hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-400">Available worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
