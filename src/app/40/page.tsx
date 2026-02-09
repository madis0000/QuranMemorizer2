import Link from "next/link";
import {
  ArrowRight,
  Bird,
  BookOpen,
  Brain,
  Cloud,
  Droplets,
  Flower2,
  Leaf,
  LogIn,
  Moon,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  Sunrise,
  TreePine,
  Trees,
  Trophy,
  UserPlus,
  Wind,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const heroStats = [
  { value: "4", label: "Seasons" },
  { value: "114", label: "Living Trees" },
  { value: "6,236", label: "Flowers" },
  { value: "\u221E", label: "Growth Cycles" },
];

const seasonIcons = [
  { icon: Sprout, label: "Spring", color: "#00E5A0", lightColor: "#059669" },
  { icon: Sun, label: "Summer", color: "#FFD700", lightColor: "#B8860B" },
  { icon: Leaf, label: "Autumn", color: "#FF8C00", lightColor: "#D2691E" },
  { icon: Snowflake, label: "Winter", color: "#00B8D4", lightColor: "#0891B2" },
];

const springTrees = [
  {
    name: "Al-Mulk",
    arabic: "\u0627\u0644\u0645\u0644\u0643",
    ayahs: 30,
    planted: 5,
    progress: 17,
    stage: "Seedling",
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    planted: 12,
    progress: 15,
    stage: "Sapling",
  },
  {
    name: "Al-Waqiah",
    arabic: "\u0627\u0644\u0648\u0627\u0642\u0639\u0629",
    ayahs: 96,
    planted: 3,
    progress: 3,
    stage: "Seed",
  },
];

const summerTrees = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    bloomed: 7,
    progress: 100,
    achievements: ["Perfect Recitation", "7-Day Streak"],
  },
  {
    name: "Al-Ikhlas",
    arabic: "\u0627\u0644\u0625\u062E\u0644\u0627\u0635",
    ayahs: 4,
    bloomed: 4,
    progress: 100,
    achievements: ["Speed Record", "Tajweed Master"],
  },
];

const autumnTrees = [
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    bloomed: 50,
    wilting: 14,
    progress: 60,
    daysSinceReview: 12,
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    bloomed: 102,
    wilting: 38,
    progress: 36,
    daysSinceReview: 18,
  },
];

const winterTree = {
  name: "Al-Kahf",
  arabic: "\u0627\u0644\u0643\u0647\u0641",
  ayahs: 110,
  bloomed: 25,
  dormant: true,
  progress: 23,
  stability: 42.7,
  daysSinceReview: 45,
};

const gardenFeatures = [
  {
    icon: Brain,
    title: "FSRS-6 Roots",
    desc: "Next-gen spaced repetition with 21 optimizable parameters. 30% fewer reviews.",
  },
  {
    icon: Sparkles,
    title: "Tajweed Coaching",
    desc: "13-rule real-time detection with animated pronunciation guides.",
  },
  {
    icon: Trophy,
    title: "Quran Leagues",
    desc: "Five tiers from Talib to Imam with weekly promotions and challenges.",
  },
  {
    icon: BookOpen,
    title: "Mushaf Rendering",
    desc: "7+ editions with exact physical page layouts matching the printed copy.",
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

export default function SeasonalSymphonyLanding() {
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
              className="size-5"
              style={{ filter: "drop-shadow(0 0 6px rgba(5,150,105,0.3))" }}
            />
            <span className="font-medium">QuranMemorizer</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Spring", "Summer", "Autumn", "Winter", "Paradise"].map(
              (label) => (
                <Link
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="text-sm font-light tracking-wide text-[#5A7B6B] transition-colors duration-200 hover:text-[#059669] focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#6B8B7B] dark:hover:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
                >
                  {label}
                </Link>
              )
            )}
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

      {/* ==================== HERO ==================== */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-24">
        {/* Multi-colored ambient orbs (dark only) */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/4 opacity-0 dark:opacity-100"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.05) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-1/4 top-1/3 opacity-0 dark:opacity-100"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-1/4 left-1/2 opacity-0 dark:opacity-100"
          style={{
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(0,184,212,0.04) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        {/* Light mode gradient */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(5,150,105,0.05) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Season icons row */}
          <div className="mb-8 flex items-center justify-center gap-5">
            {seasonIcons.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="flex size-10 items-center justify-center rounded-full border border-[#D1E0D8] bg-white dark:border-[rgba(0,229,160,0.1)] dark:bg-[#0F1A14]">
                    <Icon
                      className="size-4"
                      style={{
                        color: s.color,
                        filter: `drop-shadow(0 0 4px ${s.color})`,
                      }}
                    />
                  </div>
                  <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          <h1 className="text-balance text-4xl font-extralight leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Your Garden Lives Through
            <br />
            <span
              className="font-light text-[#059669] dark:text-[#00E5A0]"
              style={{ textShadow: "0 0 40px rgba(0,229,160,0.3)" }}
            >
              Every Season
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
            In spring, new surahs sprout. In summer, mastered trees bloom
            golden. In autumn, neglected flowers wilt as gentle reminders. In
            winter, dormant roots grow deeper. And in Paradise &mdash;
            everything blooms forever.
          </p>

          <div className="mt-10">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 text-lg font-light text-[#059669] transition-all duration-300 hover:gap-4 focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:outline-none dark:text-[#00E5A0] dark:focus-visible:ring-[#00E5A0]"
            >
              Begin Your First Season
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4">
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
        </div>
      </section>

      {/* ==================== SPRING: NEW GROWTH ==================== */}
      <section id="spring" className="relative px-6 py-28">
        {/* Spring tint backgrounds */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, #F0F5F2 0%, #E8F5EE 50%, #F0F5F2 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, #080F0B 0%, #0A130D 50%, #080F0B 100%)",
          }}
          aria-hidden="true"
        />
        {/* Subtle green ambient glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 dark:opacity-100"
          style={{
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(0,229,160,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#059669]/20 bg-[#059669]/5 px-4 py-1.5 dark:border-[#00E5A0]/20 dark:bg-[#00E5A0]/5">
              <Sprout className="size-3.5 text-[#059669] dark:text-[#00E5A0]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#059669] dark:text-[#00E5A0]">
                Spring &middot; New Growth
              </span>
            </div>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Plant new seeds,{" "}
              <span className="text-[#059669] dark:text-[#00E5A0]">
                watch them sprout
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              Every surah you begin is a seed pressed into rich soil. First
              letters become first leaves. Each day of practice pushes the
              sapling higher. The forest floor is alive with new green
              possibility.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {springTrees.map((tree) => (
              <div
                key={tree.name}
                className="rounded-2xl border border-[#D1E0D8] bg-white p-6 dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]"
                style={{ boxShadow: "0 0 20px rgba(0,229,160,0.08)" }}
              >
                {/* Sprouting progress ring */}
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
                      stroke="#059669"
                      strokeOpacity={0.1}
                      strokeWidth="2.5"
                      className="dark:stroke-[#00E5A0]"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={`${tree.progress * 2.14} ${214 - tree.progress * 2.14}`}
                      className="dark:stroke-[#00E5A0]"
                      style={{
                        filter: "drop-shadow(0 0 6px rgba(0,229,160,0.5))",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Sprout
                      className="size-5 text-[#059669] dark:text-[#00E5A0]"
                      style={{
                        filter: "drop-shadow(0 0 4px rgba(0,229,160,0.4))",
                      }}
                    />
                  </div>
                </div>

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

                <div className="mt-4 flex items-center justify-between border-t border-[#D1E0D8] pt-3 dark:border-[#00E5A0]/10">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#5A7B6B] dark:text-[#6B8B7B]">
                    {tree.stage}
                  </span>
                  <span className="tabular-nums text-xs font-light text-[#059669] dark:text-[#00E5A0]">
                    {tree.planted}/{tree.ayahs} ayahs
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm font-light italic text-[#5A7B6B]/70 dark:text-[#6B8B7B]/60">
            &ldquo;Every mighty tree began as a seed that decided to
            grow.&rdquo;
          </p>
        </div>
      </section>

      {/* ==================== SUMMER: PEAK BLOOM ==================== */}
      <section id="summer" className="relative px-6 py-28">
        {/* Warm golden tint */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, #F0F5F2 0%, #F5F2E8 50%, #F0F5F2 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, #080F0B 0%, #100F08 50%, #080F0B 100%)",
          }}
          aria-hidden="true"
        />
        {/* Golden glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 dark:opacity-100"
          style={{
            width: "700px",
            height: "500px",
            background:
              "radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B8860B]/20 bg-[#B8860B]/5 px-4 py-1.5 dark:border-[#FFD700]/20 dark:bg-[#FFD700]/5">
              <Sun className="size-3.5 text-[#B8860B] dark:text-[#FFD700]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#FFD700]">
                Summer &middot; Peak Bloom
              </span>
            </div>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Mastered trees{" "}
              <span
                className="text-[#B8860B] dark:text-[#FFD700]"
                style={{ textShadow: "0 0 20px rgba(255,215,0,0.2)" }}
              >
                radiate golden light
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              When every flower blooms and the FSRS stability is high, a surah
              tree enters its golden summer. Achievement birds visit. The canopy
              blazes with warm light. This is the peak of your memorization.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {summerTrees.map((tree) => (
              <div
                key={tree.name}
                className="rounded-2xl border border-[#D1E0D8] bg-white p-8 dark:border-[#FFD700]/10 dark:bg-[#0F1A14]"
                style={{ boxShadow: "0 0 30px rgba(255,215,0,0.08)" }}
              >
                <div className="flex items-start gap-6">
                  {/* Golden ring */}
                  <div className="relative shrink-0 size-24">
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
                        stroke="#FFD700"
                        strokeOpacity={0.15}
                        strokeWidth="3"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke="#FFD700"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="264 0"
                        style={{
                          filter: "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Flower2
                        className="size-6 text-[#FFD700]"
                        style={{
                          filter: "drop-shadow(0 0 6px rgba(255,215,0,0.5))",
                        }}
                      />
                      <span className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-[#B8860B] dark:text-[#FFD700]/80">
                        Mastered
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p
                      className="text-2xl font-light text-[#1A2E22] dark:text-[#E8F0EC]"
                      dir="rtl"
                    >
                      {tree.arabic}
                    </p>
                    <p className="mt-0.5 text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
                      {tree.name}
                    </p>
                    <p className="mt-1 tabular-nums text-xs text-[#B8860B] dark:text-[#FFD700]/80">
                      {tree.bloomed}/{tree.ayahs} flowers in full bloom
                    </p>

                    {/* Achievement birds */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tree.achievements.map((badge) => (
                        <span
                          key={badge}
                          className="inline-flex items-center gap-1 rounded-full border border-[#B8860B]/20 bg-[#B8860B]/5 px-2.5 py-0.5 text-[9px] font-medium text-[#B8860B] dark:border-[#FFD700]/20 dark:bg-[#FFD700]/5 dark:text-[#FFD700]"
                        >
                          <Bird className="size-2.5" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm font-light italic text-[#B8860B]/60 dark:text-[#FFD700]/40">
            &ldquo;The warmth of mastery attracts rare and beautiful
            visitors.&rdquo;
          </p>
        </div>
      </section>

      {/* ==================== AUTUMN: REVIEW SEASON ==================== */}
      <section id="autumn" className="relative px-6 py-28">
        {/* Amber tint */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, #F0F5F2 0%, #F5EFE6 50%, #F0F5F2 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, #080F0B 0%, #0F0D08 50%, #080F0B 100%)",
          }}
          aria-hidden="true"
        />
        {/* Amber glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 dark:opacity-100"
          style={{
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(255,140,0,0.03) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D2691E]/20 bg-[#D2691E]/5 px-4 py-1.5 dark:border-[#FF8C00]/20 dark:bg-[#FF8C00]/5">
              <Wind className="size-3.5 text-[#D2691E] dark:text-[#FF8C00]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D2691E] dark:text-[#FF8C00]">
                Autumn &middot; Review Season
              </span>
            </div>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Your flowers need{" "}
              <span
                className="text-[#D2691E] dark:text-[#FF8C00]"
                style={{ textShadow: "0 0 20px rgba(255,140,0,0.2)" }}
              >
                water
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              When reviews are overdue, flowers begin to wilt. Leaves turn amber
              and fall. This is not failure &mdash; it is the natural rhythm of
              memory. But your garden gently calls: come back, water your trees,
              and restore their bloom before winter arrives.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {autumnTrees.map((tree) => (
              <div
                key={tree.name}
                className="rounded-2xl border border-[#D2691E]/15 bg-white p-8 dark:border-[#FF8C00]/10 dark:bg-[#0F1A14]"
                style={{ boxShadow: "0 0 24px rgba(255,140,0,0.06)" }}
              >
                <div className="flex items-start gap-5">
                  {/* Amber progress ring */}
                  <div className="relative shrink-0 size-20">
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
                        stroke="#FF8C00"
                        strokeOpacity={0.1}
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#FF8C00"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={`${tree.progress * 2.14} ${214 - tree.progress * 2.14}`}
                        style={{
                          filter: "drop-shadow(0 0 6px rgba(255,140,0,0.4))",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Leaf
                        className="size-5 text-[#D2691E] dark:text-[#FF8C00]"
                        style={{
                          filter: "drop-shadow(0 0 4px rgba(255,140,0,0.4))",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p
                      className="text-xl font-light text-[#1A2E22] dark:text-[#E8F0EC]"
                      dir="rtl"
                    >
                      {tree.arabic}
                    </p>
                    <p className="mt-0.5 text-xs font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
                      {tree.name}
                    </p>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#5A7B6B] dark:text-[#6B8B7B]">
                          Blooming
                        </span>
                        <span className="tabular-nums font-medium text-[#059669] dark:text-[#00E5A0]">
                          {tree.bloomed - tree.wilting}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#5A7B6B] dark:text-[#6B8B7B]">
                          Wilting
                        </span>
                        <span className="tabular-nums font-medium text-[#D2691E] dark:text-[#FF8C00]">
                          {tree.wilting}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#5A7B6B] dark:text-[#6B8B7B]">
                          Days since review
                        </span>
                        <span className="tabular-nums font-medium text-[#D2691E] dark:text-[#FF8C00]">
                          {tree.daysSinceReview}d
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgent CTA */}
                <div className="mt-5 rounded-lg border border-[#D2691E]/10 bg-[#D2691E]/5 p-3 text-center dark:border-[#FF8C00]/10 dark:bg-[#FF8C00]/5">
                  <p className="text-xs font-light text-[#D2691E] dark:text-[#FF8C00]">
                    <Droplets className="mr-1 inline size-3" />
                    Water this tree &mdash; review {tree.wilting} wilting
                    flowers
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm font-light italic text-[#D2691E]/50 dark:text-[#FF8C00]/40">
            &ldquo;A wilting flower is not lost &mdash; it is a gentle reminder
            to return.&rdquo;
          </p>
        </div>
      </section>

      {/* ==================== WINTER: DEEP REST ==================== */}
      <section id="winter" className="relative px-6 py-28">
        {/* Blue-gray tint */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, #F0F5F2 0%, #EAF0F5 50%, #F0F5F2 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, #080F0B 0%, #080C10 50%, #080F0B 100%)",
          }}
          aria-hidden="true"
        />
        {/* Cyan glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 dark:opacity-100"
          style={{
            width: "500px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(0,184,212,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0891B2]/20 bg-[#0891B2]/5 px-4 py-1.5 dark:border-[#00B8D4]/20 dark:bg-[#00B8D4]/5">
              <Moon className="size-3.5 text-[#0891B2] dark:text-[#00B8D4]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#0891B2] dark:text-[#00B8D4]">
                Winter &middot; Deep Rest
              </span>
            </div>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Even in winter,{" "}
              <span
                className="text-[#0891B2] dark:text-[#00B8D4]"
                style={{ textShadow: "0 0 20px rgba(0,184,212,0.2)" }}
              >
                your roots grow deeper
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              A dormant tree is not a dead tree. The flowers have retreated, the
              leaves are gone, but beneath the soil the FSRS roots hold firm.
              The stability score tells you: this memory still lives. When
              spring returns, it will bloom again faster than you expect.
            </p>
          </div>

          {/* Single dormant tree card */}
          <div className="mx-auto max-w-lg">
            <div
              className="rounded-2xl border border-[#0891B2]/15 bg-white p-10 text-center dark:border-[#00B8D4]/10 dark:bg-[#0F1A14]"
              style={{ boxShadow: "0 0 30px rgba(0,184,212,0.06)" }}
            >
              {/* Dormant tree ring */}
              <div className="relative mx-auto mb-6 size-28">
                <svg
                  className="size-28 -rotate-90"
                  viewBox="0 0 112 112"
                  aria-hidden="true"
                >
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="#00B8D4"
                    strokeOpacity={0.08}
                    strokeWidth="2"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="#00B8D4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${winterTree.progress * 3.02} ${302 - winterTree.progress * 3.02}`}
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(0,184,212,0.3))",
                    }}
                  />
                  {/* Inner root ring (stability) */}
                  <circle
                    cx="56"
                    cy="56"
                    r="38"
                    fill="none"
                    stroke="#00B8D4"
                    strokeOpacity={0.15}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <TreePine
                    className="size-7 text-[#0891B2] dark:text-[#00B8D4]"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(0,184,212,0.4))",
                    }}
                  />
                  <span className="mt-1 text-[8px] font-medium uppercase tracking-wider text-[#0891B2]/60 dark:text-[#00B8D4]/60">
                    Dormant
                  </span>
                </div>
              </div>

              <p
                className="text-2xl font-light text-[#1A2E22] dark:text-[#E8F0EC]"
                dir="rtl"
              >
                {winterTree.arabic}
              </p>
              <p className="mt-0.5 text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
                {winterTree.name}
              </p>

              <div className="mx-auto mt-6 max-w-xs space-y-2">
                <div className="flex items-center justify-between border-b border-[#D1E0D8] pb-2 dark:border-[#00B8D4]/10">
                  <span className="text-xs text-[#5A7B6B] dark:text-[#6B8B7B]">
                    Flowers memorized
                  </span>
                  <span className="tabular-nums text-xs font-medium text-[#0891B2] dark:text-[#00B8D4]">
                    {winterTree.bloomed}/{winterTree.ayahs}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D1E0D8] pb-2 dark:border-[#00B8D4]/10">
                  <span className="text-xs text-[#5A7B6B] dark:text-[#6B8B7B]">
                    Root stability
                  </span>
                  <span className="tabular-nums text-xs font-medium text-[#0891B2] dark:text-[#00B8D4]">
                    {winterTree.stability} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5A7B6B] dark:text-[#6B8B7B]">
                    Last reviewed
                  </span>
                  <span className="tabular-nums text-xs font-medium text-[#0891B2] dark:text-[#00B8D4]">
                    {winterTree.daysSinceReview} days ago
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-[#0891B2]/10 bg-[#0891B2]/5 p-3 dark:border-[#00B8D4]/10 dark:bg-[#00B8D4]/5">
                <p className="text-xs font-light text-[#0891B2] dark:text-[#00B8D4]">
                  <Cloud className="mr-1 inline size-3" />
                  Root stability holds at {winterTree.stability}d &mdash; memory
                  is intact beneath the surface
                </p>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm font-light italic text-[#0891B2]/50 dark:text-[#00B8D4]/40">
            &ldquo;Even in winter, your roots grow deeper. Rest is part of the
            journey.&rdquo;
          </p>
        </div>
      </section>

      {/* ==================== PARADISE: THE ETERNAL SPRING ==================== */}
      <section id="paradise" className="relative px-6 py-28">
        {/* Golden paradise tint */}
        <div
          className="pointer-events-none absolute inset-0 dark:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, #F0F5F2 0%, #F8F4E8 50%, #F0F5F2 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, #080F0B 0%, #12100A 50%, #080F0B 100%)",
          }}
          aria-hidden="true"
        />
        {/* Golden paradise glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 dark:opacity-100"
          style={{
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse, rgba(255,215,0,0.06) 0%, rgba(0,229,160,0.02) 40%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <Sunrise
            className="mx-auto mb-4 size-8 text-[#B8860B] dark:text-[#FFD700]"
            style={{ filter: "drop-shadow(0 0 12px rgba(255,215,0,0.5))" }}
          />
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B8860B] dark:text-[#FFD700]">
            The Eternal Spring
          </p>
          <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
            In Paradise,{" "}
            <span
              className="text-[#B8860B] dark:text-[#FFD700]"
              style={{ textShadow: "0 0 30px rgba(255,215,0,0.25)" }}
            >
              everything blooms forever
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
            Complete all 114 surahs and your garden transcends the seasons. No
            wilting. No dormancy. Every tree stands in eternal golden light,
            every flower in permanent bloom. Rivers of similar verse connections
            shimmer between trees. 30 biomes unite into one: Jannah &mdash; the
            Paradise Garden.
          </p>

          {/* Paradise stats */}
          <div className="mx-auto mt-14 grid max-w-md grid-cols-3 gap-8">
            <div>
              <p
                className="tabular-nums text-2xl font-extralight text-[#B8860B] dark:text-[#FFD700]"
                style={{ textShadow: "0 0 12px rgba(255,215,0,0.3)" }}
              >
                114
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                Golden Trees
              </p>
            </div>
            <div>
              <p
                className="tabular-nums text-2xl font-extralight text-[#B8860B] dark:text-[#FFD700]"
                style={{ textShadow: "0 0 12px rgba(255,215,0,0.3)" }}
              >
                6,236
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                Eternal Flowers
              </p>
            </div>
            <div>
              <p
                className="tabular-nums text-2xl font-extralight text-[#B8860B] dark:text-[#FFD700]"
                style={{ textShadow: "0 0 12px rgba(255,215,0,0.3)" }}
              >
                30
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#5A7B6B] dark:text-[#6B8B7B]">
                United Biomes
              </p>
            </div>
          </div>

          {/* Key features grid */}
          <div className="mx-auto mt-16 grid max-w-2xl gap-4 sm:grid-cols-2">
            {gardenFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex items-start gap-3 rounded-xl border border-[#D1E0D8] bg-white p-4 text-left dark:border-[#FFD700]/8 dark:bg-[#0F1A14]"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-[#B8860B] dark:text-[#FFD700]" />
                  <div>
                    <p className="text-sm font-medium text-[#1A2E22] dark:text-[#E8F0EC]">
                      {f.title}
                    </p>
                    <p className="mt-0.5 text-xs font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== QURAN QUOTE ==================== */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
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
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="rounded-2xl border border-[#059669]/20 bg-white px-8 py-14 sm:px-12 dark:border-[#00E5A0]/30 dark:bg-[#0F1A14]"
            style={{ boxShadow: "0 0 40px rgba(0,229,160,0.08)" }}
          >
            <Trees
              className="mx-auto mb-6 size-10 text-[#059669] dark:text-[#00E5A0]"
              style={{ filter: "drop-shadow(0 0 12px rgba(0,229,160,0.5))" }}
            />
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every season begins with a{" "}
              <span
                className="text-[#059669] dark:text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.3)" }}
              >
                single seed
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#5A7B6B] dark:text-[#6B8B7B]">
              Free forever. No ads. No distractions. Plant your first seed today
              and watch it grow through spring, summer, autumn, and winter
              &mdash; until your entire garden blooms in eternal light.
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
