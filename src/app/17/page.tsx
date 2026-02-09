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
  Shield,
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

const jewelColors = {
  ruby: "#E63946",
  sapphire: "#1D3557",
  emerald: "#2D6A4F",
  amber: "#E9C46A",
  amethyst: "#7B2D8E",
} as const;

const heroWords = [
  { text: "Illuminate", color: jewelColors.ruby },
  { text: "Your", color: jewelColors.amber },
  { text: "Path", color: jewelColors.emerald },
  { text: "to", color: jewelColors.amethyst },
  { text: "Hifz", color: jewelColors.sapphire },
] as const;

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions rendered with exact physical layouts &mdash; Madinah, IndoPak, and beyond.",
    color: jewelColors.ruby,
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud and receive instant word-level feedback via Web Speech API with Whisper AI fallback.",
    color: jewelColors.sapphire,
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Science-backed scheduling achieving 30% fewer reviews with higher retention than SM-2.",
    color: jewelColors.emerald,
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time color-coded coaching with audio analysis and animated pronunciation guides.",
    color: jewelColors.amber,
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall &mdash; eight distinct strategies for every memory pathway.",
    color: jewelColors.amethyst,
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five competitive tiers from Talib to Imam with weekly promotions and streak multipliers.",
    color: jewelColors.ruby,
  },
  {
    icon: Headphones,
    title: "Follow Renowned Qaris",
    description:
      "Ayah-by-ayah playback with word-level highlighting, adjustable speed, and offline downloads.",
    color: jewelColors.sapphire,
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device, study without internet. Data syncs seamlessly when you reconnect.",
    color: jewelColors.emerald,
  },
];

const stats = [
  { value: "114", label: "Surahs", color: jewelColors.ruby },
  { value: "6,236", label: "Ayahs", color: jewelColors.emerald },
  { value: "7+", label: "Editions", color: jewelColors.amber },
  { value: "100+", label: "Translations", color: jewelColors.amethyst },
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

export default function StainedGlassLanding() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white antialiased">
      {/* ---- Sticky Nav ---- */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#1A1A2E]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-[#E9C46A] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#E9C46A] focus-visible:outline-none"
          >
            QuranMemorizer
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-white/70 transition-opacity duration-200 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#E9C46A]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="bg-[#E63946] text-white transition-opacity duration-200 hover:bg-[#E63946]/80 focus-visible:ring-2 focus-visible:ring-[#E9C46A]"
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
      <section className="relative overflow-hidden px-6 pb-24 pt-20">
        {/* Decorative rosette SVG */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            width="800"
            height="800"
            viewBox="0 0 800 800"
            className="opacity-[0.04]"
          >
            <circle
              cx="400"
              cy="400"
              r="300"
              fill="none"
              stroke="#E9C46A"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="250"
              fill="none"
              stroke="#E63946"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="200"
              fill="none"
              stroke="#2D6A4F"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="350"
              fill="none"
              stroke="#7B2D8E"
              strokeWidth="1"
            />
            <circle
              cx="250"
              cy="400"
              r="200"
              fill="none"
              stroke="#E9C46A"
              strokeWidth="0.5"
            />
            <circle
              cx="550"
              cy="400"
              r="200"
              fill="none"
              stroke="#1D3557"
              strokeWidth="0.5"
            />
            <circle
              cx="400"
              cy="250"
              r="200"
              fill="none"
              stroke="#E63946"
              strokeWidth="0.5"
            />
            <circle
              cx="400"
              cy="550"
              r="200"
              fill="none"
              stroke="#2D6A4F"
              strokeWidth="0.5"
            />
            <circle
              cx="300"
              cy="300"
              r="180"
              fill="none"
              stroke="#7B2D8E"
              strokeWidth="0.5"
            />
            <circle
              cx="500"
              cy="300"
              r="180"
              fill="none"
              stroke="#E9C46A"
              strokeWidth="0.5"
            />
            <circle
              cx="300"
              cy="500"
              r="180"
              fill="none"
              stroke="#1D3557"
              strokeWidth="0.5"
            />
            <circle
              cx="500"
              cy="500"
              r="180"
              fill="none"
              stroke="#E63946"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            {heroWords.map((word) => (
              <span
                key={word.text}
                style={{ color: word.color }}
                className="mr-4 inline-block"
              >
                {word.text}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
            Where ancient sacred beauty meets modern memorization science. AI
            voice recognition, FSRS-6 spaced repetition, and 13-rule Tajweed
            coaching &mdash; refracted through a world-class experience.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#E63946] px-8 text-base font-semibold text-white transition-opacity duration-200 hover:bg-[#E63946]/80 focus-visible:ring-2 focus-visible:ring-[#E9C46A]"
            >
              <Link href="/register">
                Begin Your Journey
                <ChevronRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/10 bg-transparent px-8 text-base text-white/80 transition-opacity duration-200 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#E9C46A]"
            >
              <Link href="/quran">Explore the Mushaf</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Lead line divider ---- */}
      <div
        className="mx-auto max-w-4xl border-t border-white/10"
        aria-hidden="true"
      />

      {/* ---- Stats ---- */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-6 text-center"
              style={{
                backgroundColor: `${stat.color}10`,
                boxShadow: `inset 0 0 30px ${stat.color}08`,
              }}
            >
              <div
                className="tabular-nums text-3xl font-bold sm:text-4xl"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Lead line divider ---- */}
      <div
        className="mx-auto max-w-4xl border-t border-white/10"
        aria-hidden="true"
      />

      {/* ---- Features (Glass Panels) ---- */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              Every facet of memorization, illuminated
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/50">
              Like light through cathedral glass &mdash; each tool reveals a
              different dimension of your Hifz journey.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border-l-4 p-6"
                  style={{
                    borderLeftColor: feature.color,
                    backgroundColor: `${feature.color}10`,
                    boxShadow: `inset 0 0 40px ${feature.color}08`,
                  }}
                >
                  <div
                    className="mb-4 flex size-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon className="size-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-white/50"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Lead line divider ---- */}
      <div
        className="mx-auto max-w-4xl border-t border-white/10"
        aria-hidden="true"
      />

      {/* ---- Memorization Methods ---- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Traditional methods, modern technology
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-white/50">
            Choose from battle-tested Islamic memorization methodologies, each
            digitized and enhanced with AI-powered feedback.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                name: "Mauritanian Method",
                desc: "Mastery gates &mdash; achieve 95%+ accuracy before advancing to the next verse.",
                color: jewelColors.ruby,
              },
              {
                name: "3x3 Method",
                desc: "Read verse 3 times, recite from memory 3 times, then combine with previous verses.",
                color: jewelColors.sapphire,
              },
              {
                name: "Ottoman Method",
                desc: "Page-by-page memorization with bi-weekly review cycles for long-term retention.",
                color: jewelColors.emerald,
              },
              {
                name: "Sabaq / Sabqi / Manzil",
                desc: "New lesson, recent review, and older review tracked separately for optimal recall.",
                color: jewelColors.amber,
              },
            ].map((method) => (
              <div
                key={method.name}
                className="rounded-xl border border-white/5 p-6"
                style={{
                  backgroundColor: `${method.color}08`,
                  boxShadow: `inset 0 0 30px ${method.color}05`,
                }}
              >
                <h3
                  className="mb-2 text-lg font-bold"
                  style={{ color: method.color }}
                >
                  {method.name}
                </h3>
                <p
                  className="text-sm leading-relaxed text-white/50"
                  dangerouslySetInnerHTML={{ __html: method.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Lead line divider ---- */}
      <div
        className="mx-auto max-w-4xl border-t border-white/10"
        aria-hidden="true"
      />

      {/* ---- Achievements showcase ---- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
            50+ achievements to illuminate your progress
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/50">
            Every milestone earns a jewel-toned badge. Four rarity tiers &mdash;
            Common, Rare, Epic, and Legendary &mdash; shine like facets of
            light.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {[
              { Icon: Star, color: jewelColors.amber },
              { Icon: Trophy, color: jewelColors.ruby },
              { Icon: Shield, color: jewelColors.sapphire },
              { Icon: Award, color: jewelColors.emerald },
              { Icon: Sparkles, color: jewelColors.amethyst },
              { Icon: BarChart3, color: jewelColors.amber },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex size-20 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${badge.color}15`,
                  boxShadow: `inset 0 0 24px ${badge.color}10, 0 0 20px ${badge.color}08`,
                }}
              >
                <badge.Icon className="size-8" style={{ color: badge.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA with merged gradient ---- */}
      <section className="px-6 py-24">
        <div
          className="mx-auto max-w-4xl rounded-2xl p-12 text-center sm:p-16"
          style={{
            background:
              "linear-gradient(135deg, #E6394610 0%, #1D355710 25%, #2D6A4F10 50%, #E9C46A10 75%, #7B2D8E10 100%)",
            boxShadow:
              "inset 0 0 60px rgba(233,196,106,0.05), inset 0 0 30px rgba(230,57,70,0.05)",
          }}
        >
          <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
            Let the light in. Start memorizing today.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/50">
            Free forever. No ads. No distractions. Just you, the Quran, and the
            most luminous memorization experience ever crafted.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#E63946] px-8 text-base font-semibold text-white transition-opacity duration-200 hover:bg-[#E63946]/80 focus-visible:ring-2 focus-visible:ring-[#E9C46A]"
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
              className="border-white/10 bg-transparent px-8 text-base text-white/80 transition-opacity duration-200 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#E9C46A]"
            >
              <Link href="/quran">Browse the Mushaf</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href="/"
            className="text-lg font-bold text-[#E9C46A] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#E9C46A] focus-visible:outline-none"
          >
            QuranMemorizer 2.0
          </Link>
          <nav className="flex flex-wrap gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/40 transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#E9C46A] focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 text-center text-xs text-white/20">
          &copy; 2026 QuranMemorizer. Built with love for the Ummah.
        </div>
      </footer>
    </div>
  );
}
