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
  Repeat,
  Sparkles,
  Sprout,
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

const heroStats = [
  { value: "114", label: "Living Trees" },
  { value: "6,236", label: "Glowing Flowers" },
  { value: "30", label: "Biomes" },
  { value: "\u221E", label: "Blessings" },
];

const surahTrees = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    bloomed: 7,
    progress: 100,
    season: "summer",
    seasonColor: "#FFD700",
    branches: ["Praise", "Guidance", "Prayer"],
    mastered: true,
    fireflies: [
      { top: "8%", left: "12%", size: 4, opacity: 0.9 },
      { top: "22%", left: "85%", size: 3, opacity: 0.7 },
      { top: "65%", left: "90%", size: 2, opacity: 0.5 },
    ],
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    bloomed: 102,
    progress: 36,
    season: "spring",
    seasonColor: "#00E5A0",
    branches: ["Faith", "Law", "Stories", "Finance"],
    mastered: false,
    fireflies: [
      { top: "15%", left: "8%", size: 3, opacity: 0.6 },
      { top: "78%", left: "88%", size: 2, opacity: 0.4 },
    ],
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    bloomed: 50,
    progress: 60,
    season: "spring",
    seasonColor: "#00E5A0",
    branches: ["Resurrection", "Signs", "Creation"],
    mastered: false,
    fireflies: [
      { top: "10%", left: "90%", size: 4, opacity: 0.8 },
      { top: "70%", left: "5%", size: 2, opacity: 0.5 },
      { top: "45%", left: "92%", size: 3, opacity: 0.6 },
    ],
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    bloomed: 12,
    progress: 15,
    season: "winter",
    seasonColor: "#00B8D4",
    branches: ["Blessings", "Creation", "Paradise"],
    mastered: false,
    fireflies: [{ top: "20%", left: "7%", size: 2, opacity: 0.4 }],
  },
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    bloomed: 3,
    progress: 100,
    season: "summer",
    seasonColor: "#FFD700",
    branches: ["Abundance"],
    mastered: true,
    fireflies: [
      { top: "5%", left: "80%", size: 5, opacity: 0.9 },
      { top: "30%", left: "10%", size: 3, opacity: 0.7 },
      { top: "75%", left: "85%", size: 4, opacity: 0.8 },
    ],
  },
];

const heroFireflies = [
  { top: "12%", left: "8%", size: 4, opacity: 0.7 },
  { top: "25%", left: "92%", size: 3, opacity: 0.5 },
  { top: "18%", left: "45%", size: 2, opacity: 0.4 },
  { top: "35%", left: "78%", size: 5, opacity: 0.8 },
  { top: "42%", left: "15%", size: 3, opacity: 0.6 },
  { top: "55%", left: "88%", size: 2, opacity: 0.3 },
  { top: "62%", left: "35%", size: 4, opacity: 0.7 },
  { top: "70%", left: "65%", size: 6, opacity: 0.9 },
  { top: "48%", left: "52%", size: 3, opacity: 0.5 },
  { top: "30%", left: "22%", size: 2, opacity: 0.4 },
  { top: "78%", left: "10%", size: 5, opacity: 0.6 },
  { top: "85%", left: "75%", size: 3, opacity: 0.7 },
  { top: "15%", left: "60%", size: 2, opacity: 0.3 },
  { top: "58%", left: "5%", size: 4, opacity: 0.5 },
  { top: "90%", left: "42%", size: 3, opacity: 0.8 },
  { top: "8%", left: "30%", size: 2, opacity: 0.4 },
  { top: "65%", left: "48%", size: 5, opacity: 0.6 },
  { top: "38%", left: "95%", size: 3, opacity: 0.5 },
];

const fireflyPath = [
  {
    stage: "Seed",
    icon: Sprout,
    description: "Plant your first verse",
    fireflies: 1,
    color: "#6B8B7B",
  },
  {
    stage: "Sapling",
    icon: Leaf,
    description: "Grow with daily practice",
    fireflies: 4,
    color: "#00E5A0",
  },
  {
    stage: "Forest",
    icon: Trees,
    description: "Multiple surahs memorized",
    fireflies: 8,
    color: "#00E5A0",
  },
  {
    stage: "Paradise",
    icon: Sparkles,
    description: "Complete Quran — Jannah Garden",
    fireflies: 16,
    color: "#FFD700",
  },
];

const gardenStats = [
  { value: "2,847", label: "Flowers Bloomed", color: "#00E5A0", size: 96 },
  { value: "42", label: "Trees Growing", color: "#00E5A0", size: 80 },
  { value: "15", label: "Biomes Unlocked", color: "#00B8D4", size: 72 },
  { value: "365", label: "Day Streak", color: "#FFD700", size: 88 },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts. Every page matches the printed Mushaf.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Quran-specific precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen scheduling. 30% fewer reviews for higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "First-letter hints to full recall. Eight strategies for every memory pathway.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions and daily challenges.",
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

const footerLinks = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Tajweed", href: "/tajweed" },
  { label: "Garden", href: "/garden" },
];

const navAnchors = ["Forest", "Journey", "Features"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FireflyEditionLanding() {
  return (
    <div className="min-h-screen bg-[#080F0B] text-[#E8F0EC] antialiased dark:bg-[#080F0B] dark:text-[#E8F0EC]">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-[#00E5A0]/10 bg-[#080F0B]/80 backdrop-blur-xl dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-light tracking-wide text-[#00E5A0] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none dark:text-[#00E5A0]"
          >
            <Trees
              className="size-5"
              style={{ filter: "drop-shadow(0 0 6px rgba(0,229,160,0.4))" }}
            />
            <span className="font-medium">QuranMemorizer</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navAnchors.map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-light tracking-wide text-[#6B8B7B] transition-colors duration-200 hover:text-[#00E5A0] focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none dark:text-[#6B8B7B]"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="border border-[#00E5A0]/10 bg-transparent px-4 py-2 text-sm font-light text-[#E8F0EC] transition-colors duration-200 hover:border-[#00E5A0]/30 hover:bg-[#00E5A0]/5 hover:text-[#00E5A0] focus-visible:ring-2 focus-visible:ring-[#00E5A0]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-5 py-2 text-sm font-medium text-[#00E5A0] shadow-[0_0_20px_rgba(0,229,160,0.15)] transition-all duration-200 hover:bg-[#00E5A0]/20 hover:shadow-[0_0_30px_rgba(0,229,160,0.25)] focus-visible:ring-2 focus-visible:ring-[#00E5A0]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO WITH FIREFLIES ==================== */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-24">
        {/* Ambient glow orb */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.06) 0%, rgba(0,229,160,0.02) 30%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        {/* Secondary golden orb */}
        <div
          className="pointer-events-none absolute right-1/4 top-1/2"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255,215,0,0.03) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Fireflies scattered across hero */}
        {heroFireflies.map((fly, i) => (
          <div
            key={i}
            className="pointer-events-none absolute rounded-full bg-[#00E5A0]"
            style={{
              top: fly.top,
              left: fly.left,
              width: `${fly.size}px`,
              height: `${fly.size}px`,
              opacity: fly.opacity,
              boxShadow: `0 0 ${fly.size * 3}px ${fly.size}px rgba(0,229,160,${fly.opacity * 0.6})`,
            }}
            aria-hidden="true"
          />
        ))}

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Tagline */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/5 px-5 py-2">
            <Sparkles
              className="size-3.5 text-[#00E5A0]"
              style={{ filter: "drop-shadow(0 0 4px rgba(0,229,160,0.5))" }}
            />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#00E5A0]">
              Firefly Edition
            </span>
          </div>

          <h1 className="text-balance text-4xl font-extralight leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            A Thousand Lights
            <br />
            <span
              className="font-light text-[#00E5A0]"
              style={{ textShadow: "0 0 40px rgba(0,229,160,0.3)" }}
            >
              Guide Your Path
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-[#6B8B7B]">
            Each memorized ayah sparks a firefly in your enchanted forest. Watch
            a single glow become thousands &mdash; illuminating 114 surah trees
            with AI voice recognition, FSRS-6 spaced repetition, and real-time
            Tajweed coaching.
          </p>

          {/* CTA with arrow */}
          <div className="mt-10">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 text-lg font-light text-[#00E5A0] transition-all duration-300 hover:gap-4 focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
              style={{ textShadow: "0 0 20px rgba(0,229,160,0.4)" }}
            >
              Catch Your First Firefly
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="tabular-nums text-3xl font-extralight text-[#00E5A0]"
                  style={{ textShadow: "0 0 20px rgba(0,229,160,0.3)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-[#6B8B7B]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SURAH TREES WITH CANOPY GLOW ==================== */}
      <section id="forest" className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              THE FIREFLY FOREST
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every surah, a{" "}
              <span
                className="text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.2)" }}
              >
                glowing canopy
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#6B8B7B]">
              Fireflies gather around each tree as you memorize. More ayahs
              memorized means a brighter, wider canopy glow. Mastered trees
              radiate golden light with swarms of golden fireflies.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {surahTrees.map((tree) => {
              const glowColor = tree.mastered ? "#FFD700" : "#00E5A0";
              const canopySize = 60 + (tree.progress / 100) * 80;
              const canopyOpacity = 0.05 + (tree.progress / 100) * 0.15;
              const glowShadow = tree.mastered
                ? "0 0 25px rgba(255,215,0,0.2)"
                : "0 0 20px rgba(0,229,160,0.12)";

              return (
                <div
                  key={tree.name}
                  className="relative overflow-hidden rounded-2xl border border-[#00E5A0]/10 bg-[#0F1A14] p-6"
                  style={{ boxShadow: glowShadow }}
                >
                  {/* Card fireflies */}
                  {tree.fireflies.map((fly, i) => (
                    <div
                      key={i}
                      className="pointer-events-none absolute rounded-full"
                      style={{
                        top: fly.top,
                        left: fly.left,
                        width: `${fly.size}px`,
                        height: `${fly.size}px`,
                        opacity: fly.opacity,
                        backgroundColor: tree.mastered ? "#FFD700" : "#00E5A0",
                        boxShadow: `0 0 ${fly.size * 3}px ${fly.size}px ${
                          tree.mastered
                            ? `rgba(255,215,0,${fly.opacity * 0.5})`
                            : `rgba(0,229,160,${fly.opacity * 0.5})`
                        }`,
                      }}
                      aria-hidden="true"
                    />
                  ))}

                  {/* Canopy glow */}
                  <div
                    className="relative mx-auto mb-5 flex items-center justify-center"
                    style={{ height: "96px" }}
                  >
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: `${canopySize}px`,
                        height: `${canopySize}px`,
                        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                        opacity: canopyOpacity,
                        filter: `blur(${8 + (tree.progress / 100) * 12}px)`,
                      }}
                      aria-hidden="true"
                    />
                    <div className="relative flex flex-col items-center justify-center">
                      {tree.mastered ? (
                        <TreePine
                          className="size-10"
                          style={{
                            color: "#FFD700",
                            filter: "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
                          }}
                        />
                      ) : (
                        <TreePine
                          className="size-10"
                          style={{
                            color: "#00E5A0",
                            filter: `drop-shadow(0 0 ${4 + (tree.progress / 100) * 8}px rgba(0,229,160,${0.2 + (tree.progress / 100) * 0.4}))`,
                          }}
                        />
                      )}
                      <span
                        className="mt-1 tabular-nums text-lg font-light"
                        style={{
                          color: glowColor,
                          textShadow: `0 0 10px ${glowColor}`,
                        }}
                      >
                        {tree.bloomed}
                      </span>
                      <span className="text-[8px] font-medium uppercase tracking-wider text-[#6B8B7B]">
                        flowers
                      </span>
                    </div>
                  </div>

                  {/* Surah name */}
                  <div className="text-center">
                    <p className="text-xl font-light text-[#E8F0EC]" dir="rtl">
                      {tree.arabic}
                    </p>
                    <p className="mt-0.5 text-xs font-light text-[#6B8B7B]">
                      {tree.name}
                    </p>
                  </div>

                  {/* Branch tags */}
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {tree.branches.map((branch) => (
                      <span
                        key={branch}
                        className="rounded-full border border-[#00E5A0]/20 px-2.5 py-0.5 text-[9px] font-medium text-[#6B8B7B]"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>

                  {/* Season */}
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        backgroundColor: tree.seasonColor,
                        boxShadow: `0 0 6px ${tree.seasonColor}`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#6B8B7B]">
                      {tree.season}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== FIREFLY PATH ==================== */}
      <section id="journey" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              THE JOURNEY
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Follow the{" "}
              <span
                className="text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.2)" }}
              >
                firefly path
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#6B8B7B]">
              From a single flickering light to a constellation of thousands.
              Every step brings more fireflies to your forest.
            </p>
          </div>

          <div className="rounded-2xl border border-[#00E5A0]/10 bg-[#0F1A14] p-8 sm:p-12">
            <div className="grid gap-6 sm:grid-cols-4">
              {fireflyPath.map((step, i) => {
                const Icon = step.icon;
                const fireflyDots = Array.from(
                  { length: step.fireflies },
                  (_, idx) => idx
                );
                return (
                  <div key={step.stage} className="relative text-center">
                    {/* Connector dotted line */}
                    {i < fireflyPath.length - 1 && (
                      <div
                        className="pointer-events-none absolute right-0 top-10 hidden h-px sm:block"
                        style={{
                          width: "calc(100% - 48px)",
                          left: "calc(50% + 24px)",
                          backgroundImage: `repeating-linear-gradient(to right, ${step.color}40, ${step.color}40 4px, transparent 4px, transparent 12px)`,
                        }}
                        aria-hidden="true"
                      />
                    )}

                    {/* Icon with glow */}
                    <div className="relative mx-auto mb-4 flex size-20 items-center justify-center">
                      {/* Firefly cluster around icon */}
                      {fireflyDots
                        .slice(0, Math.min(6, step.fireflies))
                        .map((_, fIdx) => {
                          const angle =
                            (fIdx / Math.min(6, step.fireflies)) * 360;
                          const rad = (angle * Math.PI) / 180;
                          const radius = 32;
                          const cx = 50 + Math.cos(rad) * radius;
                          const cy = 50 + Math.sin(rad) * radius;
                          const dotSize = 2 + (fIdx % 3);
                          return (
                            <div
                              key={fIdx}
                              className="pointer-events-none absolute rounded-full"
                              style={{
                                left: `${cx}%`,
                                top: `${cy}%`,
                                width: `${dotSize}px`,
                                height: `${dotSize}px`,
                                backgroundColor: step.color,
                                opacity: 0.5 + (fIdx % 4) * 0.1,
                                boxShadow: `0 0 ${dotSize * 2}px ${step.color}`,
                                transform: "translate(-50%, -50%)",
                              }}
                              aria-hidden="true"
                            />
                          );
                        })}
                      <Icon
                        className="size-7"
                        style={{
                          color: step.color,
                          filter: `drop-shadow(0 0 8px ${step.color})`,
                        }}
                      />
                    </div>

                    <h3
                      className="mb-1 text-sm font-medium"
                      style={{
                        color: step.color,
                        textShadow: `0 0 10px ${step.color}40`,
                      }}
                    >
                      {step.stage}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                      {step.description}
                    </p>
                    <p
                      className="mt-2 tabular-nums text-[10px] font-medium uppercase tracking-[0.15em]"
                      style={{ color: step.color }}
                    >
                      {step.fireflies} firefl
                      {step.fireflies === 1 ? "y" : "ies"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== GARDEN STATS AS GLOWING ORBS ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              GARDEN VITALS
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Your forest at a glance
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {gardenStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                {/* Glowing orb */}
                <div
                  className="relative mb-4 flex items-center justify-center rounded-full"
                  style={{
                    width: `${stat.size}px`,
                    height: `${stat.size}px`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${stat.color}15 0%, ${stat.color}05 50%, transparent 70%)`,
                      boxShadow: `0 0 ${stat.size / 2}px ${stat.size / 6}px ${stat.color}15`,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-2 rounded-full border"
                    style={{ borderColor: `${stat.color}30` }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative tabular-nums text-xl font-extralight sm:text-2xl"
                    style={{
                      color: stat.color,
                      textShadow: `0 0 16px ${stat.color}`,
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#6B8B7B]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TREE ANATOMY ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              TREE ANATOMY
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every part of the tree has meaning
            </h2>
          </div>

          <div className="rounded-2xl border border-[#00E5A0]/10 bg-[#0F1A14] p-8 sm:p-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  icon: Sprout,
                  label: "Roots",
                  color: "#00E5A0",
                  description:
                    "FSRS stability \u2014 deeper roots mean stronger, longer-lasting memory",
                },
                {
                  icon: TreePine,
                  label: "Trunk",
                  color: "#00E5A0",
                  description:
                    "Overall mastery level \u2014 grows thicker with consistent practice",
                },
                {
                  icon: Leaf,
                  label: "Branches",
                  color: "#00E5A0",
                  description:
                    "Thematic subjects (mawdu\u2019at) \u2014 each theme is a living branch",
                },
                {
                  icon: Flower2,
                  label: "Flowers",
                  color: "#FFD700",
                  description:
                    "One per ayah \u2014 blooms when memorized, wilts when review is overdue",
                },
                {
                  icon: Droplets,
                  label: "Rivers",
                  color: "#00B8D4",
                  description:
                    "Similar verse connections \u2014 flowing between related surah trees",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center">
                      <Icon
                        className="size-6"
                        style={{
                          color: item.color,
                          filter: `drop-shadow(0 0 8px ${item.color})`,
                        }}
                      />
                    </div>
                    <h3
                      className="mb-2 text-sm font-medium"
                      style={{
                        color: item.color,
                        textShadow: `0 0 10px ${item.color}40`,
                      }}
                    >
                      {item.label}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Visual separator */}
            <div
              className="my-10 h-px bg-gradient-to-r from-transparent via-[#00E5A0]/20 to-transparent"
              aria-hidden="true"
            />

            {/* Biome + bird info */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <Bird
                  className="mt-1 size-5 shrink-0 text-[#FFD700]"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(255,215,0,0.4))",
                  }}
                />
                <div>
                  <h3
                    className="mb-1 text-sm font-medium text-[#FFD700]"
                    style={{
                      textShadow: "0 0 10px rgba(255,215,0,0.3)",
                    }}
                  >
                    Firefly Swarms
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                    Achievements manifest as luminous firefly swarms visiting
                    your trees. Rare badges bring exotic golden fireflies. Your
                    forest teems with light as you grow.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Trees
                  className="mt-1 size-5 shrink-0 text-[#00E5A0]"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(0,229,160,0.4))",
                  }}
                />
                <div>
                  <h3
                    className="mb-1 text-sm font-medium text-[#00E5A0]"
                    style={{
                      textShadow: "0 0 10px rgba(0,229,160,0.3)",
                    }}
                  >
                    30 Biomes &rarr; Paradise
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                    Each juz unlocks a biome: meadow, oasis, forest, mountain,
                    valley. Complete all 30 and your garden transforms into
                    Jannah &mdash; the Paradise Garden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              FEATURES
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Everything your Hifz needs
            </h2>
          </div>

          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="group flex items-start gap-4">
                <div className="relative mt-0.5 shrink-0">
                  {/* Firefly dot as feature bullet */}
                  <span
                    className="flex size-2.5 rounded-full bg-[#00E5A0]"
                    style={{
                      boxShadow: "0 0 8px rgba(0,229,160,0.5)",
                    }}
                    aria-hidden="true"
                  />
                  {/* Tiny secondary firefly */}
                  <span
                    className="absolute -right-1 -top-1 size-1 rounded-full bg-[#00E5A0]/50"
                    style={{
                      boxShadow: "0 0 4px rgba(0,229,160,0.3)",
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-[#E8F0EC]">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== QURAN QUOTE ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <blockquote
            className="text-xl font-extralight italic leading-relaxed text-[#00E5A0]/80 sm:text-2xl"
            style={{ textShadow: "0 0 30px rgba(0,229,160,0.15)" }}
          >
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </blockquote>
          <cite className="mt-6 block text-xs font-medium uppercase tracking-[0.2em] text-[#6B8B7B] not-italic">
            Surah Al-Qamar &middot; 54:17
          </cite>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="relative overflow-hidden rounded-2xl border border-[#00E5A0]/30 bg-[#0F1A14] px-8 py-14 sm:px-12"
            style={{ boxShadow: "0 0 40px rgba(0,229,160,0.08)" }}
          >
            {/* CTA fireflies */}
            {[
              { top: "10%", left: "5%", size: 3, opacity: 0.6 },
              { top: "20%", left: "90%", size: 4, opacity: 0.7 },
              { top: "70%", left: "8%", size: 2, opacity: 0.4 },
              { top: "80%", left: "85%", size: 5, opacity: 0.8 },
              { top: "45%", left: "95%", size: 3, opacity: 0.5 },
              { top: "60%", left: "3%", size: 2, opacity: 0.3 },
            ].map((fly, i) => (
              <div
                key={i}
                className="pointer-events-none absolute rounded-full bg-[#00E5A0]"
                style={{
                  top: fly.top,
                  left: fly.left,
                  width: `${fly.size}px`,
                  height: `${fly.size}px`,
                  opacity: fly.opacity,
                  boxShadow: `0 0 ${fly.size * 3}px ${fly.size}px rgba(0,229,160,${fly.opacity * 0.5})`,
                }}
                aria-hidden="true"
              />
            ))}

            <Flower2
              className="mx-auto mb-6 size-10 text-[#00E5A0]"
              style={{
                filter: "drop-shadow(0 0 12px rgba(0,229,160,0.5))",
              }}
            />
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Let the first firefly{" "}
              <span
                className="text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.3)" }}
              >
                spark your journey
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#6B8B7B]">
              Free forever. No ads. No distractions. 114 surahs waiting to
              become 114 glowing canopies in the most enchanted memorization
              forest ever imagined.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="border border-[#00E5A0]/40 bg-[#00E5A0]/15 px-8 py-4 text-base font-light text-[#00E5A0] shadow-[0_0_20px_rgba(0,229,160,0.2)] transition-all duration-300 hover:bg-[#00E5A0]/25 hover:shadow-[0_0_30px_rgba(0,229,160,0.35)] focus-visible:ring-2 focus-visible:ring-[#00E5A0]"
              >
                <Link href="/register">
                  Plant Your First Seed
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="border border-[#00E5A0]/10 bg-transparent px-8 py-4 text-base font-light text-[#E8F0EC] transition-colors duration-200 hover:border-[#00E5A0]/20 hover:bg-[#00E5A0]/5 focus-visible:ring-2 focus-visible:ring-[#00E5A0]"
              >
                <Link href="/quran">
                  <BookOpen className="size-5" />
                  Explore the Mushaf
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-[#00E5A0]/10 px-6 pb-10 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-[#00E5A0] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
            >
              <Trees className="size-4" />
              QuranMemorizer 2.0
            </Link>
            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-light text-[#6B8B7B] transition-colors duration-200 hover:text-[#00E5A0] focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="mt-6 text-center text-[10px] font-light tracking-wide text-[#6B8B7B]/50">
            &copy; 2026 QuranMemorizer. Built with love for the Ummah.
          </p>
        </div>
      </footer>
    </div>
  );
}
