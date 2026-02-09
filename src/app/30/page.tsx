import Link from "next/link";
import {
  ArrowRight,
  Bird,
  BookOpen,
  Brain,
  Droplets,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Repeat,
  Sparkles,
  Sprout,
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
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    bloomed: 7,
    progress: 100,
    season: "summer",
    branches: ["Praise", "Guidance", "Supplication"],
    mastered: true,
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    bloomed: 98,
    progress: 34,
    season: "spring",
    branches: ["Faith", "Law", "Stories", "Finance", "Jihad"],
    mastered: false,
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    bloomed: 50,
    progress: 60,
    season: "spring",
    branches: ["Resurrection", "Signs", "Creation"],
    mastered: false,
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    bloomed: 8,
    progress: 10,
    season: "winter",
    branches: ["Blessings", "Creation", "Paradise"],
    mastered: false,
  },
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    bloomed: 3,
    progress: 100,
    season: "summer",
    branches: ["Abundance"],
    mastered: true,
  },
];

const growthStory = [
  {
    title: "The Seed",
    text: "It begins with a single ayah. You hear the words, you repeat them, you plant a seed in your memory. The FSRS-6 algorithm watches quietly, calibrating the perfect moment to ask you again. The seed takes root in soil only you can see.",
    wash: "bg-gradient-to-br from-[#C5D5C0]/30 via-transparent to-[#E8D5B8]/10",
  },
  {
    title: "The Sprouting",
    text: "Days pass. Your tree begins to show itself \u2014 tiny branches for each theme the surah explores, small buds where ayahs wait to bloom. You return to review, and a flower opens. Then another. Your tree is unmistakably alive now.",
    wash: "bg-gradient-to-br from-[#E8D5B8]/25 via-transparent to-[#C5D5C0]/15",
  },
  {
    title: "The Flowering",
    text: "Dozens of flowers now. Birds visit your tree \u2014 each one an achievement you\u2019ve earned. Rivers of light connect your tree to others where similar verses live. Your garden is becoming an ecosystem, rich and interconnected.",
    wash: "bg-gradient-to-br from-[#C5D5C0]/20 via-[#E8D5B8]/10 to-transparent",
  },
  {
    title: "The Paradise",
    text: "One hundred and fourteen trees. Thirty biomes. Every flower in bloom, every river flowing, every bird singing. Your garden transforms into something that can only be called one thing \u2014 Jannah. The Paradise Garden, earned one ayah at a time.",
    wash: "bg-gradient-to-br from-[#E8D5B8]/30 via-[#C5D5C0]/15 to-transparent",
  },
];

const gardenLayers = [
  {
    icon: Sprout,
    label: "Roots",
    color: "#5C8A6A",
    description:
      "FSRS stability anchors your memory. Deeper roots mean stronger, longer-lasting recall that withstands time.",
    wash: "bg-gradient-to-br from-[#C5D5C0]/25 via-transparent to-transparent",
  },
  {
    icon: Leaf,
    label: "Branches",
    color: "#5C8A6A",
    description:
      "Thematic subjects become living branches. Each surah\u2019s themes grow organically from its trunk.",
    wash: "bg-gradient-to-r from-[#E8D5B8]/20 via-transparent to-[#C5D5C0]/15",
  },
  {
    icon: Flower2,
    label: "Flowers",
    color: "#B8860B",
    description:
      "One flower per ayah. They bloom when memorized and gently wilt when a review is overdue. Tend your garden.",
    wash: "bg-gradient-to-br from-[#E8D5B8]/25 via-transparent to-transparent",
  },
  {
    icon: Droplets,
    label: "Rivers",
    color: "#5C8A6A",
    description:
      "Similar verse connections flow like watercolor rivers between trees. The Mutash\u0101bih\u0101t, made visible.",
    wash: "bg-gradient-to-r from-[#C5D5C0]/20 via-transparent to-[#E8D5B8]/10",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts. Every page as it was printed.",
    color: "#5C8A6A",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Quran-specific precision.",
    color: "#5C8A6A",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen scheduling. 30% fewer reviews for higher retention than SM-2.",
    color: "#B8860B",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides.",
    color: "#5C8A6A",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "First-letter hints to full recall. Eight memory strategies for every learner.",
    color: "#B8860B",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions and daily challenges.",
    color: "#5C8A6A",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah following with word-level sync and offline downloads.",
    color: "#5C8A6A",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Syncs when you reconnect.",
    color: "#B8860B",
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

export default function WatercolorBloomLanding() {
  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#3A3530] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 bg-[#FBF8F3]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-serif text-xl italic text-[#5C8A6A] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#5C8A6A] focus-visible:outline-none"
          >
            QuranMemorizer
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Garden", "Story", "Features"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm text-[#8A7E75] transition-colors duration-200 hover:text-[#3A3530] focus-visible:ring-2 focus-visible:ring-[#5C8A6A] focus-visible:outline-none"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-[#8A7E75] underline-offset-4 transition-colors duration-200 hover:text-[#3A3530] hover:underline focus-visible:ring-2 focus-visible:ring-[#5C8A6A] focus-visible:outline-none"
            >
              <LogIn className="size-3.5" />
              Login
            </Link>
            <Button
              asChild
              className="rounded-full bg-[#5C8A6A] px-5 py-2 text-sm font-medium text-white transition-opacity duration-200 hover:bg-[#5C8A6A] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#5C8A6A]"
            >
              <Link href="/register">
                <UserPlus className="size-3.5" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        {/* Watercolor wash behind hero */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C5D5C0]/30 via-transparent to-[#E8D5B8]/20"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-balance font-serif text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl">
            Where every verse blooms into{" "}
            <em className="text-[#5C8A6A]">something beautiful</em>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-loose text-[#8A7E75]">
            114 surahs become 114 living trees. Each ayah, a flower that opens
            when you memorize it &mdash; tended by AI, nourished by science,
            grown with love.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#5C8A6A] px-8 py-4 text-base font-medium text-white transition-opacity duration-200 hover:bg-[#5C8A6A] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#5C8A6A]"
            >
              <Link href="/register">
                <Sprout className="size-5" />
                Plant your first seed
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full px-8 py-4 text-base text-[#3A3530] underline-offset-4 hover:bg-transparent hover:underline focus-visible:ring-2 focus-visible:ring-[#5C8A6A]"
            >
              <Link href="/quran">
                <BookOpen className="size-5" />
                Explore the Mushaf
              </Link>
            </Button>
          </div>

          {/* Flowing stats */}
          <div className="mx-auto mt-20 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <span className="text-center">
              <span className="tabular-nums font-serif text-3xl text-[#5C8A6A]">
                114
              </span>
              <span className="ml-1.5 text-sm text-[#8A7E75]">trees</span>
            </span>
            <span className="text-[#C5D5C0]" aria-hidden="true">
              &middot;
            </span>
            <span className="text-center">
              <span className="tabular-nums font-serif text-3xl text-[#5C8A6A]">
                6,236
              </span>
              <span className="ml-1.5 text-sm text-[#8A7E75]">flowers</span>
            </span>
            <span className="text-[#C5D5C0]" aria-hidden="true">
              &middot;
            </span>
            <span className="text-center">
              <span className="tabular-nums font-serif text-3xl text-[#B8860B]">
                30
              </span>
              <span className="ml-1.5 text-sm text-[#8A7E75]">biomes</span>
            </span>
          </div>
        </div>
      </section>

      {/* ==================== SURAH TREE CARDS ==================== */}
      <section id="garden" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="text-balance font-serif text-3xl sm:text-4xl">
              Every surah, a <em className="text-[#5C8A6A]">unique tree</em>
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[#8A7E75]">
              From a tiny 3-flower bonsai to a towering 286-flower oak. Each
              tree reflects the real shape of the Quran.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {surahTrees.map((tree) => {
              const progressColor = tree.mastered ? "#B8860B" : "#5C8A6A";
              const circumference = 2 * Math.PI * 36;
              const dashLength = (tree.progress / 100) * circumference;

              return (
                <div
                  key={tree.name}
                  className="rounded-3xl bg-white/60 p-6 shadow-sm"
                >
                  {/* Soft progress ring */}
                  <div className="relative mx-auto mb-4 size-20">
                    <svg
                      className="size-20 -rotate-90"
                      viewBox="0 0 80 80"
                      aria-hidden="true"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="#C5D5C0"
                        strokeOpacity={0.3}
                        strokeWidth="4"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke={progressColor}
                        strokeOpacity={0.7}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className="tabular-nums font-serif text-lg"
                        style={{ color: progressColor }}
                      >
                        {tree.bloomed}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <p
                      className="font-serif text-lg italic text-[#3A3530]"
                      dir="rtl"
                    >
                      {tree.arabic}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8A7E75]">{tree.name}</p>
                  </div>

                  {/* Branches */}
                  <p className="mt-3 text-center text-[11px] leading-relaxed text-[#5C8A6A]">
                    {tree.branches.join(", ").toLowerCase()}
                  </p>

                  {/* Season */}
                  <p className="mt-2 text-center font-serif text-[10px] italic text-[#8A7E75]">
                    {tree.season}
                  </p>

                  {/* Mastered badge */}
                  {tree.mastered && (
                    <p className="mt-2 text-center text-[10px] font-medium text-[#B8860B]">
                      in full bloom
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== GROWTH STORY ==================== */}
      <section id="story" className="px-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-16 text-center font-serif text-3xl sm:text-4xl">
            From <em className="text-[#5C8A6A]">seed</em> to{" "}
            <em className="text-[#B8860B]">paradise</em>
          </h2>

          <div className="space-y-12">
            {growthStory.map((chapter, i) => (
              <div key={chapter.title} className="relative">
                {/* Wash behind text */}
                <div
                  className={`absolute -inset-6 -z-10 rounded-[40px] ${chapter.wash}`}
                  aria-hidden="true"
                />
                <div className="px-2">
                  <h3 className="mb-3 font-serif text-xl italic text-[#3A3530]">
                    {chapter.title}
                  </h3>
                  <p className="leading-loose text-[#8A7E75]">{chapter.text}</p>
                </div>

                {/* Decorative dot separator */}
                {i < growthStory.length - 1 && (
                  <div
                    className="mt-10 flex items-center justify-center gap-2"
                    aria-hidden="true"
                  >
                    <span className="size-1.5 rounded-full bg-[#C5D5C0]" />
                    <span className="size-2 rounded-full bg-[#5C8A6A]/40" />
                    <span className="size-1.5 rounded-full bg-[#C5D5C0]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== GARDEN LAYERS ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-14 text-center font-serif text-3xl sm:text-4xl">
            Layers of a <em className="text-[#5C8A6A]">living garden</em>
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {gardenLayers.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.label}
                  className="relative overflow-hidden rounded-[40px] p-8"
                >
                  {/* Wash background */}
                  <div
                    className={`absolute inset-0 -z-10 ${layer.wash}`}
                    aria-hidden="true"
                  />
                  <div className="mb-4 flex items-center gap-3">
                    <Icon className="size-5" style={{ color: layer.color }} />
                    <h3
                      className="font-serif text-lg italic"
                      style={{ color: layer.color }}
                    >
                      {layer.label}
                    </h3>
                  </div>
                  <p className="leading-relaxed text-[#8A7E75]">
                    {layer.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Birds + Biomes note */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-[40px] p-8">
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-br from-[#E8D5B8]/20 via-transparent to-[#C5D5C0]/10"
                aria-hidden="true"
              />
              <div className="mb-4 flex items-center gap-3">
                <Bird className="size-5 text-[#B8860B]" />
                <h3 className="font-serif text-lg italic text-[#B8860B]">
                  Birds &amp; butterflies
                </h3>
              </div>
              <p className="leading-relaxed text-[#8A7E75]">
                Achievements manifest as delicate visitors to your trees. Rare
                badges bring exotic species. Your garden fills with life.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-[40px] p-8">
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-br from-[#C5D5C0]/25 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="mb-4 flex items-center gap-3">
                <Trees className="size-5 text-[#5C8A6A]" />
                <h3 className="font-serif text-lg italic text-[#5C8A6A]">
                  30 biomes
                </h3>
              </div>
              <p className="leading-relaxed text-[#8A7E75]">
                Each juz is a biome: meadow, oasis, forest, valley. Complete all
                thirty and your garden becomes Jannah &mdash; the Paradise
                Garden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-14 text-center font-serif text-3xl sm:text-4xl">
            Everything your <em className="text-[#5C8A6A]">Hifz</em> needs
          </h2>

          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <span
                  className="mt-2 size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: feature.color }}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="mb-0.5 text-sm font-medium text-[#3A3530]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#8A7E75]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== QURAN QUOTE ==================== */}
      <section className="relative px-6 pb-28">
        {/* Gold wash behind */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#E8D5B8]/30 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <blockquote className="font-serif text-2xl italic leading-relaxed text-[#3A3530] sm:text-3xl">
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </blockquote>
          <cite className="mt-6 block text-sm not-italic text-[#B8860B]">
            Surah Al-Qamar &middot; 54:17
          </cite>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative px-6 pb-28">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#C5D5C0]/15 via-transparent to-[#C5D5C0]/15"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <Flower2 className="mx-auto mb-6 size-8 text-[#5C8A6A]" />
          <h2 className="text-balance font-serif text-3xl sm:text-4xl">
            Your garden begins with a{" "}
            <em className="text-[#5C8A6A]">single verse</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[#8A7E75]">
            Free forever. No ads. No distractions. Just you, the Quran, and the
            most beautiful memorization garden ever painted.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#5C8A6A] px-8 py-4 text-base font-medium text-white transition-opacity duration-200 hover:bg-[#5C8A6A] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#5C8A6A]"
            >
              <Link href="/register">
                Plant your first seed
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full px-8 py-4 text-base text-[#3A3530] underline-offset-4 hover:bg-transparent hover:underline focus-visible:ring-2 focus-visible:ring-[#5C8A6A]"
            >
              <Link href="/quran">
                <BookOpen className="size-5" />
                Browse the Mushaf
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="px-6 pb-10 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link
              href="/"
              className="font-serif text-sm italic text-[#5C8A6A] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#5C8A6A] focus-visible:outline-none"
            >
              QuranMemorizer 2.0
            </Link>
            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-serif text-xs text-[#8A7E75] transition-colors duration-200 hover:text-[#3A3530] focus-visible:ring-2 focus-visible:ring-[#5C8A6A] focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="mt-6 text-center font-serif text-[10px] text-[#8A7E75]/50">
            &copy; 2026 QuranMemorizer. Built with love for the Ummah.
          </p>
        </div>
      </footer>
    </div>
  );
}
