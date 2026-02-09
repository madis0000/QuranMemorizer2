import Link from "next/link";
import {
  ArrowRight,
  Bird,
  BookOpen,
  Brain,
  Droplets,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Mountain,
  Repeat,
  Sparkles,
  Sprout,
  Sun,
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

/**
 * Page 26 — "Your Living Quran"
 * Neumorphic Soft base with an interactive story:
 * the page itself mirrors the garden metaphor.
 * Each section IS a biome the user scrolls through.
 */

const heroStats = [
  { value: "114", label: "Trees to Grow" },
  { value: "6,236", label: "Flowers to Bloom" },
  { value: "30", label: "Biomes to Explore" },
  { value: "\u221E", label: "Rewards Awaiting" },
];

/** Sample surah trees for the showcase */
const sampleTrees = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    progress: 100,
    size: "Bonsai",
    icon: Flower2,
    season: "summer",
    branches: ["Praise", "Guidance", "Supplication"],
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    progress: 35,
    size: "Baobab",
    icon: Trees,
    season: "spring",
    branches: ["Faith", "Law", "Stories", "Finance", "Jihad"],
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    progress: 60,
    size: "Oak",
    icon: TreePine,
    season: "spring",
    branches: ["Resurrection", "Signs", "Creation"],
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    progress: 10,
    size: "Sapling",
    icon: Sprout,
    season: "spring",
    branches: ["Blessings", "Creation", "Paradise"],
  },
];

const gardenLayers = [
  {
    icon: Sprout,
    title: "Seeds & Roots",
    subtitle: "FSRS Stability",
    description:
      "When you first memorize an ayah, you plant a seed. The FSRS-6 algorithm measures how deep your roots grow \u2014 deeper roots mean stronger, longer-lasting memory.",
    accent: "#7FB3A8",
  },
  {
    icon: Leaf,
    title: "Branches & Themes",
    subtitle: "Mawdu\u2019at",
    description:
      "Every surah explores themes \u2014 faith, law, stories, creation. Each theme becomes a branch on your tree. You learn tafsir naturally through the structure of growth.",
    accent: "#4A9E8E",
  },
  {
    icon: Flower2,
    title: "Flowers & Ayahs",
    subtitle: "Memorization",
    description:
      "Each memorized ayah blooms as a flower on its branch. Skip your reviews and flowers wilt. Keep them alive with consistent practice \u2014 a beautiful loss-aversion mechanic.",
    accent: "#3D8B7C",
  },
  {
    icon: Bird,
    title: "Visitors & Achievements",
    subtitle: "50+ Badges",
    description:
      "Birds and butterflies visit your trees when you earn achievements. Rare badges bring exotic visitors. Your garden becomes a living record of every milestone.",
    accent: "#2E7568",
  },
  {
    icon: Droplets,
    title: "Rivers & Connections",
    subtitle: "Mutash\u0101bih\u0101t",
    description:
      "Similar verses create rivers flowing between surah trees. The #1 challenge for Huffaz \u2014 confusing similar verses \u2014 is visualized and trained through these connections.",
    accent: "#4A8E9E",
  },
  {
    icon: Mountain,
    title: "30 Biomes & Paradise",
    subtitle: "Juz Completion",
    description:
      "Each juz unlocks a biome: meadow, oasis, forest, mountain, valley, riverside. Complete all 30 to transform your garden into the Paradise Garden \u2014 Jannah.",
    accent: "#5A8E6E",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical Mushaf layouts. Every page as it was printed.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Arabic Quran precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen scheduling. 30% fewer reviews for higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "Tajweed Detection",
    desc: "13 rules detected in real time with color-coded coaching and animated guides.",
  },
  {
    icon: Repeat,
    title: "8 Hide Modes",
    desc: "First-letter hints to full recall. Eight strategies for every memory pathway.",
  },
  {
    icon: Trophy,
    title: "Quran Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions and daily challenges.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Audio",
    desc: "Ayah-by-ayah following with word-level sync and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Syncs when you reconnect.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LivingQuranLanding() {
  return (
    <div className="min-h-screen bg-[#E8ECF1] text-[#3A3F47] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 bg-[#E8ECF1]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-2xl px-4 py-2 text-lg font-bold tracking-tight text-[#4A9E8E] shadow-[4px_4px_10px_#c8ccd1,-4px_-4px_10px_#ffffff] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
          >
            <Trees className="size-5" />
            QuranMemorizer
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {["Garden", "How It Grows", "Features"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-lg px-3 py-1.5 text-sm text-[#5A6068] transition-colors duration-200 hover:text-[#2E3339] focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-2xl bg-[#E8ECF1] px-4 py-2 text-[#3A3F47] shadow-[4px_4px_10px_#c8ccd1,-4px_-4px_10px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_3px_3px_6px_#c8ccd1,inset_-3px_-3px_6px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-2xl bg-[#4A9E8E] px-5 py-2 text-white shadow-[4px_4px_10px_#c8ccd1,-4px_-4px_10px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_3px_3px_6px_#3a8475,inset_-3px_-3px_6px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-2xl bg-[#E8ECF1] px-5 py-2 shadow-[4px_4px_10px_#c8ccd1,-4px_-4px_10px_#ffffff]">
            <Sprout className="size-4 text-[#4A9E8E]" />
            <span className="text-sm font-medium text-[#4A9E8E]">
              Your Quran is alive
            </span>
          </div>

          {/* Main hero plate */}
          <div className="mx-auto max-w-3xl rounded-3xl bg-[#E8ECF1] px-8 py-12 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:px-12 sm:py-16">
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-[#2E3339] sm:text-5xl lg:text-6xl">
              Grow a <span className="text-[#4A9E8E]">living garden</span>
              <br />
              from the Quran
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#5A6068]">
              Every surah is a tree. Every ayah, a flower. Watch your personal
              garden bloom as you memorize &mdash; powered by AI voice
              recognition, FSRS-6 spaced repetition, and real-time Tajweed
              coaching.
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/register">
                <Sprout className="size-5" />
                Plant Your First Seed
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-[#E8ECF1] px-8 py-4 text-base font-semibold text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/quran">
                <BookOpen className="size-5" />
                Explore the Mushaf
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero stats as neumorphic dials */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {heroStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] sm:size-28">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_3px_3px_6px_#c8ccd1,inset_-3px_-3px_6px_#ffffff] sm:size-20">
                  <span className="tabular-nums text-xl font-bold text-[#4A9E8E] sm:text-2xl">
                    {stat.value}
                  </span>
                </div>
              </div>
              <span className="mt-2.5 text-xs font-medium text-[#5A6068]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SURAH TREE SHOWCASE ==================== */}
      <section id="garden" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
              The Garden
            </p>
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Every surah, a unique tree
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#5A6068]">
              From a tiny 3-flower bonsai (Al-Kawthar) to a 286-flower baobab
              (Al-Baqarah) &mdash; your trees reflect the real structure of the
              Quran.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sampleTrees.map((tree) => {
              const Icon = tree.icon;
              const isComplete = tree.progress === 100;
              return (
                <div
                  key={tree.name}
                  className="rounded-2xl bg-[#E8ECF1] p-6 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                >
                  {/* Tree icon in inset circle */}
                  <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                    <Icon
                      className="size-8"
                      style={{
                        color: isComplete ? "#C9A84C" : "#4A9E8E",
                      }}
                    />
                  </div>

                  {/* Surah name */}
                  <div className="text-center">
                    <p
                      className="text-xl font-semibold text-[#2E3339]"
                      dir="rtl"
                    >
                      {tree.arabic}
                    </p>
                    <p className="mt-0.5 text-sm text-[#5A6068]">{tree.name}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="mx-auto mt-4 h-3 w-full overflow-hidden rounded-full bg-[#E8ECF1] shadow-[inset_2px_2px_4px_#c8ccd1,inset_-2px_-2px_4px_#ffffff]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${tree.progress}%`,
                        backgroundColor: isComplete ? "#C9A84C" : "#4A9E8E",
                      }}
                    />
                  </div>

                  {/* Stats row */}
                  <div className="mt-3 flex items-center justify-between text-xs text-[#5A6068]">
                    <span>
                      <span className="tabular-nums font-bold text-[#2E3339]">
                        {Math.round((tree.progress / 100) * tree.ayahs)}
                      </span>
                      /{tree.ayahs} ayahs
                    </span>
                    <span className="rounded-lg bg-[#E8ECF1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_4px_#c8ccd1,-2px_-2px_4px_#ffffff]">
                      {tree.size}
                    </span>
                  </div>

                  {/* Branch tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tree.branches.map((branch) => (
                      <span
                        key={branch}
                        className="rounded-lg bg-[#E8ECF1] px-2 py-0.5 text-[10px] font-medium text-[#4A9E8E] shadow-[inset_2px_2px_4px_#c8ccd1,inset_-2px_-2px_4px_#ffffff]"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>

                  {/* Season badge */}
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    <Sun className="size-3 text-[#4A9E8E]" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#5A6068]">
                      {isComplete
                        ? "Summer \u2014 Peak Mastery"
                        : "Spring \u2014 Growing"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Garden total bar */}
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-[#E8ECF1] px-8 py-6 shadow-[8px_8px_16px_#c8ccd1,-8px_-8px_16px_#ffffff]">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
                  Your Garden
                </p>
                <p className="mt-1 text-xl font-bold text-[#2E3339]">
                  <span className="tabular-nums text-[#4A9E8E]">4</span>
                  <span className="text-[#5A6068] font-normal">
                    {" "}
                    of 114 trees planted
                  </span>
                </p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="tabular-nums text-2xl font-bold text-[#4A9E8E]">
                    188
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6068]">
                    Flowers
                  </p>
                </div>
                <div className="text-center">
                  <p className="tabular-nums text-2xl font-bold text-[#C9A84C]">
                    1
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6068]">
                    Mastered
                  </p>
                </div>
                <div className="text-center">
                  <p className="tabular-nums text-2xl font-bold text-[#2E3339]">
                    14
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6068]">
                    Branches
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT GROWS ==================== */}
      <section id="how-it-grows" className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
              How It Grows
            </p>
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Six layers of a living garden
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gardenLayers.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.title}
                  className="rounded-2xl bg-[#E8ECF1] p-7 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E8ECF1] shadow-[inset_3px_3px_6px_#c8ccd1,inset_-3px_-3px_6px_#ffffff]">
                      <Icon
                        className="size-5"
                        style={{ color: layer.accent }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: layer.accent }}
                      >
                        {layer.subtitle}
                      </p>
                      <h3 className="text-base font-bold text-[#2E3339]">
                        {layer.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#5A6068]">
                    {layer.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== QURANIC QUOTE ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-[#E8ECF1] px-8 py-12 text-center shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <blockquote className="text-xl font-medium italic leading-relaxed text-[#2E3339] sm:text-2xl">
              &ldquo;And We have certainly made the Qur&rsquo;an easy for
              remembrance, so is there any who will remember?&rdquo;
            </blockquote>
            <cite className="mt-4 block text-sm font-medium text-[#4A9E8E] not-italic">
              Surah Al-Qamar &middot; 54:17
            </cite>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
              Features
            </p>
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Every tool your Hifz needs
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-[#E8ECF1] p-6 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#E8ECF1] shadow-[inset_3px_3px_6px_#c8ccd1,inset_-3px_-3px_6px_#ffffff]">
                    <Icon className="size-5 text-[#4A9E8E]" />
                  </div>
                  <h3 className="mb-1.5 text-base font-bold text-[#2E3339]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5A6068]">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl bg-[#E8ECF1] px-8 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:px-12">
            <TreePine className="mx-auto mb-6 size-12 text-[#4A9E8E]" />
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Your paradise garden begins
              <br />
              with a <span className="text-[#4A9E8E]">single seed</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#5A6068]">
              Free forever. No ads. No distractions. 114 surahs waiting to
              become 114 trees in the most beautiful memorization garden ever
              imagined.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/register">
                  Plant Your First Seed
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#E8ECF1] px-8 py-4 text-base font-semibold text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/quran">
                  <BookOpen className="size-5" />
                  Browse the Quran
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="px-6 pb-10 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-[#E8ECF1] px-8 py-8 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-bold text-[#4A9E8E] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
              >
                <Trees className="size-5" />
                QuranMemorizer 2.0
              </Link>
              <nav className="flex flex-wrap gap-6">
                {["Read Quran", "Memorize", "Listen", "Progress", "Garden"].map(
                  (label) => (
                    <Link
                      key={label}
                      href={`/${label.toLowerCase().replace(" ", "-")}`}
                      className="text-sm text-[#5A6068] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
                    >
                      {label}
                    </Link>
                  )
                )}
              </nav>
            </div>
            <p className="mt-6 text-center text-xs text-[#8A8F96]">
              &copy; 2026 QuranMemorizer. Built with love for the Ummah.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
