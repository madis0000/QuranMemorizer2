import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Headphones,
  LogIn,
  Mic,
  Sparkles,
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
      "Seven editions rendered to match their physical counterparts glyph-for-glyph. Navigate the Quran exactly as it was printed.",
    accent: "border-l-emerald-400",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Dual-engine system: Web Speech API for real-time feedback, Whisper AI for precision. Every syllable heard, every mistake caught.",
    accent: "border-l-cyan-400",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "21 optimized parameters trained on 700M+ reviews. 30% fewer sessions, higher retention. The science of never forgetting.",
    accent: "border-l-purple-400",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Engine",
    description:
      "From Qalqalah to Ikhfa, every rule detected in real-time. Color-coded coaching with animated pronunciation visualizations.",
    accent: "border-l-pink-400",
  },
  {
    icon: Trophy,
    title: "Leagues & 50+ Achievements",
    description:
      "Five competitive tiers, weekly promotions, daily challenges, streak multipliers, and a Garden of Jannah that grows with your knowledge.",
    accent: "border-l-teal-400",
  },
  {
    icon: Headphones,
    title: "Immersive Audio Experience",
    description:
      "Follow world-renowned Qaris ayah-by-ayah with word-level highlighting. Adjustable speed, offline downloads, seamless playback.",
    accent: "border-l-violet-400",
  },
  {
    icon: WifiOff,
    title: "Offline-First Architecture",
    description:
      "Install as a PWA, study anywhere without internet. Seven IndexedDB stores keep everything synced when you reconnect.",
    accent: "border-l-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Deep Fluency Analytics",
    description:
      "Words per minute, pause analysis, confidence scoring, Tajweed accuracy per rule, session-over-session improvement graphs.",
    accent: "border-l-cyan-400",
  },
];

const stats = [
  { value: "114", label: "Surahs" },
  { value: "6,236", label: "Ayahs" },
  { value: "7+", label: "Mushaf Editions" },
  { value: "100+", label: "Translations" },
];

const methods = [
  {
    name: "Mauritanian Method",
    detail: "95% accuracy gate before advancing",
  },
  {
    name: "3\u00d73 Method",
    detail: "Read 3\u00d7, recite 3\u00d7, combine",
  },
  {
    name: "Sabaq System",
    detail: "Separate new, recent, and old review",
  },
  {
    name: "Similar Verse Trainer",
    detail: "Catch confusing verses before they catch you",
  },
];

export default function AuroraBorealisPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0D17] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* ============================================================= */}
      {/*  AURORA GRADIENT ORBS — decorative                             */}
      {/* ============================================================= */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {/* Emerald orb — top left */}
        <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-emerald-500/[0.08] blur-[120px]" />
        {/* Cyan orb — center */}
        <div className="absolute top-1/4 left-1/3 h-[600px] w-[600px] rounded-full bg-cyan-400/[0.10] blur-[150px]" />
        {/* Purple orb — right */}
        <div className="absolute top-10 right-0 h-[800px] w-[800px] rounded-full bg-purple-500/[0.08] blur-[140px]" />
        {/* Pink orb — bottom */}
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-500/[0.06] blur-[130px]" />
        {/* Teal orb — mid-right */}
        <div className="absolute top-[60%] right-1/4 h-[400px] w-[400px] rounded-full bg-teal-400/[0.12] blur-[100px]" />
        {/* Noise/grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />
      </div>

      {/* ============================================================= */}
      {/*  STICKY NAV                                                    */}
      {/* ============================================================= */}
      <nav className="sticky top-0 z-50 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm"
          >
            QuranMemorizer
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-xl bg-white/[0.06] border border-white/[0.10] text-white/80 hover:bg-white/[0.12] hover:text-white transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Link href="/login">
                <LogIn className="size-4" aria-hidden="true" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 border-0"
            >
              <Link href="/register">
                <UserPlus className="size-4" aria-hidden="true" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ============================================================= */}
      {/*  HERO                                                          */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 pt-28 pb-32 lg:pt-40 lg:pb-44">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.10] px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm mb-8">
            <span
              className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse"
              aria-hidden="true"
            />
            Now in Public Beta
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-tight text-balance bg-gradient-to-r from-emerald-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
            Memorize the Quran with the Power of Light
          </h1>

          <p className="mt-8 text-lg lg:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            AI voice recognition, FSRS-6 spaced repetition, 13-rule Tajweed
            coaching, and page-accurate Mushaf rendering &mdash; woven into an
            experience as beautiful as the northern lights.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-8 py-6 h-auto text-base hover:opacity-90 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 border-0"
            >
              <Link href="/register">
                Begin Your Journey
                <ChevronRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-2xl bg-white/[0.06] border border-white/[0.10] text-white/80 px-8 py-6 h-auto text-base hover:bg-white/[0.12] hover:text-white transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 backdrop-blur-sm"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  STATS — glass pills                                           */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] px-5 py-6 text-center"
            >
              <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-white/40 tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FEATURES — frosted glass cards                                */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/60 mb-4">
              Features
            </p>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-balance bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Everything You Need to Complete Your Hifz
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-8 border-l-2 ${feature.accent} hover:bg-white/[0.07] transition-opacity duration-200 group`}
                >
                  <div className="flex items-start gap-5">
                    <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] p-3 shrink-0">
                      <Icon
                        className="size-5 text-white/60 group-hover:text-white/90 transition-opacity duration-200"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white/90">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/40 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  TRADITIONAL METHODS                                           */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-10 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300/60 mb-4">
              Proven Methods
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-balance bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Centuries of Wisdom, Digitized
            </h2>
            <p className="mt-6 text-white/40 leading-relaxed max-w-2xl">
              We didn&rsquo;t invent new ways to memorize &mdash; we took the
              methods that have produced millions of Huffaz and made them
              available on every device, enhanced with AI and spaced repetition.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {methods.map((method) => (
                <div
                  key={method.name}
                  className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
                >
                  <h3 className="text-sm font-semibold text-white/80">
                    {method.name}
                  </h3>
                  <p className="mt-1 text-xs text-white/35">{method.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  QUOTE                                                         */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight text-balance bg-gradient-to-r from-emerald-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </p>
          <p className="mt-8 text-sm font-medium text-white/30 tracking-wide">
            Surah Al-Qamar &mdash; 54:17
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  CTA — intensified aurora                                      */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-24 lg:py-32">
        <div className="relative mx-auto max-w-4xl rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-12 lg:p-20 text-center overflow-hidden">
          {/* Intensified aurora behind CTA */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute -top-20 left-1/4 h-[300px] w-[300px] rounded-full bg-emerald-500/[0.15] blur-[80px]" />
            <div className="absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/[0.15] blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[400px] rounded-full bg-cyan-400/[0.12] blur-[60px]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-balance bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Your Hifz Journey Starts Here
            </h2>
            <p className="mt-6 text-white/40 max-w-lg mx-auto">
              Join thousands of Muslims using science-backed technology to
              memorize the Book of Allah. Free forever.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-10 py-6 h-auto text-base hover:opacity-90 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 border-0"
              >
                <Link href="/register">
                  Create Free Account
                  <ChevronRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-white/25">
              No credit card required &mdash; works on any device
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FOOTER                                                        */}
      {/* ============================================================= */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            &copy; 2026 QuranMemorizer &mdash; Built for the Ummah
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="text-xs text-white/25 hover:text-white/50 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-xs text-white/25 hover:text-white/50 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
