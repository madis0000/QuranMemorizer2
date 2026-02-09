import Link from "next/link";
import {
  ArrowRight,
  Bird,
  BookOpen,
  Brain,
  Crown,
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

const seeds = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    description:
      "The Opening \u2014 seven precious petals that open the gate to every garden",
  },
  {
    name: "Al-Ikhlas",
    arabic: "\u0627\u0644\u0625\u062E\u0644\u0627\u0635",
    ayahs: 4,
    description:
      "Sincerity \u2014 a tiny seed worth a third of the entire forest",
  },
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    description: "Abundance \u2014 the smallest bonsai with the deepest roots",
  },
];

const growingTrees = [
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    bloomed: 47,
    progress: 57,
    branches: ["Resurrection", "Signs", "Creation"],
    season: "Spring",
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    bloomed: 31,
    progress: 40,
    branches: ["Blessings", "Creation", "Paradise"],
    season: "Spring",
  },
  {
    name: "Al-Mulk",
    arabic: "\u0627\u0644\u0645\u0644\u0643",
    ayahs: 30,
    bloomed: 18,
    progress: 60,
    branches: ["Sovereignty", "Creation", "Accountability"],
    season: "Summer",
  },
];

const masteredTrees = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    flowers: 7,
    branches: ["Praise", "Guidance", "Prayer"],
    achievements: ["First Bloom", "Perfect Roots"],
  },
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    flowers: 3,
    branches: ["Abundance"],
    achievements: ["Golden Bonsai", "Speed Bloom"],
  },
];

const paradiseStats = [
  { value: "114", label: "Trees in Paradise" },
  { value: "6,236", label: "Blooming Flowers" },
  { value: "30", label: "Biome Realms" },
  { value: "604", label: "Mushaf Pages" },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions matching the physical Mushaf page-for-page, line-for-line.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Quran-tuned precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen algorithm. 30% fewer reviews for the same retention as SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation visuals.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "From first-letter hints to full recall. Eight pathways to permanent memory.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotion and daily challenges.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah playback with word-level sync and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Syncs when reconnected.",
  },
];

const starPositions = [
  { top: "8%", left: "12%", size: 3, opacity: 0.7 },
  { top: "15%", left: "85%", size: 4, opacity: 0.9 },
  { top: "6%", left: "45%", size: 2, opacity: 0.5 },
  { top: "22%", left: "72%", size: 3, opacity: 0.6 },
  { top: "10%", left: "30%", size: 5, opacity: 0.8 },
  { top: "18%", left: "58%", size: 2, opacity: 0.4 },
  { top: "4%", left: "92%", size: 3, opacity: 0.7 },
  { top: "25%", left: "8%", size: 4, opacity: 0.6 },
  { top: "12%", left: "68%", size: 2, opacity: 0.5 },
  { top: "20%", left: "40%", size: 3, opacity: 0.8 },
  { top: "7%", left: "55%", size: 2, opacity: 0.4 },
  { top: "16%", left: "20%", size: 4, opacity: 0.7 },
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

export default function StorybookIllustratedLanding() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#EADFD0] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-[#F4A261]/10 bg-[#1A1A2E]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-medium tracking-wide text-[#F4A261] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#F4A261] focus-visible:outline-none"
          >
            <Star
              className="size-5"
              style={{ filter: "drop-shadow(0 0 6px rgba(244,162,97,0.5))" }}
            />
            <span>QuranMemorizer</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="border border-[#F4A261]/15 bg-transparent px-4 py-2 text-sm font-light text-[#EADFD0] transition-colors duration-200 hover:border-[#F4A261]/30 hover:bg-[#F4A261]/5 hover:text-[#F4A261] focus-visible:ring-2 focus-visible:ring-[#F4A261]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="bg-[#F4A261] px-5 py-2 text-sm font-medium text-[#1A1A2E] shadow-[0_0_20px_rgba(244,162,97,0.2)] transition-all duration-200 hover:bg-[#F4A261]/90 hover:shadow-[0_0_30px_rgba(244,162,97,0.35)] focus-visible:ring-2 focus-visible:ring-[#F4A261]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO: Once Upon a Surah ==================== */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 py-24">
        {/* Stars */}
        {starPositions.map((star, i) => (
          <div
            key={i}
            className="pointer-events-none absolute rounded-full bg-[#FFE8A3]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 3}px rgba(255,232,163,${star.opacity * 0.5})`,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Warm ambient glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(244,162,97,0.06) 0%, rgba(42,157,143,0.03) 40%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-6 text-sm font-light italic tracking-widest text-[#8A8AAE]">
            A story told in light and leaves
          </p>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Once upon a time,
            <br />
            <span
              className="text-[#F4A261]"
              style={{ textShadow: "0 0 40px rgba(244,162,97,0.25)" }}
            >
              every surah became a tree...
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-[#8A8AAE]">
            In a garden beyond time, 114 trees await your voice. Each ayah you
            memorize blooms a flower. Each page grows a canopy. And when the
            last petal opens, the garden becomes{" "}
            <em className="text-[#FFE8A3]">Paradise itself</em>.
          </p>

          <div className="mt-10">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 text-lg font-medium text-[#F4A261] transition-all duration-300 hover:gap-4 focus-visible:ring-2 focus-visible:ring-[#F4A261] focus-visible:outline-none"
              style={{ textShadow: "0 0 20px rgba(244,162,97,0.3)" }}
            >
              Begin the Story
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CHAPTER ONE: The Seeds ==================== */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#F4A261]">
            Chapter One
          </p>
          <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
            The Seeds
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-light italic leading-relaxed text-[#8A8AAE]">
            &ldquo;The smallest seeds grow into the most precious bonsai. Begin
            with what is gentle, and the garden will teach you what comes
            next.&rdquo;
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {seeds.map((seed) => (
              <div
                key={seed.name}
                className="rounded-xl border border-[#F4A261]/20 bg-[#232347] p-6 transition-all duration-300 hover:border-[#F4A261]/40 hover:shadow-[0_0_30px_rgba(244,162,97,0.08)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#2A9D8F]/15">
                    <Sprout className="size-5 text-[#2A9D8F]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#EADFD0]">
                      {seed.name}
                    </p>
                    <p className="font-['Amiri'] text-base text-[#F4A261]">
                      {seed.arabic}
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-xs font-medium text-[#2A9D8F]">
                  <span className="tabular-nums">{seed.ayahs}</span> ayahs
                </p>
                <p className="text-sm font-light leading-relaxed text-[#8A8AAE]">
                  {seed.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CHAPTER TWO: The Growing Forest ==================== */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#F4A261]">
            Chapter Two
          </p>
          <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
            The Growing Forest
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-light italic leading-relaxed text-[#8A8AAE]">
            &ldquo;As the days pass and the voice returns, the saplings rise.
            Roots deepen with each review. Branches reach toward every
            theme.&rdquo;
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {growingTrees.map((tree) => (
              <div
                key={tree.name}
                className="rounded-xl border border-[#2A9D8F]/20 bg-[#232347] p-6 transition-all duration-300 hover:border-[#2A9D8F]/40 hover:shadow-[0_0_30px_rgba(42,157,143,0.08)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#2A9D8F]/15">
                      <TreePine className="size-5 text-[#2A9D8F]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#EADFD0]">
                        {tree.name}
                      </p>
                      <p className="font-['Amiri'] text-base text-[#F4A261]">
                        {tree.arabic}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-light text-[#8A8AAE]">
                    {tree.season}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-[#8A8AAE]">
                    <span>
                      <span className="tabular-nums text-[#2A9D8F]">
                        {tree.bloomed}
                      </span>{" "}
                      / <span className="tabular-nums">{tree.ayahs}</span>{" "}
                      flowers
                    </span>
                    <span className="tabular-nums font-medium text-[#2A9D8F]">
                      {tree.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1A1A2E]">
                    <div
                      className="h-full rounded-full bg-[#2A9D8F]"
                      style={{
                        width: `${tree.progress}%`,
                        boxShadow: "0 0 8px rgba(42,157,143,0.4)",
                      }}
                    />
                  </div>
                </div>

                {/* Branches */}
                <div className="flex flex-wrap gap-1.5">
                  {tree.branches.map((branch) => (
                    <span
                      key={branch}
                      className="rounded-full border border-[#2A9D8F]/20 bg-[#2A9D8F]/10 px-2.5 py-0.5 text-xs font-light text-[#2A9D8F]"
                    >
                      <Leaf className="mb-0.5 mr-1 inline size-3" />
                      {branch}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CHAPTER THREE: The Golden Trees ==================== */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#F4A261]">
            Chapter Three
          </p>
          <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
            The Golden Trees
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-light italic leading-relaxed text-[#8A8AAE]">
            &ldquo;When every flower has opened, the tree turns to gold. It hums
            with a quiet light, its roots deeper than you can see. Mastery is
            not the end \u2014 it is when the tree begins to sing.&rdquo;
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {masteredTrees.map((tree) => (
              <div
                key={tree.name}
                className="rounded-xl border border-[#FFE8A3]/30 bg-[#232347] p-8 shadow-[0_0_40px_rgba(255,232,163,0.06)] transition-all duration-300 hover:border-[#FFE8A3]/50 hover:shadow-[0_0_60px_rgba(255,232,163,0.1)]"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div
                    className="flex size-12 items-center justify-center rounded-full bg-[#FFE8A3]/15"
                    style={{ boxShadow: "0 0 20px rgba(255,232,163,0.15)" }}
                  >
                    <Trees className="size-6 text-[#FFE8A3]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#FFE8A3]">
                      {tree.name}
                    </p>
                    <p className="font-['Amiri'] text-xl text-[#F4A261]">
                      {tree.arabic}
                    </p>
                  </div>
                  <Crown
                    className="ml-auto size-5 text-[#FFE8A3]"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(255,232,163,0.5))",
                    }}
                  />
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <Flower2 className="size-4 text-[#FFE8A3]" />
                  <span className="text-sm text-[#EADFD0]">
                    <span className="tabular-nums font-bold text-[#FFE8A3]">
                      {tree.flowers}
                    </span>{" "}
                    / <span className="tabular-nums">{tree.ayahs}</span> flowers
                    in full bloom
                  </span>
                </div>

                {/* Full progress bar */}
                <div className="mb-4 h-1.5 rounded-full bg-[#1A1A2E]">
                  <div
                    className="h-full rounded-full bg-[#FFE8A3]"
                    style={{
                      width: "100%",
                      boxShadow: "0 0 10px rgba(255,232,163,0.4)",
                    }}
                  />
                </div>

                {/* Branches */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {tree.branches.map((branch) => (
                    <span
                      key={branch}
                      className="rounded-full border border-[#FFE8A3]/20 bg-[#FFE8A3]/10 px-2.5 py-0.5 text-xs font-light text-[#FFE8A3]"
                    >
                      {branch}
                    </span>
                  ))}
                </div>

                {/* Achievements */}
                <div className="flex flex-wrap gap-2">
                  {tree.achievements.map((ach) => (
                    <span
                      key={ach}
                      className="inline-flex items-center gap-1 rounded-full bg-[#F4A261]/15 px-3 py-1 text-xs font-medium text-[#F4A261]"
                    >
                      <Star className="size-3" />
                      {ach}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CHAPTER FOUR: Paradise ==================== */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#F4A261]">
            Chapter Four
          </p>
          <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
            Paradise
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-light italic leading-relaxed text-[#8A8AAE]">
            &ldquo;And then, one day, the last petal opened. The garden was
            complete. Light poured from every leaf, rivers sang between the
            trees, and birds of achievement took flight.&rdquo;
          </p>

          <div className="mt-12 rounded-2xl border border-[#F4A261]/25 bg-[#232347] p-8 shadow-[0_0_60px_rgba(244,162,97,0.08)] sm:p-12">
            <div className="mb-8 flex items-center gap-3">
              <div
                className="flex size-14 items-center justify-center rounded-full bg-[#F4A261]/15"
                style={{ boxShadow: "0 0 30px rgba(244,162,97,0.15)" }}
              >
                <Sparkles className="size-7 text-[#F4A261]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#F4A261]">
                  The Garden of Jannah
                </h3>
                <p className="text-sm font-light text-[#8A8AAE]">
                  When all 114 trees bloom, your garden becomes Paradise itself
                </p>
              </div>
            </div>

            <p className="mb-8 text-base font-light leading-relaxed text-[#8A8AAE]">
              Rivers of similar verse connections flow between golden trees.
              Birds and butterflies \u2014 your earned achievements \u2014 dance
              through the canopy. Thirty biomes, one for each juz, each alive
              with its own colors and seasons. This is not just a metaphor. It
              is a living map of your journey with the Quran.
            </p>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {paradiseStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="tabular-nums text-3xl font-bold text-[#F4A261]"
                    style={{ textShadow: "0 0 20px rgba(244,162,97,0.25)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-light text-[#8A8AAE]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Decorative elements: birds, rivers, butterflies */}
            <div className="mt-8 flex items-center justify-center gap-4 text-[#8A8AAE]">
              <Bird className="size-4 text-[#FFE8A3]" />
              <span className="text-xs font-light italic">
                Birds = achievements
              </span>
              <span className="text-[#F4A261]/30">|</span>
              <Flower2 className="size-4 text-[#2A9D8F]" />
              <span className="text-xs font-light italic">
                Flowers = memorized ayahs
              </span>
              <span className="text-[#F4A261]/30">|</span>
              <Sparkles className="size-4 text-[#F4A261]" />
              <span className="text-xs font-light italic">
                Rivers = similar verses
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE TOOLS OF THE GARDENER ==================== */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#F4A261]">
            The Tools of the Gardener
          </p>
          <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
            Everything You Need to Grow
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-light italic leading-relaxed text-[#8A8AAE]">
            &ldquo;A gardener is only as good as their tools. Here are yours
            \u2014 forged by science, polished by tradition.&rdquo;
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[#2A9D8F]/15 bg-[#232347] p-5 transition-all duration-300 hover:border-[#2A9D8F]/30 hover:shadow-[0_0_25px_rgba(42,157,143,0.06)]"
              >
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[#2A9D8F]/15">
                  <feature.icon className="size-4.5 text-[#2A9D8F]" />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-[#EADFD0]">
                  {feature.title}
                </h3>
                <p className="text-xs font-light leading-relaxed text-[#8A8AAE]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== QURANIC QUOTE ==================== */}
      <section className="relative px-6 py-24">
        {/* Scattered stars around the quote */}
        <div
          className="pointer-events-none absolute right-[20%] top-[30%] size-2 rounded-full bg-[#FFE8A3]"
          style={{ boxShadow: "0 0 8px rgba(255,232,163,0.5)", opacity: 0.7 }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-[15%] top-[60%] size-3 rounded-full bg-[#FFE8A3]"
          style={{ boxShadow: "0 0 10px rgba(255,232,163,0.4)", opacity: 0.6 }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-[30%] bottom-[25%] size-2 rounded-full bg-[#FFE8A3]"
          style={{ boxShadow: "0 0 6px rgba(255,232,163,0.5)", opacity: 0.5 }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-3xl text-center">
          <p
            className="font-['Amiri'] text-3xl leading-relaxed text-[#FFE8A3] sm:text-4xl"
            dir="rtl"
          >
            {
              "\u0648\u064E\u0644\u064E\u0642\u064E\u062F\u0652 \u064A\u064E\u0633\u064E\u0651\u0631\u0652\u0646\u064E\u0627 \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E \u0644\u0650\u0644\u0630\u064E\u0651\u0643\u064E\u0631\u0650 \u0641\u064E\u0647\u064E\u0644\u0652 \u0645\u0650\u0646\u0652 \u0645\u064F\u062F\u064E\u0651\u0643\u0650\u0631\u064D"
            }
          </p>
          <p className="mt-6 text-base font-light italic leading-relaxed text-[#8A8AAE]">
            &ldquo;And We have certainly made the Quran easy for remembrance, so
            is there any who will remember?&rdquo;
          </p>
          <p className="mt-2 text-sm font-medium text-[#F4A261]">
            Surah Al-Qamar (54:17)
          </p>
        </div>
      </section>

      {/* ==================== CTA: The End... or The Beginning? ==================== */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#F4A261]">
            The Final Chapter
          </p>
          <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
            The End... or{" "}
            <span
              className="text-[#F4A261]"
              style={{ textShadow: "0 0 30px rgba(244,162,97,0.2)" }}
            >
              The Beginning?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light italic leading-relaxed text-[#8A8AAE]">
            &ldquo;Every great garden began with a single seed planted in faith.
            Your story starts the moment you speak the first ayah.&rdquo;
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="bg-[#F4A261] px-8 py-3 text-base font-medium text-[#1A1A2E] shadow-[0_0_30px_rgba(244,162,97,0.25)] transition-all duration-300 hover:bg-[#F4A261]/90 hover:shadow-[0_0_40px_rgba(244,162,97,0.4)] focus-visible:ring-2 focus-visible:ring-[#F4A261]"
            >
              <Link href="/register">
                <Sprout className="size-5" />
                Plant Your First Seed
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="border border-[#F4A261]/20 bg-transparent px-6 py-3 text-base font-light text-[#EADFD0] transition-colors duration-200 hover:border-[#F4A261]/40 hover:bg-[#F4A261]/5 hover:text-[#F4A261] focus-visible:ring-2 focus-visible:ring-[#F4A261]"
            >
              <Link href="/quran">
                <BookOpen className="size-5" />
                Read the Quran First
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-[#F4A261]/10 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-[#F4A261] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#F4A261] focus-visible:outline-none"
          >
            <Star className="size-4" />
            QuranMemorizer
          </Link>

          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-light text-[#8A8AAE] transition-colors duration-200 hover:text-[#F4A261] focus-visible:ring-2 focus-visible:ring-[#F4A261] focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-xs font-light text-[#8A8AAE]/60">
            &copy; 2026 QuranMemorizer
          </p>
        </div>
      </footer>
    </div>
  );
}
