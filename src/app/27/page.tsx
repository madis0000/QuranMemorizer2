import Link from "next/link";
import {
  ArrowRight,
  Bird,
  BookOpen,
  Brain,
  Droplets,
  Flower,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Mountain,
  Repeat,
  Sparkles,
  Sprout,
  TreeDeciduous,
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

/**
 * Page 27 — "Botanical Encyclopedia"
 * Inspired by 19th-century botanical illustration journals.
 * Warm parchment tones, serif headings, specimen-card layouts,
 * annotation-style labels, and classical botanical illustration vibes.
 */

const SPECIMENS = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    blooming: 7,
    icon: Flower,
    juz: 1,
    treeType: "Wildflower Cluster",
    season: "Summer",
    branches: ["Praise", "Guidance", "Supplication"],
    classification: {
      family: "Juz 1 \u2014 Meadow Biome",
      genus: "Miniature (7 flowers)",
      species: "Devotional \u00b7 Liturgical",
    },
    progress: 100,
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    blooming: 100,
    icon: TreeDeciduous,
    juz: 1,
    treeType: "Grand Oak",
    season: "Spring",
    branches: ["Faith", "Law", "Stories", "Finance", "Jihad"],
    classification: {
      family: "Juz 1\u20133 \u2014 Forest Biome",
      genus: "Monumental (286 flowers)",
      species: "Legislative \u00b7 Narrative \u00b7 Doctrinal",
    },
    progress: 35,
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    blooming: 50,
    icon: TreePine,
    juz: 22,
    treeType: "Cypress",
    season: "Spring",
    branches: ["Resurrection", "Signs", "Creation"],
    classification: {
      family: "Juz 22\u201323 \u2014 Mountain Biome",
      genus: "Stately (83 flowers)",
      species: "Eschatological \u00b7 Cosmological",
    },
    progress: 60,
  },
  {
    name: "Ar-Rahman",
    arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
    ayahs: 78,
    blooming: 8,
    icon: Flower2,
    juz: 27,
    treeType: "Flowering Magnolia",
    season: "Spring",
    branches: ["Blessings", "Creation", "Paradise"],
    classification: {
      family: "Juz 27 \u2014 Riverside Biome",
      genus: "Ornamental (78 flowers)",
      species: "Doxological \u00b7 Aesthetic",
    },
    progress: 10,
  },
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    blooming: 3,
    icon: Sprout,
    juz: 30,
    treeType: "Tiny Bonsai",
    season: "Summer",
    branches: ["Abundance"],
    classification: {
      family: "Juz 30 \u2014 Oasis Biome",
      genus: "Miniature (3 flowers)",
      species: "Consolatory \u00b7 Devotional",
    },
    progress: 100,
  },
];

const ANATOMY_PARTS = [
  {
    label: "Canopy",
    sublabel: "Flowers = Ayahs",
    description:
      "Each memorized ayah blooms as a flower in the canopy. Overdue FSRS reviews cause petals to wilt until refreshed.",
    icon: Flower2,
  },
  {
    label: "Branches",
    sublabel: "Mawdu\u2019at = Thematic Subjects",
    description:
      "Every surah branches into its core themes \u2014 faith, law, stories, creation. Master each branch to see it thicken.",
    icon: Leaf,
  },
  {
    label: "Trunk",
    sublabel: "Overall Mastery Strength",
    description:
      "The trunk thickens as your overall mastery grows. A thick trunk means consistent, deep knowledge across the surah.",
    icon: TreePine,
  },
  {
    label: "Roots",
    sublabel: "FSRS-6 Stability Depth",
    description:
      "Roots represent how deeply your memory has stabilized. Deep roots = long-term retention that resists forgetting.",
    icon: Sprout,
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions rendered to match exact physical Mushaf proportions, page by page.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine system: Web Speech API for speed, Whisper AI for Arabic Quran precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-generation algorithm achieving 30% fewer reviews than SM-2 at higher retention.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time coaching with color-coded rule identification and animated visual guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "From first-letter hints to full blank recall \u2014 eight strategies for every learner.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five competitive tiers from Talib to Imam with weekly promotions and challenges.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah recitation with word-level sync, speed control, and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Background sync when reconnected.",
  },
];

const GARDEN_ECOLOGY = [
  {
    icon: Bird,
    label: "Visitors",
    text: "Birds and butterflies represent achievements that visit your growing trees.",
  },
  {
    icon: Droplets,
    label: "Rivers",
    text: "Similar verse connections (mutash\u0101bih\u0101t) flow as rivers between surah trees.",
  },
  {
    icon: Mountain,
    label: "30 Biomes",
    text: "Each juz unlocks a unique biome \u2014 meadow, oasis, forest, mountain, valley, riverside.",
  },
  {
    icon: Trees,
    label: "Paradise",
    text: "Complete all 114 surahs to transform your garden into Jannah \u2014 the Paradise Garden.",
  },
];

const FOOTER_LINKS = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Garden", href: "/garden" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BotanicalEncyclopediaLanding() {
  return (
    <div className="min-h-screen bg-[#FDFAF5] text-[#2C1810] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="border-b border-[#D4C5B0]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-serif text-lg italic text-[#2C1810] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none"
          >
            QuranMemorizer
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Specimens", "Anatomy", "Features"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm tracking-wide text-[#7A6B5E] transition-colors duration-200 hover:text-[#2C1810] focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-[#7A6B5E] transition-colors duration-200 hover:text-[#2C1810] focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none"
            >
              <LogIn className="size-3.5" />
              Login
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 text-sm text-[#7A6B5E] transition-colors duration-200 hover:text-[#2C1810] focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none"
            >
              <UserPlus className="size-3.5" />
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative rule */}
          <div className="mx-auto mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#D4C5B0]" />
            <Leaf className="size-4 text-[#4A7C59]" />
            <span className="h-px w-12 bg-[#D4C5B0]" />
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#8B6914]">
            A Living Botanical Collection
          </p>

          <h1 className="text-balance font-serif text-4xl leading-tight font-light text-[#2C1810] sm:text-5xl lg:text-6xl">
            A Botanical Guide
            <br />
            to Memorizing the{" "}
            <span className="italic text-[#4A7C59]">Qur&rsquo;an</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[#7A6B5E]">
            114 surahs. 114 trees. Each ayah, a flower that blooms when
            memorized and wilts when forgotten. Tend your garden with
            scientifically-backed spaced repetition, AI voice recognition, and
            real-time Tajweed coaching.
          </p>

          {/* Decorative rule */}
          <div className="mx-auto mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#D4C5B0]" />
            <Flower2 className="size-4 text-[#4A7C59]" />
            <span className="h-px w-12 bg-[#D4C5B0]" />
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#4A7C59] bg-transparent px-8 py-4 font-serif text-base text-[#4A7C59] transition-colors duration-200 hover:bg-[#4A7C59] hover:text-white focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
            >
              <Link href="/register">
                Begin Your Collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#D4C5B0] bg-transparent px-8 py-4 font-serif text-base text-[#7A6B5E] transition-colors duration-200 hover:border-[#7A6B5E] hover:text-[#2C1810] focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
            >
              <Link href="/quran">
                <BookOpen className="size-4" />
                Browse the Mushaf
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SPECIMEN CARDS ==================== */}
      <section id="specimens" className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8B6914]">
              Plate I
            </p>
            <h2 className="text-balance font-serif text-3xl font-light text-[#2C1810] sm:text-4xl">
              Selected Specimens from the Collection
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[#7A6B5E]">
              From the tiny 3-flower bonsai of Al-Kawthar to the monumental
              286-flower oak of Al-Baqarah &mdash; each surah grows as a unique
              botanical specimen in your garden.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SPECIMENS.map((specimen) => {
              const Icon = specimen.icon;
              const isComplete = specimen.progress === 100;
              return (
                <div
                  key={specimen.name}
                  className="border border-[#D4C5B0] bg-[#FDFAF5] p-6"
                >
                  {/* Header */}
                  <div className="border-b border-dashed border-[#D4C5B0] pb-4 text-center">
                    <p className="font-serif text-2xl text-[#2C1810]" dir="rtl">
                      {specimen.arabic}
                    </p>
                    <p className="mt-1 font-serif text-sm italic text-[#4A7C59]">
                      {specimen.name}
                    </p>
                  </div>

                  {/* Specimen Illustration Area */}
                  <div className="relative flex flex-col items-center justify-center py-8">
                    <Icon
                      className="size-12"
                      style={{
                        color: isComplete ? "#8B6914" : "#4A7C59",
                      }}
                    />
                    {/* Annotation labels */}
                    <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#7A6B5E]">
                        <span className="tabular-nums font-semibold text-[#2C1810]">
                          {specimen.ayahs}
                        </span>{" "}
                        ayahs
                      </span>
                      <span className="text-[10px] text-[#D4C5B0]">&bull;</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#7A6B5E]">
                        <span className="tabular-nums font-semibold text-[#2C1810]">
                          {specimen.branches.length}
                        </span>{" "}
                        branches
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] font-medium uppercase tracking-widest text-[#4A7C59]">
                      {specimen.season}
                    </p>
                  </div>

                  {/* Progress line */}
                  <div className="mb-4">
                    <div className="relative h-0.5 w-full bg-[#D4C5B0]">
                      <div
                        className="absolute top-0 left-0 h-0.5"
                        style={{
                          width: `${specimen.progress}%`,
                          backgroundColor: isComplete ? "#8B6914" : "#4A7C59",
                        }}
                      />
                      <div
                        className="absolute -top-1 size-2.5 rounded-full border border-[#FDFAF5]"
                        style={{
                          left: `${Math.min(specimen.progress, 97)}%`,
                          backgroundColor: isComplete ? "#8B6914" : "#4A7C59",
                        }}
                      />
                    </div>
                    <p className="mt-2 text-right text-[10px] tabular-nums text-[#7A6B5E]">
                      {specimen.blooming}/{specimen.ayahs} blooming
                    </p>
                  </div>

                  {/* Classification */}
                  <div className="border-t border-dashed border-[#D4C5B0] pt-4">
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-[#8B6914]">
                      Classification
                    </p>
                    <dl className="space-y-1.5 text-[11px] leading-snug">
                      <div className="flex gap-2">
                        <dt className="font-serif italic text-[#7A6B5E]">
                          Family:
                        </dt>
                        <dd className="text-[#2C1810]">
                          {specimen.classification.family}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-serif italic text-[#7A6B5E]">
                          Genus:
                        </dt>
                        <dd className="text-[#2C1810]">
                          {specimen.classification.genus}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-serif italic text-[#7A6B5E]">
                          Species:
                        </dt>
                        <dd className="text-[#2C1810]">
                          {specimen.classification.species}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== ANATOMY OF A SURAH TREE ==================== */}
      <section id="anatomy" className="px-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8B6914]">
              Plate II
            </p>
            <h2 className="text-balance font-serif text-3xl font-light text-[#2C1810] sm:text-4xl">
              Anatomy of a Surah Tree
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[#7A6B5E]">
              Every part of the tree maps to a dimension of your memorization
              journey &mdash; from the depth of your retention to the breadth of
              your thematic understanding.
            </p>
          </div>

          {/* Vertical anatomy diagram */}
          <div className="mx-auto max-w-2xl">
            {ANATOMY_PARTS.map((part, i) => {
              const Icon = part.icon;
              const isLast = i === ANATOMY_PARTS.length - 1;
              return (
                <div key={part.label} className="flex gap-6">
                  {/* Vertical connector line */}
                  <div className="flex flex-col items-center">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#D4C5B0] bg-[#FDFAF5]">
                      <Icon className="size-4 text-[#4A7C59]" />
                    </div>
                    {!isLast && (
                      <div className="w-px grow border-l border-dashed border-[#D4C5B0]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={isLast ? "pb-0" : "pb-10"}>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-[#8B6914]">
                      {part.sublabel}
                    </p>
                    <h3 className="mt-1 font-serif text-xl text-[#2C1810]">
                      {part.label}
                    </h3>
                    <p className="mt-2 max-w-md leading-relaxed text-sm text-[#7A6B5E]">
                      {part.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Garden ecology row */}
          <div className="mt-20 border-t border-[#D4C5B0] pt-12">
            <p className="mb-8 text-center text-[10px] font-semibold uppercase tracking-widest text-[#8B6914]">
              The Garden Ecology
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {GARDEN_ECOLOGY.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="text-center">
                    <Icon className="mx-auto mb-3 size-5 text-[#4A7C59]" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#2C1810]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#7A6B5E]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8B6914]">
              Plate III
            </p>
            <h2 className="text-balance font-serif text-3xl font-light text-[#2C1810] sm:text-4xl">
              Instruments &amp; Methods
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[#7A6B5E]">
              The tools your memorization garden requires &mdash; each carefully
              selected for scientific rigor and practical efficacy.
            </p>
          </div>

          <div className="grid gap-x-16 gap-y-8 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-4">
                  <div className="mt-1 flex size-2 shrink-0 items-center justify-center">
                    <div className="size-1.5 rounded-full bg-[#4A7C59]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#2C1810]">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#7A6B5E]">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== SEASONAL CYCLE ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="border border-[#D4C5B0] p-8 sm:p-12">
            <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-widest text-[#8B6914]">
              The Seasonal Cycle
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  season: "Spring",
                  state: "Active Learning",
                  desc: "New ayahs are being memorized. Flowers bud and branches extend.",
                  color: "#4A7C59",
                },
                {
                  season: "Summer",
                  state: "Peak Mastery",
                  desc: "Full bloom. Reviews are current and retention is strong.",
                  color: "#8B6914",
                },
                {
                  season: "Autumn",
                  state: "Falling Behind",
                  desc: "Overdue reviews. Flowers wilt and leaves begin to fall.",
                  color: "#B8860B",
                },
                {
                  season: "Winter",
                  state: "Inactive",
                  desc: "Prolonged absence. The tree is dormant, awaiting your return.",
                  color: "#7A6B5E",
                },
              ].map((s) => (
                <div key={s.season} className="text-center">
                  <div
                    className="mx-auto mb-3 size-3 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <p className="font-serif text-lg text-[#2C1810]">
                    {s.season}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#7A6B5E]">
                    {s.state}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#7A6B5E]">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== QURANIC QUOTE ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-2xl text-center">
          {/* Decorative rule */}
          <div className="mx-auto mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#D4C5B0]" />
            <Leaf className="size-3 text-[#4A7C59]" />
            <span className="h-px w-16 bg-[#D4C5B0]" />
          </div>

          <blockquote className="font-serif text-xl leading-relaxed font-light italic text-[#2C1810] sm:text-2xl">
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </blockquote>
          <cite className="mt-4 block font-serif text-sm italic text-[#4A7C59] not-italic">
            Surah Al-Qamar &middot; 54:17
          </cite>

          {/* Decorative rule */}
          <div className="mx-auto mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#D4C5B0]" />
            <Leaf className="size-3 text-[#4A7C59]" />
            <span className="h-px w-16 bg-[#D4C5B0]" />
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <TreeDeciduous className="mx-auto mb-6 size-10 text-[#4A7C59]" />
          <h2 className="text-balance font-serif text-3xl font-light text-[#2C1810] sm:text-4xl">
            Begin Your Collection
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-[#7A6B5E]">
            Free forever. No advertisements. No distractions. 114 surahs
            awaiting their place in the most beautiful memorization garden ever
            cultivated.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#4A7C59] bg-transparent px-8 py-4 font-serif text-base text-[#4A7C59] transition-colors duration-200 hover:bg-[#4A7C59] hover:text-white focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
            >
              <Link href="/register">
                Begin Your Collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#D4C5B0] bg-transparent px-8 py-4 font-serif text-base text-[#7A6B5E] transition-colors duration-200 hover:border-[#7A6B5E] hover:text-[#2C1810] focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
            >
              <Link href="/quran">
                <BookOpen className="size-4" />
                Explore the Mushaf
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-[#D4C5B0] px-6 pb-10 pt-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href="/"
            className="font-serif text-sm italic text-[#4A7C59] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none"
          >
            QuranMemorizer 2.0
          </Link>

          <nav className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#7A6B5E] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-center font-serif text-xs italic text-[#D4C5B0]">
          &copy; 2026 QuranMemorizer. Cultivated with love for the Ummah.
        </p>
      </footer>
    </div>
  );
}
