import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Headphones,
  LogIn,
  Mic,
  Repeat,
  Scissors,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const palette = {
  sienna: "#A0522D",
  dustyRose: "#C08B8B",
  sage: "#8B9E7C",
  navy: "#2C3E50",
  cream: "#FFF9F0",
  warmGray: "#F0EBE3",
  paper: "#FFFCF7",
} as const;

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions rendered with exact physical layouts &mdash; Madinah, IndoPak, and beyond.",
    accent: palette.sienna,
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud and receive instant word-level feedback via Web Speech API with Whisper AI fallback.",
    accent: palette.dustyRose,
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Science-backed scheduling achieving 30% fewer reviews with higher retention than SM-2.",
    accent: palette.sage,
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time color-coded coaching with audio analysis and animated pronunciation guides.",
    accent: palette.navy,
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall &mdash; eight distinct strategies for every memory pathway.",
    accent: palette.sienna,
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five competitive tiers from Talib to Imam with weekly promotions and streak multipliers.",
    accent: palette.dustyRose,
  },
  {
    icon: Headphones,
    title: "Follow Renowned Qaris",
    description:
      "Ayah-by-ayah playback with word-level highlighting, adjustable speed, and offline downloads.",
    accent: palette.sage,
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device, study without internet. Data syncs seamlessly when you reconnect.",
    accent: palette.navy,
  },
];

const stats = [
  { value: "114", label: "Surahs" },
  { value: "6,236", label: "Ayahs" },
  { value: "7+", label: "Editions" },
  { value: "100+", label: "Translations" },
];

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Privacy", href: "#privacy" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PapercraftLayersLanding() {
  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#2C3E50] antialiased">
      {/* ---- Sticky Nav ---- */}
      <nav className="sticky top-0 z-50 border-b border-dashed border-[#A0522D]/20 bg-[#FFF9F0]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-[#A0522D] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:outline-none"
          >
            <span className="inline-flex items-center gap-2">
              <Scissors
                className="size-4 rotate-45 text-[#A0522D]/60"
                aria-hidden="true"
              />
              QuranMemorizer
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-[#2C3E50]/70 transition-opacity duration-200 hover:bg-[#A0522D]/5 hover:text-[#2C3E50] focus-visible:ring-2 focus-visible:ring-[#A0522D]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="bg-[#A0522D] text-white transition-opacity duration-200 hover:bg-[#A0522D]/80 focus-visible:ring-2 focus-visible:ring-[#A0522D]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ---- Hero with layered papers ---- */}
      <section className="relative overflow-hidden px-6 pb-28 pt-16">
        <div className="mx-auto max-w-4xl">
          {/* Background paper layers (decorative) */}
          <div className="relative">
            {/* Layer 4 - deepest */}
            <div
              className="absolute -left-4 -right-4 top-4 h-full rotate-2 rounded-2xl bg-[#E8E0D4] shadow-xl"
              aria-hidden="true"
            />
            {/* Layer 3 */}
            <div
              className="absolute -left-2 -right-2 top-2 h-full -rotate-1 rounded-2xl bg-[#F0EBE3] shadow-lg"
              aria-hidden="true"
            />
            {/* Layer 2 */}
            <div
              className="absolute -left-1 -right-1 top-1 h-full rotate-[0.5deg] rounded-2xl bg-[#F7F2EA] shadow-md"
              aria-hidden="true"
            />
            {/* Layer 1 - topmost */}
            <div className="relative rounded-2xl bg-white px-8 py-16 shadow-xl sm:px-14 sm:py-20">
              <h1 className="text-balance text-center text-4xl font-extrabold leading-tight tracking-tight text-[#2C3E50] sm:text-5xl lg:text-6xl">
                Craft your Hifz,
                <br />
                <span className="text-[#A0522D]">page by beautiful page</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-[#2C3E50]/60">
                A warm, handcrafted memorization experience that feels like your
                favorite journal. AI voice recognition, spaced repetition, and
                Tajweed coaching &mdash; wrapped in a tactile, paper-soft
                interface.
              </p>

              {/* CTA Buttons styled as tags */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="relative rounded-lg bg-[#A0522D] px-8 text-base font-semibold text-white transition-opacity duration-200 hover:bg-[#A0522D]/80 focus-visible:ring-2 focus-visible:ring-[#A0522D]"
                >
                  <Link href="/register">
                    Start Memorizing Free
                    <ChevronRight className="size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-dashed border-[#A0522D]/30 bg-transparent px-8 text-base text-[#A0522D] transition-opacity duration-200 hover:bg-[#A0522D]/5 hover:text-[#A0522D] focus-visible:ring-2 focus-visible:ring-[#A0522D]"
                >
                  <Link href="/quran">Explore the Mushaf</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stats as Postal Stamps ---- */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#A0522D]/30 bg-white p-5 shadow-md"
            >
              <span className="tabular-nums text-3xl font-bold text-[#A0522D]">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-widest text-[#2C3E50]/50">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Features as scattered papers ---- */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold text-[#2C3E50] sm:text-4xl">
              Everything you need, lovingly crafted
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#2C3E50]/50">
              Each feature is a page in your memorization journal &mdash;
              carefully designed, thoughtfully placed.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const rotation =
                index % 4 === 0
                  ? "rotate-1"
                  : index % 4 === 1
                    ? "-rotate-1"
                    : index % 4 === 2
                      ? "rotate-[0.5deg]"
                      : "-rotate-[0.5deg]";
              return (
                <div
                  key={feature.title}
                  className={`${rotation} rounded-xl bg-white p-6 shadow-lg transition-transform duration-200 hover:rotate-0`}
                >
                  {/* Accent top bar */}
                  <div
                    className="mb-5 h-1 w-12 rounded-full"
                    style={{ backgroundColor: feature.accent }}
                    aria-hidden="true"
                  />
                  <div
                    className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-dashed"
                    style={{ borderColor: `${feature.accent}40` }}
                  >
                    <Icon
                      className="size-5"
                      style={{ color: feature.accent }}
                    />
                  </div>
                  <h3
                    className="mb-2 text-lg font-bold"
                    style={{ color: feature.accent }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-[#2C3E50]/50"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Dashed divider ---- */}
      <div
        className="mx-auto max-w-4xl border-t border-dashed border-[#A0522D]/15"
        aria-hidden="true"
      />

      {/* ---- How It Works ---- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-14 text-center text-3xl font-bold text-[#2C3E50]">
            Three simple steps
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Pick Your Page",
                text: "Browse the page-accurate Mushaf and choose any surah or verse to begin.",
                accent: palette.sienna,
              },
              {
                step: "02",
                icon: Mic,
                title: "Recite & Learn",
                text: "Progressive hide modes challenge your memory while AI coaches your Tajweed.",
                accent: palette.dustyRose,
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Grow Your Garden",
                text: "FSRS-6 schedules perfect reviews. Earn achievements and watch your garden bloom.",
                accent: palette.sage,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div
                    className="mx-auto mb-5 flex size-20 items-center justify-center rounded-xl border-2 border-dashed bg-white shadow-md"
                    style={{ borderColor: `${item.accent}40` }}
                  >
                    <Icon className="size-8" style={{ color: item.accent }} />
                  </div>
                  <div
                    className="mb-2 text-xs font-bold uppercase tracking-widest"
                    style={{ color: item.accent }}
                  >
                    Step {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#2C3E50]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#2C3E50]/50">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Dashed divider ---- */}
      <div
        className="mx-auto max-w-4xl border-t border-dashed border-[#A0522D]/15"
        aria-hidden="true"
      />

      {/* ---- Achievements Showcase ---- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="-rotate-[0.3deg] rounded-2xl bg-white p-10 shadow-xl sm:p-14">
            <div className="grid items-center gap-10 sm:grid-cols-2">
              <div>
                <h2 className="text-balance text-3xl font-bold text-[#2C3E50]">
                  50+ handcrafted achievements
                </h2>
                <p className="mt-4 leading-relaxed text-[#2C3E50]/50">
                  Like pressed flowers in a journal, each milestone is
                  preserved. Four rarity tiers &mdash; Common, Rare, Epic, and
                  Legendary &mdash; mark your progress from first verse to
                  complete Hifz.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { Icon: Award, color: palette.sienna },
                  { Icon: Star, color: palette.dustyRose },
                  { Icon: Trophy, color: palette.sage },
                  { Icon: Sparkles, color: palette.navy },
                  { Icon: BarChart3, color: palette.sienna },
                  { Icon: Brain, color: palette.dustyRose },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex size-16 items-center justify-center rounded-full border-2 border-dashed bg-[#FFF9F0] sm:size-20"
                    style={{ borderColor: `${badge.color}40` }}
                  >
                    <badge.Icon
                      className="size-7"
                      style={{ color: badge.color }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {/* Background layer */}
            <div
              className="absolute -left-3 -right-3 top-3 h-full rotate-1 rounded-2xl bg-[#E8E0D4] shadow-lg"
              aria-hidden="true"
            />
            <div className="relative rounded-2xl bg-white px-8 py-14 text-center shadow-xl sm:px-14">
              <h2 className="text-balance text-3xl font-bold text-[#2C3E50] sm:text-4xl">
                Open a new page in your Hifz journey
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[#2C3E50]/50">
                Free forever. No ads. No distractions. Just you, the Quran, and
                the most lovingly crafted memorization tools you&rsquo;ll find.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#A0522D] px-8 text-base font-semibold text-white transition-opacity duration-200 hover:bg-[#A0522D]/80 focus-visible:ring-2 focus-visible:ring-[#A0522D]"
                >
                  <Link href="/register">
                    Create Free Account
                    <ChevronRight className="size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-dashed border-[#A0522D]/30 bg-transparent px-8 text-base text-[#A0522D] transition-opacity duration-200 hover:bg-[#A0522D]/5 focus-visible:ring-2 focus-visible:ring-[#A0522D]"
                >
                  <Link href="/quran">Browse the Mushaf</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-dashed border-[#A0522D]/15 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href="/"
            className="text-lg font-bold text-[#A0522D] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:outline-none"
          >
            QuranMemorizer 2.0
          </Link>
          <nav className="flex flex-wrap gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#2C3E50]/40 transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 text-center text-xs text-[#2C3E50]/30">
          &copy; 2026 QuranMemorizer. Built with love for the Ummah.
        </div>
      </footer>
    </div>
  );
}
