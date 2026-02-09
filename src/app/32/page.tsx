import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Flower2,
  Headphones,
  LogIn,
  Mic,
  Repeat,
  Shield,
  Sparkles,
  TreePine,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const BONSAI_TREES = [
  {
    name: "Al-Fatiha",
    nameAr: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    memorized: 7,
    progress: 100,
    season: "summer",
    branches: "praise \u00B7 guidance \u00B7 du\u2019a",
  },
  {
    name: "Al-Baqarah",
    nameAr: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    memorized: 142,
    progress: 50,
    season: "spring",
    branches: "law \u00B7 stories \u00B7 faith \u00B7 jihad",
  },
  {
    name: "Maryam",
    nameAr: "\u0645\u0631\u064A\u0645",
    ayahs: 98,
    memorized: 73,
    progress: 74,
    season: "spring",
    branches: "prophets \u00B7 mercy \u00B7 devotion",
  },
  {
    name: "Yasin",
    nameAr: "\u064A\u0633",
    ayahs: 83,
    memorized: 83,
    progress: 100,
    season: "summer",
    branches: "resurrection \u00B7 signs \u00B7 mercy",
  },
  {
    name: "Al-Kawthar",
    nameAr: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    memorized: 3,
    progress: 100,
    season: "summer",
    branches: "gratitude",
  },
] as const;

const GARDEN_WAY = [
  {
    icon: TreePine,
    label: "roots",
    text: "FSRS stability \u2014 the unseen strength that holds your memory in the earth",
  },
  {
    icon: TreePine,
    label: "trunk",
    text: "mastery \u2014 the steady core, built verse by verse, day by day",
  },
  {
    icon: TreePine,
    label: "branches",
    text: "mawdu\u2019at \u2014 thematic subjects that spread outward like understanding",
  },
  {
    icon: Flower2,
    label: "flowers",
    text: "each ayah memorized \u2014 a bloom that opens, and wilts if neglected",
  },
  {
    icon: Sparkles,
    label: "rivers",
    text: "similar verse connections \u2014 flowing between trees, linking what the mind confuses",
  },
] as const;

const FEATURES = [
  {
    icon: BookOpen,
    name: "Page-Accurate Mushaf",
    text: "Seven editions rendered to match your physical Mushaf, page for page, line for line.",
  },
  {
    icon: Mic,
    name: "AI Voice Recognition",
    text: "Web Speech API with Whisper fallback. Recite freely and receive word-level feedback.",
  },
  {
    icon: Brain,
    name: "FSRS-6 Spaced Repetition",
    text: "The most effective SRS algorithm available. Fewer reviews, deeper retention.",
  },
  {
    icon: Shield,
    name: "13-Rule Tajweed Detection",
    text: "Real-time analysis of your recitation with color-coded rule identification.",
  },
  {
    icon: Repeat,
    name: "8 Progressive Hide Modes",
    text: "First-letter hints, keyword mode, reverse recall, and six more strategies.",
  },
  {
    icon: Trophy,
    name: "Quran-Themed Leagues",
    text: "Five tiers from Talib to Imam. Weekly XP competition with promotion and demotion.",
  },
  {
    icon: Headphones,
    name: "Multi-Qari Playback",
    text: "Dozens of world-renowned reciters. Ayah-by-ayah synchronization, offline support.",
  },
  {
    icon: WifiOff,
    name: "Offline-First PWA",
    text: "Works without internet. Background sync, IndexedDB caching, installable anywhere.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Helper: progress line color                                        */
/* ------------------------------------------------------------------ */

function progressColor(pct: number): string {
  if (pct === 100) return "#B8960C";
  if (pct >= 50) return "#5B7B5E";
  return "#8B7355";
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function JapaneseZenGardenLandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D2D2D]">
      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="border-b border-[#E5E0D8]">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          <Link
            href="/"
            className="text-lg font-extralight tracking-wide text-[#2D2D2D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7B5E] rounded"
          >
            QuranMemorizer
          </Link>
          <div className="flex items-center gap-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="font-light tracking-wide text-[#9B9B9B] hover:text-[#2D2D2D] focus-visible:ring-2 focus-visible:ring-[#5B7B5E]"
            >
              <Link href="/login">
                <LogIn className="mr-1.5 size-3.5" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="font-light tracking-wide text-[#9B9B9B] hover:text-[#2D2D2D] focus-visible:ring-2 focus-visible:ring-[#5B7B5E]"
            >
              <Link href="/register">
                <UserPlus className="mr-1.5 size-3.5" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 lg:py-44">
        <h1 className="mb-6 max-w-2xl text-balance text-center text-4xl font-extralight leading-snug tracking-wide text-[#2D2D2D] lg:text-5xl">
          Tend your garden.
          <br />
          Memorize the Quran.
        </h1>
        <p className="mb-12 max-w-lg text-center font-light leading-relaxed text-[#9B9B9B]">
          114 surahs become 114 bonsai. Each ayah, a flower. Each review, deeper
          roots. Build a garden that reflects the Quran in your heart.
        </p>
        <Link
          href="/register"
          className="group inline-flex items-center gap-2 font-light tracking-wide text-[#5B7B5E] transition-colors hover:text-[#3D5A40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7B5E] rounded"
        >
          Begin your garden
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* ── Bonsai Surah Trees ───────────────────────────────────── */}
      <section className="px-6 pb-32 pt-8">
        <p className="mb-16 text-center text-xs font-light lowercase tracking-[0.2em] text-[#9B9B9B]">
          surah bonsai
        </p>

        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {BONSAI_TREES.map((tree) => (
            <div
              key={tree.name}
              className="flex flex-col items-center border border-[#E5E0D8] bg-[#FAF9F6] px-6 py-10"
            >
              {/* Tree icon */}
              <TreePine
                className="mb-6 size-8"
                style={{ color: progressColor(tree.progress) }}
              />

              {/* Surah name */}
              <h3 className="mb-1 text-center font-light tracking-wide">
                {tree.name}
              </h3>
              <p
                className="mb-6 text-center text-sm font-light text-[#9B9B9B]"
                dir="rtl"
                lang="ar"
              >
                {tree.nameAr}
              </p>

              {/* Progress line */}
              <div className="mb-4 h-px w-full bg-[#E5E0D8]">
                <div
                  className="h-px"
                  style={{
                    width: `${tree.progress}%`,
                    backgroundColor: progressColor(tree.progress),
                  }}
                />
              </div>

              {/* Stats */}
              <p className="mb-1 text-center text-xs font-light tracking-[0.15em] text-[#9B9B9B]">
                <span className="tabular-nums">{tree.memorized}</span>
                {" / "}
                <span className="tabular-nums">{tree.ayahs}</span>
                {" ayahs"}
              </p>
              <p className="mb-4 text-center text-xs font-light tracking-[0.15em] text-[#9B9B9B]">
                {tree.season}
              </p>

              {/* Branches */}
              <p className="text-center text-xs font-light leading-relaxed text-[#9B9B9B]">
                {tree.branches}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Way of the Garden ────────────────────────────────── */}
      <section className="border-t border-[#E5E0D8] px-6 py-32">
        <p className="mb-20 text-center text-xs font-light lowercase tracking-[0.2em] text-[#9B9B9B]">
          the way of the garden
        </p>

        <div className="mx-auto flex max-w-xl flex-col gap-16">
          {GARDEN_WAY.map((item) => (
            <div key={item.label} className="flex items-start gap-6">
              <item.icon className="mt-0.5 size-5 shrink-0 text-[#5B7B5E]" />
              <div>
                <p className="mb-1 text-xs font-light lowercase tracking-[0.2em] text-[#8B7355]">
                  {item.label}
                </p>
                <p className="font-light leading-relaxed text-[#2D2D2D]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Garden in Numbers ────────────────────────────────── */}
      <section className="border-t border-[#E5E0D8] px-6 py-24">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-12 lg:grid-cols-4">
          {[
            { value: "114", label: "trees" },
            { value: "6,236", label: "flowers" },
            { value: "30", label: "biomes" },
            { value: "604", label: "pages" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="mb-1 text-3xl font-extralight tabular-nums tracking-wide text-[#2D2D2D]">
                {stat.value}
              </p>
              <p className="text-xs font-light lowercase tracking-[0.2em] text-[#9B9B9B]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="border-t border-[#E5E0D8] px-6 py-32">
        <p className="mb-16 text-center text-xs font-light lowercase tracking-[0.2em] text-[#9B9B9B]">
          capabilities
        </p>

        <div className="mx-auto max-w-2xl">
          {FEATURES.map((feature, i) => (
            <div key={feature.name}>
              <div className="flex items-start gap-5 py-6">
                <feature.icon className="mt-0.5 size-4 shrink-0 text-[#5B7B5E]" />
                <div>
                  <h3 className="mb-1 font-light tracking-wide text-[#5B7B5E]">
                    {feature.name}
                  </h3>
                  <p className="font-light leading-relaxed text-[#9B9B9B]">
                    {feature.text}
                  </p>
                </div>
              </div>
              {i < FEATURES.length - 1 && (
                <div className="h-px w-full bg-[#E5E0D8]" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Quranic Quote ────────────────────────────────────────── */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-32">
        <p
          className="mb-8 max-w-2xl text-center text-3xl font-extralight leading-loose tracking-wide text-[#2D2D2D] lg:text-4xl"
          dir="rtl"
          lang="ar"
        >
          {
            "\u0648\u064E\u0644\u064E\u0642\u064E\u062F\u0652 \u064A\u064E\u0633\u064E\u0651\u0631\u0652\u0646\u064E\u0627 \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E \u0644\u0650\u0644\u0630\u064E\u0651\u0643\u0652\u0631\u0650 \u0641\u064E\u0647\u064E\u0644\u0652 \u0645\u0650\u0646 \u0645\u064F\u062F\u064E\u0651\u0643\u0650\u0631\u064D"
          }
        </p>
        <p className="mb-2 max-w-lg text-center font-extralight leading-relaxed text-[#9B9B9B]">
          And We have certainly made the Quran easy for remembrance &mdash; so
          is there any who will remember?
        </p>
        <p className="text-xs font-light tracking-[0.15em] text-[#8B7355]">
          Al-Qamar 54:17
        </p>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t border-[#E5E0D8] px-6 py-32 text-center">
        <Link
          href="/register"
          className="mb-4 inline-block text-2xl font-extralight tracking-wide text-[#5B7B5E] transition-colors hover:text-[#3D5A40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7B5E] rounded"
        >
          Begin.
        </Link>
        <p className="font-light text-[#9B9B9B]">It costs nothing.</p>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#E5E0D8] px-6 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs font-light text-[#9B9B9B]">QuranMemorizer</p>
          <div className="flex gap-6 text-xs font-light text-[#9B9B9B]">
            <Link
              href="/quran"
              className="hover:text-[#5B7B5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7B5E] rounded"
            >
              Read
            </Link>
            <Link
              href="/memorize"
              className="hover:text-[#5B7B5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7B5E] rounded"
            >
              Memorize
            </Link>
            <Link
              href="/listen"
              className="hover:text-[#5B7B5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7B5E] rounded"
            >
              Listen
            </Link>
          </div>
          <p className="text-xs font-light text-[#9B9B9B]">
            Built for the Ummah
          </p>
        </div>
      </footer>
    </div>
  );
}
