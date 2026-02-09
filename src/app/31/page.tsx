import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  ChevronRight,
  Crown,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Repeat,
  Shield,
  Sparkles,
  Star,
  TreePine,
  Trophy,
  UserPlus,
  WifiOff,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    num: 1,
    bg: "bg-[#E8F5E9]",
    border: "border-[#C8E6C9]",
    icon: Leaf,
    iconColor: "text-[#4CAF50]",
    title: "Pick a Surah",
    description:
      "Choose any of the 114 surahs. Each one becomes a unique tree seed in your garden.",
  },
  {
    num: 2,
    bg: "bg-[#FFF8E1]",
    border: "border-[#FFE082]",
    icon: Flower2,
    iconColor: "text-[#FF9800]",
    title: "Memorize Ayahs",
    description:
      "Every verse you memorize blooms into a flower on your tree. Watch them open one by one.",
  },
  {
    num: 3,
    bg: "bg-[#E3F2FD]",
    border: "border-[#90CAF9]",
    icon: TreePine,
    iconColor: "text-[#2196F3]",
    title: "Watch It Grow",
    description:
      "Your tree grows taller with mastery. Branches form around themes. Roots deepen with review.",
  },
  {
    num: 4,
    bg: "bg-[#FFF3E0]",
    border: "border-[#FFCC80]",
    icon: Sparkles,
    iconColor: "text-[#7C4DFF]",
    title: "Build Paradise",
    description:
      "Complete all 30 juz to fill 30 biomes. 114 trees. 6,236 flowers. Your own Paradise Garden.",
  },
] as const;

const SHOWCASE_TREES = [
  {
    name: "Al-Fatiha",
    nameAr: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    totalAyahs: 7,
    memorized: 7,
    progress: 100,
    season: "Summer",
    branches: ["Du\u2019a", "Praise", "Guidance"],
    color: "from-[#4CAF50] to-[#81C784]",
    levelUp: true,
  },
  {
    name: "Al-Baqarah",
    nameAr: "\u0627\u0644\u0628\u0642\u0631\u0629",
    totalAyahs: 286,
    memorized: 142,
    progress: 50,
    season: "Spring",
    branches: ["Law", "Stories", "Faith", "Jihad"],
    color: "from-[#FF9800] to-[#FFB74D]",
    levelUp: false,
  },
  {
    name: "Yasin",
    nameAr: "\u064A\u0633",
    totalAyahs: 83,
    memorized: 62,
    progress: 75,
    season: "Spring",
    branches: ["Resurrection", "Signs", "Mercy"],
    color: "from-[#7C4DFF] to-[#B388FF]",
    levelUp: false,
  },
  {
    name: "Al-Kawthar",
    nameAr: "\u0627\u0644\u0643\u0648\u062B\u0631",
    totalAyahs: 3,
    memorized: 3,
    progress: 100,
    season: "Summer",
    branches: ["Gratitude"],
    color: "from-[#4CAF50] to-[#A5D6A7]",
    levelUp: true,
  },
] as const;

const STATS = [
  { label: "Trees Planted", value: "114", icon: TreePine },
  { label: "Flowers Blooming", value: "6,236", icon: Flower2 },
  { label: "Biomes Unlocked", value: "30", icon: Sparkles },
  { label: "Days Streak", value: "365", icon: Zap },
] as const;

const FEATURES = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions rendered exactly like your physical Mushaf. Every page, every line, pixel-perfect.",
    iconBg: "bg-[#E8F5E9]",
    iconColor: "text-[#4CAF50]",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Web Speech API plus Whisper fallback. Recite and get instant word-level feedback.",
    iconBg: "bg-[#FFF3E0]",
    iconColor: "text-[#FF9800]",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "The world\u2019s best SRS algorithm. 30% fewer reviews than Anki for the same retention.",
    iconBg: "bg-[#E3F2FD]",
    iconColor: "text-[#2196F3]",
  },
  {
    icon: Shield,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time Tajweed analysis with color-coded rules and coaching feedback.",
    iconBg: "bg-[#F3E5F5]",
    iconColor: "text-[#7C4DFF]",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full hide. Keyword mode, reverse recall, and more.",
    iconBg: "bg-[#FFF8E1]",
    iconColor: "text-[#FFA000]",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five tiers from Talib to Imam. Weekly competition. Climb the ranks with XP.",
    iconBg: "bg-[#E8F5E9]",
    iconColor: "text-[#4CAF50]",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    description:
      "Listen to dozens of world-renowned reciters. Ayah-by-ayah sync and offline support.",
    iconBg: "bg-[#E3F2FD]",
    iconColor: "text-[#2196F3]",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Works without internet. IndexedDB caching, background sync, install on any device.",
    iconBg: "bg-[#FFF3E0]",
    iconColor: "text-[#FF9800]",
  },
] as const;

const LEAGUES = [
  {
    tier: "Bronze",
    name: "Talib",
    subtitle: "Student",
    icon: Star,
    bg: "bg-[#FFF8E1]",
    border: "border-[#FFE082]",
    color: "text-[#F57F17]",
  },
  {
    tier: "Silver",
    name: "Qari",
    subtitle: "Reciter",
    icon: Award,
    bg: "bg-[#F5F5F5]",
    border: "border-[#BDBDBD]",
    color: "text-[#616161]",
  },
  {
    tier: "Gold",
    name: "Hafiz",
    subtitle: "Memorizer",
    icon: Trophy,
    bg: "bg-[#FFF8E1]",
    border: "border-[#FFD54F]",
    color: "text-[#FF8F00]",
  },
  {
    tier: "Platinum",
    name: "Sheikh",
    subtitle: "Scholar",
    icon: Sparkles,
    bg: "bg-[#E3F2FD]",
    border: "border-[#90CAF9]",
    color: "text-[#1565C0]",
  },
  {
    tier: "Diamond",
    name: "Imam",
    subtitle: "Leader",
    icon: Crown,
    bg: "bg-[#F3E5F5]",
    border: "border-[#CE93D8]",
    color: "text-[#7B1FA2]",
  },
] as const;

const HERO_TREES = [
  {
    size: "size-10",
    treeSz: "size-5",
    bg: "bg-[#E8F5E9]",
    ring: "ring-[#C8E6C9]",
  },
  {
    size: "size-12",
    treeSz: "size-6",
    bg: "bg-[#FFF8E1]",
    ring: "ring-[#FFE082]",
  },
  {
    size: "size-16",
    treeSz: "size-8",
    bg: "bg-[#E3F2FD]",
    ring: "ring-[#90CAF9]",
  },
  {
    size: "size-12",
    treeSz: "size-6",
    bg: "bg-[#FFF3E0]",
    ring: "ring-[#FFCC80]",
  },
  {
    size: "size-10",
    treeSz: "size-5",
    bg: "bg-[#F3E5F5]",
    ring: "ring-[#CE93D8]",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function FlatPlayfulLandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A2E]">
      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50] rounded-lg"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#4CAF50]">
              <TreePine className="size-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              QuranMemorizer
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-[#666680] hover:text-[#1A1A2E] focus-visible:ring-2 focus-visible:ring-[#4CAF50]"
            >
              <Link href="/login">
                <LogIn className="mr-1.5 size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#4CAF50] font-bold text-white hover:bg-[#43A047] focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-2"
            >
              <Link href="/register">
                <UserPlus className="mr-1.5 size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F5E9]/60 via-white to-white">
        <div className="container mx-auto px-4 pb-20 pt-16 lg:pb-28 lg:pt-24">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#E8F5E9] px-4 py-1.5 text-sm font-semibold text-[#2E7D32]">
              <Sparkles className="size-4" />
              Gamified Quran Memorization
            </div>

            <h1 className="mb-5 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
              Grow a Tree for{" "}
              <span className="text-[#4CAF50]">Every Surah!</span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg font-medium text-[#666680]">
              114 surahs become 114 living trees. Each ayah you memorize blooms
              into a flower. Build your own Paradise Garden with AI-powered
              memorization, spaced repetition, and real-time Tajweed coaching.
            </p>

            {/* Hero tree row */}
            <div className="mb-10 flex items-end gap-3">
              {HERO_TREES.map((t, i) => (
                <div
                  key={i}
                  className={`${t.size} ${t.bg} flex items-center justify-center rounded-full ring-2 ${t.ring}`}
                >
                  <TreePine className={`${t.treeSz} text-[#4CAF50]`} />
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#4CAF50] px-8 text-lg font-extrabold text-white shadow-lg shadow-[#4CAF50]/30 hover:bg-[#43A047] hover:shadow-xl hover:shadow-[#4CAF50]/40 focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-2"
              >
                <Link href="/register">
                  Start Growing &mdash; It&apos;s Free
                  <ArrowRight className="ml-1.5 size-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-[#4CAF50] px-8 text-lg font-bold text-[#4CAF50] hover:bg-[#E8F5E9] focus-visible:ring-2 focus-visible:ring-[#4CAF50]"
              >
                <Link href="/quran">
                  <BookOpen className="mr-1.5 size-5" />
                  Explore the Mushaf
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── How the Garden Works ──────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-balance text-3xl font-extrabold lg:text-4xl">
              How the Garden Works
            </h2>
            <p className="text-lg font-medium text-[#666680]">
              Four simple steps from seed to paradise
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className={`relative rounded-2xl border-2 ${step.border} ${step.bg} p-6 transition-transform hover:-translate-y-1`}
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-white text-lg font-extrabold text-[#1A1A2E] shadow-sm">
                  {step.num}
                </div>
                <div className={`mb-3 ${step.iconColor}`}>
                  <step.icon className="size-8" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold">{step.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-[#666680]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Surah Tree Showcase ──────────────────────────────────── */}
      <section className="bg-[#F9FBF9] py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-balance text-3xl font-extrabold lg:text-4xl">
              Your Surah Trees
            </h2>
            <p className="text-lg font-medium text-[#666680]">
              Every surah is a unique tree. From tiny bonsai to massive oaks.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SHOWCASE_TREES.map((tree) => (
              <div
                key={tree.name}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Color bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${tree.color}`} />

                {/* Level-up badge */}
                {tree.levelUp && (
                  <div className="absolute right-3 top-5 rounded-full bg-[#FF9800] px-2.5 py-0.5 text-xs font-extrabold text-white">
                    Level Up!
                  </div>
                )}

                <div className="p-5">
                  {/* Progress ring */}
                  <div className="mx-auto mb-4 flex size-24 items-center justify-center">
                    <svg
                      viewBox="0 0 100 100"
                      className="size-24"
                      aria-label={`${tree.progress}% memorized`}
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#E8E8E8"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={tree.progress === 100 ? "#4CAF50" : "#FF9800"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${tree.progress * 2.64} 264`}
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-[#1A1A2E] text-xl font-extrabold"
                        style={{ fontSize: "22px", fontWeight: 800 }}
                      >
                        {tree.progress}%
                      </text>
                    </svg>
                  </div>

                  {/* Info */}
                  <h3 className="mb-0.5 text-center text-lg font-extrabold">
                    {tree.name}
                  </h3>
                  <p
                    className="mb-3 text-center text-sm text-[#666680]"
                    dir="rtl"
                  >
                    {tree.nameAr}
                  </p>

                  {/* Flower count */}
                  <div className="mb-3 flex items-center justify-center gap-1.5 text-sm font-bold text-[#FF9800]">
                    <Flower2 className="size-4" />
                    <span className="tabular-nums">
                      {tree.memorized}/{tree.totalAyahs}
                    </span>
                    <span className="font-medium text-[#666680]">flowers</span>
                  </div>

                  {/* Branches */}
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {tree.branches.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-[#E3F2FD] px-2.5 py-0.5 text-xs font-semibold text-[#1565C0]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Season */}
                  <p className="mt-3 text-center text-xs font-semibold text-[#4CAF50]">
                    {tree.season}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Garden Stats Bar ─────────────────────────────────────── */}
      <section className="bg-[#E8F5E9] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                <stat.icon className="mb-2 size-7 text-[#4CAF50]" />
                <p className="text-4xl font-extrabold tabular-nums text-[#1A1A2E]">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-[#666680]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-balance text-3xl font-extrabold lg:text-4xl">
              Packed with Superpowers
            </h2>
            <p className="text-lg font-medium text-[#666680]">
              Everything you need for serious Quran memorization
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border-2 border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div
                  className={`mb-3 inline-flex size-11 items-center justify-center rounded-xl ${feature.iconBg}`}
                >
                  <feature.icon className={`size-5 ${feature.iconColor}`} />
                </div>
                <h3 className="mb-1.5 text-base font-extrabold">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#666680]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── League Teaser ────────────────────────────────────────── */}
      <section className="bg-[#F9FBF9] py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-balance text-3xl font-extrabold lg:text-4xl">
              Climb the Quran Leagues
            </h2>
            <p className="text-lg font-medium text-[#666680]">
              Compete weekly, earn XP, and rise through five tiers
            </p>
          </div>

          <div className="flex flex-wrap items-end justify-center gap-4">
            {LEAGUES.map((league, i) => (
              <div
                key={league.name}
                className={`flex flex-col items-center rounded-2xl border-2 ${league.border} ${league.bg} p-5 transition-transform hover:-translate-y-1`}
                style={{ minWidth: "140px", paddingBottom: `${20 + i * 8}px` }}
              >
                <league.icon className={`mb-2 size-8 ${league.color}`} />
                <p className={`text-lg font-extrabold ${league.color}`}>
                  {league.name}
                </p>
                <p className="text-xs font-semibold text-[#666680]">
                  {league.subtitle}
                </p>
                <p className="mt-2 rounded-full bg-white/80 px-3 py-0.5 text-xs font-bold text-[#1A1A2E]">
                  {league.tier}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quranic Quote ────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl border-2 border-[#FFE082] bg-[#FFF8E1] p-8 text-center lg:p-12">
            <p
              className="mb-4 text-2xl font-bold leading-relaxed text-[#1A1A2E] lg:text-3xl"
              dir="rtl"
              lang="ar"
            >
              {
                "\u0648\u064E\u0644\u064E\u0642\u064E\u062F\u0652 \u064A\u064E\u0633\u064E\u0651\u0631\u0652\u0646\u064E\u0627 \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E \u0644\u0650\u0644\u0630\u064E\u0651\u0643\u0652\u0631\u0650 \u0641\u064E\u0647\u064E\u0644\u0652 \u0645\u0650\u0646 \u0645\u064F\u062F\u064E\u0651\u0643\u0650\u0631\u064D"
              }
            </p>
            <p className="text-base font-medium text-[#666680]">
              &ldquo;And We have certainly made the Quran easy for remembrance,
              so is there any who will remember?&rdquo;
            </p>
            <p className="mt-2 text-sm font-bold text-[#FF9800]">
              Surah Al-Qamar (54:17)
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <TreePine className="mx-auto mb-4 size-12 text-[#4CAF50]" />
          <h2 className="mb-3 text-balance text-3xl font-extrabold lg:text-4xl">
            Your Garden is Waiting
          </h2>
          <p className="mb-8 text-lg font-medium text-[#666680]">
            Start with just one verse. Watch your first flower bloom today.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#4CAF50] px-8 text-lg font-extrabold text-white shadow-lg shadow-[#4CAF50]/30 hover:bg-[#43A047] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-2"
            >
              <Link href="/register">
                Plant Your First Seed
                <ChevronRight className="ml-1 size-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-[#FF9800] px-8 text-lg font-bold text-[#FF9800] hover:bg-[#FFF3E0] focus-visible:ring-2 focus-visible:ring-[#FF9800]"
            >
              <Link href="/quran">
                Browse the Quran
                <ArrowRight className="ml-1 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#4CAF50]">
              <TreePine className="size-4 text-white" />
            </div>
            <span className="font-extrabold">QuranMemorizer</span>
          </div>
          <p className="text-sm font-medium text-[#666680]">
            Built for the Ummah. Free forever.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-[#666680]">
            <Link
              href="/quran"
              className="hover:text-[#4CAF50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50] rounded"
            >
              Read
            </Link>
            <Link
              href="/memorize"
              className="hover:text-[#4CAF50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50] rounded"
            >
              Memorize
            </Link>
            <Link
              href="/listen"
              className="hover:text-[#4CAF50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50] rounded"
            >
              Listen
            </Link>
            <Link
              href="/progress"
              className="hover:text-[#4CAF50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50] rounded"
            >
              Progress
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
