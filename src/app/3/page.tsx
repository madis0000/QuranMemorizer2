import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  Globe,
  Headphones,
  LogIn,
  Mic,
  Repeat,
  Shield,
  Sparkles,
  Trophy,
  UserPlus,
  WifiOff,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                       */
/* ------------------------------------------------------------------ */

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Why Us", href: "#why-us" },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions with pixel-perfect rendering. Madinah, IndoPak, and more \u2014 exactly as you know them.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Dual-engine system: Web Speech API for speed, Whisper Arabic Quran model for precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Next-gen scheduling trained on 700M+ reviews. 30% fewer repetitions for the same retention.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time rule identification with color-coded highlighting, coaching panels, and animated guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "Full hide, first letter, random blank, translation recall, audio recall, and more.",
  },
  {
    icon: Trophy,
    title: "50+ Achievements & Leagues",
    description:
      "Five Quran-themed competitive leagues, daily challenges, streak multipliers, and garden growth.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description:
      "Ayah-by-ayah following with word-level sync. Adjustable speed, background play, offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device. All data persists in IndexedDB and syncs when you reconnect.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "604-page mastery heatmap, fluency metrics, accuracy trends, weak-area identification.",
  },
];

const highlights = [
  {
    icon: Brain,
    text: "FSRS-6 spaced repetition \u2014 99.6% superiority over SM-2 in independent A/B tests",
  },
  {
    icon: Mic,
    text: "Dual-engine voice AI: Web Speech for speed + Whisper for Arabic Quran accuracy",
  },
  {
    icon: Sparkles,
    text: "13 Tajweed rules detected and coached in real time with animated visuals",
  },
  {
    icon: Repeat,
    text: "8 progressive hide modes from first-letter hints to full recall drills",
  },
  {
    icon: Shield,
    text: "Offline-first architecture \u2014 7 IndexedDB stores for uninterrupted study",
  },
  {
    icon: Zap,
    text: "Similar Verse Trainer \u2014 the #1 challenge for Huffaz, solved by no other app",
  },
];

const stats = [
  { value: "114", label: "Surahs" },
  { value: "6,236", label: "Ayahs" },
  { value: "7+", label: "Mushaf Editions" },
  { value: "100+", label: "Translations" },
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

export default function ModernSaaSPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-emerald-100">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 shadow-sm transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              QuranMemorizer
            </span>
          </Link>

          {/* Center nav links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Link href="/login">
                <LogIn className="mr-1.5 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-emerald-800 font-medium text-white hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* Soft green radial gradient */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-50/80 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-36">
          <div className="flex flex-col items-center text-center">
            {/* Badge with green pulse dot */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Now available &mdash; 100% free
            </div>

            {/* Main heading */}
            <h1 className="text-balance mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              The smartest way to{" "}
              <span className="text-emerald-800">memorize the Quran</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-12 max-w-xl text-lg leading-relaxed text-gray-500 sm:text-xl">
              AI-powered voice recognition. FSRS-6 spaced repetition.
              Page-accurate Mushaf. Real-time Tajweed coaching. All free, all
              offline-capable.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-emerald-800 px-8 text-base font-semibold text-white shadow-xl shadow-emerald-800/20 hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <Link href="/register">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Free Account
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 border-gray-200 px-8 text-base text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <Link href="/quran">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Try Without Account
                </Link>
              </Button>
            </div>

            {/* Stats row with pipe separators */}
            <div className="mt-20 flex flex-wrap items-center justify-center gap-x-4 gap-y-4 sm:gap-x-6">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 sm:gap-6"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums text-gray-900 sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="text-sm text-gray-400">{stat.label}</span>
                  </div>
                  {i < stats.length - 1 ? (
                    <span
                      className="hidden text-gray-200 lg:block"
                      aria-hidden="true"
                    >
                      |
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="bg-gray-50/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-800">
              Features
            </p>
            <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Memorize
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/[0.04]"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 transition-colors group-hover:bg-emerald-100">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-lg font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY US ==================== */}
      <section id="why-us" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-800">
                Why QuranMemorizer
              </p>
              <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
                Built with Cutting-Edge Technology
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-4">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-3.5 w-3.5 text-emerald-800" />
                  </div>
                  <span className="text-sm leading-relaxed text-gray-600">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-emerald-800 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance mb-4 text-3xl font-bold text-white sm:text-4xl">
            Begin Your Memorization Journey
          </h2>
          <p className="mb-10 text-lg text-emerald-100/60">
            Join thousands of Muslims worldwide improving their relationship
            with the Quran &mdash; completely free, forever.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="group h-12 bg-white px-10 text-base font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-white"
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
              className="h-12 border-white/20 px-10 text-base text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
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
              className="flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-800">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">QuranMemorizer</span>
            </Link>

            <nav
              className="flex flex-wrap items-center gap-6"
              aria-label="Footer"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded text-sm text-gray-400 transition-colors hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-emerald-600"
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
