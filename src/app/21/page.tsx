import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Flower2,
  Headphones,
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
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

/** Surah Tree showcase — each represents a real surah with its ayah count */
const surahTrees = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    memorized: 7,
    branches: ["Praise", "Guidance", "Prayer"],
    season: "bloom" as const,
  },
  {
    name: "Al-Ikhlas",
    arabic: "\u0627\u0644\u0625\u062E\u0644\u0627\u0635",
    ayahs: 4,
    memorized: 4,
    branches: ["Oneness", "Eternity"],
    season: "bloom" as const,
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    memorized: 142,
    branches: ["Faith", "Law", "Stories", "Jihad", "Finance"],
    season: "spring" as const,
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    memorized: 30,
    branches: ["Resurrection", "Signs", "Parables"],
    season: "spring" as const,
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    memorized: 5,
    branches: ["Blessings", "Creation", "Paradise"],
    season: "seed" as const,
  },
];

const seasonColors = {
  bloom: {
    ring: "#C9A84C",
    bg: "rgba(201,168,76,0.08)",
    label: "Mastered",
    trunk: "#C9A84C",
  },
  spring: {
    ring: "#4A9E8E",
    bg: "rgba(74,158,142,0.08)",
    label: "Growing",
    trunk: "#4A9E8E",
  },
  seed: {
    ring: "#6B7280",
    bg: "rgba(107,114,128,0.08)",
    label: "Planted",
    trunk: "#6B7280",
  },
};

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts. Every page as it was printed.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech API for speed, Whisper AI for Arabic Quran precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen scheduling. 30% fewer reviews, higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "From first-letter hints to full recall \u2014 eight distinct memory strategies.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions, daily challenges.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah following with word-level sync and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Syncs when you reconnect.",
  },
];

const stats = [
  { value: "114", label: "SURAHS" },
  { value: "6,236", label: "AYAHS" },
  { value: "7+", label: "EDITIONS" },
  { value: "50+", label: "ACHIEVEMENTS" },
];

const growthStages = [
  {
    icon: Sprout,
    stage: "Seed",
    desc: "You plant a seed the moment you begin memorizing a surah. The roots take hold.",
  },
  {
    icon: Leaf,
    stage: "Sapling",
    desc: "Branches emerge as you explore the surah\u2019s themes \u2014 each branch a subject within it.",
  },
  {
    icon: Flower2,
    stage: "Bloom",
    desc: "Every memorized ayah becomes a flower on its branch. Review keeps them alive.",
  },
  {
    icon: TreePine,
    stage: "Mastery",
    desc: "A fully memorized surah becomes a golden tree in your garden \u2014 a monument to your devotion.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Simple seeded deterministic value for tree visual heights */
function treeHeight(memorized: number, total: number): number {
  return Math.round((memorized / total) * 100);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NeumorphicCinematicLanding() {
  return (
    <div className="min-h-screen bg-[#0C0F14] text-[#E8ECF1] antialiased selection:bg-[#C9A84C]/20">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0C0F14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-medium uppercase tracking-[0.15em] text-[#C9A84C] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
          >
            QuranMemorizer
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Garden", "Features", "Journey"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-xs font-light uppercase tracking-[0.2em] text-[#E8ECF1]/30 transition-colors duration-200 hover:text-[#E8ECF1]/60 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs uppercase tracking-[0.1em] text-[#E8ECF1]/40 hover:bg-transparent hover:text-[#E8ECF1]/70 focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
            >
              <Link href="/login">
                <LogIn className="size-3.5" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-[#1A1F28] px-5 text-xs uppercase tracking-[0.1em] text-[#C9A84C] shadow-[4px_4px_12px_rgba(0,0,0,0.5),-4px_-4px_12px_rgba(30,35,45,0.8)] transition-shadow duration-300 hover:bg-[#1A1F28] hover:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(30,35,45,0.8)] focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
            >
              <Link href="/register">
                <UserPlus className="size-3.5" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative flex min-h-screen flex-col">
        {/* Letterbox bar */}
        <div className="h-10 bg-black sm:h-14" aria-hidden="true" />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A84C]/[0.03] blur-[120px]" />

        <div className="relative flex flex-1 flex-col items-center justify-center px-6">
          {/* Overline */}
          <p className="mb-6 text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A84C]/50">
            A Living Garden of Knowledge
          </p>

          {/* Main heading — neumorphic plate on dark */}
          <div className="mx-auto max-w-4xl rounded-3xl bg-[#12161D] px-8 py-12 shadow-[12px_12px_30px_rgba(0,0,0,0.6),-12px_-12px_30px_rgba(30,35,50,0.4)] sm:px-14 sm:py-16">
            <h1 className="text-balance text-center text-4xl font-extralight uppercase leading-tight tracking-[0.1em] text-[#E8ECF1] sm:text-5xl lg:text-7xl">
              Your Quran
              <br />
              <span className="font-light text-[#C9A84C]">grows with you</span>
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-center text-base font-light leading-relaxed text-[#E8ECF1]/35">
              Every surah is a tree. Every ayah, a flower. Watch your garden
              bloom as you memorize &mdash; powered by AI voice recognition,
              FSRS-6 spaced repetition, and real-time Tajweed coaching.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-[#1A1F28] px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-[#C9A84C] shadow-[6px_6px_16px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(30,35,50,0.5)] transition-shadow duration-300 hover:bg-[#1A1F28] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),inset_-4px_-4px_10px_rgba(30,35,50,0.5)] focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
            >
              <Link href="/register">
                Plant Your First Seed
                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Link
              href="/quran"
              className="text-xs font-light uppercase tracking-[0.15em] text-[#E8ECF1]/25 transition-colors duration-200 hover:text-[#E8ECF1]/50 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
            >
              or explore the Mushaf
            </Link>
          </div>
        </div>

        {/* Letterbox bar */}
        <div className="h-10 bg-black sm:h-14" aria-hidden="true" />
      </section>

      {/* ==================== SURAH TREE GARDEN ==================== */}
      <section id="garden" className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mb-20 text-center">
            <p className="mb-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A84C]/50">
              The Surah Tree System
            </p>
            <h2 className="text-balance text-3xl font-extralight uppercase tracking-[0.1em] text-[#E8ECF1] sm:text-4xl">
              114 Surahs. 114 Trees. One Paradise.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-[#E8ECF1]/30">
              Each surah in the Quran becomes a living tree in your personal
              garden. Its size reflects the number of ayahs &mdash; from a
              3-flower bonsai for Al-Kawthar to a 286-flower oak for Al-Baqarah.
              Watch them grow as you memorize.
            </p>
          </div>

          {/* Tree cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {surahTrees.map((tree) => {
              const pct = treeHeight(tree.memorized, tree.ayahs);
              const season = seasonColors[tree.season];
              return (
                <div
                  key={tree.name}
                  className="rounded-2xl bg-[#12161D] p-6 shadow-[6px_6px_16px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(30,35,50,0.4)] transition-shadow duration-300 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.6),-8px_-8px_20px_rgba(30,35,50,0.5)]"
                >
                  {/* Tree visual — a stylized growth bar */}
                  <div className="mb-5 flex flex-col items-center">
                    <div
                      className="relative flex h-32 w-16 items-end justify-center overflow-hidden rounded-xl"
                      style={{ backgroundColor: season.bg }}
                    >
                      {/* Growth fill */}
                      <div
                        className="w-full rounded-t-lg transition-all duration-700"
                        style={{
                          height: `${pct}%`,
                          background: `linear-gradient(to top, ${season.trunk}40, ${season.trunk}15)`,
                          borderTop: `2px solid ${season.trunk}60`,
                        }}
                      />
                      {/* Ring at top */}
                      <div
                        className="absolute top-2 flex size-8 items-center justify-center rounded-full"
                        style={{
                          boxShadow: `0 0 0 2px ${season.ring}40, inset 0 0 8px ${season.ring}20`,
                        }}
                      >
                        <TreePine
                          className="size-4"
                          style={{ color: season.ring }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Surah name */}
                  <div className="text-center">
                    <p
                      className="text-lg font-light text-[#E8ECF1]/80"
                      dir="rtl"
                    >
                      {tree.arabic}
                    </p>
                    <p className="mt-1 text-xs font-light uppercase tracking-[0.1em] text-[#E8ECF1]/30">
                      {tree.name}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-wider">
                    <span className="text-[#E8ECF1]/20">
                      <span
                        className="tabular-nums text-xs font-medium"
                        style={{ color: season.trunk }}
                      >
                        {tree.memorized}
                      </span>
                      /{tree.ayahs}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                      style={{
                        color: season.trunk,
                        backgroundColor: season.bg,
                      }}
                    >
                      {season.label}
                    </span>
                  </div>

                  {/* Branches (subjects) */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tree.branches.map((branch) => (
                      <span
                        key={branch}
                        className="rounded-md bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-[#E8ECF1]/25"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Garden summary bar */}
          <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-[#12161D] px-8 py-6 shadow-[8px_8px_20px_rgba(0,0,0,0.5),-8px_-8px_20px_rgba(30,35,50,0.4)]">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <p className="text-xs font-light uppercase tracking-[0.15em] text-[#C9A84C]/60">
                  Garden Progress
                </p>
                <p className="mt-1 text-2xl font-extralight text-[#E8ECF1]">
                  <span className="tabular-nums font-light text-[#C9A84C]">
                    5
                  </span>
                  <span className="text-[#E8ECF1]/20">
                    {" "}
                    / 114 trees planted
                  </span>
                </p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="tabular-nums text-xl font-light text-[#4A9E8E]">
                    188
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#E8ECF1]/20">
                    Flowers
                  </p>
                </div>
                <div className="w-px bg-white/5" aria-hidden="true" />
                <div>
                  <p className="tabular-nums text-xl font-light text-[#C9A84C]">
                    2
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#E8ECF1]/20">
                    Mastered
                  </p>
                </div>
                <div className="w-px bg-white/5" aria-hidden="true" />
                <div>
                  <p className="tabular-nums text-xl font-light text-[#E8ECF1]/50">
                    13
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#E8ECF1]/20">
                    Branches
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== GROWTH JOURNEY ==================== */}
      <section id="journey" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 text-center">
            <p className="mb-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A84C]/50">
              The Growth Journey
            </p>
            <h2 className="text-balance text-3xl font-extralight uppercase tracking-[0.1em] text-[#E8ECF1] sm:text-4xl">
              From seed to Paradise
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {growthStages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.stage}
                  className="rounded-2xl bg-[#12161D] p-7 shadow-[6px_6px_16px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(30,35,50,0.4)]"
                >
                  {/* Step indicator */}
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#0C0F14] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(30,35,50,0.3)]">
                      <Icon className="size-5 text-[#C9A84C]" />
                    </div>
                    <span className="text-[10px] font-light uppercase tracking-[0.2em] text-[#C9A84C]/40">
                      Stage {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mb-2 text-base font-light uppercase tracking-[0.05em] text-[#E8ECF1]/80">
                    {stage.stage}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-[#E8ECF1]/30">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Metaphor explanation */}
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <div
              className="mx-auto mb-8 h-px w-16 bg-[#C9A84C]/20"
              aria-hidden="true"
            />
            <p className="text-sm font-light leading-relaxed text-[#E8ECF1]/25">
              <span className="text-[#C9A84C]/60">Roots</span> represent your
              retention depth (FSRS stability).{" "}
              <span className="text-[#4A9E8E]/60">Branches</span> are the
              surah&rsquo;s themes and subjects.{" "}
              <span className="text-[#E8ECF1]/50">Rivers</span> flow between
              trees that share similar verses. Complete all 30 juz &mdash; 30
              garden biomes &mdash; to unlock the{" "}
              <span className="text-[#C9A84C]">Paradise Garden</span>.
            </p>
            <div
              className="mx-auto mt-8 h-px w-16 bg-[#C9A84C]/20"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="border-y border-white/[0.04] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center">
                  <div className="flex size-20 items-center justify-center rounded-full bg-[#12161D] shadow-[6px_6px_14px_rgba(0,0,0,0.5),-6px_-6px_14px_rgba(30,35,50,0.4)] sm:size-24">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#0C0F14] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(30,35,50,0.3)] sm:size-16">
                      <span className="tabular-nums text-xl font-light text-[#C9A84C] sm:text-2xl">
                        {stat.value}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[10px] font-light uppercase tracking-[0.2em] text-[#E8ECF1]/25">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <p className="mb-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A84C]/50">
              The Complete Toolkit
            </p>
            <h2 className="text-balance text-3xl font-extralight uppercase tracking-[0.1em] text-[#E8ECF1] sm:text-4xl">
              Every tool your Hifz demands
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl bg-[#12161D] p-6 shadow-[6px_6px_16px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(30,35,50,0.4)] transition-shadow duration-300 hover:shadow-[8px_8px_22px_rgba(0,0,0,0.6),-8px_-8px_22px_rgba(30,35,50,0.5)]"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#0C0F14] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(30,35,50,0.3)] transition-shadow duration-300 group-hover:shadow-[3px_3px_8px_rgba(0,0,0,0.5),-3px_-3px_8px_rgba(30,35,50,0.4)]">
                    <Icon className="size-5 text-[#C9A84C]/70" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-medium uppercase tracking-[0.03em] text-[#E8ECF1]/80">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-[#E8ECF1]/25">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== QUOTE ==================== */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div
            className="mx-auto mb-8 h-px w-16 bg-[#C9A84C]/20"
            aria-hidden="true"
          />
          <blockquote className="text-2xl font-extralight italic leading-relaxed text-[#E8ECF1]/50 sm:text-3xl">
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </blockquote>
          <cite className="mt-6 block text-[10px] font-light uppercase tracking-[0.2em] text-[#C9A84C]/40 not-italic">
            Surah Al-Qamar &middot; 54:17
          </cite>
          <div
            className="mx-auto mt-8 h-px w-16 bg-[#C9A84C]/20"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl bg-[#12161D] px-8 py-14 text-center shadow-[12px_12px_30px_rgba(0,0,0,0.6),-12px_-12px_30px_rgba(30,35,50,0.4)] sm:px-14 sm:py-16">
            <p className="mb-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A84C]/50">
              Your Garden Awaits
            </p>
            <h2 className="text-balance text-3xl font-extralight uppercase tracking-[0.1em] text-[#E8ECF1] sm:text-4xl">
              Begin growing your
              <br />
              <span className="font-light text-[#C9A84C]">Paradise Garden</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-[#E8ECF1]/30">
              Free forever. No ads. No distractions. 114 surahs waiting to
              become 114 trees in the most beautiful memorization garden ever
              imagined.
            </p>
            <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#1A1F28] px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-[#C9A84C] shadow-[6px_6px_16px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(30,35,50,0.5)] transition-shadow duration-300 hover:bg-[#1A1F28] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),inset_-4px_-4px_10px_rgba(30,35,50,0.5)] focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              >
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#0C0F14] px-8 py-4 text-sm font-light uppercase tracking-[0.15em] text-[#E8ECF1]/40 shadow-[6px_6px_16px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(30,35,50,0.5)] transition-shadow duration-300 hover:bg-[#0C0F14] hover:text-[#E8ECF1]/60 hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),inset_-4px_-4px_10px_rgba(30,35,50,0.5)] focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              >
                <Link href="/quran">
                  <BookOpen className="mr-2 size-4" />
                  Browse the Quran
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/[0.04] px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-8 text-[10px] font-light uppercase tracking-[0.3em] text-[#E8ECF1]/15">
            End Credits
          </p>
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-light uppercase tracking-[0.15em] text-[#C9A84C]/50 transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
          >
            QuranMemorizer 2.0
          </Link>
          <nav className="mb-8 flex flex-wrap justify-center gap-8">
            {["Read Quran", "Memorize", "Listen", "Progress", "Tajweed"].map(
              (label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase().replace(" ", "-")}`}
                  className="text-xs font-light uppercase tracking-[0.1em] text-[#E8ECF1]/15 transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
                >
                  {label}
                </Link>
              )
            )}
          </nav>
          <p className="text-[10px] font-light uppercase tracking-[0.2em] text-[#E8ECF1]/10">
            &copy; 2026 QuranMemorizer &middot; Built with love for the Ummah
          </p>
        </div>
      </footer>
    </div>
  );
}
