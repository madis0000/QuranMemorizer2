import Link from "next/link";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Droplets,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Repeat,
  Scissors,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  TreePine,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const TERRARIUMS = [
  {
    surah: "Al-Fatiha",
    surahAr: "الفاتحة",
    number: 1,
    totalAyahs: 7,
    memorized: 7,
    branches: ["Du'a", "Praise"],
    season: "summer" as const,
    mastered: true,
  },
  {
    surah: "Al-Baqarah",
    surahAr: "البقرة",
    number: 2,
    totalAyahs: 286,
    memorized: 143,
    branches: ["Law", "Stories", "Faith"],
    season: "spring" as const,
    mastered: false,
  },
  {
    surah: "Al-Kahf",
    surahAr: "الكهف",
    number: 18,
    totalAyahs: 110,
    memorized: 85,
    branches: ["Stories", "Trials", "Wisdom"],
    season: "autumn" as const,
    mastered: false,
  },
  {
    surah: "Yasin",
    surahAr: "يس",
    number: 36,
    totalAyahs: 83,
    memorized: 83,
    branches: ["Resurrection", "Signs"],
    season: "summer" as const,
    mastered: true,
  },
  {
    surah: "Al-Kawthar",
    surahAr: "الكوثر",
    number: 108,
    totalAyahs: 3,
    memorized: 3,
    branches: ["Gratitude"],
    season: "summer" as const,
    mastered: true,
  },
];

const SEASON_CONFIG = {
  spring: { icon: Sprout, label: "Spring", color: "#6B8F71" },
  summer: { icon: Sun, label: "Summer", color: "#B8960C" },
  autumn: { icon: Leaf, label: "Autumn", color: "#C77B4A" },
  winter: { icon: Snowflake, label: "Winter", color: "#8A7B6B" },
} as const;

const CARE_STEPS = [
  {
    icon: Droplets,
    title: "Water Daily",
    subtitle: "Practice keeps your trees alive",
    description:
      "Every recitation session waters your terrariums. Maintain streaks to keep the soil moist and flowers blooming. Skip a day and watch the petals begin to wilt.",
  },
  {
    icon: Scissors,
    title: "Prune Branches",
    subtitle: "Review specific subjects",
    description:
      "Each branch represents a thematic subject. Prune with targeted review drills to keep branches healthy and strong. Neglected branches lose their leaves.",
  },
  {
    icon: Repeat,
    title: "Watch for Seasons",
    subtitle: "FSRS schedules your reviews",
    description:
      "Trees cycle through spring, summer, autumn, and winter based on FSRS stability. A tree in perpetual summer means deep memorization. Winter means it needs your attention.",
  },
  {
    icon: Sparkles,
    title: "Grow to Paradise",
    subtitle: "Complete your collection",
    description:
      "114 terrariums. 6,236 flowers. When every ayah blooms and every tree stands tall, your collection transforms into the Paradise Garden \u2014 a visual testament to your devotion.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description: "7+ authentic editions with true-to-print layout rendering",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Web Speech API with Whisper fallback for precise recitation tracking",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Next-generation algorithm with 20-30% fewer reviews than SM-2",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Character-level analysis with real-time coaching and mastery tracking",
  },
  {
    icon: TreePine,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall, tailored to your level",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five competitive tiers from Talib to Imam with weekly promotion",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description:
      "Learn from master reciters with ayah-by-ayah synchronized audio",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Full functionality without internet. Your Quran, always with you",
  },
];

const COLLECTION_TOTAL = 114;
const COLLECTION_ACTIVE = 4;
const COLLECTION_MASTERED = 3;

const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Care Guide", href: "#care" },
  { label: "Features", href: "#features" },
];

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function progressPercent(memorized: number, total: number): number {
  return Math.round((memorized / total) * 100);
}

function treeSize(ayahs: number): string {
  if (ayahs <= 10) return "Bonsai";
  if (ayahs <= 50) return "Shrub";
  if (ayahs <= 100) return "Sapling";
  if (ayahs <= 200) return "Tree";
  return "Great Oak";
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TerrariumDioramaLanding() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#FDF6EC", color: "#3D3027" }}
    >
      {/* ---- Nav ---- */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(253, 246, 236, 0.95)",
          borderBottom: "1px solid #E8DDD0",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded-lg outline-none"
            aria-label="QuranMemorizer home"
          >
            <Sprout className="size-7" style={{ color: "#6B8F71" }} />
            <span className="text-lg font-bold" style={{ color: "#3D3027" }}>
              QuranMemorizer
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded outline-none"
                style={{ color: "#8A7B6B" }}
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
              className="text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#6B8F71]"
              style={{ color: "#8A7B6B" }}
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-xl text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-[#6B8F71]"
              style={{ backgroundColor: "#6B8F71" }}
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
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Decorative leaves */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-[10%] top-[15%] size-3 rounded-full opacity-20"
            style={{ backgroundColor: "#6B8F71" }}
          />
          <div
            className="absolute right-[15%] top-[25%] size-2 rounded-full opacity-15"
            style={{ backgroundColor: "#C77B4A" }}
          />
          <div
            className="absolute left-[25%] bottom-[20%] size-4 rounded-full opacity-10"
            style={{ backgroundColor: "#B8960C" }}
          />
          <div
            className="absolute right-[20%] bottom-[30%] size-2.5 rounded-full opacity-20"
            style={{ backgroundColor: "#6B8F71" }}
          />
          <div
            className="absolute left-[60%] top-[10%] size-3.5 rounded-full opacity-10"
            style={{ backgroundColor: "#C77B4A" }}
          />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Leaf className="size-5" style={{ color: "#6B8F71" }} />
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#C77B4A" }}
            >
              A living Quran collection
            </span>
            <Leaf className="size-5" style={{ color: "#6B8F71" }} />
          </div>

          <h1
            className="text-balance text-4xl font-bold leading-tight md:text-6xl md:leading-tight"
            style={{ color: "#3D3027" }}
          >
            Each Surah, a Terrarium.
            <br />
            <span style={{ color: "#6B8F71" }}>Each Ayah, a Bloom.</span>
          </h1>

          <div className="mx-auto my-8 flex items-center justify-center gap-3">
            <span
              className="h-px w-12"
              style={{ backgroundColor: "#E8DDD0" }}
            />
            <Flower2 className="size-5" style={{ color: "#C77B4A" }} />
            <span
              className="h-px w-12"
              style={{ backgroundColor: "#E8DDD0" }}
            />
          </div>

          <p
            className="mx-auto max-w-2xl text-lg leading-relaxed md:text-xl"
            style={{ color: "#8A7B6B" }}
          >
            Nurture 114 miniature worlds. Watch flowers bloom as you memorize,
            branches grow as you master subjects, and trees flourish as your
            connection with the Quran deepens. Your personal botanical
            collection of the divine word.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 text-base font-semibold text-white shadow-lg focus-visible:ring-2 focus-visible:ring-[#6B8F71]"
              style={{ backgroundColor: "#6B8F71" }}
            >
              <Link href="/register">
                <Sprout className="size-5" />
                Start Your Collection
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-8 text-base font-semibold focus-visible:ring-2 focus-visible:ring-[#C77B4A]"
              style={{ borderColor: "#C77B4A", color: "#C77B4A" }}
            >
              <Link href="/quran">
                <BookOpen className="size-5" />
                Explore the Mushaf
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Terrarium Collection ---- */}
      <section id="collection" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-4 text-center">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#C77B4A" }}
            >
              Your Terrarium Shelf
            </span>
          </div>
          <h2
            className="text-balance text-center text-3xl font-bold md:text-4xl"
            style={{ color: "#3D3027" }}
          >
            114 Surahs. 114 Living Terrariums.
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed"
            style={{ color: "#8A7B6B" }}
          >
            Each surah lives inside its own glass dome. Tiny bonsais for the
            shortest surahs, towering oaks for the longest. Watch them grow as
            you memorize.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {TERRARIUMS.map((t) => {
              const pct = progressPercent(t.memorized, t.totalAyahs);
              const season = SEASON_CONFIG[t.season];
              const SeasonIcon = season.icon;

              return (
                <div
                  key={t.number}
                  className="group relative overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-xl"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 20px rgba(61, 48, 39, 0.08)",
                    border: t.mastered
                      ? "2px solid #B8960C"
                      : "1px solid #E8DDD0",
                  }}
                >
                  {/* Dome top */}
                  <div
                    className="relative flex h-40 items-center justify-center rounded-t-full"
                    style={{ backgroundColor: "#F0EDE6" }}
                  >
                    {/* Glass dome reflection effect */}
                    <div
                      className="absolute left-1/4 top-4 h-8 w-1 rotate-12 rounded-full opacity-30"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                    <div
                      className="absolute left-[30%] top-6 h-5 w-0.5 rotate-12 rounded-full opacity-20"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />

                    <TreePine
                      className="size-16 transition-transform duration-500 group-hover:scale-110"
                      style={{ color: t.mastered ? "#B8960C" : "#6B8F71" }}
                    />

                    {t.mastered && (
                      <div className="absolute right-3 top-3">
                        <Sparkles
                          className="size-5"
                          style={{ color: "#B8960C" }}
                        />
                      </div>
                    )}

                    {/* Season indicator */}
                    <div
                      className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5"
                      style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
                    >
                      <SeasonIcon
                        className="size-3"
                        style={{ color: season.color }}
                      />
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: season.color }}
                      >
                        {season.label}
                      </span>
                    </div>
                  </div>

                  {/* Soil section */}
                  <div
                    className="p-4"
                    style={{ backgroundColor: "rgba(232, 221, 208, 0.3)" }}
                  >
                    <div className="mb-1 flex items-baseline justify-between">
                      <h3
                        className="text-sm font-bold"
                        style={{ color: "#3D3027" }}
                      >
                        {t.surah}
                      </h3>
                      <span
                        className="font-arabic text-sm"
                        style={{ color: "#8A7B6B" }}
                        dir="rtl"
                      >
                        {t.surahAr}
                      </span>
                    </div>

                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#8A7B6B" }}>
                        {treeSize(t.totalAyahs)}
                      </span>
                      <span
                        className="text-xs tabular-nums"
                        style={{ color: "#8A7B6B" }}
                      >
                        {t.memorized}/{t.totalAyahs} ayahs
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div
                      className="mb-3 h-2 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: "#E8DDD0" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: t.mastered ? "#B8960C" : "#6B8F71",
                        }}
                      />
                    </div>

                    {/* Branch tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {t.branches.map((branch) => (
                        <span
                          key={branch}
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: "rgba(199, 123, 74, 0.12)",
                            color: "#C77B4A",
                          }}
                        >
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Care Guide ---- */}
      <section
        id="care"
        className="py-20 md:py-28"
        style={{ backgroundColor: "#F7F0E5" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-4 text-center">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#C77B4A" }}
            >
              Growing Instructions
            </span>
          </div>
          <h2
            className="text-balance text-center text-3xl font-bold md:text-4xl"
            style={{ color: "#3D3027" }}
          >
            How to Care for Your Quran Garden
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-center leading-relaxed"
            style={{ color: "#8A7B6B" }}
          >
            Treat your memorization like a garden. Water it daily, prune with
            purpose, and watch it grow into something breathtaking.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-2xl p-6 transition-shadow duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 2px 12px rgba(61, 48, 39, 0.06)",
                  }}
                >
                  <div
                    className="mb-4 flex size-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(199, 123, 74, 0.1)" }}
                  >
                    <Icon className="size-6" style={{ color: "#C77B4A" }} />
                  </div>
                  <div
                    className="mb-1 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#C77B4A" }}
                  >
                    Step {i + 1}
                  </div>
                  <h3
                    className="mb-1 text-lg font-bold"
                    style={{ color: "#3D3027" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mb-3 text-sm font-medium"
                    style={{ color: "#6B8F71" }}
                  >
                    {step.subtitle}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#8A7B6B" }}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-4 text-center">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#C77B4A" }}
            >
              Everything You Need
            </span>
          </div>
          <h2
            className="text-balance text-center text-3xl font-bold md:text-4xl"
            style={{ color: "#3D3027" }}
          >
            World-Class Tools for Your Journey
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-center leading-relaxed"
            style={{ color: "#8A7B6B" }}
          >
            Scientifically-backed algorithms, AI-powered voice recognition, and
            deep gamification \u2014 all in one beautiful platform.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl p-6 transition-shadow duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 2px 12px rgba(61, 48, 39, 0.06)",
                  }}
                >
                  <div
                    className="mb-4 flex size-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(107, 143, 113, 0.1)" }}
                  >
                    <Icon className="size-6" style={{ color: "#6B8F71" }} />
                  </div>
                  <h3
                    className="mb-2 text-base font-bold"
                    style={{ color: "#3D3027" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#8A7B6B" }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Collection Progress ---- */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: "#F7F0E5" }}
      >
        <div className="mx-auto max-w-4xl px-6">
          <div
            className="overflow-hidden rounded-3xl p-8 md:p-12"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 24px rgba(61, 48, 39, 0.08)",
            }}
          >
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-bold" style={{ color: "#3D3027" }}>
                  Your Collection
                </h3>
                <p className="text-sm" style={{ color: "#8A7B6B" }}>
                  <span
                    className="tabular-nums font-semibold"
                    style={{ color: "#6B8F71" }}
                  >
                    {COLLECTION_ACTIVE}
                  </span>{" "}
                  of{" "}
                  <span className="tabular-nums font-semibold">
                    {COLLECTION_TOTAL}
                  </span>{" "}
                  terrariums started{" "}
                  <span style={{ color: "#8A7B6B" }}>&middot;</span>{" "}
                  <span
                    className="tabular-nums font-semibold"
                    style={{ color: "#B8960C" }}
                  >
                    {COLLECTION_MASTERED}
                  </span>{" "}
                  mastered
                </p>
              </div>
              <div
                className="flex items-center gap-4 text-xs"
                style={{ color: "#8A7B6B" }}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block size-3 rounded-full"
                    style={{ backgroundColor: "#6B8F71" }}
                  />
                  Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block size-3 rounded-full"
                    style={{ backgroundColor: "#B8960C" }}
                  />
                  Mastered
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block size-3 rounded-full"
                    style={{ backgroundColor: "#E8DDD0" }}
                  />
                  Unstarted
                </span>
              </div>
            </div>

            {/* Mini terrarium dots */}
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: COLLECTION_TOTAL }, (_, i) => {
                const idx = i;
                let bg = "#E8DDD0";
                if (idx === 0 || idx === 35 || idx === 107) bg = "#B8960C";
                else if (idx === 1) bg = "#6B8F71";
                else if (idx === 17) bg = "#6B8F71";

                return (
                  <span
                    key={idx}
                    className="inline-block size-3 rounded-full transition-transform hover:scale-150"
                    style={{ backgroundColor: bg }}
                    title={`Surah ${idx + 1}`}
                  />
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#8A7B6B" }}
              >
                Complete all{" "}
                <span
                  className="tabular-nums font-semibold"
                  style={{ color: "#3D3027" }}
                >
                  6,236
                </span>{" "}
                flowers across{" "}
                <span
                  className="tabular-nums font-semibold"
                  style={{ color: "#3D3027" }}
                >
                  114
                </span>{" "}
                terrariums to unlock the{" "}
                <span className="font-semibold" style={{ color: "#B8960C" }}>
                  Paradise Garden
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Quranic Quote ---- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div
            className="rounded-2xl p-8 text-center md:p-12"
            style={{
              backgroundColor: "#FDF6EC",
              border: "2px solid #C77B4A",
            }}
          >
            <Flower2
              className="mx-auto mb-6 size-8"
              style={{ color: "#C77B4A" }}
            />
            <blockquote>
              <p
                className="font-arabic text-2xl leading-loose md:text-3xl"
                style={{ color: "#3D3027" }}
                dir="rtl"
              >
                {
                  "\u0648\u064E\u0644\u064E\u0642\u064E\u062F\u0652 \u064A\u064E\u0633\u064E\u0651\u0631\u0652\u0646\u064E\u0627 \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E \u0644\u0650\u0644\u0630\u064E\u0651\u0643\u0652\u0631\u0650 \u0641\u064E\u0647\u064E\u0644\u0652 \u0645\u0650\u0646 \u0645\u064F\u062F\u064E\u0651\u0643\u0650\u0631\u064D"
                }
              </p>
              <p className="mt-4 text-base italic" style={{ color: "#8A7B6B" }}>
                &ldquo;And We have certainly made the Quran easy for
                remembrance, so is there any who will remember?&rdquo;
              </p>
              <cite
                className="mt-2 block text-sm font-semibold not-italic"
                style={{ color: "#C77B4A" }}
              >
                Surah Al-Qamar (54:17)
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: "#F7F0E5" }}
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Sprout
            className="mx-auto mb-6 size-12"
            style={{ color: "#6B8F71" }}
          />
          <h2
            className="text-balance text-3xl font-bold md:text-4xl"
            style={{ color: "#3D3027" }}
          >
            Start Your Collection Today
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "#8A7B6B" }}
          >
            Your first terrarium is waiting. Plant the seed of Al-Fatiha and
            watch seven delicate flowers bloom. Then keep growing \u2014 one
            surah at a time \u2014 until your shelf holds all 114 living worlds.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-10 text-base font-semibold text-white shadow-lg focus-visible:ring-2 focus-visible:ring-[#6B8F71]"
              style={{ backgroundColor: "#6B8F71" }}
            >
              <Link href="/register">
                <Sprout className="size-5" />
                Create Free Account
                <ChevronRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-8 text-base font-semibold focus-visible:ring-2 focus-visible:ring-[#C77B4A]"
              style={{ borderColor: "#C77B4A", color: "#C77B4A" }}
            >
              <Link href="/quran">Browse the Mushaf</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer
        style={{ backgroundColor: "#FDF6EC", borderTop: "1px solid #E8DDD0" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded-lg outline-none"
              >
                <Sprout className="size-6" style={{ color: "#6B8F71" }} />
                <span className="font-bold" style={{ color: "#3D3027" }}>
                  QuranMemorizer
                </span>
              </Link>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "#8A7B6B" }}
              >
                The world&apos;s most advanced Quran memorization platform.
                Nurture your collection of 114 living terrariums.
              </p>
            </div>

            <div>
              <h4
                className="mb-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#C77B4A" }}
              >
                Platform
              </h4>
              <ul className="space-y-2">
                {["Mushaf Reader", "Memorization", "Tajweed", "Progress"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/quran"
                        className="text-sm transition-colors hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded outline-none"
                        style={{ color: "#8A7B6B" }}
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4
                className="mb-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#C77B4A" }}
              >
                Community
              </h4>
              <ul className="space-y-2">
                {["Leagues", "Hifz Circles", "Challenges", "Leaderboard"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/quran"
                        className="text-sm transition-colors hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded outline-none"
                        style={{ color: "#8A7B6B" }}
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4
                className="mb-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#C77B4A" }}
              >
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
                      className="text-sm transition-colors hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded outline-none"
                      style={{ color: "#8A7B6B" }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-10 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
            style={{ borderTop: "1px solid #E8DDD0" }}
          >
            <p className="text-xs" style={{ color: "#8A7B6B" }}>
              &copy; 2026 QuranMemorizer. Built with love for the Ummah.
            </p>
            <p className="text-xs" style={{ color: "#8A7B6B" }}>
              Offline-first &middot; Open Source &middot; Free Forever
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
