import Link from "next/link";
import {
  Activity,
  BookOpen,
  Brain,
  CalendarDays,
  ChevronRight,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Repeat,
  Shield,
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

/** Al-Baqarah subject branches with progress */
const branches = [
  {
    name: "Faith & Belief",
    arabic: "\u0627\u0644\u0625\u064A\u0645\u0627\u0646",
    ayahRange: "1\u201320, 163\u2013177",
    totalFlowers: 54,
    bloomedFlowers: 48,
    icon: Sparkles,
    color: "#4A9E8E",
  },
  {
    name: "Law & Legislation",
    arabic: "\u0627\u0644\u0634\u0631\u064A\u0639\u0629",
    ayahRange: "178\u2013242",
    totalFlowers: 65,
    bloomedFlowers: 52,
    icon: Shield,
    color: "#3A8475",
  },
  {
    name: "Stories of the Prophets",
    arabic:
      "\u0642\u0635\u0635 \u0627\u0644\u0623\u0646\u0628\u064A\u0627\u0621",
    ayahRange: "30\u201373, 124\u2013141",
    totalFlowers: 62,
    bloomedFlowers: 45,
    icon: BookOpen,
    color: "#2E6B5E",
  },
  {
    name: "Jihad & Struggle",
    arabic: "\u0627\u0644\u062C\u0647\u0627\u062F",
    ayahRange: "190\u2013218, 243\u2013252",
    totalFlowers: 39,
    bloomedFlowers: 30,
    icon: Activity,
    color: "#C9A84C",
  },
  {
    name: "Finance & Charity",
    arabic: "\u0627\u0644\u0645\u0627\u0644",
    ayahRange: "261\u2013286",
    totalFlowers: 26,
    bloomedFlowers: 23,
    icon: Leaf,
    color: "#6DB897",
  },
];

/** FSRS root metrics */
const rootMetrics = [
  {
    label: "Retention",
    value: "92.4%",
    subtext: "Target: 90%",
    color: "#4A9E8E",
  },
  {
    label: "Avg. Stability",
    value: "47.3",
    subtext: "days",
    color: "#3A8475",
  },
  {
    label: "Last Review",
    value: "2",
    subtext: "days ago",
    color: "#2E6B5E",
  },
  {
    label: "Lapses",
    value: "14",
    subtext: "total relearns",
    color: "#C9A84C",
  },
];

/** Overall tree stats */
const treeStats = {
  totalAyahs: 286,
  memorized: 248,
  blooming: 198,
  wilting: 50,
  due: 23,
  mastery: 87,
};

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions with exact physical Mushaf layouts &mdash; every page as the scholars printed it.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Dual-engine: Web Speech API for speed, Whisper AI for Arabic Quran precision. Word-level feedback.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Next-gen scheduling that grows your roots deeper &mdash; 30% fewer reviews, higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time color-coded coaching with animated pronunciation guides. Master every rule.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall &mdash; eight distinct memory strategies for every pathway.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five tiers from Talib to Imam. Weekly promotions, streak multipliers, daily challenges.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description:
      "Ayah-by-ayah following with word-level sync, adjustable speed, and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device. Study without internet. Data syncs seamlessly when you reconnect.",
  },
];

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Tree", href: "#tree" },
  { label: "Roots", href: "#roots" },
  { label: "Privacy", href: "#privacy" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SingleTreeDeepDiveLanding() {
  const overallPct = Math.round(
    (treeStats.memorized / treeStats.totalAyahs) * 100
  );

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

      {/* ==================== HERO: SINGLE TREE DEEP DIVE ==================== */}
      <section id="tree" className="relative px-6 pb-24 pt-20">
        <div className="mx-auto max-w-6xl">
          {/* Hero heading */}
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#4A9E8E]">
              Deep Dive: Surah Tree Anatomy
            </p>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-[#2E3339] sm:text-5xl lg:text-6xl">
              The Tree of
              <span className="text-[#4A9E8E]"> Al-Baqarah</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5A6068]">
              286 ayahs. 5 thematic branches. One magnificent oak. Explore the
              anatomy of a surah tree &mdash; from the flowers that bloom on its
              branches to the FSRS roots that anchor your retention.
            </p>
          </div>

          {/* Main tree plate */}
          <div className="rounded-2xl bg-[#E8ECF1] p-8 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:p-12">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto_1fr]">
              {/* Left branches (Faith, Law, Stories) */}
              <div className="flex flex-col gap-6">
                {branches.slice(0, 3).map((branch) => {
                  const Icon = branch.icon;
                  const pct = Math.round(
                    (branch.bloomedFlowers / branch.totalFlowers) * 100
                  );
                  return (
                    <div
                      key={branch.name}
                      className="rounded-2xl bg-[#E8ECF1] p-5 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                          <Icon
                            className="size-5"
                            style={{ color: branch.color }}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#2E3339]">
                            {branch.name}
                          </h3>
                          <p className="text-xs text-[#8A8F96]" dir="rtl">
                            {branch.arabic}
                          </p>
                        </div>
                      </div>
                      <p className="mb-2 text-xs text-[#8A8F96]">
                        Ayahs: {branch.ayahRange}
                      </p>
                      {/* Flower count + progress */}
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-[#5A6068]">
                          <Flower2
                            className="mr-1 inline size-3"
                            style={{ color: branch.color }}
                          />
                          <span
                            className="tabular-nums font-bold"
                            style={{ color: branch.color }}
                          >
                            {branch.bloomedFlowers}
                          </span>
                          <span className="text-[#8A8F96]">
                            {" "}
                            / {branch.totalFlowers} flowers
                          </span>
                        </span>
                        <span
                          className="tabular-nums font-bold"
                          style={{ color: branch.color }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: branch.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Central trunk */}
              <div className="flex flex-col items-center">
                {/* Canopy */}
                <div className="mb-4 flex size-28 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[8px_8px_16px_#c8ccd1,-8px_-8px_16px_#ffffff] sm:size-36">
                  <div className="flex size-20 flex-col items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] sm:size-28">
                    <TreePine className="size-8 text-[#4A9E8E] sm:size-10" />
                    <span className="mt-1 text-xs font-semibold text-[#5A6068]">
                      286 ayahs
                    </span>
                  </div>
                </div>

                {/* Surah name plate */}
                <div className="mb-4 rounded-2xl bg-[#E8ECF1] px-8 py-4 text-center shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                  <p className="text-3xl font-bold text-[#2E3339]" dir="rtl">
                    {"\u0627\u0644\u0628\u0642\u0631\u0629"}
                  </p>
                  <p className="text-sm font-medium text-[#5A6068]">
                    Al-Baqarah
                  </p>
                  <p className="mt-1 text-xs text-[#8A8F96]">
                    Juz 1&ndash;3 &middot; Medinan &middot; 286 ayahs
                  </p>
                </div>

                {/* Vertical trunk progress bar */}
                <div className="relative mb-4 h-64 w-10 overflow-hidden rounded-2xl bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                  {/* Fill from bottom */}
                  <div
                    className="absolute bottom-0 left-0 w-full rounded-t-lg bg-gradient-to-t from-[#2E6B5E] via-[#4A9E8E] to-[#6DB897] transition-all duration-700"
                    style={{ height: `${overallPct}%` }}
                  />
                  {/* Percentage label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="tabular-nums text-sm font-bold text-white drop-shadow-md">
                      {overallPct}%
                    </span>
                  </div>
                </div>

                {/* Mastery label */}
                <div className="rounded-2xl bg-[#E8ECF1] px-5 py-2.5 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A9E8E]">
                    Trunk Strength: {treeStats.mastery}%
                  </span>
                </div>
              </div>

              {/* Right branches (Jihad, Finance) + stats */}
              <div className="flex flex-col gap-6">
                {branches.slice(3).map((branch) => {
                  const Icon = branch.icon;
                  const pct = Math.round(
                    (branch.bloomedFlowers / branch.totalFlowers) * 100
                  );
                  return (
                    <div
                      key={branch.name}
                      className="rounded-2xl bg-[#E8ECF1] p-5 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                          <Icon
                            className="size-5"
                            style={{ color: branch.color }}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#2E3339]">
                            {branch.name}
                          </h3>
                          <p className="text-xs text-[#8A8F96]" dir="rtl">
                            {branch.arabic}
                          </p>
                        </div>
                      </div>
                      <p className="mb-2 text-xs text-[#8A8F96]">
                        Ayahs: {branch.ayahRange}
                      </p>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-[#5A6068]">
                          <Flower2
                            className="mr-1 inline size-3"
                            style={{ color: branch.color }}
                          />
                          <span
                            className="tabular-nums font-bold"
                            style={{ color: branch.color }}
                          >
                            {branch.bloomedFlowers}
                          </span>
                          <span className="text-[#8A8F96]">
                            {" "}
                            / {branch.totalFlowers} flowers
                          </span>
                        </span>
                        <span
                          className="tabular-nums font-bold"
                          style={{ color: branch.color }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: branch.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Flower summary card */}
                <div className="rounded-2xl bg-[#E8ECF1] p-5 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                  <h4 className="mb-3 text-sm font-bold text-[#2E3339]">
                    Flower Health
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center rounded-xl bg-[#E8ECF1] p-3 shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                      <Flower2 className="mb-1 size-4 text-[#4A9E8E]" />
                      <span className="tabular-nums text-lg font-bold text-[#4A9E8E]">
                        {treeStats.blooming}
                      </span>
                      <span className="text-[10px] text-[#8A8F96]">
                        Blooming
                      </span>
                    </div>
                    <div className="flex flex-col items-center rounded-xl bg-[#E8ECF1] p-3 shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                      <Sprout className="mb-1 size-4 text-[#D97706]" />
                      <span className="tabular-nums text-lg font-bold text-[#D97706]">
                        {treeStats.wilting}
                      </span>
                      <span className="text-[10px] text-[#8A8F96]">
                        Wilting
                      </span>
                    </div>
                    <div className="flex flex-col items-center rounded-xl bg-[#E8ECF1] p-3 shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                      <CalendarDays className="mb-1 size-4 text-[#C9A84C]" />
                      <span className="tabular-nums text-lg font-bold text-[#C9A84C]">
                        {treeStats.due}
                      </span>
                      <span className="text-[10px] text-[#8A8F96]">
                        Due Today
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ROOTS: FSRS STABILITY ==================== */}
      <section id="roots" className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Roots: FSRS Stability Metrics
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#5A6068]">
              The roots of your tree represent how deeply embedded your
              memorization is. FSRS-6 measures stability, retrievability, and
              difficulty to schedule reviews at the perfect intervals.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {rootMetrics.map((metric) => (
              <div key={metric.label} className="flex flex-col items-center">
                {/* Raised outer circle */}
                <div className="flex size-28 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[8px_8px_16px_#c8ccd1,-8px_-8px_16px_#ffffff] sm:size-32">
                  {/* Inset inner circle */}
                  <div className="flex size-20 flex-col items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] sm:size-24">
                    <span
                      className="tabular-nums text-xl font-bold sm:text-2xl"
                      style={{ color: metric.color }}
                    >
                      {metric.value}
                    </span>
                    <span className="text-[10px] text-[#8A8F96]">
                      {metric.subtext}
                    </span>
                  </div>
                </div>
                <span className="mt-3 text-sm font-bold text-[#2E3339]">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Root depth visualization */}
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-[#E8ECF1] p-8 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <h3 className="mb-4 text-center text-lg font-bold text-[#2E3339]">
              Root Depth Profile
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Short-term Memory",
                  pct: 95,
                  color: "#6DB897",
                  desc: "Ayahs reviewed within 7 days",
                },
                {
                  label: "Medium-term Memory",
                  pct: 78,
                  color: "#4A9E8E",
                  desc: "Stable for 1\u20134 weeks",
                },
                {
                  label: "Long-term Memory",
                  pct: 62,
                  color: "#3A8475",
                  desc: "Stable for 1\u20133 months",
                },
                {
                  label: "Deep Retention",
                  pct: 41,
                  color: "#2E6B5E",
                  desc: "Stable for 3+ months",
                },
              ].map((root) => (
                <div key={root.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2E3339]">
                      {root.label}
                    </span>
                    <span
                      className="tabular-nums font-bold"
                      style={{ color: root.color }}
                    >
                      {root.pct}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${root.pct}%`,
                        backgroundColor: root.color,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-[#8A8F96]">{root.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SEASON INDICATOR ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-[#E8ECF1] p-10 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:p-14">
            <div className="grid items-center gap-10 sm:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-[#E8ECF1] px-4 py-2 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                  <Sun className="size-5 text-[#4A9E8E]" />
                  <span className="text-sm font-bold text-[#4A9E8E]">
                    Current Season: Spring
                  </span>
                </div>
                <h2 className="text-balance text-3xl font-bold text-[#2E3339]">
                  Your Al-Baqarah tree is in active growth
                </h2>
                <p className="mt-4 leading-relaxed text-[#5A6068]">
                  Spring means you&rsquo;re actively learning new ayahs and
                  reviewing consistently. The tree is growing rapidly &mdash;
                  branches are filling with new flowers, and the trunk is
                  thickening with each successful review session.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#E8ECF1] shadow-[3px_3px_6px_#c8ccd1,-3px_-3px_6px_#ffffff]">
                      <Flower2 className="size-4 text-[#4A9E8E]" />
                    </div>
                    <span className="text-[#5A6068]">
                      <span className="tabular-nums font-bold text-[#4A9E8E]">
                        {treeStats.blooming}
                      </span>{" "}
                      flowers in active bloom
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#E8ECF1] shadow-[3px_3px_6px_#c8ccd1,-3px_-3px_6px_#ffffff]">
                      <CalendarDays className="size-4 text-[#C9A84C]" />
                    </div>
                    <span className="text-[#5A6068]">
                      <span className="tabular-nums font-bold text-[#C9A84C]">
                        {treeStats.due}
                      </span>{" "}
                      ayahs due for review today
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#E8ECF1] shadow-[3px_3px_6px_#c8ccd1,-3px_-3px_6px_#ffffff]">
                      <Brain className="size-4 text-[#2E6B5E]" />
                    </div>
                    <span className="text-[#5A6068]">
                      <span className="tabular-nums font-bold text-[#2E6B5E]">
                        38
                      </span>{" "}
                      new ayahs remaining to complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Season cycle */}
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    {
                      season: "Spring",
                      desc: "Active learning and consistent review. Rapid growth.",
                      color: "#4A9E8E",
                      active: true,
                    },
                    {
                      season: "Summer",
                      desc: "Peak mastery. All flowers blooming. Deep roots.",
                      color: "#C9A84C",
                      active: false,
                    },
                    {
                      season: "Autumn",
                      desc: "Reviews falling behind. Flowers starting to wilt.",
                      color: "#D97706",
                      active: false,
                    },
                    {
                      season: "Winter",
                      desc: "Inactive. No recent sessions. Tree dormant.",
                      color: "#8A8F96",
                      active: false,
                    },
                  ] as const
                ).map((s) => (
                  <div
                    key={s.season}
                    className={`rounded-2xl bg-[#E8ECF1] p-5 ${
                      s.active
                        ? "shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]"
                        : "shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span
                        className="text-sm font-bold"
                        style={{ color: s.color }}
                      >
                        {s.season}
                      </span>
                      {s.active && (
                        <span className="rounded-full bg-[#4A9E8E]/10 px-2 py-0.5 text-[10px] font-bold text-[#4A9E8E]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-[#8A8F96]">
                      {s.desc}
                    </p>
                  </div>
                ))}
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
              The tools that power every tree
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#5A6068]">
              Behind every flourishing surah tree is a suite of purpose-built
              memorization tools &mdash; from AI voice analysis to
              science-backed scheduling.
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
              &ldquo;The likeness of the one who reads the Qur&rsquo;an and
              memorizes it is that of a citron: its fragrance is sweet and its
              taste is sweet.&rdquo;
            </blockquote>
            <cite className="mt-4 block text-sm font-medium text-[#4A9E8E] not-italic">
              Sahih al-Bukhari &middot; 5427
            </cite>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl bg-[#E8ECF1] px-10 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Start growing your own surah tree
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#5A6068]">
              Free forever. No ads. No distractions. Choose any surah, plant a
              seed, and watch it grow into a magnificent tree &mdash; one ayah
              at a time. Your Paradise Garden awaits.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/register">
                  Plant Your First Seed
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
