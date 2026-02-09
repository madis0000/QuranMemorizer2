import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Bird,
  BookOpen,
  Brain,
  Droplets,
  Flower2,
  Headphones,
  Layers,
  Leaf,
  LogIn,
  Mic,
  Network,
  Repeat,
  Shield,
  Sparkles,
  Sprout,
  TreePine,
  Trees,
  Trophy,
  UserPlus,
  WifiOff,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const heroStats = [
  { value: "114", label: "Living Trees" },
  { value: "6,236", label: "Luminous Flowers" },
  { value: "30", label: "Forest Biomes" },
  { value: "99.6%", label: "Retention Rate" },
];

const canopyTrees = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    bloomed: 7,
    progress: 100,
    color: "#FFD700",
    tier: "mastered",
  },
  {
    name: "Al-Ikhlas",
    arabic: "\u0627\u0644\u0625\u062E\u0644\u0627\u0635",
    ayahs: 4,
    bloomed: 4,
    progress: 100,
    color: "#FFD700",
    tier: "mastered",
  },
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    bloomed: 3,
    progress: 100,
    color: "#FFD700",
    tier: "mastered",
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    bloomed: 50,
    progress: 60,
    color: "#00E5A0",
    tier: "growing",
  },
  {
    name: "Al-Mulk",
    arabic: "\u0627\u0644\u0645\u0644\u0643",
    ayahs: 30,
    bloomed: 22,
    progress: 73,
    color: "#00E5A0",
    tier: "growing",
  },
];

const trunkFeatures = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts. Every page matches the printed Mushaf you know.",
    side: "left" as const,
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Quran-specific Arabic precision.",
    side: "right" as const,
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides for every rule.",
    side: "left" as const,
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "First-letter hints to full recall. Eight strategies for every memory pathway.",
    side: "right" as const,
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions, daily challenges, and friend duels.",
    side: "left" as const,
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah following with word-level sync and offline downloads.",
    side: "right" as const,
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Syncs when you reconnect.",
    side: "left" as const,
  },
  {
    icon: Bird,
    title: "Achievement Ecosystem",
    desc: "50+ achievements manifest as birds visiting your trees. Rare badges summon legendary creatures.",
    side: "right" as const,
  },
];

const rootMetrics = [
  {
    label: "Retention Rate",
    value: "95.2%",
    desc: "FSRS-6 optimizes for your target retention. Deeper roots mean longer-lasting memory that holds firm through months without review.",
    color: "#00E5A0",
    icon: Shield,
  },
  {
    label: "Stability Score",
    value: "42.7d",
    desc: "How many days your memory can survive before dropping below threshold. The thicker the root, the longer the interval.",
    color: "#00B8D4",
    icon: Layers,
  },
  {
    label: "Review Intervals",
    value: "1\u20192\u20194\u201911\u201930",
    desc: "Exponentially growing intervals calculated from 21 optimizable parameters trained on 700M+ reviews worldwide.",
    color: "#FFD700",
    icon: Zap,
  },
  {
    label: "Memory Strength",
    value: "S\u00B7D\u00B7R",
    desc: "The Three Component Model: Stability, Difficulty, and Retrievability work together to schedule the perfect review moment.",
    color: "#E879F9",
    icon: Brain,
  },
];

const similarVerseRivers = [
  { from: "2:35", to: "7:19", label: "Adam in the Garden", similarity: 87 },
  { from: "2:58", to: "7:161", label: "Enter the Gate", similarity: 82 },
  { from: "3:133", to: "57:21", label: "Race to Forgiveness", similarity: 79 },
  { from: "6:151", to: "17:31", label: "Do Not Kill Children", similarity: 91 },
  { from: "21:30", to: "24:45", label: "Creation from Water", similarity: 74 },
];

const footerLinks = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Tajweed", href: "/tajweed" },
  { label: "Garden", href: "/garden" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DeepRootsLanding() {
  return (
    <div className="min-h-screen bg-[#F0F5F2] text-[#1A2E22] dark:bg-[#080F0B] dark:text-[#E8F0EC] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-[#D1E0D8] bg-[#F0F5F2]/80 backdrop-blur-xl dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-light tracking-wide text-[#059669] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
          >
            <Trees
              className="size-5 drop-shadow-sm dark:drop-shadow-none"
              style={{ filter: "drop-shadow(0 0 6px rgba(5,150,105,0.3))" }}
            />
            <span className="font-medium">QuranMemorizer</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Canopy", "Trunk", "Roots", "Rivers"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-light tracking-wide text-[#5A7B6B] transition-colors duration-200 hover:text-[#059669] focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#6B8B7B] dark:hover:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="border border-[#D1E0D8] bg-transparent px-4 py-2 text-sm font-light text-[#1A2E22] transition-colors duration-200 hover:border-[#059669]/30 hover:bg-[#059669]/5 hover:text-[#059669] focus-visible:ring-2 focus-visible:ring-[#059669] dark:border-[#00E5A0]/10 dark:text-[#E8F0EC] dark:hover:border-[#00E5A0]/30 dark:hover:bg-[#00E5A0]/5 dark:hover:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="border border-[#059669]/30 bg-[#059669]/10 px-5 py-2 text-sm font-medium text-[#059669] transition-all duration-200 hover:bg-[#059669]/20 focus-visible:ring-2 focus-visible:ring-[#059669] dark:border-[#00E5A0]/30 dark:bg-[#00E5A0]/10 dark:text-[#00E5A0] dark:shadow-[0_0_20px_rgba(0,229,160,0.15)] dark:hover:bg-[#00E5A0]/20 dark:hover:shadow-[0_0_30px_rgba(0,229,160,0.25)] dark:focus-visible:ring-[#00E5A0]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO: THE CANOPY ==================== */}
      <section
        id="canopy"
        className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 py-24"
      >
        {/* Ambient glow orbs - dark only */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 opacity-0 dark:opacity-100"
          style={{
            width: "900px",
            height: "900px",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.07) 0%, rgba(0,229,160,0.02) 35%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-1/4 top-1/2 opacity-0 dark:opacity-100"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        {/* Light mode: soft leaf-dappled gradient */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(5,150,105,0.06) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Canopy badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#059669]/20 bg-[#059669]/5 px-5 py-2 dark:border-[#00E5A0]/20 dark:bg-[#00E5A0]/5">
            <Leaf className="size-3.5 text-[#059669] dark:text-[#00E5A0]" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#059669] dark:text-[#00E5A0]">
              The Canopy
            </span>
          </div>

          <h1 className="text-balance text-4xl font-extralight leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Reach for Light,
            <br />
            <span
              className="font-light text-[#059669] dark:text-[#00E5A0]"
              style={{ textShadow: "0 0 40px rgba(0,229,160,0.3)" }}
            >
              Root in Depth
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
            Your Quran garden is a living tree. The canopy catches the light of
            new memorization. The trunk stands firm with consistent practice.
            And the roots &mdash; powered by FSRS-6 spaced repetition &mdash;
            anchor every ayah deep into permanent memory.
          </p>

          {/* CTA with downward arrow */}
          <div className="mt-10 flex flex-col items-center gap-6">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 text-lg font-light text-[#059669] transition-all duration-300 hover:gap-4 focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
            >
              Begin Your Journey Downward
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#trunk"
              className="flex flex-col items-center gap-1 text-[#5A7B6B]/60 transition-colors duration-200 hover:text-[#059669] focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#6B8B7B]/60 dark:hover:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
              aria-label="Scroll down to the trunk section"
            >
              <span className="text-[9px] font-medium uppercase tracking-[0.2em]">
                Descend
              </span>
              <ArrowDown className="size-4 animate-bounce" />
            </Link>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="tabular-nums text-3xl font-extralight text-[#059669] dark:text-[#00E5A0]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Canopy tree cards */}
          <div className="mt-20">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#059669] dark:text-[#00E5A0]">
              Flowers in the Canopy
            </p>
            <p className="mx-auto mb-10 max-w-lg text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
              Mastered surahs radiate golden light above, while growing trees
              reach upward with emerald energy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {canopyTrees.map((tree) => (
                <div
                  key={tree.name}
                  className="relative w-36 rounded-xl border border-[#D1E0D8] bg-white p-4 dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]"
                  style={{
                    boxShadow:
                      tree.tier === "mastered"
                        ? "0 0 20px rgba(255,215,0,0.1)"
                        : "0 0 16px rgba(0,229,160,0.08)",
                  }}
                >
                  {/* Progress ring */}
                  <div className="relative mx-auto mb-3 size-16">
                    <svg
                      className="size-16 -rotate-90"
                      viewBox="0 0 64 64"
                      aria-hidden="true"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="27"
                        fill="none"
                        stroke={tree.color}
                        strokeOpacity={0.12}
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="27"
                        fill="none"
                        stroke={tree.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={`${tree.progress * 1.7} ${170 - tree.progress * 1.7}`}
                        style={{ filter: `drop-shadow(0 0 6px ${tree.color})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Flower2
                        className="size-5"
                        style={{
                          color: tree.color,
                          filter: `drop-shadow(0 0 4px ${tree.color})`,
                        }}
                      />
                    </div>
                  </div>
                  <p
                    className="text-center text-lg font-light text-[#1A2E22] dark:text-[#E8F0EC]"
                    dir="rtl"
                  >
                    {tree.arabic}
                  </p>
                  <p className="mt-0.5 text-center text-[10px] font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
                    {tree.bloomed}/{tree.ayahs} flowers
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE TRUNK: Features as Branches ==================== */}
      <section
        id="trunk"
        className="relative px-6 py-28"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(5,150,105,0.02) 50%, transparent 100%)",
        }}
      >
        {/* Dark mode overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, #080F0B 0%, #0A120E 50%, #080F0B 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-20 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#059669] dark:text-[#00E5A0]">
              The Trunk
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Strong features,{" "}
              <span className="text-[#059669] dark:text-[#00E5A0]">
                branching outward
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
              Each capability branches from the central trunk of your
              memorization journey. Left and right, they reach toward the light.
            </p>
          </div>

          {/* Central trunk spine with alternating branches */}
          <div className="relative">
            {/* Central vertical line */}
            <div
              className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(5,150,105,0.2) 10%, rgba(5,150,105,0.2) 90%, transparent)",
              }}
              aria-hidden="true"
            />
            {/* Dark mode central line */}
            <div
              className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 opacity-0 dark:opacity-100 md:block"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(0,229,160,0.15) 10%, rgba(0,229,160,0.15) 90%, transparent)",
              }}
              aria-hidden="true"
            />

            <div className="space-y-6">
              {trunkFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                const isLeft = feature.side === "left";
                return (
                  <div
                    key={feature.title}
                    className={`flex flex-col gap-4 md:flex-row md:items-center ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`flex-1 rounded-xl border border-[#D1E0D8] bg-white p-6 dark:border-[#00E5A0]/8 dark:bg-[#0F1A14] ${
                        isLeft ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-3 ${isLeft ? "md:flex-row-reverse" : ""}`}
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#059669]/10 dark:bg-[#00E5A0]/10">
                          <Icon className="size-4 text-[#059669] dark:text-[#00E5A0]" />
                        </div>
                        <h3 className="text-sm font-medium text-[#1A2E22] dark:text-[#E8F0EC]">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-xs font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
                        {feature.desc}
                      </p>
                    </div>

                    {/* Center node */}
                    <div className="hidden shrink-0 md:flex md:items-center md:justify-center">
                      <div className="flex size-8 items-center justify-center rounded-full border border-[#D1E0D8] bg-[#F0F5F2] dark:border-[#00E5A0]/20 dark:bg-[#0F1A14]">
                        <span className="tabular-nums text-[10px] font-medium text-[#059669] dark:text-[#00E5A0]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden flex-1 md:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE ROOTS: FSRS Deep Dive ==================== */}
      <section id="roots" className="relative px-6 py-28">
        {/* Gradient: page gets darker as you go deeper */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-100 opacity-0"
          style={{
            background:
              "linear-gradient(180deg, #080F0B 0%, #050A07 40%, #030604 100%)",
          }}
          aria-hidden="true"
        />
        {/* Light mode: sage deepening */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, #F0F5F2 0%, #E4EDE8 40%, #D5E0DA 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-20 text-center">
            <Sprout
              className="mx-auto mb-4 size-8 text-[#059669] dark:text-[#00E5A0]"
              style={{ filter: "drop-shadow(0 0 8px rgba(0,229,160,0.4))" }}
            />
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#059669] dark:text-[#00E5A0]">
              The Roots
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              FSRS-6: Where{" "}
              <span className="text-[#059669] dark:text-[#00E5A0]">
                memory takes root
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              The Free Spaced Repetition Scheduler achieves 99.6% superiority
              over SM-2 in A/B tests. 21 parameters trained on 700 million
              reviews. 30% fewer reviews for the same retention. Your roots grow
              deeper, not wider.
            </p>
          </div>

          {/* Root metric cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {rootMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-[#D1E0D8] bg-white p-8 dark:border-[rgba(0,229,160,0.08)] dark:bg-[#0A120E]"
                  style={{
                    boxShadow: `0 0 30px ${metric.color}08`,
                  }}
                >
                  <div className="mb-5 flex items-center gap-4">
                    <div
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${metric.color}12` }}
                    >
                      <Icon
                        className="size-6"
                        style={{
                          color: metric.color,
                          filter: `drop-shadow(0 0 6px ${metric.color})`,
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                        {metric.label}
                      </p>
                      <p
                        className="tabular-nums text-2xl font-extralight"
                        style={{
                          color: metric.color,
                          textShadow: `0 0 12px ${metric.color}40`,
                        }}
                      >
                        {metric.value}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
                    {metric.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* "Deeper you go" message */}
          <div className="mt-16 text-center">
            <p
              className="text-lg font-extralight italic text-[#059669]/70 dark:text-[#00E5A0]/60"
              style={{ textShadow: "0 0 20px rgba(0,229,160,0.15)" }}
            >
              &ldquo;The deeper you go, the stronger you grow.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ==================== UNDERGROUND RIVERS: Similar Verses ==================== */}
      <section id="rivers" className="relative px-6 py-28">
        {/* Even darker underground */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, #030604 0%, #020403 50%, #030604 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, #D5E0DA 0%, #C8D5CE 50%, #D5E0DA 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <Droplets
              className="mx-auto mb-4 size-8 text-[#0891B2] dark:text-[#00B8D4]"
              style={{ filter: "drop-shadow(0 0 10px rgba(0,184,212,0.4))" }}
            />
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#0891B2] dark:text-[#00B8D4]">
              Underground Rivers
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Similar verses,{" "}
              <span className="text-[#0891B2] dark:text-[#00B8D4]">
                flowing connections
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              The #1 challenge for every Hafiz: confusing similar verses.
              Underground rivers connect related surah trees, revealing the
              patterns and differences that trip up even experienced memorizers.
              No competitor has this.
            </p>
          </div>

          {/* River connection cards */}
          <div className="space-y-3">
            {similarVerseRivers.map((river) => (
              <div
                key={`${river.from}-${river.to}`}
                className="flex items-center gap-4 rounded-xl border border-[#D1E0D8] bg-white/80 p-5 dark:border-[#00B8D4]/8 dark:bg-[#0A120E]/80"
              >
                {/* From verse */}
                <div className="flex-1 text-right">
                  <p
                    className="tabular-nums text-sm font-medium text-[#0891B2] dark:text-[#00B8D4]"
                    style={{ textShadow: "0 0 8px rgba(0,184,212,0.2)" }}
                  >
                    {river.from}
                  </p>
                </div>

                {/* River flow */}
                <div className="flex items-center gap-2">
                  <div
                    className="h-px w-8 bg-[#0891B2]/30 dark:bg-[#00B8D4]/20"
                    aria-hidden="true"
                  />
                  <Network className="size-4 text-[#0891B2]/60 dark:text-[#00B8D4]/40" />
                  <div
                    className="h-px w-8 bg-[#0891B2]/30 dark:bg-[#00B8D4]/20"
                    aria-hidden="true"
                  />
                </div>

                {/* To verse */}
                <div className="flex-1">
                  <p
                    className="tabular-nums text-sm font-medium text-[#0891B2] dark:text-[#00B8D4]"
                    style={{ textShadow: "0 0 8px rgba(0,184,212,0.2)" }}
                  >
                    {river.to}
                  </p>
                </div>

                {/* Label + similarity */}
                <div className="hidden flex-1 sm:block">
                  <p className="text-xs font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
                    {river.label}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="tabular-nums text-xs font-medium text-[#0891B2] dark:text-[#00B8D4]">
                    {river.similarity}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* River explanation */}
          <div className="mt-10 rounded-xl border border-[#0891B2]/10 bg-[#0891B2]/5 p-6 text-center dark:border-[#00B8D4]/10 dark:bg-[#00B8D4]/5">
            <p className="text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              <span className="font-medium text-[#0891B2] dark:text-[#00B8D4]">
                Targeted drills
              </span>{" "}
              surface when similar verses share &gt;70% word overlap.
              Side-by-side comparison, &ldquo;Which surah?&rdquo; quizzes, and
              continuation challenges &mdash; all scheduled by FSRS based on
              your confusion history.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== QURAN QUOTE ==================== */}
      <section className="relative px-6 py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{ background: "#030604" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{ background: "#D5E0DA" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <blockquote
            className="text-xl font-extralight italic leading-relaxed text-[#059669]/80 dark:text-[#00E5A0]/80 sm:text-2xl"
            style={{ textShadow: "0 0 30px rgba(0,229,160,0.15)" }}
          >
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </blockquote>
          <cite className="mt-6 block text-xs font-medium uppercase tracking-[0.2em] text-[#5A7B6B] dark:text-[#6B8B7B] not-italic">
            Surah Al-Qamar &middot; 54:17
          </cite>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative px-6 pb-28 pt-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background: "linear-gradient(180deg, #030604 0%, #080F0B 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background: "linear-gradient(180deg, #D5E0DA 0%, #F0F5F2 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <div
            className="rounded-2xl border border-[#059669]/20 bg-white px-8 py-14 sm:px-12 dark:border-[#00E5A0]/30 dark:bg-[#0F1A14]"
            style={{ boxShadow: "0 0 40px rgba(0,229,160,0.08)" }}
          >
            <TreePine
              className="mx-auto mb-6 size-10 text-[#059669] dark:text-[#00E5A0]"
              style={{ filter: "drop-shadow(0 0 12px rgba(0,229,160,0.5))" }}
            />
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Plant your roots{" "}
              <span
                className="text-[#059669] dark:text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.3)" }}
              >
                deep
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              Free forever. No ads. Start from the canopy with your first verse,
              and watch your roots grow deeper with every review. 114 trees.
              6,236 flowers. One enchanted forest that is uniquely yours.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="border border-[#059669]/30 bg-[#059669]/15 px-8 py-4 text-base font-light text-[#059669] transition-all duration-300 hover:bg-[#059669]/25 focus-visible:ring-2 focus-visible:ring-[#059669] dark:border-[#00E5A0]/40 dark:bg-[#00E5A0]/15 dark:text-[#00E5A0] dark:shadow-[0_0_20px_rgba(0,229,160,0.2)] dark:hover:bg-[#00E5A0]/25 dark:hover:shadow-[0_0_30px_rgba(0,229,160,0.35)] dark:focus-visible:ring-[#00E5A0]"
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
                className="border border-[#D1E0D8] bg-transparent px-8 py-4 text-base font-light text-[#1A2E22] transition-colors duration-200 hover:border-[#059669]/20 hover:bg-[#059669]/5 focus-visible:ring-2 focus-visible:ring-[#059669] dark:border-[#00E5A0]/10 dark:text-[#E8F0EC] dark:hover:border-[#00E5A0]/20 dark:hover:bg-[#00E5A0]/5 dark:focus-visible:ring-[#00E5A0]"
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
      <footer className="border-t border-[#D1E0D8] px-6 pb-10 pt-8 dark:border-[#00E5A0]/10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-[#059669] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
            >
              <Trees className="size-4" />
              QuranMemorizer 2.0
            </Link>
            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-light text-[#5A7B6B] transition-colors duration-200 hover:text-[#059669] focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#6B8B7B] dark:hover:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="mt-6 text-center text-[10px] font-light tracking-wide text-[#5A7B6B]/50 dark:text-[#6B8B7B]/50">
            &copy; 2026 QuranMemorizer. Built with love for the Ummah.
          </p>
        </div>
      </footer>
    </div>
  );
}
