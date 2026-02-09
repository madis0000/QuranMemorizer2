import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Flower2,
  Headphones,
  Heart,
  Leaf,
  LogIn,
  Mic,
  Repeat,
  Sparkles,
  Sprout,
  TreePine,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                       */
/* ------------------------------------------------------------------ */

const journeySteps = [
  {
    icon: Sprout,
    label: "Plant a Seed",
    description: "Begin with your very first verse. Every Hafiz started here.",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    icon: Leaf,
    label: "Watch It Grow",
    description:
      "Practice daily with AI feedback and spaced repetition. Watch your garden bloom.",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    icon: TreePine,
    label: "Harvest the Fruit",
    description:
      "Complete surahs, earn landmarks, and build your personal Garden of Jannah.",
    color: "bg-green-200 text-green-800 border-green-300",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions rendered with pixel-perfect accuracy, matching the physical Mushaf you love.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud for instant word-level feedback. Dual-engine: Web Speech + Whisper Arabic.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Science-backed scheduling trained on 700M+ reviews. 30% fewer reps, same retention.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Coaching",
    description:
      "Real-time detection, color-coded highlighting, audio analysis, and animated guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "First letter, random blank, translation recall, audio recall, and more. Build deep memory.",
  },
  {
    icon: Trophy,
    title: "50+ Achievements & Leagues",
    description:
      "Five competitive tiers, daily challenges, streak multipliers, and your own growing garden.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description:
      "Ayah-by-ayah following with word-level sync, adjustable speed, and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device. All data persists locally and syncs when you reconnect.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "604-page heatmap, fluency trends, accuracy metrics, and personalized study recommendations.",
  },
];

const stats = [
  {
    value: "114",
    label: "Surahs",
    bg: "bg-green-50",
    border: "border-green-200",
    accent: "text-green-800",
  },
  {
    value: "6,236",
    label: "Ayahs",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "text-emerald-800",
  },
  {
    value: "7+",
    label: "Mushaf Editions",
    bg: "bg-lime-50",
    border: "border-lime-200",
    accent: "text-lime-800",
  },
  {
    value: "100+",
    label: "Translations",
    bg: "bg-teal-50",
    border: "border-teal-200",
    accent: "text-teal-800",
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

export default function GardenOfJannahPage() {
  return (
    <div className="min-h-screen bg-[#FAFDF7] text-gray-900 selection:bg-green-200">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-green-100 bg-[#FAFDF7]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-green-600"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14532D] shadow-sm transition-transform group-hover:scale-105">
              <Leaf className="h-5 w-5 text-green-200" />
            </div>
            <span className="text-lg font-bold text-[#14532D]">
              QuranMemorizer
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-green-700 hover:bg-green-50 hover:text-green-900 focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <Link href="/login">
                <LogIn className="mr-1.5 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-[#14532D] font-semibold text-white hover:bg-green-950 focus-visible:ring-2 focus-visible:ring-green-600"
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
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-green-50/80 via-[#DCFCE7]/50 to-[#FAFDF7]" />

        {/* Decorative scattered leaf/tree icons at low opacity */}
        <div
          className="pointer-events-none absolute left-[5%] top-20 opacity-[0.06]"
          aria-hidden="true"
        >
          <Leaf className="h-28 w-28 rotate-45 text-green-800" />
        </div>
        <div
          className="pointer-events-none absolute right-[8%] top-32 opacity-[0.05]"
          aria-hidden="true"
        >
          <TreePine className="h-24 w-24 -rotate-12 text-green-700" />
        </div>
        <div
          className="pointer-events-none absolute bottom-24 left-[15%] opacity-[0.05]"
          aria-hidden="true"
        >
          <Flower2 className="h-20 w-20 rotate-12 text-green-600" />
        </div>
        <div
          className="pointer-events-none absolute bottom-32 right-[12%] opacity-[0.06]"
          aria-hidden="true"
        >
          <Sprout className="h-16 w-16 text-green-700" />
        </div>
        <div
          className="pointer-events-none absolute left-[45%] top-16 opacity-[0.04]"
          aria-hidden="true"
        >
          <Leaf className="h-14 w-14 -rotate-45 text-green-800" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-36">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-5 py-2 text-sm font-medium text-green-800 shadow-sm">
              <Sprout className="h-4 w-4 text-green-600" />
              Grow your Quran garden
            </div>

            {/* Main heading */}
            <h1 className="text-balance mb-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
              <span className="text-[#14532D]">Plant the Seeds of</span>
              <br />
              <span className="bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
                Quran Memorization
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-green-800/50 sm:text-xl">
              Every verse you memorize grows a flower. Every page, a tree. Every
              surah, a landmark in your Garden of Jannah. Watch your knowledge
              bloom with AI-powered learning, spaced repetition, and real-time
              Tajweed coaching.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group bg-[#14532D] px-8 text-base font-semibold text-white shadow-lg shadow-green-900/20 hover:bg-green-950 focus-visible:ring-2 focus-visible:ring-green-600 sm:text-lg"
              >
                <Link href="/register">
                  <Sprout className="mr-2 h-5 w-5" />
                  Start Your Garden
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-green-300 bg-white/60 px-8 text-base text-green-800 hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-600 sm:text-lg"
              >
                <Link href="/quran">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Open the Mushaf
                </Link>
              </Button>
            </div>

            {/* Stats as garden "plot" cards */}
            <div className="mt-20 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border px-6 py-5 shadow-sm transition-transform hover:scale-[1.03] ${stat.bg} ${stat.border}`}
                >
                  <p
                    className={`text-3xl font-bold tabular-nums sm:text-4xl ${stat.accent}`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-green-700/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== JOURNEY SECTION ==================== */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-700">
              Your Journey
            </p>
            <h2 className="text-balance text-3xl font-bold text-[#14532D] sm:text-4xl">
              From Seed to Paradise Garden
            </h2>
          </div>

          {/* Steps with connector lines */}
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-0">
              {journeySteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  {/* Step card */}
                  <div className="flex w-64 flex-col items-center px-4 text-center">
                    <div
                      className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border ${step.color}`}
                    >
                      <step.icon className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-[#14532D]">
                      {step.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-green-700/50">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector line */}
                  {i < journeySteps.length - 1 ? (
                    <div
                      className="hidden h-px w-16 bg-gradient-to-r from-green-300 to-green-100 md:block"
                      aria-hidden="true"
                    />
                  ) : null}
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-700">
              Features
            </p>
            <h2 className="text-balance mb-4 text-3xl font-bold text-[#14532D] sm:text-4xl">
              Nurture Your Memorization
            </h2>
            <p className="mx-auto max-w-xl text-lg text-green-700/50">
              A complete toolkit that blends modern science with the timeless
              wisdom of traditional Hifz methods.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-green-100 bg-green-50/40 p-6 transition-all hover:-translate-y-1 hover:border-green-200 hover:bg-green-50 hover:shadow-lg hover:shadow-green-100/50"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-700 transition-colors group-hover:bg-green-100">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#14532D]">
                  {f.title}
                </h3>
                <p className="leading-relaxed text-green-700/50">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-gradient-to-b from-green-50/80 to-green-100/40 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <TreePine className="mx-auto mb-6 h-12 w-12 text-green-700/70" />
          <h2 className="text-balance mb-4 text-3xl font-bold text-[#14532D] sm:text-4xl">
            Your Garden Awaits
          </h2>
          <p className="mb-10 text-lg text-green-700/50">
            Every great Hafiz began with a single verse. Plant your first seed
            today &mdash; QuranMemorizer is 100% free, forever.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="group bg-[#14532D] px-10 text-base font-semibold text-white shadow-lg shadow-green-900/20 hover:bg-green-950 focus-visible:ring-2 focus-visible:ring-green-600 sm:text-lg"
            >
              <Link href="/register">
                Plant Your First Seed
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-green-700 hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <Link href="/quran">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore First
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-green-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#14532D]">
                <Leaf className="h-4 w-4 text-green-200" />
              </div>
              <span className="font-bold text-[#14532D]">QuranMemorizer</span>
            </Link>

            <nav
              className="flex flex-wrap items-center gap-6"
              aria-label="Footer"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded text-sm text-green-600/50 transition-colors hover:text-green-700 focus-visible:ring-2 focus-visible:ring-green-600"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="flex items-center gap-1.5 text-sm text-green-600/40">
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              Made with love for the Ummah
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
