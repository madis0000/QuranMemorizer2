import Link from "next/link";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Mountain,
  Palmtree,
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

const surahTrees = [
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    memorized: 0,
    stage: "seed" as const,
    season: "winter" as const,
    branches: ["Abundance"],
    juz: 30,
  },
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    memorized: 3,
    stage: "sprout" as const,
    season: "spring" as const,
    branches: ["Praise", "Guidance", "Prayer"],
    juz: 1,
  },
  {
    name: "Al-Ikhlas",
    arabic: "\u0627\u0644\u0625\u062E\u0644\u0627\u0635",
    ayahs: 4,
    memorized: 3,
    stage: "sapling" as const,
    season: "spring" as const,
    branches: ["Oneness", "Eternity"],
    juz: 30,
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    memorized: 62,
    stage: "young" as const,
    season: "summer" as const,
    branches: ["Resurrection", "Signs", "Parables"],
    juz: 22,
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    memorized: 248,
    stage: "mature" as const,
    season: "summer" as const,
    branches: ["Faith", "Law", "Stories", "Jihad", "Finance"],
    juz: 1,
  },
  {
    name: "Al-Fatihah \u2714",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    memorized: 7,
    stage: "golden" as const,
    season: "summer" as const,
    branches: ["Praise", "Guidance", "Prayer"],
    juz: 1,
  },
];

const stageConfig = {
  seed: {
    label: "Seed",
    icon: Sprout,
    accentColor: "#8A8F96",
    fillPct: 5,
    trunkWidth: "w-2",
    canopySize: "size-8",
    description: "Planted &mdash; waiting for first recitation",
  },
  sprout: {
    label: "Sprout",
    icon: Sprout,
    accentColor: "#6DB897",
    fillPct: 25,
    trunkWidth: "w-3",
    canopySize: "size-12",
    description: "First ayahs memorized, roots forming",
  },
  sapling: {
    label: "Sapling",
    icon: Leaf,
    accentColor: "#4A9E8E",
    fillPct: 50,
    trunkWidth: "w-4",
    canopySize: "size-16",
    description: "Branches emerging, themes unlocking",
  },
  young: {
    label: "Young Tree",
    icon: TreePine,
    accentColor: "#3A8475",
    fillPct: 75,
    trunkWidth: "w-5",
    canopySize: "size-20",
    description: "Strong growth, most ayahs in bloom",
  },
  mature: {
    label: "Mature Tree",
    icon: Trees,
    accentColor: "#2E6B5E",
    fillPct: 90,
    trunkWidth: "w-6",
    canopySize: "size-24",
    description: "Nearly complete, deep roots established",
  },
  golden: {
    label: "Golden Master",
    icon: Sun,
    accentColor: "#C9A84C",
    fillPct: 100,
    trunkWidth: "w-6",
    canopySize: "size-24",
    description: "Fully memorized &mdash; a golden monument",
  },
};

const seasonConfig = {
  spring: { label: "Spring", color: "#4A9E8E", bg: "rgba(74,158,142,0.1)" },
  summer: { label: "Summer", color: "#C9A84C", bg: "rgba(201,168,76,0.1)" },
  autumn: { label: "Autumn", color: "#D97706", bg: "rgba(217,119,6,0.1)" },
  winter: { label: "Winter", color: "#8A8F96", bg: "rgba(138,143,150,0.1)" },
};

const biomes = [
  { name: "Meadow", juz: "1\u20136", pct: 72, icon: Flower2 },
  { name: "Oasis", juz: "7\u201312", pct: 45, icon: Palmtree },
  { name: "Forest", juz: "13\u201318", pct: 28, icon: Trees },
  { name: "Mountain", juz: "19\u201324", pct: 15, icon: Mountain },
  { name: "Garden", juz: "25\u201330", pct: 60, icon: TreePine },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions rendered with exact physical Mushaf layouts &mdash; Madinah, IndoPak, and beyond.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud and get word-level feedback. Web Speech API + Whisper AI fallback for Arabic Quran precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Science-backed scheduling &mdash; 30% fewer reviews with higher retention than SM-2. Your roots grow deeper.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time color-coded coaching with animated pronunciation guides. Master every rule on your path.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall &mdash; eight strategies that train every memory pathway.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five competitive tiers from Talib to Imam. Weekly promotions, streak multipliers, daily challenges.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description:
      "Ayah-by-ayah following with word-level highlighting, adjustable speed, and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device, study without internet. Data syncs seamlessly when you reconnect.",
  },
];

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Garden", href: "#garden" },
  { label: "Biomes", href: "#biomes" },
  { label: "Privacy", href: "#privacy" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GardenOverviewLanding() {
  return (
    <div className="min-h-screen bg-[#E8ECF1] text-[#3A3F47] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 bg-[#E8ECF1]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="rounded-2xl px-5 py-2.5 text-lg font-bold tracking-tight text-[#4A9E8E] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
          >
            QuranMemorizer
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-2xl bg-[#E8ECF1] px-4 py-2 text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-2xl bg-[#4A9E8E] px-5 py-2 text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO: GARDEN OVERVIEW ==================== */}
      <section id="garden" className="relative px-6 pb-24 pt-20">
        <div className="mx-auto max-w-6xl">
          {/* Hero heading plate */}
          <div className="mx-auto mb-16 max-w-3xl rounded-2xl bg-[#E8ECF1] px-10 py-14 text-center shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#4A9E8E]">
              The Surah Tree Garden
            </p>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-[#2E3339] sm:text-5xl lg:text-6xl">
              114 Surahs. 114 Trees.
              <br />
              <span className="text-[#4A9E8E]">One Paradise Garden.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5A6068]">
              Every surah in the Quran becomes a living tree in your personal
              garden. Each ayah is a flower that blooms when memorized and wilts
              when review is overdue. Watch your garden grow from seeds to a
              golden Paradise &mdash; powered by FSRS-6 spaced repetition, AI
              voice recognition, and real-time Tajweed coaching.
            </p>
          </div>

          {/* 6 Surah Tree Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {surahTrees.map((tree) => {
              const stage = stageConfig[tree.stage];
              const season = seasonConfig[tree.season];
              const Icon = stage.icon;
              const pct =
                tree.ayahs > 0
                  ? Math.round((tree.memorized / tree.ayahs) * 100)
                  : 0;

              return (
                <div
                  key={tree.name + tree.stage}
                  className="rounded-2xl bg-[#E8ECF1] p-7 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                >
                  {/* Tree visual area */}
                  <div className="mb-5 flex flex-col items-center">
                    {/* Canopy circle */}
                    <div
                      className={`${stage.canopySize} mb-2 flex items-center justify-center rounded-full bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]`}
                    >
                      <div className="flex size-3/4 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                        <Icon
                          className="size-1/2"
                          style={{ color: stage.accentColor }}
                        />
                      </div>
                    </div>
                    {/* Trunk */}
                    <div
                      className={`${stage.trunkWidth} rounded-b-md`}
                      style={{
                        height: "24px",
                        background: `linear-gradient(to bottom, ${stage.accentColor}60, ${stage.accentColor}20)`,
                      }}
                    />
                  </div>

                  {/* Surah name */}
                  <div className="mb-4 text-center">
                    <p className="text-2xl font-bold text-[#2E3339]" dir="rtl">
                      {tree.arabic}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#5A6068]">
                      {tree.name}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#5A6068]">
                        <span
                          className="tabular-nums font-bold"
                          style={{ color: stage.accentColor }}
                        >
                          {tree.memorized}
                        </span>
                        <span className="text-[#8A8F96]">
                          {" "}
                          / {tree.ayahs} ayahs
                        </span>
                      </span>
                      <span
                        className="tabular-nums font-bold"
                        style={{ color: stage.accentColor }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: stage.accentColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stage + Season badges */}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        color: stage.accentColor,
                        backgroundColor: `${stage.accentColor}15`,
                      }}
                    >
                      {stage.label}
                    </span>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        color: season.color,
                        backgroundColor: season.bg,
                      }}
                    >
                      {season.label}
                    </span>
                  </div>

                  {/* Branch tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {tree.branches.map((branch) => (
                      <span
                        key={branch}
                        className="rounded-lg bg-[#E8ECF1] px-2.5 py-1 text-xs font-medium text-[#5A6068] shadow-[3px_3px_6px_#c8ccd1,-3px_-3px_6px_#ffffff]"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Growth stages legend */}
          <div className="mx-auto mt-12 max-w-4xl rounded-2xl bg-[#E8ECF1] px-8 py-8 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <h3 className="mb-6 text-center text-lg font-bold text-[#2E3339]">
              Growth Stages
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {(
                [
                  "seed",
                  "sprout",
                  "sapling",
                  "young",
                  "mature",
                  "golden",
                ] as const
              ).map((key) => {
                const s = stageConfig[key];
                const SIcon = s.icon;
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[4px_4px_8px_#c8ccd1,-4px_-4px_8px_#ffffff]">
                      <SIcon
                        className="size-5"
                        style={{ color: s.accentColor }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: s.accentColor }}
                    >
                      {s.label}
                    </span>
                    <p
                      className="mt-1 text-[10px] leading-tight text-[#8A8F96]"
                      dangerouslySetInnerHTML={{ __html: s.description }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BIOME STRIP ==================== */}
      <section id="biomes" className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              30 Juz, 30 Garden Biomes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#5A6068]">
              Every juz unlocks a unique biome in your garden &mdash; from
              tranquil meadows to majestic mountain peaks. Complete all 30 to
              unlock the full Paradise Garden.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {biomes.map((biome) => {
              const BiomeIcon = biome.icon;
              return (
                <div key={biome.name} className="flex flex-col items-center">
                  {/* Outer raised circle */}
                  <div className="flex size-28 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[8px_8px_16px_#c8ccd1,-8px_-8px_16px_#ffffff] sm:size-32">
                    {/* Inner inset circle */}
                    <div className="relative flex size-20 flex-col items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] sm:size-24">
                      <BiomeIcon className="mb-1 size-6 text-[#4A9E8E] sm:size-7" />
                      <span className="tabular-nums text-lg font-bold text-[#4A9E8E]">
                        {biome.pct}%
                      </span>
                    </div>
                  </div>
                  <span className="mt-3 text-sm font-bold text-[#2E3339]">
                    {biome.name}
                  </span>
                  <span className="text-xs text-[#8A8F96]">
                    Juz {biome.juz}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Paradise progress bar */}
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-[#E8ECF1] px-8 py-6 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold text-[#2E3339]">
                Paradise Garden Progress
              </span>
              <span className="tabular-nums font-bold text-[#4A9E8E]">44%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4A9E8E] to-[#C9A84C]"
                style={{ width: "44%" }}
              />
            </div>
            <p className="mt-2 text-xs text-[#8A8F96]">
              <span className="tabular-nums font-semibold text-[#5A6068]">
                50
              </span>{" "}
              of 114 surahs have at least one memorized ayah
            </p>
          </div>
        </div>
      </section>

      {/* ==================== METAPHOR EXPLAINER ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-[#E8ECF1] p-10 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:p-14">
            <div className="grid items-center gap-10 sm:grid-cols-2">
              <div>
                <h2 className="text-balance text-3xl font-bold text-[#2E3339]">
                  Every element has meaning
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8ECF1] shadow-[4px_4px_8px_#c8ccd1,-4px_-4px_8px_#ffffff]">
                      <Flower2 className="size-5 text-[#4A9E8E]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2E3339]">
                        Flowers = Ayahs
                      </p>
                      <p className="text-sm text-[#5A6068]">
                        Each flower blooms when memorized. Overdue FSRS reviews
                        cause them to wilt &mdash; motivating consistent
                        practice.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8ECF1] shadow-[4px_4px_8px_#c8ccd1,-4px_-4px_8px_#ffffff]">
                      <TreePine className="size-5 text-[#3A8475]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2E3339]">
                        Branches = Themes (Mawdu&rsquo;at)
                      </p>
                      <p className="text-sm text-[#5A6068]">
                        Branches represent thematic subjects within the surah
                        &mdash; learn tafsir through structure, not just rote
                        memory.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8ECF1] shadow-[4px_4px_8px_#c8ccd1,-4px_-4px_8px_#ffffff]">
                      <Brain className="size-5 text-[#2E6B5E]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2E3339]">
                        Roots = FSRS Stability
                      </p>
                      <p className="text-sm text-[#5A6068]">
                        Deep roots mean strong long-term retention. The deeper
                        your roots, the harder it is for knowledge to be
                        uprooted.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8ECF1] shadow-[4px_4px_8px_#c8ccd1,-4px_-4px_8px_#ffffff]">
                      <Sparkles className="size-5 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2E3339]">
                        Rivers = Similar Verses
                      </p>
                      <p className="text-sm text-[#5A6068]">
                        Rivers flow between surah trees that share similar
                        verses (mutashabihat) &mdash; helping you master the
                        Quran&rsquo;s interconnections.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(["spring", "summer", "autumn", "winter"] as const).map(
                  (key) => {
                    const s = seasonConfig[key];
                    return (
                      <div
                        key={key}
                        className="flex flex-col items-center rounded-2xl bg-[#E8ECF1] p-5 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                      >
                        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                          <span
                            className="text-lg font-bold"
                            style={{ color: s.color }}
                          >
                            {key === "spring"
                              ? "\u{1F331}"
                              : key === "summer"
                                ? "\u{2600}"
                                : key === "autumn"
                                  ? "\u{1F342}"
                                  : "\u{2744}"}
                          </span>
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: s.color }}
                        >
                          {s.label}
                        </span>
                        <span className="mt-1 text-center text-[10px] leading-tight text-[#8A8F96]">
                          {key === "spring"
                            ? "Active learning"
                            : key === "summer"
                              ? "Peak mastery"
                              : key === "autumn"
                                ? "Falling behind"
                                : "Inactive"}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Everything your Hifz garden needs
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#5A6068]">
              Purpose-built for Quran memorization &mdash; each feature refined
              to help you grow a lasting, beautiful garden of knowledge.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-[#E8ECF1] p-7 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                >
                  <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                    <Icon className="size-6 text-[#4A9E8E]" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#2E3339]">
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-[#5A6068]"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== QUOTE ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl bg-[#E8ECF1] px-10 py-12 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <blockquote className="text-xl font-bold italic leading-relaxed text-[#2E3339] sm:text-2xl">
              &ldquo;And We have certainly made the Qur&rsquo;an easy for
              remembrance, so is there any who will remember?&rdquo;
            </blockquote>
            <cite className="mt-4 block text-sm font-medium text-[#4A9E8E] not-italic">
              Surah Al-Qamar &middot; 54:17
            </cite>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl bg-[#E8ECF1] px-10 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Plant your first seed today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#5A6068]">
              Free forever. No ads. No distractions. 114 surahs waiting to
              become 114 trees in the most beautiful memorization garden ever
              built. Begin your journey toward Paradise.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/register">
                  Start Growing Free
                  <ChevronRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#E8ECF1] px-8 py-4 text-base font-semibold text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/quran">Explore the Mushaf</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="px-6 pb-10 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-[#E8ECF1] px-8 py-8 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <Link
                href="/"
                className="text-lg font-bold text-[#4A9E8E] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
              >
                QuranMemorizer 2.0
              </Link>
              <nav className="flex flex-wrap gap-6">
                {footerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-[#5A6068] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-6 text-center text-xs text-[#8A8F96]">
              &copy; 2026 QuranMemorizer. Built with love for the Ummah.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
