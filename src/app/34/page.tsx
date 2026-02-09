import Link from "next/link";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Flower2,
  Headphones,
  Layers,
  LogIn,
  Mic,
  Mountain,
  Repeat,
  Sparkles,
  Sprout,
  TreePine,
  Trophy,
  UserPlus,
  Waves,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const SURAH_TREES = [
  {
    surah: "Al-Fatiha",
    surahAr: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    number: 1,
    totalAyahs: 7,
    memorized: 7,
    branches: ["Du'a", "Praise"],
    mastered: true,
  },
  {
    surah: "Al-Baqarah",
    surahAr: "\u0627\u0644\u0628\u0642\u0631\u0629",
    number: 2,
    totalAyahs: 286,
    memorized: 198,
    branches: ["Law", "Stories", "Faith"],
    mastered: false,
  },
  {
    surah: "Maryam",
    surahAr: "\u0645\u0631\u064A\u0645",
    number: 19,
    totalAyahs: 98,
    memorized: 98,
    branches: ["Prophets", "Mercy"],
    mastered: true,
  },
  {
    surah: "Ar-Rahman",
    surahAr: "\u0627\u0644\u0631\u062D\u0645\u0646",
    number: 55,
    totalAyahs: 78,
    memorized: 45,
    branches: ["Blessings", "Signs"],
    mastered: false,
  },
  {
    surah: "Al-Ikhlas",
    surahAr: "\u0627\u0644\u0625\u062E\u0644\u0627\u0635",
    number: 112,
    totalAyahs: 4,
    memorized: 4,
    branches: ["Tawheed"],
    mastered: true,
  },
];

const GARDEN_LAYERS = [
  {
    icon: Sprout,
    title: "Roots",
    subtitle: "FSRS Stability",
    description:
      "Deep roots represent long-term memory stability. The stronger your spaced repetition scores, the deeper and wider the roots grow, anchoring your knowledge against the winds of forgetting.",
  },
  {
    icon: Layers,
    title: "Trunk",
    subtitle: "Overall Mastery",
    description:
      "The trunk reflects your total mastery of each surah. A thick, sturdy trunk means consistent accuracy across all ayahs. A thin trunk signals areas that need strengthening.",
  },
  {
    icon: TreePine,
    title: "Branches",
    subtitle: "Thematic Subjects",
    description:
      "Each branch is a mawdu\u2019 (thematic subject) within the surah. Law, stories, du\u2019a, promises, warnings \u2014 master each subject and watch its branch extend and flourish.",
  },
  {
    icon: Flower2,
    title: "Flowers",
    subtitle: "Individual Ayahs",
    description:
      "Every ayah is a flower. Memorize it and the flower blooms in vibrant color. Let your FSRS review become overdue and the petals begin to wilt, calling you back to practice.",
  },
  {
    icon: Waves,
    title: "Rivers",
    subtitle: "Similar Verse Connections",
    description:
      "Flowing rivers connect trees whose surahs share similar verses (mutashabihat). The stronger you master both sides, the wider the river flows between them.",
  },
  {
    icon: Mountain,
    title: "Biomes",
    subtitle: "30 Juz = 30 Worlds",
    description:
      "Each of the 30 juz is its own biome \u2014 a unique landscape with its own ecology. Complete all surahs in a juz and the entire biome comes alive with color and movement.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description: "7+ authentic editions rendered true to the physical print",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description: "Dual-engine: Web Speech API primary, Whisper AI fallback",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description: "State-of-the-art algorithm trained on 700M+ reviews",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description: "Real-time character analysis with coaching and mastery path",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description: "From first-letter hints to pure recall from memory",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description: "Talib to Imam: five tiers of weekly competition",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description: "Ayah-by-ayah audio from the world\u2019s master reciters",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description: "Works without internet. Your Quran is always accessible",
  },
];

const STATS = [
  { value: "114", label: "Surah Trees" },
  { value: "6,236", label: "Ayah Flowers" },
  { value: "30", label: "Juz Biomes" },
  { value: "604", label: "Mushaf Pages" },
];

const NAV_LINKS = [
  { label: "Garden", href: "#garden" },
  { label: "Layers", href: "#layers" },
  { label: "Features", href: "#features" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function progressPercent(memorized: number, total: number): number {
  return Math.round((memorized / total) * 100);
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function GradientMeshOrganicFlowLanding() {
  return (
    <div className="min-h-screen bg-[#064E3B] text-white">
      {/* ---- Nav ---- */}
      <nav
        className="sticky top-0 z-50 bg-transparent backdrop-blur-md"
        style={{ backgroundColor: "rgba(6, 78, 59, 0.8)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#6EE7B7]"
            aria-label="QuranMemorizer home"
          >
            <TreePine className="size-7 text-[#6EE7B7]" />
            <span className="text-lg font-bold text-white">QuranMemorizer</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-[#6EE7B7] outline-none"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#6EE7B7]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#6EE7B7] text-sm font-semibold text-[#064E3B] hover:bg-[#6EE7B7]/90 focus-visible:ring-2 focus-visible:ring-[#6EE7B7]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] py-28 md:py-40">
        {/* Organic decorative blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 size-96 rounded-full bg-gradient-to-br from-[#6EE7B7]/10 to-transparent blur-3xl" />
          <div className="absolute -right-24 top-1/4 size-80 rounded-full bg-gradient-to-bl from-[#047857]/30 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-gradient-to-t from-[#6EE7B7]/5 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 size-64 rounded-full bg-gradient-to-tl from-[#FCD34D]/5 to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 backdrop-blur-sm">
            <Sprout className="size-4 text-[#6EE7B7]" />
            <span className="text-sm font-medium text-white/80">
              The world&apos;s most advanced Quran memorization platform
            </span>
          </div>

          <h1 className="text-balance text-5xl font-extrabold leading-tight md:text-7xl md:leading-tight">
            The Quran, <span className="text-[#6EE7B7]">Alive</span>
            <br />
            and Growing.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-white/60 md:text-xl">
            114 surahs become 114 living trees. 6,236 ayahs bloom as flowers.
            Your memorization journey transforms into a{" "}
            <span className="font-normal text-[#6EE7B7]">Paradise Garden</span>{" "}
            that grows with every verse you learn.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#6EE7B7] px-10 text-base font-semibold text-[#064E3B] shadow-lg shadow-[#6EE7B7]/20 hover:bg-[#6EE7B7]/90 focus-visible:ring-2 focus-visible:ring-[#6EE7B7]"
            >
              <Link href="/register">
                <Sprout className="size-5" />
                Plant Your First Tree
                <ChevronRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full border border-white/20 px-8 text-base font-semibold text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Link href="/quran">
                <BookOpen className="size-5" />
                Explore the Mushaf
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Surah Trees ---- */}
      <section
        id="garden"
        className="bg-gradient-to-r from-[#065F46] via-[#0F766E] to-[#115E59] py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-medium text-[#6EE7B7]">
              Living Collection
            </span>
          </div>
          <h2 className="text-balance text-center text-3xl font-bold md:text-5xl">
            Every Surah, a Living Tree
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-light text-white/60">
            From Al-Kawthar&apos;s tiny bonsai with 3 delicate flowers to
            Al-Baqarah&apos;s towering oak with 286 blooms. Watch your forest
            grow.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SURAH_TREES.map((tree) => {
              const pct = progressPercent(tree.memorized, tree.totalAyahs);
              const ringColor = tree.mastered ? "#FCD34D" : "#6EE7B7";
              const circumference = 2 * Math.PI * 42;
              const strokeDash = (pct / 100) * circumference;

              return (
                <div
                  key={tree.number}
                  className="group rounded-3xl bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                  style={{
                    border: tree.mastered
                      ? "1px solid rgba(252, 211, 77, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {/* Circular progress ring */}
                  <div className="relative mx-auto mb-5 size-24">
                    <svg className="size-full -rotate-90" viewBox="0 0 96 96">
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TreePine
                        className="size-8 transition-transform duration-500 group-hover:scale-110"
                        style={{ color: tree.mastered ? "#FCD34D" : "#6EE7B7" }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3
                      className="text-base font-bold"
                      style={{ color: tree.mastered ? "#FCD34D" : "#FFFFFF" }}
                    >
                      {tree.surah}
                    </h3>
                    <p className="font-arabic text-sm text-white/40" dir="rtl">
                      {tree.surahAr}
                    </p>

                    <p className="mt-2 text-2xl font-bold tabular-nums text-[#6EE7B7]">
                      {pct}%
                    </p>

                    <p className="text-xs text-white/40">
                      <span className="tabular-nums font-medium text-white/60">
                        {tree.memorized}
                      </span>{" "}
                      / {tree.totalAyahs} flowers
                    </p>

                    {/* Branch pills */}
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {tree.branches.map((branch) => (
                        <span
                          key={branch}
                          className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/60"
                        >
                          {branch}
                        </span>
                      ))}
                    </div>

                    {tree.mastered && (
                      <div className="mt-3 flex items-center justify-center gap-1">
                        <Sparkles className="size-3.5 text-[#FCD34D]" />
                        <span className="text-xs font-semibold text-[#FCD34D]">
                          Mastered
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Organic Metaphor / Garden Layers ---- */}
      <section
        id="layers"
        className="bg-gradient-to-br from-[#0F766E] via-[#115E59] to-[#065F46] py-24 md:py-32"
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-medium text-[#6EE7B7]">
              Living Anatomy
            </span>
          </div>
          <h2 className="text-balance text-center text-3xl font-bold md:text-5xl">
            Every Layer Has Meaning
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-light text-white/60">
            Your Quran garden is more than a metaphor. Each element maps
            directly to a dimension of your memorization journey.
          </p>

          <div className="mt-16 space-y-8">
            {GARDEN_LAYERS.map((layer, i) => {
              const Icon = layer.icon;
              const isEven = i % 2 === 0;

              return (
                <div
                  key={layer.title}
                  className={`flex flex-col items-center gap-6 rounded-3xl bg-white/5 p-8 backdrop-blur-sm md:flex-row ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                  style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}
                >
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="size-10 text-[#6EE7B7]" />
                  </div>
                  <div className={isEven ? "md:text-left" : "md:text-right"}>
                    <h3 className="text-xl font-bold text-white">
                      {layer.title}
                    </h3>
                    <p className="mb-2 text-sm font-medium text-[#6EE7B7]">
                      {layer.subtitle}
                    </p>
                    <p className="font-light leading-relaxed text-white/60">
                      {layer.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section
        id="features"
        className="bg-gradient-to-br from-[#047857] via-[#059669] to-[#10B981] py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-medium text-white/80">
              Powerful Tools
            </span>
          </div>
          <h2 className="text-balance text-center text-3xl font-bold md:text-5xl">
            Everything to Master the Quran
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-light text-white/70">
            AI voice recognition, scientifically-backed spaced repetition, and
            gamification that makes memorization a joy.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                  style={{ border: "1px solid rgba(255, 255, 255, 0.08)" }}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white/10">
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-white/60">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Stats ---- */}
      <section className="bg-gradient-to-r from-[#059669] via-[#047857] to-[#065F46] py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold tabular-nums text-[#6EE7B7] md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-light text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Quranic Quote ---- */}
      <section className="bg-gradient-to-br from-[#065F46] via-[#064E3B] to-[#065F46] py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Flower2 className="mx-auto mb-8 size-10 text-[#6EE7B7]" />

          <blockquote>
            <p
              className="font-arabic text-3xl leading-loose text-white md:text-4xl"
              dir="rtl"
            >
              {
                "\u0648\u064E\u0644\u064E\u0642\u064E\u062F\u0652 \u064A\u064E\u0633\u064E\u0651\u0631\u0652\u0646\u064E\u0627 \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E \u0644\u0650\u0644\u0630\u064E\u0651\u0643\u0652\u0631\u0650 \u0641\u064E\u0647\u064E\u0644\u0652 \u0645\u0650\u0646 \u0645\u064F\u062F\u064E\u0651\u0643\u0650\u0631\u064D"
              }
            </p>
            <p className="mt-6 text-lg font-light italic text-white/50">
              &ldquo;And We have certainly made the Quran easy for remembrance,
              so is there any who will remember?&rdquo;
            </p>
            <cite className="mt-3 block text-sm font-semibold not-italic text-[#6EE7B7]">
              Surah Al-Qamar (54:17)
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="bg-gradient-to-r from-[#064E3B] via-[#1E3A2F] to-[#064E3B] py-24 md:py-32">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          {/* Subtle glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-96 rounded-full bg-[#6EE7B7]/5 blur-3xl" />
          </div>

          <div className="relative">
            <TreePine className="mx-auto mb-6 size-14 text-[#6EE7B7]" />
            <h2 className="text-balance text-3xl font-extrabold md:text-5xl">
              Your Garden Awaits
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-white/60">
              Plant the seed of Al-Fatiha. Watch seven flowers bloom. Then grow
              your forest, one surah at a time, until 114 trees stand tall and
              the{" "}
              <span className="font-normal text-[#FCD34D]">
                Paradise Garden
              </span>{" "}
              is complete.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#6EE7B7] px-10 text-base font-semibold text-[#064E3B] shadow-lg shadow-[#6EE7B7]/20 hover:bg-[#6EE7B7]/90 focus-visible:ring-2 focus-visible:ring-[#6EE7B7]"
              >
                <Link href="/register">
                  <Sprout className="size-5" />
                  Create Free Account
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full border border-white/20 px-8 text-base font-semibold text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Link href="/quran">Browse the Mushaf</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="bg-gradient-to-b from-[#064E3B] to-[#042F2E] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#6EE7B7]"
              >
                <TreePine className="size-6 text-[#6EE7B7]" />
                <span className="font-bold text-white">QuranMemorizer</span>
              </Link>
              <p className="mt-3 text-sm font-light leading-relaxed text-white/40">
                The world&apos;s most advanced Quran memorization platform. Grow
                your Paradise Garden, one ayah at a time.
              </p>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Platform
              </h4>
              <ul className="space-y-2">
                {["Mushaf Reader", "Memorization", "Tajweed", "Progress"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/quran"
                        className="text-sm text-white/40 transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:ring-[#6EE7B7] rounded outline-none"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Community
              </h4>
              <ul className="space-y-2">
                {["Leagues", "Hifz Circles", "Challenges", "Leaderboard"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/quran"
                        className="text-sm text-white/40 transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:ring-[#6EE7B7] rounded outline-none"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Account
              </h4>
              <ul className="space-y-2">
                {["Login", "Register", "Settings", "Help"].map((item) => (
                  <li key={item}>
                    <Link
                      href={
                        item === "Login"
                          ? "/login"
                          : item === "Register"
                            ? "/register"
                            : "/quran"
                      }
                      className="text-sm text-white/40 transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:ring-[#6EE7B7] rounded outline-none"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-xs text-white/30">
              &copy; 2026 QuranMemorizer. Built with love for the Ummah.
            </p>
            <p className="text-xs text-white/30">
              Offline-first &middot; Open Source &middot; Free Forever
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
