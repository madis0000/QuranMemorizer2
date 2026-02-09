import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Flower2,
  Grid3X3,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Repeat,
  Sparkles,
  Sprout,
  Star,
  TreePine,
  Trees,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const socialProof = [
  { value: "10,000+", label: "Memorizers" },
  { value: "1.2M", label: "Ayahs Reviewed" },
  { value: "30K+", label: "Trees Grown" },
];

const gardenPreviewTrees = [
  {
    name: "Al-Fatihah",
    ayahs: 7,
    bloomed: 7,
    progress: 100,
    status: "mastered" as const,
    branches: ["Praise", "Guidance"],
  },
  {
    name: "Al-Baqarah",
    ayahs: 286,
    bloomed: 102,
    progress: 36,
    status: "growing" as const,
    branches: ["Faith", "Law", "Stories"],
  },
  {
    name: "Yasin",
    ayahs: 83,
    bloomed: 47,
    progress: 57,
    status: "growing" as const,
    branches: ["Resurrection", "Signs"],
  },
  {
    name: "Al-Mulk",
    ayahs: 30,
    bloomed: 18,
    progress: 60,
    status: "growing" as const,
    branches: ["Sovereignty"],
  },
  {
    name: "Al-Kawthar",
    ayahs: 3,
    bloomed: 3,
    progress: 100,
    status: "mastered" as const,
    branches: ["Abundance"],
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Choose a Surah",
    description:
      "Pick any of the 114 surahs. Start small with Al-Fatihah or go big with Al-Baqarah.",
    icon: BookOpen,
  },
  {
    step: 2,
    title: "Memorize Ayahs",
    description:
      "Use AI voice recognition, progressive hide modes, and spaced repetition to learn.",
    icon: Mic,
  },
  {
    step: 3,
    title: "Watch Your Garden Grow",
    description:
      "Each memorized ayah blooms a flower. Each surah grows a tree. Complete them all for Paradise.",
    icon: Trees,
  },
];

const biomeGrid = [
  { juz: 1, name: "Alif Lam Mim", progress: 85, unlocked: true },
  { juz: 2, name: "Sayaqul", progress: 62, unlocked: true },
  { juz: 3, name: "Tilkar Rusul", progress: 40, unlocked: true },
  { juz: 4, name: "Lan Tanaloo", progress: 28, unlocked: true },
  { juz: 5, name: "Wal Muhsanat", progress: 15, unlocked: true },
  { juz: 6, name: "La Yuhibbu", progress: 0, unlocked: false },
  { juz: 7, name: "Wa Idha Sami'u", progress: 0, unlocked: false },
  { juz: 8, name: "Wa Law Annana", progress: 0, unlocked: false },
  { juz: 9, name: "Qalal Mala", progress: 0, unlocked: false },
  { juz: 10, name: "Wa A'lamu", progress: 0, unlocked: false },
  { juz: 11, name: "Ya'tadhiruna", progress: 0, unlocked: false },
  { juz: 12, name: "Wa Ma Min", progress: 0, unlocked: false },
  { juz: 13, name: "Wa Ma Ubarri'u", progress: 0, unlocked: false },
  { juz: 14, name: "Rubama", progress: 0, unlocked: false },
  { juz: 15, name: "Subhanal Ladhi", progress: 0, unlocked: false },
  { juz: 16, name: "Qal Alam", progress: 0, unlocked: false },
  { juz: 17, name: "Iqtaraba", progress: 0, unlocked: false },
  { juz: 18, name: "Qad Aflaha", progress: 0, unlocked: false },
  { juz: 19, name: "Wa Qalal Ladhina", progress: 0, unlocked: false },
  { juz: 20, name: "Amman Khalaq", progress: 0, unlocked: false },
  { juz: 21, name: "Utlu Ma Uhiya", progress: 0, unlocked: false },
  { juz: 22, name: "Wa Man Yaqnut", progress: 0, unlocked: false },
  { juz: 23, name: "Wa Mali", progress: 0, unlocked: false },
  { juz: 24, name: "Faman Azlam", progress: 0, unlocked: false },
  { juz: 25, name: "Ilayhi Yuraddu", progress: 0, unlocked: false },
  { juz: 26, name: "Ha Mim", progress: 0, unlocked: false },
  { juz: 27, name: "Qala Fama", progress: 0, unlocked: false },
  { juz: 28, name: "Qad Sami' Allah", progress: 0, unlocked: false },
  { juz: 29, name: "Tabarakal Ladhi", progress: 10, unlocked: true },
  { juz: 30, name: "Amma", progress: 72, unlocked: true },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical Mushaf layouts.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Web Speech + Whisper AI for Quran precision.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "30% fewer reviews, higher retention than SM-2.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching and guides.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "Eight strategies for every memory pathway.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam weekly.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah sync with offline downloads.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install anywhere. Study without internet.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const testimonials = [
  {
    name: "Ahmad R.",
    role: "Hafiz Student, UK",
    quote:
      "Finally, a memorization app that makes me WANT to practice daily. Watching my garden grow is addictive.",
    rating: 5,
  },
  {
    name: "Fatima K.",
    role: "Teacher, Malaysia",
    quote:
      "The FSRS algorithm is a game-changer. My students retain more with fewer reviews. The Tajweed coaching saves me hours.",
    rating: 5,
  },
  {
    name: "Omar S.",
    role: "Software Engineer, US",
    quote:
      "As a developer, I appreciate the tech behind this. As a Muslim, I appreciate the thoughtfulness. Best of both worlds.",
    rating: 5,
  },
];

const pricingFeatures = [
  "114 Surah Trees with flower tracking",
  "AI Voice Recognition (Web Speech + Whisper)",
  "FSRS-6 Spaced Repetition engine",
  "13-Rule Tajweed detection and coaching",
  "8 Progressive Hide Modes",
  "Quran-Themed Leagues (5 tiers)",
  "Multi-Qari audio playback",
  "Offline-first PWA with sync",
  "30 Biome progress map",
  "50+ achievements and badges",
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Read Quran", href: "/quran" },
      { label: "Memorize", href: "/memorize" },
      { label: "Listen", href: "/listen" },
      { label: "Garden", href: "/garden" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Tajweed", href: "/tajweed" },
      { label: "Progress", href: "/progress" },
      { label: "Curriculum", href: "/curriculum" },
      { label: "Challenges", href: "/challenges" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Leagues", href: "/leagues" },
      { label: "Hifz Circles", href: "/circles" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Achievements", href: "/achievements" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: progress color                                             */
/* ------------------------------------------------------------------ */

function progressColor(progress: number): string {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 40) return "bg-emerald-400";
  if (progress > 0) return "bg-emerald-300";
  return "bg-gray-200";
}

function biomeColor(unlocked: boolean, progress: number): string {
  if (!unlocked) return "bg-gray-100 border-gray-200";
  if (progress >= 80) return "bg-emerald-100 border-emerald-300";
  if (progress >= 40) return "bg-emerald-50 border-emerald-200";
  return "bg-amber-50 border-amber-200";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ModernAppShowcaseLanding() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-[#059669] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none"
          >
            <Trees className="size-6 text-[#059669]" />
            <span>QuranMemorizer</span>
            <span className="ml-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-emerald-700">
              Free
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors duration-200 hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#059669]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-lg bg-[#059669] px-5 py-2 text-sm font-medium text-white shadow-md shadow-emerald-200/50 transition-all duration-200 hover:bg-[#047857] hover:shadow-lg hover:shadow-emerald-200/60 focus-visible:ring-2 focus-visible:ring-[#059669]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5">
              <Sparkles className="size-3.5 text-emerald-600" />
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-700">
                AI-Powered Memorization
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
              The smartest way to{" "}
              <span className="text-[#059669]">memorize the Quran</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#6B7280]">
              Every surah becomes a living tree. Every ayah blooms a flower.
              FSRS-6 spaced repetition, AI voice recognition, and real-time
              Tajweed coaching \u2014 all in one beautiful, free app.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="rounded-lg bg-[#059669] px-6 py-3 text-base font-medium text-white shadow-lg shadow-emerald-200/50 transition-all duration-200 hover:bg-[#047857] hover:shadow-xl hover:shadow-emerald-200/60 focus-visible:ring-2 focus-visible:ring-[#059669]"
              >
                <Link href="/register">
                  Start Memorizing Free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-lg border-[#E5E7EB] px-6 py-3 text-base font-medium text-[#111827] transition-colors duration-200 hover:border-[#059669]/30 hover:text-[#059669] focus-visible:ring-2 focus-visible:ring-[#059669]"
              >
                <Link href="/quran">
                  Read Quran
                  <BookOpen className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-8">
              {socialProof.map((stat) => (
                <div key={stat.label}>
                  <p className="tabular-nums text-xl font-bold text-[#111827]">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-[#6B7280]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating app mockup */}
          <div className="relative flex justify-center">
            <div
              className="w-full max-w-sm rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xl shadow-gray-200/50"
              style={{ transform: "rotate(2deg)" }}
            >
              {/* Fake app header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trees className="size-4 text-[#059669]" />
                  <span className="text-sm font-bold text-[#111827]">
                    My Garden
                  </span>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-emerald-700">
                  5 / 114 trees
                </span>
              </div>

              {/* Mini tree cards */}
              <div className="space-y-2.5">
                {gardenPreviewTrees.slice(0, 4).map((tree) => (
                  <div
                    key={tree.name}
                    className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] p-3"
                  >
                    <div
                      className={`flex size-8 items-center justify-center rounded-lg ${
                        tree.status === "mastered"
                          ? "bg-amber-50"
                          : "bg-emerald-50"
                      }`}
                    >
                      {tree.status === "mastered" ? (
                        <TreePine className="size-4 text-[#D97706]" />
                      ) : (
                        <Sprout className="size-4 text-[#059669]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#111827]">
                          {tree.name}
                        </p>
                        <span className="tabular-nums text-xs text-[#6B7280]">
                          {tree.progress}%
                        </span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            tree.status === "mastered"
                              ? "bg-[#D97706]"
                              : "bg-[#059669]"
                          }`}
                          style={{ width: `${tree.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini biome grid */}
              <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] p-3">
                <p className="mb-2 text-xs font-semibold text-[#111827]">
                  Biome Progress
                </p>
                <div className="grid grid-cols-6 gap-1">
                  {biomeGrid.slice(0, 12).map((biome) => (
                    <div
                      key={biome.juz}
                      className={`flex size-6 items-center justify-center rounded text-[8px] tabular-nums font-medium ${
                        biome.unlocked
                          ? biome.progress >= 50
                            ? "bg-emerald-200 text-emerald-800"
                            : "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {biome.juz}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative floating badges */}
            <div
              className="absolute -left-4 top-8 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-lg shadow-gray-200/50"
              style={{ transform: "rotate(-6deg)" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-amber-50">
                  <Trophy className="size-4 text-[#D97706]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111827]">
                    7-Day Streak
                  </p>
                  <p className="text-[10px] text-[#6B7280]">Keep going!</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-4 bottom-12 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-lg shadow-gray-200/50"
              style={{ transform: "rotate(4deg)" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-emerald-50">
                  <Flower2 className="size-4 text-[#059669]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111827]">
                    +3 Flowers
                  </p>
                  <p className="text-[10px] text-[#6B7280]">
                    Al-Ikhlas complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== APP PREVIEW: GARDEN ==================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#059669]">
              App Preview
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
              Your personal Quran garden
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-[#6B7280]">
              Track every surah as a living tree. Watch flowers bloom as you
              memorize, and see your garden flourish over time.
            </p>
          </div>

          {/* App window mockup */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xl shadow-gray-200/50">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
              <div className="size-3 rounded-full bg-red-300" />
              <div className="size-3 rounded-full bg-amber-300" />
              <div className="size-3 rounded-full bg-green-300" />
              <div className="ml-4 flex-1 rounded-md bg-white px-4 py-1 text-xs text-[#6B7280]">
                quranmemorizer.app/garden
              </div>
            </div>

            {/* App content */}
            <div className="p-6 sm:p-8">
              {/* App header bar */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">
                    Surah Forest
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    <span className="tabular-nums font-semibold text-[#059669]">
                      5
                    </span>{" "}
                    of <span className="tabular-nums">114</span> trees planted
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
                  <Flower2 className="size-4 text-[#059669]" />
                  <span className="tabular-nums text-sm font-semibold text-emerald-700">
                    177 flowers
                  </span>
                </div>
              </div>

              {/* Tree cards grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {gardenPreviewTrees.map((tree) => (
                  <div
                    key={tree.name}
                    className={`rounded-xl border p-4 transition-shadow duration-200 hover:shadow-md ${
                      tree.status === "mastered"
                        ? "border-[#D97706]/30 bg-amber-50/50"
                        : "border-[#E5E7EB] bg-white"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className={`flex size-10 items-center justify-center rounded-xl ${
                          tree.status === "mastered"
                            ? "bg-amber-100"
                            : "bg-emerald-50"
                        }`}
                      >
                        {tree.status === "mastered" ? (
                          <TreePine className="size-5 text-[#D97706]" />
                        ) : (
                          <Sprout className="size-5 text-[#059669]" />
                        )}
                      </div>
                      {tree.status === "mastered" && (
                        <Star className="size-4 text-[#D97706]" />
                      )}
                    </div>

                    <p className="text-sm font-bold text-[#111827]">
                      {tree.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      <span className="tabular-nums">{tree.bloomed}</span> /{" "}
                      <span className="tabular-nums">{tree.ayahs}</span> flowers
                    </p>

                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${
                          tree.status === "mastered"
                            ? "bg-[#D97706]"
                            : progressColor(tree.progress)
                        }`}
                        style={{ width: `${tree.progress}%` }}
                      />
                    </div>

                    {/* Branch tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {tree.branches.map((branch) => (
                        <span
                          key={branch}
                          className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280]"
                        >
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#059669]">
              How It Works
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
              Three steps to a flourishing garden
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="relative text-center">
                {/* Connector arrow (between cards) */}
                {i < howItWorks.length - 1 && (
                  <div className="pointer-events-none absolute -right-4 top-12 hidden text-gray-300 sm:block">
                    <ChevronRight className="size-6" />
                  </div>
                )}

                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <item.icon className="size-6 text-[#059669]" />
                </div>
                <div className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium tabular-nums text-[#6B7280]">
                  Step {item.step}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#111827]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== APP PREVIEW: BIOME MAP ==================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#059669]">
              Biome Map
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
              30 Juz. 30 Biomes. One Paradise.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-[#6B7280]">
              Each juz is a biome in your garden. Unlock them one by one as you
              progress through the Quran.
            </p>
          </div>

          {/* App window mockup */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xl shadow-gray-200/50">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
              <div className="size-3 rounded-full bg-red-300" />
              <div className="size-3 rounded-full bg-amber-300" />
              <div className="size-3 rounded-full bg-green-300" />
              <div className="ml-4 flex-1 rounded-md bg-white px-4 py-1 text-xs text-[#6B7280]">
                quranmemorizer.app/garden/biomes
              </div>
            </div>

            {/* App content */}
            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">
                    Biome Map
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    <span className="tabular-nums font-semibold text-[#059669]">
                      7
                    </span>{" "}
                    of <span className="tabular-nums">30</span> biomes unlocked
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block size-3 rounded bg-emerald-200" />{" "}
                    Complete
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block size-3 rounded bg-emerald-100" />{" "}
                    In Progress
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block size-3 rounded bg-gray-100" />{" "}
                    Locked
                  </span>
                </div>
              </div>

              {/* 6x5 biome grid */}
              <div className="grid grid-cols-6 gap-2">
                {biomeGrid.map((biome) => (
                  <div
                    key={biome.juz}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-shadow duration-200 ${biomeColor(biome.unlocked, biome.progress)} ${biome.unlocked ? "hover:shadow-md" : "opacity-60"}`}
                  >
                    <div className="flex items-center gap-1">
                      {biome.unlocked ? (
                        <Grid3X3
                          className={`size-3.5 ${biome.progress >= 50 ? "text-emerald-600" : "text-emerald-400"}`}
                        />
                      ) : (
                        <Grid3X3 className="size-3.5 text-gray-300" />
                      )}
                      <span
                        className={`tabular-nums text-xs font-bold ${biome.unlocked ? "text-[#111827]" : "text-gray-400"}`}
                      >
                        {biome.juz}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-center text-[9px] leading-tight text-[#6B7280]">
                      {biome.name}
                    </p>
                    {biome.unlocked && biome.progress > 0 && (
                      <div className="mt-1.5 h-1 w-full rounded-full bg-white/80">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${biome.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#059669]">
              Features
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
              Everything you need to memorize the Quran
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-gray-200/50"
              >
                <div
                  className={`mb-3 flex size-10 items-center justify-center rounded-xl ${feature.bg}`}
                >
                  <feature.icon className={`size-5 ${feature.color}`} />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-[#111827]">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#6B7280]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#059669]">
              Testimonials
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
              Loved by memorizers worldwide
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-[#111827]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-[#111827]">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#059669]">
            Pricing
          </p>
          <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
            Forever Free
          </h2>
          <p className="mt-3 text-base text-[#6B7280]">
            No subscriptions. No paywalls. Full access to every feature.
          </p>

          <div className="mt-10 rounded-2xl border border-[#E5E7EB] bg-white p-8 text-left shadow-xl shadow-gray-200/50">
            <div className="mb-6 flex items-baseline gap-2">
              <span className="tabular-nums text-5xl font-bold text-[#111827]">
                $0
              </span>
              <span className="text-base text-[#6B7280]">/ forever</span>
            </div>

            <ul className="space-y-3">
              {pricingFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <Check className="size-3 text-[#059669]" />
                  </div>
                  <span className="text-sm text-[#111827]">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="mt-8 w-full rounded-lg bg-[#059669] py-3 text-base font-medium text-white shadow-md shadow-emerald-200/50 transition-all duration-200 hover:bg-[#047857] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#059669]"
            >
              <Link href="/register">
                Get Started Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== QURANIC QUOTE ==================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <Leaf className="size-6 text-[#059669]" />
          </div>
          <p
            className="font-['Amiri'] text-3xl leading-relaxed text-[#111827] sm:text-4xl"
            dir="rtl"
          >
            {
              "\u0648\u064E\u0644\u064E\u0642\u064E\u062F\u0652 \u064A\u064E\u0633\u064E\u0651\u0631\u0652\u0646\u064E\u0627 \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E \u0644\u0650\u0644\u0630\u064E\u0651\u0643\u064E\u0631\u0650 \u0641\u064E\u0647\u064E\u0644\u0652 \u0645\u0650\u0646\u0652 \u0645\u064F\u062F\u064E\u0651\u0643\u0650\u0631\u064D"
            }
          </p>
          <p className="mt-4 text-base italic text-[#6B7280]">
            &ldquo;And We have certainly made the Quran easy for remembrance, so
            is there any who will remember?&rdquo;
          </p>
          <p className="mt-2 text-sm font-medium text-[#059669]">
            Surah Al-Qamar (54:17)
          </p>
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="bg-[#059669] px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
              Ready to grow your garden?
            </h2>
            <p className="mt-2 text-base text-emerald-100">
              Join thousands of memorizers building their Paradise, one ayah at
              a time.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#059669] shadow-lg shadow-emerald-800/20 transition-all duration-200 hover:bg-gray-50 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white"
          >
            <Link href="/register">
              Start Free Today
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-4">
            {/* Brand column */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-base font-bold text-[#059669] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none"
              >
                <Trees className="size-5" />
                QuranMemorizer
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
                The smartest way to memorize the Quran. Free forever.
              </p>
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#111827]">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#6B7280] transition-colors duration-200 hover:text-[#059669] focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-[#E5E7EB] pt-6 text-center text-xs text-[#6B7280]">
            &copy; 2026 QuranMemorizer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
