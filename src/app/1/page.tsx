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
  Moon,
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
/*  Static data hoisted outside the component                         */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "Read with exact layouts matching physical Mushafs across 7+ editions including Madinah, IndoPak, and more.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud and get instant, word-level feedback powered by Web Speech API with Whisper AI fallback.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Science-backed scheduling that reduces reviews by 30% while achieving higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time Tajweed coaching with color-coded rules, audio analysis, and animated pronunciation guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall \u2014 eight distinct strategies to strengthen every memory pathway.",
  },
  {
    icon: Trophy,
    title: "50+ Achievements & Leagues",
    description:
      "Quran-themed leagues, daily challenges, streak multipliers, and a Garden of Jannah growth metaphor.",
  },
  {
    icon: Headphones,
    title: "Follow Renowned Qaris",
    description:
      "Listen ayah-by-ayah with word-level highlighting, adjustable speed, and offline audio downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device, study without internet. All data syncs seamlessly when you reconnect.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "Fluency metrics, 604-page mastery heatmap, accuracy trends, and AI-generated study recommendations.",
  },
];

const stats = [
  { value: "114", label: "Surahs" },
  { value: "6,236", label: "Ayahs" },
  { value: "7+", label: "Mushaf Editions" },
  { value: "100+", label: "Translations" },
];

const starPositions = [
  { top: "5%", left: "8%", size: "w-1 h-1", delay: "delay-0" },
  { top: "12%", left: "22%", size: "w-0.5 h-0.5", delay: "delay-100" },
  { top: "8%", left: "45%", size: "w-1.5 h-1.5", delay: "delay-300" },
  { top: "18%", left: "65%", size: "w-1 h-1", delay: "delay-500" },
  { top: "6%", left: "82%", size: "w-0.5 h-0.5", delay: "delay-700" },
  { top: "22%", left: "92%", size: "w-1 h-1", delay: "delay-200" },
  { top: "28%", left: "15%", size: "w-0.5 h-0.5", delay: "delay-1000" },
  { top: "15%", left: "55%", size: "w-1 h-1", delay: "delay-150" },
  { top: "32%", left: "78%", size: "w-1.5 h-1.5", delay: "delay-500" },
  { top: "35%", left: "35%", size: "w-0.5 h-0.5", delay: "delay-800" },
  { top: "10%", left: "70%", size: "w-1 h-1", delay: "delay-400" },
  { top: "25%", left: "5%", size: "w-1 h-1", delay: "delay-600" },
];

const footerLinks = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function CelestialNightPage() {
  return (
    <div className="min-h-screen bg-[#080F25] text-white selection:bg-amber-500/30">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080F25]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5 text-[#080F25]" />
            </div>
            <span className="text-lg font-semibold text-amber-100">
              QuranMemorizer
            </span>
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-amber-200/80 hover:text-amber-100 hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Link href="/login">
                <LogIn className="mr-1.5 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-[#080F25] shadow-lg shadow-amber-500/25 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Link href="/register">
                <UserPlus className="mr-1.5 h-4 w-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* Arabesque geometric SVG overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A84C' stroke-width='0.8'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3Cpath d='M40 12L68 40L40 68L12 40Z'/%3E%3Ccircle cx='40' cy='40' r='16'/%3E%3Cpath d='M40 0v80M0 40h80'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Bismillah watermark */}
        <div
          className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none text-[10rem] leading-none text-amber-400/[0.025] sm:text-[14rem] lg:text-[18rem]"
          dir="rtl"
          aria-hidden="true"
          style={{ fontFamily: "Amiri, serif" }}
        >
          &#xFDFD;
        </div>

        {/* Radial glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-amber-500/[0.04] blur-3xl" />

        {/* Animated star dots */}
        {starPositions.map((s, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-amber-200/80 animate-pulse ${s.size} ${s.delay}`}
            style={{ top: s.top, left: s.left }}
            aria-hidden="true"
          />
        ))}

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-36">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/[0.08] px-5 py-2 text-sm text-amber-300">
              <Moon className="h-4 w-4" />
              <span>100% free &middot; No ads &middot; Open source</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>

            {/* Main heading */}
            <h1 className="text-balance mb-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
              <span className="bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
                Memorize the Holy Quran
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                with Divine Precision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-amber-100/50 sm:text-xl">
              The world&rsquo;s most advanced Quran memorization platform
              &mdash; combining AI voice recognition, FSRS-6 spaced repetition,
              13-rule Tajweed coaching, and deep gamification in one beautiful
              experience.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-amber-500 to-amber-600 px-8 text-base font-semibold text-[#080F25] shadow-xl shadow-amber-500/25 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-amber-400 sm:text-lg"
              >
                <Link href="/register">
                  Start Your Journey
                  <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-amber-500/30 px-8 text-base text-amber-200 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-100 focus-visible:ring-2 focus-visible:ring-amber-400 sm:text-lg"
              >
                <Link href="/quran">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Open the Mushaf
                </Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="mt-20 grid grid-cols-2 gap-6 sm:gap-10 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="relative">
                  <p className="bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-3xl font-bold tabular-nums text-transparent sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-amber-200/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="relative py-24 sm:py-32">
        {/* Subtle gradient band */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.015] to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-400">
              Features
            </p>
            <h2 className="text-balance mb-4 text-3xl font-bold text-amber-100 sm:text-4xl">
              Everything You Need to Become a Hafiz
            </h2>
            <p className="mx-auto max-w-xl text-lg text-amber-200/40">
              Powered by cutting-edge AI, rooted in centuries of Islamic
              memorization tradition.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-amber-500/20 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-amber-500/[0.04]"
              >
                {/* Icon */}
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/[0.08] transition-colors group-hover:bg-amber-500/[0.15]">
                  <f.icon className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-amber-100">
                  {f.title}
                </h3>
                <p className="leading-relaxed text-amber-200/40">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SOCIAL PROOF / WHY US ==================== */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: heading + description */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-400">
                Why Choose Us
              </p>
              <h2 className="text-balance mb-6 text-3xl font-bold text-amber-100 sm:text-4xl">
                Built for the Serious Student of Quran
              </h2>
              <p className="leading-relaxed text-amber-200/40">
                No existing app combines scientifically-proven spaced
                repetition, real-time voice AI, Tajweed coaching, and
                Duolingo-level gamification into a single experience.
                QuranMemorizer is the first to do it all &mdash; and it&rsquo;s
                completely free.
              </p>
            </div>

            {/* Right: checklist */}
            <ul className="space-y-5">
              {[
                {
                  icon: Brain,
                  text: "FSRS-6 algorithm \u2014 30% fewer reviews than SM-2 for the same retention",
                },
                {
                  icon: Mic,
                  text: "Dual-engine voice AI: Web Speech + Whisper Arabic Quran model",
                },
                {
                  icon: Sparkles,
                  text: "13 Tajweed rules detected and coached in real time",
                },
                {
                  icon: Shield,
                  text: "Offline-first \u2014 study anywhere without internet",
                },
                {
                  icon: Globe,
                  text: "3 languages, 100+ translations, 7+ Mushaf editions",
                },
                {
                  icon: Award,
                  text: "Similar Verse Trainer \u2014 no competitor has this",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-amber-100/70">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative py-24 sm:py-32">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-amber-500/[0.04] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Moon className="mx-auto mb-6 h-10 w-10 text-amber-400/60" />
          <h2 className="text-balance mb-4 text-3xl font-bold text-amber-100 sm:text-4xl">
            Begin Your Journey Tonight
          </h2>
          <p className="mb-10 text-lg text-amber-200/40">
            Every great Hafiz started with a single ayah. Start yours now
            &mdash; completely free, forever.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-amber-500 to-amber-600 px-10 text-base font-semibold text-[#080F25] shadow-xl shadow-amber-500/25 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-amber-400 sm:text-lg"
            >
              <Link href="/register">
                Get Started Free
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-amber-300/60 hover:text-amber-200 hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Link href="/quran">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse the Quran
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
                <BookOpen className="h-4 w-4 text-[#080F25]" />
              </div>
              <span className="font-semibold text-amber-100">
                QuranMemorizer
              </span>
            </Link>

            {/* Links */}
            <nav
              className="flex flex-wrap items-center gap-6"
              aria-label="Footer"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-amber-200/40 transition-colors hover:text-amber-200/70 focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Tagline */}
            <p className="flex items-center gap-1.5 text-sm text-amber-200/30">
              <Star className="h-3.5 w-3.5 text-amber-500/40" />
              Made with love for the Ummah
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
