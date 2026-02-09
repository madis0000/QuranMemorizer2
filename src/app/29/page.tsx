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

const heroStats = [
  { value: "114", label: "Living Trees" },
  { value: "6,236", label: "Glowing Flowers" },
  { value: "30", label: "Biomes" },
  { value: "\u221E", label: "Blessings" },
];

const surahTrees = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    bloomed: 7,
    progress: 100,
    season: "summer",
    seasonColor: "#FFD700",
    branches: ["Praise", "Guidance", "Prayer"],
    mastered: true,
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    bloomed: 102,
    progress: 36,
    season: "spring",
    seasonColor: "#00E5A0",
    branches: ["Faith", "Law", "Stories", "Finance"],
    mastered: false,
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    bloomed: 50,
    progress: 60,
    season: "spring",
    seasonColor: "#00E5A0",
    branches: ["Resurrection", "Signs", "Creation"],
    mastered: false,
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    bloomed: 12,
    progress: 15,
    season: "winter",
    seasonColor: "#00B8D4",
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
    seasonColor: "#FFD700",
    branches: ["Abundance"],
    mastered: true,
  },
];

const treeAnatomy = [
  {
    icon: Sprout,
    label: "Roots",
    color: "#00E5A0",
    description:
      "FSRS stability \u2014 deeper roots mean stronger, longer-lasting memory",
  },
  {
    icon: TreePine,
    label: "Trunk",
    color: "#00E5A0",
    description:
      "Overall mastery level \u2014 grows thicker with consistent practice",
  },
  {
    icon: Leaf,
    label: "Branches",
    color: "#00E5A0",
    description:
      "Thematic subjects (mawdu\u2019at) \u2014 each theme is a living branch",
  },
  {
    icon: Flower2,
    label: "Flowers",
    color: "#FFD700",
    description:
      "One per ayah \u2014 blooms when memorized, wilts when review is overdue",
  },
  {
    icon: Droplets,
    label: "Rivers",
    color: "#00B8D4",
    description:
      "Similar verse connections \u2014 flowing between related surah trees",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts. Every page matches the printed Mushaf.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Quran-specific precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen scheduling. 30% fewer reviews for higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "First-letter hints to full recall. Eight strategies for every memory pathway.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions and daily challenges.",
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

const footerLinks = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Tajweed", href: "/tajweed" },
  { label: "Garden", href: "/garden" },
];

const navAnchors = ["Forest", "Anatomy", "Features"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DarkEnchantedForestLanding() {
  return (
    <div className="min-h-screen bg-[#080F0B] text-[#E8F0EC] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-[#00E5A0]/10 bg-[#080F0B]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-light tracking-wide text-[#00E5A0] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
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
                className="text-sm font-light tracking-wide text-[#6B8B7B] transition-colors duration-200 hover:text-[#00E5A0] focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="border border-[#00E5A0]/10 bg-transparent px-4 py-2 text-sm font-light text-[#E8F0EC] transition-colors duration-200 hover:border-[#00E5A0]/30 hover:bg-[#00E5A0]/5 hover:text-[#00E5A0] focus-visible:ring-2 focus-visible:ring-[#00E5A0]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-5 py-2 text-sm font-medium text-[#00E5A0] shadow-[0_0_20px_rgba(0,229,160,0.15)] transition-all duration-200 hover:bg-[#00E5A0]/20 hover:shadow-[0_0_30px_rgba(0,229,160,0.25)] focus-visible:ring-2 focus-visible:ring-[#00E5A0]"
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
        {/* Ambient glow orb */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.06) 0%, rgba(0,229,160,0.02) 30%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        {/* Secondary golden orb */}
        <div
          className="pointer-events-none absolute right-1/4 top-1/2"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255,215,0,0.03) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Tagline */}
          <div className="mb-8 inline-flex items-center gap-2 border border-[#00E5A0]/20 bg-[#00E5A0]/5 px-5 py-2 rounded-full">
            <Sparkles
              className="size-3.5 text-[#00E5A0]"
              style={{ filter: "drop-shadow(0 0 4px rgba(0,229,160,0.5))" }}
            />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#00E5A0]">
              Bioluminescent Quran Garden
            </span>
          </div>

          <h1 className="text-balance text-4xl font-extralight leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Your Quran Garden
            <br />
            <span
              className="font-light text-[#00E5A0]"
              style={{ textShadow: "0 0 40px rgba(0,229,160,0.3)" }}
            >
              Glows in the Dark
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-[#6B8B7B]">
            114 surahs become 114 living trees. 6,236 ayahs become 6,236
            luminous flowers. Watch your personal forest come alive &mdash;
            powered by AI voice recognition, FSRS-6 spaced repetition, and
            real-time Tajweed coaching.
          </p>

          {/* Single CTA with arrow */}
          <div className="mt-10">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 text-lg font-light text-[#00E5A0] transition-all duration-300 hover:gap-4 focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
              style={{ textShadow: "0 0 20px rgba(0,229,160,0.4)" }}
            >
              Enter the Enchanted Forest
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="tabular-nums text-3xl font-extralight text-[#00E5A0]"
                  style={{ textShadow: "0 0 20px rgba(0,229,160,0.3)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-[#6B8B7B]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SURAH TREES ==================== */}
      <section id="forest" className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              THE ENCHANTED FOREST
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every surah, a{" "}
              <span
                className="text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.2)" }}
              >
                glowing tree
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#6B8B7B]">
              From a tiny 3-flower bonsai (Al-Kawthar) to a towering 286-flower
              oak (Al-Baqarah). Mastered trees radiate golden light.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {surahTrees.map((tree) => {
              const glowColor = tree.mastered ? "#FFD700" : "#00E5A0";
              const glowShadow = tree.mastered
                ? "0 0 20px rgba(255,215,0,0.2)"
                : "0 0 20px rgba(0,229,160,0.15)";
              const ringOpacity = tree.progress / 100;

              return (
                <div
                  key={tree.name}
                  className="relative rounded-2xl border border-[#00E5A0]/10 bg-[#0F1A14] p-6"
                  style={{ boxShadow: glowShadow }}
                >
                  {/* Glowing progress ring */}
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
                        stroke={glowColor}
                        strokeOpacity={0.1}
                        strokeWidth="3"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke={glowColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${tree.progress * 2.64} ${264 - tree.progress * 2.64}`}
                        style={{
                          filter: `drop-shadow(0 0 ${6 + ringOpacity * 8}px ${glowColor})`,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className="tabular-nums text-xl font-light"
                        style={{
                          color: glowColor,
                          textShadow: `0 0 12px ${glowColor}`,
                        }}
                      >
                        {tree.bloomed}
                      </span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-[#6B8B7B]">
                        flowers
                      </span>
                    </div>
                  </div>

                  {/* Surah name */}
                  <div className="text-center">
                    <p className="text-xl font-light text-[#E8F0EC]" dir="rtl">
                      {tree.arabic}
                    </p>
                    <p className="mt-0.5 text-xs font-light text-[#6B8B7B]">
                      {tree.name}
                    </p>
                  </div>

                  {/* Branch tags */}
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {tree.branches.map((branch) => (
                      <span
                        key={branch}
                        className="rounded-full border border-[#00E5A0]/20 px-2.5 py-0.5 text-[9px] font-medium text-[#6B8B7B]"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>

                  {/* Season */}
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        backgroundColor: tree.seasonColor,
                        boxShadow: `0 0 6px ${tree.seasonColor}`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#6B8B7B]">
                      {tree.season}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== BIOLUMINESCENT METAPHOR ==================== */}
      <section id="anatomy" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
              TREE ANATOMY
            </p>
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Every part of the tree has meaning
            </h2>
          </div>

          <div className="rounded-2xl border border-[#00E5A0]/10 bg-[#0F1A14] p-8 sm:p-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {treeAnatomy.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center">
                      <Icon
                        className="size-6"
                        style={{
                          color: item.color,
                          filter: `drop-shadow(0 0 8px ${item.color})`,
                        }}
                      />
                    </div>
                    <h3
                      className="mb-2 text-sm font-medium"
                      style={{
                        color: item.color,
                        textShadow: `0 0 10px ${item.color}40`,
                      }}
                    >
                      {item.label}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Visual separator */}
            <div
              className="my-10 h-px bg-gradient-to-r from-transparent via-[#00E5A0]/20 to-transparent"
              aria-hidden="true"
            />

            {/* Biome + bird info */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <Bird
                  className="mt-1 size-5 shrink-0 text-[#FFD700]"
                  style={{ filter: "drop-shadow(0 0 6px rgba(255,215,0,0.4))" }}
                />
                <div>
                  <h3
                    className="mb-1 text-sm font-medium text-[#FFD700]"
                    style={{ textShadow: "0 0 10px rgba(255,215,0,0.3)" }}
                  >
                    Birds &amp; Butterflies
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                    Achievements manifest as luminous creatures visiting your
                    trees. Rare badges bring exotic visitors. Your forest teems
                    with life as you grow.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Trees
                  className="mt-1 size-5 shrink-0 text-[#00E5A0]"
                  style={{ filter: "drop-shadow(0 0 6px rgba(0,229,160,0.4))" }}
                />
                <div>
                  <h3
                    className="mb-1 text-sm font-medium text-[#00E5A0]"
                    style={{ textShadow: "0 0 10px rgba(0,229,160,0.3)" }}
                  >
                    30 Biomes &rarr; Paradise
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
                    Each juz unlocks a biome: meadow, oasis, forest, mountain,
                    valley. Complete all 30 and your garden transforms into
                    Jannah &mdash; the Paradise Garden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#00E5A0]">
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
                    className="flex size-2.5 rounded-full bg-[#00E5A0]"
                    style={{ boxShadow: "0 0 8px rgba(0,229,160,0.5)" }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-[#E8F0EC]">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-[#6B8B7B]">
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
            className="text-xl font-extralight italic leading-relaxed text-[#00E5A0]/80 sm:text-2xl"
            style={{ textShadow: "0 0 30px rgba(0,229,160,0.15)" }}
          >
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </blockquote>
          <cite className="mt-6 block text-xs font-medium uppercase tracking-[0.2em] text-[#6B8B7B] not-italic">
            Surah Al-Qamar &middot; 54:17
          </cite>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="rounded-2xl border border-[#00E5A0]/30 bg-[#0F1A14] px-8 py-14 sm:px-12"
            style={{ boxShadow: "0 0 40px rgba(0,229,160,0.08)" }}
          >
            <Flower2
              className="mx-auto mb-6 size-10 text-[#00E5A0]"
              style={{ filter: "drop-shadow(0 0 12px rgba(0,229,160,0.5))" }}
            />
            <h2 className="text-balance text-3xl font-extralight tracking-tight sm:text-4xl">
              Your paradise begins with a{" "}
              <span
                className="text-[#00E5A0]"
                style={{ textShadow: "0 0 20px rgba(0,229,160,0.3)" }}
              >
                single seed
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-[#6B8B7B]">
              Free forever. No ads. No distractions. 114 surahs waiting to
              become 114 luminous trees in the most enchanted memorization
              forest ever imagined.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="border border-[#00E5A0]/40 bg-[#00E5A0]/15 px-8 py-4 text-base font-light text-[#00E5A0] shadow-[0_0_20px_rgba(0,229,160,0.2)] transition-all duration-300 hover:bg-[#00E5A0]/25 hover:shadow-[0_0_30px_rgba(0,229,160,0.35)] focus-visible:ring-2 focus-visible:ring-[#00E5A0]"
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
                className="border border-[#00E5A0]/10 bg-transparent px-8 py-4 text-base font-light text-[#E8F0EC] transition-colors duration-200 hover:border-[#00E5A0]/20 hover:bg-[#00E5A0]/5 focus-visible:ring-2 focus-visible:ring-[#00E5A0]"
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
      <footer className="border-t border-[#00E5A0]/10 px-6 pb-10 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-[#00E5A0] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
            >
              <Trees className="size-4" />
              QuranMemorizer 2.0
            </Link>
            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-light text-[#6B8B7B] transition-colors duration-200 hover:text-[#00E5A0] focus-visible:ring-2 focus-visible:ring-[#00E5A0] focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="mt-6 text-center text-[10px] font-light tracking-wide text-[#6B8B7B]/50">
            &copy; 2026 QuranMemorizer. Built with love for the Ummah.
          </p>
        </div>
      </footer>
    </div>
  );
}
