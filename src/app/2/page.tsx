import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Globe,
  Headphones,
  Heart,
  LogIn,
  Mic,
  Moon,
  Repeat,
  Sparkles,
  Star,
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
      "Seven Mushaf editions rendered with pixel-perfect accuracy, matching the physical copy you know and love.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite any verse and receive instant, word-level accuracy feedback. Web Speech + Whisper dual engine.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "The most advanced scheduling algorithm available \u2014 30% fewer reviews for the same retention rate.",
  },
  {
    icon: Sparkles,
    title: "Tajweed Coaching",
    description:
      "13 rules detected in real time with color-coded highlighting and animated pronunciation guides.",
  },
  {
    icon: Trophy,
    title: "Gamified Motivation",
    description:
      "50+ achievements, five Quran-themed leagues, streak multipliers, and a Garden of Jannah to grow.",
  },
  {
    icon: Repeat,
    title: "8 Hide Modes",
    description:
      "Progressive difficulty from first-letter hints to full recall \u2014 build rock-solid memory pathways.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description:
      "Follow along ayah-by-ayah with renowned reciters. Word-level sync and adjustable playback speed.",
  },
  {
    icon: WifiOff,
    title: "Offline Ready",
    description:
      "Full PWA support. Download pages, audio, and progress for uninterrupted study anywhere.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "604-page mastery heatmap, fluency trends, accuracy metrics, and smart study recommendations.",
  },
];

const stats = [
  { value: "114", label: "Surahs", accent: "text-emerald-700" },
  { value: "6,236", label: "Ayahs", accent: "text-sky-700" },
  { value: "7+", label: "Mushaf Editions", accent: "text-amber-700" },
  { value: "100+", label: "Translations", accent: "text-rose-600" },
];

const whyUsItems = [
  {
    icon: Brain,
    title: "Scientifically Proven",
    text: "FSRS-6 achieves 99.6% superiority over SM-2 in A/B tests with 700M+ reviews analyzed.",
  },
  {
    icon: Mic,
    title: "Dual AI Voice Engine",
    text: "Web Speech API for speed, Whisper Arabic Quran model for accuracy. Seamless automatic fallback.",
  },
  {
    icon: Sparkles,
    title: "Real-Time Tajweed",
    text: "13 rules detected live with audio analysis, coaching panel, and animated visuals.",
  },
  {
    icon: Globe,
    title: "Truly Universal",
    text: "English, Arabic, and Urdu. 100+ translations. 7 Mushaf editions from around the world.",
  },
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

export default function MadinahDawnPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-emerald-200">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D7C66] shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              QuranMemorizer
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Link href="/login">
                <LogIn className="mr-1.5 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#0D7C66] font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-[#0a6b58] focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Link href="/register">
                <UserPlus className="mr-1.5 h-4 w-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFE8D6] via-[#FFF0E5] to-[#B8D4E3]">
        {/* Mosque silhouette SVG */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 w-full opacity-[0.07]"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#0D7C66"
            d="M0,260 L0,220 Q40,180 80,210 Q100,140 120,210 Q140,170 160,210 L160,160 Q175,60 190,160 L190,210 Q240,180 290,210 L290,150 C310,50 330,50 350,150 L350,210 Q400,175 450,210 Q470,160 490,210 L490,170 Q505,70 520,170 L520,210 Q580,180 640,210 L640,150 C660,50 680,50 700,150 L700,210 Q740,175 780,210 Q810,160 840,210 L840,170 Q855,70 870,170 L870,210 Q920,180 970,210 L970,150 C990,50 1010,50 1030,150 L1030,210 Q1080,180 1130,210 Q1160,160 1190,210 L1190,170 Q1205,70 1220,170 L1220,210 Q1270,180 1320,210 Q1360,170 1400,210 Q1420,220 1440,210 L1440,260Z"
          />
        </svg>

        {/* Crescent moon decorative */}
        <div
          className="pointer-events-none absolute right-[8%] top-12 sm:top-16"
          aria-hidden="true"
        >
          <Moon className="h-20 w-20 text-amber-400/15 sm:h-28 sm:w-28" />
        </div>

        {/* Radial glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-32 pt-20 sm:px-6 sm:pb-40 sm:pt-28 lg:px-8 lg:pb-48 lg:pt-36">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#0D7C66]/20 bg-white/60 px-5 py-2 text-sm font-medium text-[#0D7C66] backdrop-blur-sm shadow-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              The future of Quran memorization
            </div>

            {/* Main heading */}
            <h1 className="text-balance mb-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
              Your Path to Memorizing{" "}
              <span className="text-[#0D7C66]">the Quran</span> Starts at Dawn
            </h1>

            {/* Subtitle */}
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              AI-powered voice recognition, scientifically-proven spaced
              repetition, real-time Tajweed coaching, and a beautiful Mushaf
              experience &mdash; all in one free platform built to help you
              succeed.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group rounded-full bg-[#0D7C66] px-8 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-[#0a6b58] focus-visible:ring-2 focus-visible:ring-emerald-500 sm:text-lg"
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
                className="rounded-full border-[#0D7C66]/25 bg-white/60 px-8 text-base text-[#0D7C66] backdrop-blur-sm hover:border-[#0D7C66]/40 hover:bg-white/80 focus-visible:ring-2 focus-visible:ring-emerald-500 sm:text-lg"
              >
                <Link href="/quran">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Open the Mushaf
                </Link>
              </Button>
            </div>

            {/* Stats as glass cards */}
            <div className="mt-20 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/60 bg-white/50 px-6 py-5 shadow-sm backdrop-blur-sm transition-transform hover:scale-[1.03]"
                >
                  <p
                    className={`text-3xl font-bold tabular-nums sm:text-4xl ${stat.accent}`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#0D7C66]">
              Features
            </p>
            <h2 className="text-balance mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-500">
              A comprehensive toolkit that merges modern technology with the
              timeless wisdom of traditional Hifz methods.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/[0.06]"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-[#0D7C66] transition-colors group-hover:bg-emerald-100">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="leading-relaxed text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY US ==================== */}
      <section className="border-y border-emerald-100 bg-emerald-50/40 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#0D7C66]">
              Why QuranMemorizer
            </p>
            <h2 className="text-balance mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              What Sets Us Apart
            </h2>
            <p className="mb-16 text-lg text-gray-500">
              We built what we wished existed &mdash; the tool that combines
              every scientific and spiritual advantage for the aspiring Hafiz.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {whyUsItems.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-6 transition-all hover:shadow-md"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#0D7C66] text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white p-10 shadow-sm sm:p-16">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#0D7C66] text-white shadow-md shadow-emerald-500/20">
              <Heart className="h-7 w-7" />
            </div>
            <h2 className="text-balance mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Start Your Memorization Today
            </h2>
            <p className="mb-10 text-lg text-gray-500">
              Every journey of a thousand pages begins with a single ayah.
              QuranMemorizer is and always will be 100% free.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="group rounded-full bg-[#0D7C66] px-10 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-[#0a6b58] focus-visible:ring-2 focus-visible:ring-emerald-500 sm:text-lg"
              >
                <Link href="/register">
                  Create Free Account
                  <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-[#0D7C66] hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Link href="/quran">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore First
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-gray-100 bg-gray-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D7C66]">
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
                  className="rounded text-sm text-gray-400 transition-colors hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="flex items-center gap-1.5 text-sm text-gray-400">
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              Made with love for the Ummah
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
