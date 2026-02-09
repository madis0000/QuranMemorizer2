import Link from "next/link";
import {
  Award,
  BookOpen,
  Brain,
  ChevronRight,
  Crown,
  Flower2,
  Headphones,
  Lock,
  LogIn,
  Mic,
  Mountain,
  Repeat,
  Sparkles,
  Star,
  TreePine,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const biomes = [
  { juz: 1, name: "Garden of Alif", trees: 7, complete: 85, unlocked: true },
  { juz: 2, name: "Oasis of Nur", trees: 1, complete: 62, unlocked: true },
  {
    juz: 3,
    name: "Valley of Patience",
    trees: 1,
    complete: 45,
    unlocked: true,
  },
  { juz: 4, name: "Meadow of Mercy", trees: 2, complete: 30, unlocked: true },
  { juz: 5, name: "Hills of Wisdom", trees: 2, complete: 18, unlocked: true },
  { juz: 6, name: "River of Grace", trees: 2, complete: 10, unlocked: true },
  { juz: 7, name: "Forest of Sabr", trees: 2, complete: 5, unlocked: true },
  { juz: 8, name: "Plains of Hope", trees: 2, complete: 0, unlocked: false },
  { juz: 9, name: "Canyon of Trust", trees: 2, complete: 0, unlocked: false },
  { juz: 10, name: "Shores of Peace", trees: 3, complete: 0, unlocked: false },
  { juz: 11, name: "Peaks of Tawbah", trees: 2, complete: 0, unlocked: false },
  { juz: 12, name: "Groves of Yusuf", trees: 2, complete: 0, unlocked: false },
  { juz: 13, name: "Fields of Baraka", trees: 3, complete: 0, unlocked: false },
  { juz: 14, name: "Springs of Iman", trees: 2, complete: 0, unlocked: false },
  { juz: 15, name: "Woods of Dhikr", trees: 3, complete: 0, unlocked: false },
  {
    juz: 16,
    name: "Terraces of Light",
    trees: 3,
    complete: 0,
    unlocked: false,
  },
  { juz: 17, name: "Isle of Isra", trees: 3, complete: 0, unlocked: false },
  {
    juz: 18,
    name: "Dunes of Du\u2019a",
    trees: 3,
    complete: 0,
    unlocked: false,
  },
  { juz: 19, name: "Garden of Maryam", trees: 5, complete: 0, unlocked: false },
  { juz: 20, name: "Vista of Taha", trees: 2, complete: 0, unlocked: false },
  { juz: 21, name: "Trails of Anbiya", trees: 4, complete: 0, unlocked: false },
  { juz: 22, name: "Bluffs of Hajj", trees: 4, complete: 0, unlocked: false },
  { juz: 23, name: "Canopy of Noor", trees: 4, complete: 0, unlocked: false },
  { juz: 24, name: "Bloom of Furqan", trees: 5, complete: 0, unlocked: false },
  { juz: 25, name: "Refuge of Shura", trees: 5, complete: 0, unlocked: false },
  { juz: 26, name: "Harbor of Ahqaf", trees: 5, complete: 0, unlocked: false },
  { juz: 27, name: "Summit of Qadr", trees: 5, complete: 0, unlocked: false },
  {
    juz: 28,
    name: "Clearing of Hashr",
    trees: 6,
    complete: 0,
    unlocked: false,
  },
  { juz: 29, name: "Dawn of Mulk", trees: 11, complete: 0, unlocked: false },
  { juz: 30, name: "Crown of Amma", trees: 37, complete: 0, unlocked: false },
];

const milestones = [
  {
    icon: Flower2,
    title: "First Biome Unlocked",
    description:
      "Complete every surah tree in your first juz. The Garden of Alif bursts into full bloom \u2014 flowers on every branch, butterflies visiting, a living testament to your dedication.",
    threshold: "1 of 30 juz",
    color: "#4A9E8E",
  },
  {
    icon: Mountain,
    title: "Half the Quran",
    description:
      "Fifteen biomes thriving. Rivers of similar-verse connections flow between your trees. Your garden stretches further than most will ever walk. The horizon shimmers with what\u2019s ahead.",
    threshold: "15 of 30 juz",
    color: "#B8884A",
  },
  {
    icon: Crown,
    title: "Paradise Garden",
    description:
      "All 30 biomes complete. 114 golden trees. Rivers of light. A garden so magnificent it can only be called one thing \u2014 Jannah. You have memorized the entire Word of Allah.",
    threshold: "30 of 30 juz",
    color: "#C9A84C",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts \u2014 Madinah, IndoPak, and beyond.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech API for speed, Whisper AI for Quran-specific precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Science-backed scheduling with 30% fewer reviews and higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "From first-letter hints to full recall \u2014 eight memory strategies for every learner.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions, streaks, and daily challenges.",
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

const journeySteps = [
  {
    step: "01",
    icon: TreePine,
    title: "Plant Your First Tree",
    text: "Choose any surah. Begin memorizing its ayahs. Each one becomes a flower on your tree\u2019s branches.",
  },
  {
    step: "02",
    icon: Star,
    title: "Grow Your Biome",
    text: "Complete every surah in a juz to unlock its biome. FSRS-6 keeps your flowers blooming with optimized reviews.",
  },
  {
    step: "03",
    icon: Crown,
    title: "Reach Paradise",
    text: "Unlock all 30 biomes. Watch your garden transform into a radiant Paradise \u2014 the ultimate achievement.",
  },
];

const stats = [
  { value: "114", label: "Trees to Grow" },
  { value: "6,236", label: "Flowers to Bloom" },
  { value: "30", label: "Biomes to Unlock" },
  { value: "1", label: "Paradise to Earn" },
];

const footerLinks = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Tajweed", href: "/tajweed" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ParadiseGardenProgressLanding() {
  const unlockedCount = biomes.filter((b) => b.unlocked).length;
  const totalTrees = biomes.reduce((sum, b) => sum + b.trees, 0);

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

          <div className="hidden items-center gap-6 md:flex">
            {["Map", "Milestones", "Features"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-medium text-[#5A6068] transition-colors duration-200 hover:text-[#4A9E8E] focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
              >
                {label}
              </Link>
            ))}
          </div>

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

      {/* ==================== HERO ==================== */}
      <section className="relative px-6 pb-24 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-12 max-w-3xl rounded-2xl bg-[#E8ECF1] px-10 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            {/* Vision badge */}
            <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-2xl bg-[#E8ECF1] px-5 py-2.5 shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
              <Crown className="size-4 text-[#C9A84C]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                The Ultimate Vision
              </span>
            </div>

            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-[#2E3339] sm:text-5xl lg:text-6xl">
              Complete <span className="tabular-nums">114</span> trees to unlock
              <span className="text-[#C9A84C]"> Paradise</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5A6068]">
              Every surah is a tree. Every juz is a biome. Memorize the entire
              Quran and watch your personal garden transform into a radiant
              Paradise &mdash; the most beautiful destination any Hafiz can
              imagine.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/register">
                Begin Your Journey to Paradise
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
      </section>

      {/* ==================== STATS DIALS ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="flex size-28 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[8px_8px_16px_#c8ccd1,-8px_-8px_16px_#ffffff] sm:size-32">
                <div className="flex size-20 flex-col items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] sm:size-24">
                  <span className="tabular-nums text-2xl font-bold text-[#4A9E8E] sm:text-3xl">
                    {stat.value}
                  </span>
                </div>
              </div>
              <span className="mt-3 text-sm font-medium text-[#5A6068]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== PROGRESS MAP ==================== */}
      <section id="map" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
              The Progress Map
            </p>
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              30 biomes. 30 juz. One Paradise.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#5A6068]">
              Each square represents one juz of the Quran. Unlock biomes by
              memorizing every surah within them. Your journey from the first
              garden to Paradise is mapped right here.
            </p>
          </div>

          {/* Garden progress summary bar */}
          <div className="mx-auto mb-10 max-w-2xl rounded-2xl bg-[#E8ECF1] px-8 py-5 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
                  Overall Progress
                </p>
                <p className="mt-1 text-xl font-bold text-[#2E3339]">
                  <span className="tabular-nums text-[#4A9E8E]">
                    {unlockedCount}
                  </span>
                  <span className="text-[#5A6068]"> / 30 biomes started</span>
                </p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="tabular-nums text-xl font-bold text-[#4A9E8E]">
                    {totalTrees}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6068]">
                    Total Trees
                  </p>
                </div>
                <div className="w-px bg-[#c8ccd1]" aria-hidden="true" />
                <div>
                  <p className="tabular-nums text-xl font-bold text-[#C9A84C]">
                    0
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A6068]">
                    Complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6x5 Grid of biomes */}
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-6">
            {biomes.map((biome) => (
              <div
                key={biome.juz}
                className={`rounded-2xl p-4 transition-shadow duration-200 ${
                  biome.unlocked
                    ? "bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                    : "bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]"
                }`}
              >
                {/* Juz number + lock/tree icon */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`tabular-nums text-xs font-bold ${
                      biome.unlocked ? "text-[#4A9E8E]" : "text-[#8A8F96]"
                    }`}
                  >
                    Juz {biome.juz}
                  </span>
                  {biome.unlocked ? (
                    <TreePine className="size-4 text-[#4A9E8E]" />
                  ) : (
                    <Lock className="size-3.5 text-[#8A8F96]" />
                  )}
                </div>

                {/* Biome name */}
                <p
                  className={`mb-2 text-[11px] font-semibold leading-tight ${
                    biome.unlocked ? "text-[#2E3339]" : "text-[#8A8F96]"
                  }`}
                >
                  {biome.name}
                </p>

                {/* Trees count */}
                <p
                  className={`mb-2 text-[10px] ${
                    biome.unlocked ? "text-[#5A6068]" : "text-[#8A8F96]"
                  }`}
                >
                  <span className="tabular-nums font-semibold">
                    {biome.trees}
                  </span>{" "}
                  {biome.trees === 1 ? "tree" : "trees"}
                </p>

                {/* Progress bar */}
                {biome.unlocked ? (
                  <div>
                    <div className="mb-1 h-2 overflow-hidden rounded-full bg-[#E8ECF1] shadow-[inset_2px_2px_4px_#c8ccd1,inset_-2px_-2px_4px_#ffffff]">
                      <div
                        className="h-full rounded-full bg-[#4A9E8E]"
                        style={{ width: `${biome.complete}%` }}
                      />
                    </div>
                    <p className="tabular-nums text-right text-[10px] font-bold text-[#4A9E8E]">
                      {biome.complete}%
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="h-2 flex-1 rounded-full bg-[#E8ECF1] shadow-[inset_2px_2px_4px_#c8ccd1,inset_-2px_-2px_4px_#ffffff]" />
                    <p className="text-[10px] font-medium text-[#8A8F96]">
                      Locked
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MILESTONES ==================== */}
      <section id="milestones" className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
              Major Milestones
            </p>
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Three landmarks on the path to Paradise
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {milestones.map((milestone) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={milestone.title}
                  className="rounded-2xl bg-[#E8ECF1] p-8 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]"
                >
                  {/* Icon circle */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                      <Icon
                        className="size-7"
                        style={{ color: milestone.color }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: milestone.color }}
                      >
                        {milestone.threshold}
                      </p>
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#2E3339]">
                    {milestone.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5A6068]">
                    {milestone.description}
                  </p>

                  {/* Decorative bottom bar */}
                  <div
                    className="mt-6 h-1 rounded-full"
                    style={{ backgroundColor: `${milestone.color}30` }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:
                          milestone.title === "First Biome Unlocked"
                            ? "85%"
                            : "0%",
                        backgroundColor: milestone.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-14 text-center text-3xl font-bold text-[#2E3339]">
            How your garden grows
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {journeySteps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                    <Icon className="size-8 text-[#4A9E8E]" />
                  </div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
                    Step {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#2E3339]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5A6068]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== QURAN QUOTE ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl bg-[#E8ECF1] px-8 py-10 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <blockquote className="text-xl font-semibold italic leading-relaxed text-[#2E3339] sm:text-2xl">
              &ldquo;The likeness of His Light is as a niche wherein is a lamp
              &mdash; the lamp is in a glass, the glass as it were a brilliant
              star.&rdquo;
            </blockquote>
            <cite className="mt-4 block text-sm font-medium not-italic text-[#4A9E8E]">
              Surah An-Nur &middot; 24:35
            </cite>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES GRID ==================== */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Every tool for the journey
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#5A6068]">
              The most complete Quran memorization toolkit ever built &mdash;
              designed to carry you from your first ayah to your last.
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
                  <p className="text-sm leading-relaxed text-[#5A6068]">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== PARADISE PREVIEW ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-[#E8ECF1] p-10 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:p-14">
            <div className="grid items-center gap-10 sm:grid-cols-2">
              <div>
                <h2 className="text-balance text-3xl font-bold text-[#2E3339]">
                  What Paradise looks like
                </h2>
                <p className="mt-4 leading-relaxed text-[#5A6068]">
                  When all 30 biomes are complete, your garden transforms. Every
                  tree turns golden. Rivers of light connect similar verses.
                  Butterflies &mdash; your achievements &mdash; fill the canopy.
                  It is the visual reward for the greatest intellectual and
                  spiritual feat in Islam: becoming a Hafiz of the Quran.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                    <span className="tabular-nums text-sm font-bold text-[#C9A84C]">
                      114
                    </span>
                  </div>
                  <span className="text-sm text-[#5A6068]">
                    Golden trees in your completed garden
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[Award, Star, Trophy, Crown, Sparkles, Flower2].map(
                  (Icon, i) => (
                    <div
                      key={i}
                      className="flex size-20 items-center justify-center rounded-2xl bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                    >
                      <Icon className="size-8 text-[#C9A84C]" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl bg-[#E8ECF1] px-10 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
              <Crown className="size-7 text-[#C9A84C]" />
            </div>
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Begin your journey to Paradise
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#5A6068]">
              Free forever. No ads. No distractions. Just you, the Quran, and
              the most beautiful memorization garden ever imagined. Plant your
              first tree today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/register">
                  Create Free Account
                  <ChevronRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#E8ECF1] px-8 py-4 text-base font-semibold text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/quran">
                  <BookOpen className="size-5" />
                  Browse the Mushaf
                </Link>
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
