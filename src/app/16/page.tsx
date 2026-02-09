import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Globe,
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
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions rendered with exact physical Mushaf layouts &mdash; Madinah, IndoPak, and beyond.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud and receive word-level feedback via Web Speech API with Whisper AI fallback.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Science-backed scheduling achieving 30% fewer reviews with higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time color-coded coaching with audio analysis and animated pronunciation guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall &mdash; eight distinct strategies for every memory pathway.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five competitive tiers from Talib to Imam with weekly promotions and streak multipliers.",
  },
  {
    icon: Headphones,
    title: "Follow Renowned Qaris",
    description:
      "Ayah-by-ayah playback with word-level highlighting, adjustable speed, and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device, study without internet. Data syncs seamlessly when you reconnect.",
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

export default function NeumorphicSoftLanding() {
  return (
    <div className="min-h-screen bg-[#E8ECF1] text-[#3A3F47] antialiased">
      {/* ---- Sticky Nav ---- */}
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

      {/* ---- Hero ---- */}
      <section className="relative px-6 pb-24 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Large raised neumorphic plate */}
          <div className="mx-auto mb-12 max-w-3xl rounded-2xl bg-[#E8ECF1] px-10 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-[#2E3339] sm:text-5xl lg:text-6xl">
              Memorize the Quran with
              <span className="text-[#4A9E8E]"> gentle precision</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5A6068]">
              A tactile, distraction-free experience that feels as natural as
              turning pages. AI voice feedback, spaced repetition, and Tajweed
              coaching &mdash; all wrapped in a soft, focused interface
              you&rsquo;ll love returning to.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/register">
                Start Memorizing Free
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
      </section>

      {/* ---- Circular Stat Dials ---- */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="flex size-28 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[8px_8px_16px_#c8ccd1,-8px_-8px_16px_#ffffff] sm:size-32">
                <div className="flex size-20 flex-col items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] sm:size-24">
                  <span className="tabular-nums text-2xl font-bold text-[#4A9E8E] sm:text-3xl">
                    {stat.value}
                  </span>
                </div>
              </div>
              <span className="mt-3 text-sm font-medium text-[#5A6068]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Features ---- */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Every tool you need, nothing you don&rsquo;t
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#5A6068]">
              Purpose-built for Quran memorization &mdash; each feature refined
              to help you build lasting, beautiful Hifz.
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
                  {/* Inset icon circle */}
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

      {/* ---- How It Works ---- */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-14 text-center text-3xl font-bold text-[#2E3339]">
            How it works
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Choose Your Surah",
                text: "Browse the page-accurate Mushaf and select any verse or surah to begin memorizing.",
              },
              {
                step: "02",
                icon: Mic,
                title: "Recite & Review",
                text: "Use progressive hide modes, recite aloud, and get real-time Tajweed feedback from AI.",
              },
              {
                step: "03",
                icon: Zap,
                title: "Build Consistency",
                text: "FSRS-6 schedules your reviews at the perfect intervals. Streaks and leagues keep you motivated.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                    <Icon className="size-8 text-[#4A9E8E]" />
                  </div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4A9E8E]">
                    Step {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#2E3339]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5A6068]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Social Proof / Badges ---- */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-[#E8ECF1] p-10 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:p-14">
            <div className="grid items-center gap-10 sm:grid-cols-2">
              <div>
                <h2 className="text-balance text-3xl font-bold text-[#2E3339]">
                  50+ achievements to unlock
                </h2>
                <p className="mt-4 leading-relaxed text-[#5A6068]">
                  From your first completed Surah to a perfect Tajweed
                  recitation, every milestone is celebrated. Earn badges across
                  four rarity tiers &mdash; Common, Rare, Epic, and Legendary
                  &mdash; and rise through five Quran-themed league tiers.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[Award, Star, Trophy, Shield, Globe, Sparkles].map(
                  (Icon, i) => (
                    <div
                      key={i}
                      className="flex size-20 items-center justify-center rounded-2xl bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                    >
                      <Icon className="size-8 text-[#4A9E8E]" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl bg-[#E8ECF1] px-10 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Start your Hifz journey today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#5A6068]">
              Free forever. No ads. No distractions. Just you, the Quran, and
              the most thoughtful memorization tools ever built.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/register">
                  Create Free Account
                  <ChevronRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#E8ECF1] px-8 py-4 text-base font-semibold text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/quran">
                  <BarChart3 className="size-5" />
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
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
