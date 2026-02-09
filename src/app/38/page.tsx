import Link from "next/link";
import {
  ArrowRight,
  Bird,
  BookOpen,
  Brain,
  Crown,
  Droplets,
  Flower2,
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
    season: "summer" as const,
    branches: ["Praise", "Guidance", "Prayer"],
    mastered: true,
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    bloomed: 102,
    progress: 36,
    season: "spring" as const,
    branches: ["Faith", "Law", "Stories", "Finance"],
    mastered: false,
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    bloomed: 50,
    progress: 60,
    season: "spring" as const,
    branches: ["Resurrection", "Signs", "Creation"],
    mastered: false,
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    bloomed: 12,
    progress: 15,
    season: "winter" as const,
    branches: ["Blessings", "Creation", "Paradise"],
    mastered: false,
  },
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    bloomed: 3,
    progress: 100,
    season: "summer" as const,
    branches: ["Abundance"],
    mastered: true,
  },
];

const seasonAurora: Record<
  string,
  { from: string; via: string; to: string; label: string }
> = {
  spring: {
    from: "#00E5A0",
    via: "#00B8D4",
    to: "#00E5A0",
    label: "Spring Aurora",
  },
  summer: {
    from: "#FFD700",
    via: "#FF8C00",
    to: "#FFD700",
    label: "Golden Aurora",
  },
  autumn: {
    from: "#FF6B35",
    via: "#E5533D",
    to: "#FF6B35",
    label: "Autumn Aurora",
  },
  winter: {
    from: "#00B8D4",
    via: "#7C3AED",
    to: "#00B8D4",
    label: "Frost Aurora",
  },
};

const leagueTiers = [
  {
    name: "Talib",
    subtitle: "Student",
    icon: BookOpen,
    auroraColors: ["#00E5A0", "#00B8D4"],
    xpRequired: "0",
    benefit: "Join the community",
  },
  {
    name: "Qari",
    subtitle: "Reciter",
    icon: Mic,
    auroraColors: ["#00B8D4", "#7C3AED"],
    xpRequired: "500",
    benefit: "Unlock voice challenges",
  },
  {
    name: "Hafiz",
    subtitle: "Memorizer",
    icon: Brain,
    auroraColors: ["#7C3AED", "#E040FB"],
    xpRequired: "2,000",
    benefit: "Custom study plans",
  },
  {
    name: "Sheikh",
    subtitle: "Scholar",
    icon: Star,
    auroraColors: ["#E040FB", "#FFD700"],
    xpRequired: "5,000",
    benefit: "Mentor students",
  },
  {
    name: "Imam",
    subtitle: "Leader",
    icon: Crown,
    auroraColors: ["#FFD700", "#FF6B35"],
    xpRequired: "10,000",
    benefit: "Lead Hifz circles",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts. Every page matches the printed Mushaf.",
    auroraColor: "#00E5A0",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Quran-specific precision.",
    auroraColor: "#00B8D4",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen scheduling. 30% fewer reviews for higher retention than SM-2.",
    auroraColor: "#7C3AED",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides.",
    auroraColor: "#E040FB",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "First-letter hints to full recall. Eight strategies for every memory pathway.",
    auroraColor: "#FFD700",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions and daily challenges.",
    auroraColor: "#FF6B35",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah following with word-level sync and offline downloads.",
    auroraColor: "#00E5A0",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Syncs when you reconnect.",
    auroraColor: "#00B8D4",
  },
];

const treeAnatomy = [
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
];

const footerLinks = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Tajweed", href: "/tajweed" },
  { label: "Garden", href: "/garden" },
];

const navAnchors = ["Forest", "Levels", "Features"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AuroraCanopyLanding() {
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

      {/* ==================== HERO WITH AURORA ==================== */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-24">
        {/* Aurora effect at the top */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[500px]"
          style={{
            background:
              "linear-gradient(to right, rgba(0,229,160,0.08), rgba(0,184,212,0.06), rgba(124,58,237,0.06), rgba(255,215,0,0.05))",
            filter: "blur(100px)",
          }}
          aria-hidden="true"
        />
        {/* Secondary aurora layer */}
        <div
          className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-1/2"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,229,160,0.04), rgba(124,58,237,0.03), transparent)",
            filter: "blur(80px)",
          }}
          aria-hidden="true"
        />

        {/* Ambient glow orb */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.05) 0%, rgba(0,229,160,0.02) 30%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Tagline */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-5 py-2">
            <Sparkles
              className="size-3.5 text-[#7C3AED]"
              style={{ filter: "drop-shadow(0 0 4px rgba(124,58,237,0.5))" }}
            />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#7C3AED]">
              Aurora Canopy Edition
            </span>
          </div>

          <h1 className="text-balance text-4xl font-extralight leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Memorize Under the
            <br />
            <span
              className="bg-gradient-to-r from-[#00E5A0] via-[#00B8D4] via-[#7C3AED] to-[#FFD700] bg-clip-text font-light text-transparent"
              style={{ filter: "drop-shadow(0 0 20px rgba(0,229,160,0.2))" }}
            >
              Northern Lights
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-[#6B8B7B]">
            The aurora dances above your enchanted forest as you grow 114 surah
            trees. AI voice recognition, FSRS-6 spaced repetition, and real-time
            Tajweed coaching light the way to Jannah.
          </p>

          {/* CTA with arrow */}
          <div className="mt-10">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 text-lg font-light text-[#00E5A0] transition-all duration-300 hover:gap-4 focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
              style={{ textShadow: "0 0 20px rgba(0,229,160,0.4)" }}
            >
              Step Beneath the Aurora
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

      {/* Aurora gradient section divider */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,229,160,0.2) 25%, rgba(0,184,212,0.2) 50%, rgba(124,58,237,0.15) 75%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* ==================== SURAH TREES WITH AURORA TOPS ==================== */}
      <section id="forest" className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              THE AURORA FOREST
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every surah, a{" "}
              <span
                className="text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.2)" }}
              >
                glowing tree
              </span>{" "}
              under the aurora
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#6B8B7B]">
              Each tree&rsquo;s canopy reflects the aurora colors of its season.
              Mastered trees glow with golden northern lights.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {surahTrees.map((tree) => {
              const glowColor = tree.mastered ? "#FFD700" : "#00E5A0";
              const aurora = seasonAurora[tree.season];
              const glowShadow = tree.mastered
                ? "0 0 20px rgba(255,215,0,0.2)"
                : "0 0 20px rgba(0,229,160,0.15)";
              const ringOpacity = tree.progress / 100;

              return (
                <div
                  key={tree.name}
                  className="relative overflow-hidden rounded-2xl border border-[#00E5A0]/10 bg-[#0F1A14]"
                  style={{ boxShadow: glowShadow }}
                >
                  {/* Aurora gradient at top of card */}
                  <div
                    className="h-1.5"
                    style={{
                      background: `linear-gradient(to right, ${aurora.from}60, ${aurora.via}60, ${aurora.to}60)`,
                      filter: "blur(1px)",
                    }}
                    aria-hidden="true"
                  />

                  <div className="p-6">
                    {/* Glowing progress ring */}
                    <div className="relative mx-auto mb-5 size-24">
                      <svg
                        className="size-24 -rotate-90"
                        viewBox="0 0 96 96"
                        aria-hidden="true"
                      >
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          fill="none"
                          stroke={glowColor}
                          strokeOpacity={0.1}
                          strokeWidth="3"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          fill="none"
                          stroke={glowColor}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${tree.progress * 2.64} ${264 - tree.progress * 2.64}`}
                          style={{
                            filter: `drop-shadow(0 0 ${6 + ringOpacity * 8}px ${glowColor})`,
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className="tabular-nums text-xl font-light"
                          style={{
                            color: glowColor,
                            textShadow: `0 0 12px ${glowColor}`,
                          }}
                        >
                          {tree.bloomed}
                        </span>
                        <span className="text-[9px] font-medium uppercase tracking-wider text-[#6B8B7B]">
                          flowers
                        </span>
                      </div>
                    </div>

                    {/* Surah name */}
                    <div className="text-center">
                      <p
                        className="text-xl font-light text-[#E8F0EC]"
                        dir="rtl"
                      >
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

                    {/* Season with aurora indicator */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span
                        className="h-1 w-6 rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${aurora.from}, ${aurora.via}, ${aurora.to})`,
                          boxShadow: `0 0 4px ${aurora.from}`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#6B8B7B]">
                        {tree.season}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Aurora gradient section divider */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(124,58,237,0.2) 25%, rgba(0,184,212,0.2) 50%, rgba(0,229,160,0.15) 75%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* ==================== TREE ANATOMY ==================== */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              TREE ANATOMY
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every part of the tree has meaning
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#00E5A0]/10 bg-[#0F1A14]">
            {/* Aurora strip at top */}
            <div
              className="h-1"
              style={{
                background:
                  "linear-gradient(to right, #00E5A0, #00B8D4, #7C3AED, #FFD700, #00E5A0)",
                filter: "blur(1px)",
              }}
              aria-hidden="true"
            />

            <div className="p-8 sm:p-12">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                {treeAnatomy.map((item) => {
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

              {/* Aurora separator */}
              <div
                className="my-10 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(0,229,160,0.2) 30%, rgba(0,184,212,0.15) 50%, rgba(124,58,237,0.1) 70%, transparent)",
                }}
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
                      Birds &amp; Butterflies
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                      Achievements manifest as luminous creatures visiting your
                      trees. Rare badges bring exotic visitors. Your forest
                      teems with life as you grow.
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
        </div>
      </section>

      {/* Aurora gradient section divider */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,215,0,0.15) 25%, rgba(124,58,237,0.2) 50%, rgba(0,229,160,0.15) 75%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* ==================== AURORA LEVELS (LEAGUE TIERS) ==================== */}
      <section id="levels" className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#7C3AED]">
              AURORA LEVELS
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Rise through the{" "}
              <span className="bg-gradient-to-r from-[#00E5A0] via-[#7C3AED] to-[#FFD700] bg-clip-text text-transparent">
                aurora tiers
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#6B8B7B]">
              Five league tiers, each with its own aurora color band. Climb from
              Student to Leader through weekly practice and competitions.
            </p>
          </div>

          <div className="space-y-4">
            {leagueTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.name}
                  className="relative overflow-hidden rounded-2xl border border-[#00E5A0]/10 bg-[#0F1A14]"
                >
                  {/* Aurora gradient stripe at top */}
                  <div
                    className="h-1"
                    style={{
                      background: `linear-gradient(to right, ${tier.auroraColors[0]}80, ${tier.auroraColors[1]}80)`,
                      filter: "blur(0.5px)",
                    }}
                    aria-hidden="true"
                  />

                  <div className="flex items-center gap-6 p-6">
                    {/* Rank number */}
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${tier.auroraColors[0]}15, ${tier.auroraColors[1]}15)`,
                        boxShadow: `0 0 20px ${tier.auroraColors[0]}10`,
                      }}
                    >
                      <Icon
                        className="size-6"
                        style={{
                          color: tier.auroraColors[0],
                          filter: `drop-shadow(0 0 6px ${tier.auroraColors[0]})`,
                        }}
                      />
                    </div>

                    {/* Tier info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3
                          className="text-base font-medium"
                          style={{
                            color: tier.auroraColors[0],
                            textShadow: `0 0 10px ${tier.auroraColors[0]}30`,
                          }}
                        >
                          {tier.name}
                        </h3>
                        <span className="text-xs font-light text-[#6B8B7B]">
                          {tier.subtitle}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-light text-[#6B8B7B]">
                        {tier.benefit}
                      </p>
                    </div>

                    {/* XP requirement */}
                    <div className="text-right">
                      <p
                        className="tabular-nums text-sm font-medium"
                        style={{ color: tier.auroraColors[0] }}
                      >
                        {tier.xpRequired} XP
                      </p>
                      <p className="text-[10px] font-light text-[#6B8B7B]">
                        to enter
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Aurora gradient section divider */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,229,160,0.15) 25%, rgba(224,64,251,0.15) 50%, rgba(255,215,0,0.15) 75%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* ==================== FEATURES (2-COLUMN WITH AURORA UNDERLINES) ==================== */}
      <section id="features" className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              FEATURES
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Everything your Hifz needs
            </h2>
          </div>

          <div className="grid gap-x-12 gap-y-1 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group">
                  <div className="flex items-start gap-4 py-6">
                    <div className="mt-0.5 shrink-0">
                      <Icon
                        className="size-5"
                        style={{
                          color: feature.auroraColor,
                          filter: `drop-shadow(0 0 6px ${feature.auroraColor})`,
                        }}
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
                  {/* Aurora gradient underline */}
                  <div
                    className="h-px"
                    style={{
                      background: `linear-gradient(to right, ${feature.auroraColor}30, ${feature.auroraColor}10, transparent)`,
                    }}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== QURAN QUOTE ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-2xl text-center">
          {/* Aurora glow behind quote */}
          <div className="relative">
            <div
              className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2"
              style={{
                width: "400px",
                height: "200px",
                background:
                  "linear-gradient(to right, rgba(0,229,160,0.04), rgba(0,184,212,0.03), rgba(124,58,237,0.03), rgba(255,215,0,0.02))",
                filter: "blur(60px)",
              }}
              aria-hidden="true"
            />
            <blockquote
              className="relative text-xl font-extralight italic leading-relaxed text-[#00E5A0]/80 sm:text-2xl"
              style={{ textShadow: "0 0 30px rgba(0,229,160,0.15)" }}
            >
              &ldquo;And We have certainly made the Qur&rsquo;an easy for
              remembrance, so is there any who will remember?&rdquo;
            </blockquote>
          </div>
          <cite className="mt-6 block text-xs font-medium uppercase tracking-[0.2em] text-[#6B8B7B] not-italic">
            Surah Al-Qamar &middot; 54:17
          </cite>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative overflow-hidden rounded-2xl border border-[#00E5A0]/30 bg-[#0F1A14]">
            {/* Aurora top edge */}
            <div
              className="h-1.5"
              style={{
                background:
                  "linear-gradient(to right, #00E5A0, #00B8D4, #7C3AED, #E040FB, #FFD700)",
                filter: "blur(1px)",
              }}
              aria-hidden="true"
            />

            {/* Diffused aurora glow */}
            <div
              className="pointer-events-none absolute left-0 right-0 top-0 h-40"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,229,160,0.04), rgba(124,58,237,0.02), transparent)",
              }}
              aria-hidden="true"
            />

            <div
              className="relative px-8 py-14 sm:px-12"
              style={{ boxShadow: "inset 0 0 60px rgba(0,229,160,0.03)" }}
            >
              <Flower2
                className="mx-auto mb-6 size-10 text-[#00E5A0]"
                style={{
                  filter: "drop-shadow(0 0 12px rgba(0,229,160,0.5))",
                }}
              />
              <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
                Your paradise begins{" "}
                <span className="bg-gradient-to-r from-[#00E5A0] via-[#00B8D4] to-[#7C3AED] bg-clip-text text-transparent">
                  beneath the aurora
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#6B8B7B]">
                Free forever. No ads. No distractions. 114 surahs waiting to
                become 114 luminous trees in the most enchanted memorization
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
