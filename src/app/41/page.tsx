import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  LogIn,
  Sparkles,
  Sprout,
  TreePine,
  Trees,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const navAnchors = ["Paradise", "Path", "Trees", "Features"];

const biomes: { juz: number; name: string; trees: number }[] = [
  { juz: 1, name: "Garden of Alif", trees: 7 },
  { juz: 2, name: "Meadow of Nur", trees: 5 },
  { juz: 3, name: "Orchard of Imran", trees: 4 },
  { juz: 4, name: "Valley of Nisa", trees: 3 },
  { juz: 5, name: "Fields of Ma'idah", trees: 2 },
  { juz: 6, name: "Glade of An'am", trees: 3 },
  { juz: 7, name: "Clearing of A'raf", trees: 3 },
  { juz: 8, name: "Oasis of Anfal", trees: 3 },
  { juz: 9, name: "Highlands of Tawbah", trees: 3 },
  { juz: 10, name: "Springs of Yunus", trees: 3 },
  { juz: 11, name: "Ridge of Hud", trees: 3 },
  { juz: 12, name: "Thicket of Yusuf", trees: 3 },
  { juz: 13, name: "Canopy of Ra'd", trees: 4 },
  { juz: 14, name: "Hills of Ibrahim", trees: 4 },
  { juz: 15, name: "Grove of Isra", trees: 3 },
  { juz: 16, name: "Terrace of Kahf", trees: 3 },
  { juz: 17, name: "Summit of Anbiya", trees: 4 },
  { juz: 18, name: "Delta of Mu'minun", trees: 4 },
  { juz: 19, name: "Forest of Furqan", trees: 4 },
  { juz: 20, name: "Basin of Naml", trees: 4 },
  { juz: 21, name: "Cascade of Ankabut", trees: 4 },
  { juz: 22, name: "Plateau of Ahzab", trees: 4 },
  { juz: 23, name: "Mountain of Yasin", trees: 5 },
  { juz: 24, name: "River of Zumar", trees: 4 },
  { juz: 25, name: "Lagoon of Fussilat", trees: 4 },
  { juz: 26, name: "Steppe of Ahqaf", trees: 4 },
  { juz: 27, name: "Valley of Rahman", trees: 5 },
  { juz: 28, name: "Shores of Hashr", trees: 5 },
  { juz: 29, name: "Dawn of Mulk", trees: 6 },
  { juz: 30, name: "Crown of Amma", trees: 7 },
];

const milestones: {
  title: string;
  fraction: string;
  description: string;
  glowIntensity: number;
  golden: boolean;
}[] = [
  {
    title: "Your First Tree",
    fraction: "1 / 114",
    description:
      "Memorize one surah. A single sapling appears in an empty landscape, glowing softly. You have begun.",
    glowIntensity: 4,
    golden: false,
  },
  {
    title: "Your First Biome",
    fraction: "1 / 30 juz",
    description:
      "Complete an entire juz. The ground transforms beneath your trees. Your first biome awakens.",
    glowIntensity: 8,
    golden: false,
  },
  {
    title: "A Growing Forest",
    fraction: "10 / 114",
    description:
      "Ten surahs memorized. Birds begin arriving. Rivers start to flow between your trees. Life is spreading.",
    glowIntensity: 12,
    golden: false,
  },
  {
    title: "Half the Quran",
    fraction: "57 / 114",
    description:
      "The halfway mark. Fifteen biomes are thriving. The glow intensifies. The forest hums with light.",
    glowIntensity: 18,
    golden: false,
  },
  {
    title: "Paradise Garden",
    fraction: "114 / 114",
    description:
      "All 114 trees stand tall. All 30 biomes are alive. Rivers of light connect every tree. This is Jannah.",
    glowIntensity: 24,
    golden: true,
  },
];

const surahTreeShowcase: {
  name: string;
  arabic: string;
  ayahs: number;
  bloomed: number;
  progress: number;
  branches: string[];
  mastered: boolean;
}[] = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    bloomed: 7,
    progress: 100,
    branches: ["Praise", "Guidance"],
    mastered: true,
  },
  {
    name: "Al-Mulk",
    arabic: "\u0627\u0644\u0645\u0644\u0643",
    ayahs: 30,
    bloomed: 30,
    progress: 100,
    branches: ["Sovereignty", "Creation"],
    mastered: true,
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    bloomed: 48,
    progress: 58,
    branches: ["Resurrection", "Signs"],
    mastered: false,
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    bloomed: 78,
    progress: 100,
    branches: ["Blessings", "Paradise"],
    mastered: true,
  },
  {
    name: "Al-Kahf",
    arabic: "\u0627\u0644\u0643\u0647\u0641",
    ayahs: 110,
    bloomed: 34,
    progress: 31,
    branches: ["Faith", "Trials", "Wisdom"],
    mastered: false,
  },
];

const features: { title: string; desc: string }[] = [
  {
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts matching the printed Mushaf.",
  },
  {
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Quran-specific precision.",
  },
  {
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen scheduling. 30% fewer reviews for the same retention.",
  },
  {
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides.",
  },
  {
    title: "8 Progressive Hide Modes",
    desc: "First-letter hints to full recall. Eight strategies for every memory pathway.",
  },
  {
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions and daily challenges.",
  },
  {
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah following with word-level sync and offline downloads.",
  },
  {
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ParadisePreviewLanding() {
  return (
    <div className="min-h-screen bg-[#F0F5F2] text-[#1A2E22] antialiased dark:bg-[#080F0B] dark:text-[#E8F0EC]">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-[#D1E0D8] bg-[#F0F5F2]/80 backdrop-blur-xl dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-light tracking-wide text-[#059669] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
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
              className="border border-[#059669]/30 bg-[#059669]/10 px-5 py-2 text-sm font-medium text-[#059669] shadow-[0_0_20px_rgba(5,150,105,0.1)] transition-all duration-200 hover:bg-[#059669]/20 hover:shadow-[0_0_30px_rgba(5,150,105,0.2)] focus-visible:ring-2 focus-visible:ring-[#059669] dark:border-[#00E5A0]/30 dark:bg-[#00E5A0]/10 dark:text-[#00E5A0] dark:shadow-[0_0_20px_rgba(0,229,160,0.15)] dark:hover:bg-[#00E5A0]/20 dark:hover:shadow-[0_0_30px_rgba(0,229,160,0.25)] dark:focus-visible:ring-[#00E5A0]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO: PARADISE AWAITS ==================== */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-24">
        {/* Ambient golden-green orbs */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "900px",
            height: "900px",
            background:
              "radial-gradient(circle, rgba(255,215,0,0.04) 0%, rgba(0,229,160,0.03) 30%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/4 top-1/2"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.05) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-1/4 top-1/4"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(255,215,0,0.03) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Tagline pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#B8860B]/20 bg-[#B8860B]/5 px-5 py-2 dark:border-[#FFD700]/20 dark:bg-[#FFD700]/5">
            <Sparkles
              className="size-3.5 text-[#B8860B] dark:text-[#FFD700]"
              style={{
                filter: "drop-shadow(0 0 4px rgba(255,215,0,0.5))",
              }}
            />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#FFD700]">
              The Completed Garden
            </span>
          </div>

          <h1 className="text-balance text-4xl font-extralight leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            This is what
            <br />
            <span
              className="font-light text-[#B8860B] dark:text-[#FFD700]"
              style={{ textShadow: "0 0 40px rgba(255,215,0,0.25)" }}
            >
              Paradise looks like
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
            114 fully-bloomed trees standing in golden light. Rivers of
            remembrance flowing between them. Birds of achievement singing from
            every branch. All 30 biomes thriving &mdash; meadows, mountains,
            oases, forests, valleys. 6,236 flowers open to the sky. This is a
            garden built entirely from memory, and it is waiting for you.
          </p>

          {/* Paradise stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "114", label: "Golden Trees" },
              { value: "6,236", label: "Open Flowers" },
              { value: "30", label: "Living Biomes" },
              { value: "\u221E", label: "Rivers of Nur" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="tabular-nums text-3xl font-extralight text-[#B8860B] dark:text-[#FFD700]"
                  style={{
                    textShadow: "0 0 20px rgba(255,215,0,0.25)",
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PARADISE GARDEN GRID (30 BIOMES) ==================== */}
      <section id="paradise" className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B8860B] dark:text-[#FFD700]">
              30 BIOMES OF JANNAH
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every juz, a{" "}
              <span
                className="text-[#B8860B] dark:text-[#FFD700]"
                style={{ textShadow: "0 0 20px rgba(255,215,0,0.15)" }}
              >
                living biome
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              In the completed Paradise Garden, all 30 biomes radiate golden
              light. Each one is a world unto itself &mdash; named, alive, and
              glowing.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
            {biomes.map((biome) => (
              <div
                key={biome.juz}
                className="group relative rounded-xl border border-[#B8860B]/15 bg-white p-3 transition-all duration-300 hover:border-[#B8860B]/30 hover:shadow-[0_0_20px_rgba(184,134,11,0.08)] dark:border-[#FFD700]/10 dark:bg-[#0F1A14] dark:hover:border-[#FFD700]/25 dark:hover:shadow-[0_0_20px_rgba(255,215,0,0.08)]"
              >
                {/* Golden glow dot */}
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="flex size-2 rounded-full bg-[#B8860B] dark:bg-[#FFD700]"
                    style={{
                      boxShadow: "0 0 6px rgba(255,215,0,0.5)",
                    }}
                    aria-hidden="true"
                  />
                  <span className="tabular-nums text-[10px] font-medium uppercase tracking-wider text-[#5A7B6B] dark:text-[#6B8B7B]">
                    Juz {biome.juz}
                  </span>
                </div>
                <p className="text-[11px] font-medium leading-snug text-[#1A2E22] dark:text-[#E8F0EC]">
                  {biome.name}
                </p>
                <p className="mt-1 text-[10px] font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
                  {biome.trees} trees
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TRANSITION: SINGLE SEED ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl">
          {/* Gradient divider: gold fading to green */}
          <div
            className="mb-16 h-px bg-gradient-to-r from-transparent via-[#B8860B]/30 to-transparent dark:via-[#FFD700]/20"
            aria-hidden="true"
          />

          <div className="text-center">
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              But every paradise starts
              <br />
              with a{" "}
              <span
                className="text-[#059669] dark:text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.25)" }}
              >
                single seed
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              Al-Fatihah. 7 ayahs. The opening. The smallest tree in the garden
              &mdash; but the one that starts everything.
            </p>
          </div>

          {/* Single seed card */}
          <div className="mx-auto mt-12 max-w-xs">
            <div
              className="relative rounded-2xl border border-[#059669]/20 bg-white p-8 text-center dark:border-[#00E5A0]/20 dark:bg-[#0F1A14]"
              style={{
                boxShadow: "0 0 30px rgba(0,229,160,0.06)",
              }}
            >
              {/* SVG ring */}
              <div className="relative mx-auto mb-5 size-20">
                <svg
                  className="size-20 -rotate-90"
                  viewBox="0 0 80 80"
                  aria-hidden="true"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    className="stroke-[#059669]/10 dark:stroke-[#00E5A0]/10"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    className="stroke-[#059669] dark:stroke-[#00E5A0]"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="213.6 0"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(0,229,160,0.4))",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sprout
                    className="size-6 text-[#059669] dark:text-[#00E5A0]"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(0,229,160,0.4))",
                    }}
                  />
                </div>
              </div>

              <p
                className="text-lg font-light text-[#1A2E22] dark:text-[#E8F0EC]"
                dir="rtl"
              >
                {"\u0627\u0644\u0641\u0627\u062A\u062D\u0629"}
              </p>
              <p className="mt-0.5 text-xs font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
                Al-Fatihah
              </p>
              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                7 ayahs &middot; Your first seed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE GROWTH PATH ==================== */}
      <section id="path" className="px-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#059669] dark:text-[#00E5A0]">
              THE GROWTH PATH
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              From seed to{" "}
              <span
                className="text-[#B8860B] dark:text-[#FFD700]"
                style={{ textShadow: "0 0 20px rgba(255,215,0,0.15)" }}
              >
                paradise
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              Five milestones on the journey. Each one brighter than the last.
              The final step radiates golden light.
            </p>
          </div>

          <div className="space-y-5">
            {milestones.map((milestone, index) => {
              const isGolden = milestone.golden;
              const accentColor = isGolden ? "#FFD700" : "#00E5A0";
              const lightAccent = isGolden ? "#B8860B" : "#059669";
              const glowRadius = milestone.glowIntensity;

              return (
                <div
                  key={milestone.title}
                  className={`relative rounded-2xl border p-6 sm:p-8 ${
                    isGolden
                      ? "border-[#B8860B]/25 bg-[#B8860B]/[0.03] dark:border-[#FFD700]/20 dark:bg-[#FFD700]/[0.03]"
                      : "border-[#D1E0D8] bg-white dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]"
                  }`}
                  style={{
                    boxShadow: isGolden
                      ? `0 0 ${glowRadius * 2}px rgba(255,215,0,0.06)`
                      : `0 0 ${glowRadius}px rgba(0,229,160,0.04)`,
                  }}
                >
                  <div className="flex items-start gap-5 sm:gap-8">
                    {/* Glow indicator */}
                    <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
                      <span
                        className="flex rounded-full"
                        style={{
                          width: `${8 + index * 3}px`,
                          height: `${8 + index * 3}px`,
                          backgroundColor: isGolden ? lightAccent : lightAccent,
                          boxShadow: `0 0 ${glowRadius}px ${accentColor}`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="tabular-nums text-[10px] font-medium uppercase tracking-wider text-[#5A7B6B] dark:text-[#6B8B7B]">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h3
                          className="text-lg font-light sm:text-xl"
                          style={{
                            color: isGolden ? lightAccent : undefined,
                            textShadow: isGolden
                              ? `0 0 15px rgba(255,215,0,0.2)`
                              : undefined,
                          }}
                        >
                          {milestone.title}
                        </h3>
                        <span
                          className="tabular-nums text-xs font-medium"
                          style={{
                            color: isGolden ? lightAccent : lightAccent,
                          }}
                        >
                          {milestone.fraction}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== SURAH TREE SHOWCASE ==================== */}
      <section id="trees" className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#059669] dark:text-[#00E5A0]">
              TREE SHOWCASE
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every surah, a{" "}
              <span
                className="text-[#059669] dark:text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.2)" }}
              >
                living tree
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              Mastered trees radiate golden light. Growing trees glow green.
              Each flower is an ayah blooming from memory.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {surahTreeShowcase.map((tree) => {
              const glowHex = tree.mastered ? "#FFD700" : "#00E5A0";
              const lightGlowHex = tree.mastered ? "#B8860B" : "#059669";
              const ringOpacity = tree.progress / 100;

              return (
                <div
                  key={tree.name}
                  className={`relative rounded-2xl border p-6 ${
                    tree.mastered
                      ? "border-[#B8860B]/20 bg-white dark:border-[#FFD700]/15 dark:bg-[#0F1A14]"
                      : "border-[#D1E0D8] bg-white dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]"
                  }`}
                  style={{
                    boxShadow: tree.mastered
                      ? "0 0 20px rgba(255,215,0,0.08)"
                      : "0 0 15px rgba(0,229,160,0.04)",
                  }}
                >
                  {/* SVG progress ring */}
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
                        className={
                          tree.mastered
                            ? "stroke-[#B8860B]/10 dark:stroke-[#FFD700]/10"
                            : "stroke-[#059669]/10 dark:stroke-[#00E5A0]/10"
                        }
                        strokeWidth="3"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke={glowHex}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${tree.progress * 2.64} ${264 - tree.progress * 2.64}`}
                        className="hidden dark:block"
                        style={{
                          filter: `drop-shadow(0 0 ${6 + ringOpacity * 8}px ${glowHex})`,
                        }}
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke={lightGlowHex}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${tree.progress * 2.64} ${264 - tree.progress * 2.64}`}
                        className="dark:hidden"
                        style={{
                          filter: `drop-shadow(0 0 ${4 + ringOpacity * 4}px ${lightGlowHex})`,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className={`tabular-nums text-xl font-light ${
                          tree.mastered
                            ? "text-[#B8860B] dark:text-[#FFD700]"
                            : "text-[#059669] dark:text-[#00E5A0]"
                        }`}
                        style={{
                          textShadow: `0 0 12px ${glowHex}40`,
                        }}
                      >
                        {tree.bloomed}
                      </span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-[#5A7B6B] dark:text-[#6B8B7B]">
                        flowers
                      </span>
                    </div>
                  </div>

                  {/* Surah name */}
                  <div className="text-center">
                    <p
                      className="text-xl font-light text-[#1A2E22] dark:text-[#E8F0EC]"
                      dir="rtl"
                    >
                      {tree.arabic}
                    </p>
                    <p className="mt-0.5 text-xs font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
                      {tree.name}
                    </p>
                  </div>

                  {/* Branch tags */}
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {tree.branches.map((branch) => (
                      <span
                        key={branch}
                        className="rounded-full border border-[#D1E0D8] px-2.5 py-0.5 text-[9px] font-medium text-[#5A7B6B] dark:border-[#00E5A0]/20 dark:text-[#6B8B7B]"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>

                  {/* Mastery indicator */}
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        backgroundColor: tree.mastered
                          ? lightGlowHex
                          : lightGlowHex,
                        boxShadow: `0 0 6px ${glowHex}`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                      {tree.mastered ? "mastered" : "growing"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#059669] dark:text-[#00E5A0]">
              FEATURES
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Everything your Hifz needs
            </h2>
          </div>

          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0">
                  <span
                    className="flex size-2.5 rounded-full bg-[#059669] dark:bg-[#00E5A0]"
                    style={{
                      boxShadow: "0 0 8px rgba(0,229,160,0.5)",
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-[#1A2E22] dark:text-[#E8F0EC]">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
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
            className="text-xl font-extralight italic leading-relaxed text-[#059669]/80 sm:text-2xl dark:text-[#00E5A0]/80"
            style={{ textShadow: "0 0 30px rgba(0,229,160,0.15)" }}
          >
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </blockquote>
          <cite className="mt-6 block text-xs font-medium uppercase tracking-[0.2em] text-[#5A7B6B] not-italic dark:text-[#6B8B7B]">
            Surah Al-Qamar &middot; 54:17
          </cite>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="rounded-2xl border border-[#059669]/20 bg-white px-8 py-14 sm:px-12 dark:border-[#00E5A0]/30 dark:bg-[#0F1A14]"
            style={{ boxShadow: "0 0 40px rgba(0,229,160,0.06)" }}
          >
            <TreePine
              className="mx-auto mb-6 size-10 text-[#059669] dark:text-[#00E5A0]"
              style={{
                filter: "drop-shadow(0 0 12px rgba(0,229,160,0.5))",
              }}
            />
            <h2 className="text-balance text-2xl font-extralight tracking-tight sm:text-3xl lg:text-4xl">
              Your paradise is{" "}
              <span
                className="text-[#B8860B] dark:text-[#FFD700]"
                style={{ textShadow: "0 0 20px rgba(255,215,0,0.2)" }}
              >
                114 trees
              </span>{" "}
              away
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              Free forever. No ads. No distractions. Plant the first seed
              &mdash; Al-Fatihah &mdash; and watch your garden grow toward
              paradise. Every ayah you memorize becomes a flower that never
              wilts.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="border border-[#059669]/30 bg-[#059669]/10 px-8 py-4 text-base font-light text-[#059669] shadow-[0_0_20px_rgba(5,150,105,0.1)] transition-all duration-300 hover:bg-[#059669]/20 hover:shadow-[0_0_30px_rgba(5,150,105,0.25)] focus-visible:ring-2 focus-visible:ring-[#059669] dark:border-[#00E5A0]/40 dark:bg-[#00E5A0]/15 dark:text-[#00E5A0] dark:shadow-[0_0_20px_rgba(0,229,160,0.2)] dark:hover:bg-[#00E5A0]/25 dark:hover:shadow-[0_0_30px_rgba(0,229,160,0.35)] dark:focus-visible:ring-[#00E5A0]"
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
