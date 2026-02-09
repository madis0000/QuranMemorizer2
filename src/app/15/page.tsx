import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Headphones,
  LogIn,
  Mic,
  Repeat,
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
      "Seven editions rendered with glyph-level fidelity. Navigate by page, surah, or juz \u2014 exactly as it was printed.",
    borderColor: "border-l-rose-400",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Dual-engine: Web Speech API for speed, Whisper AI for precision. Word-level accuracy with three sensitivity levels.",
    borderColor: "border-l-amber-400",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "21 parameters trained on 700M+ reviews. 30% fewer sessions at higher retention \u2014 the math of never forgetting.",
    borderColor: "border-l-orange-400",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Engine",
    description:
      "Real-time detection from Qalqalah to Madd. Color-coded feedback, FFT audio analysis, animated coaching visuals.",
    borderColor: "border-l-violet-400",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "First letter, random blank, translation recall, audio recall, reverse, context, keyword, and full hide.",
    borderColor: "border-l-rose-400",
  },
  {
    icon: Trophy,
    title: "Leagues & 50+ Achievements",
    description:
      "Five tiers from Talib to Imam. Weekly competition, daily challenges, streak multipliers, Garden of Jannah.",
    borderColor: "border-l-amber-400",
  },
  {
    icon: Headphones,
    title: "Immersive Audio",
    description:
      "Follow renowned Qaris ayah-by-ayah with word-level sync. Adjustable speed, offline downloads, seamless playback.",
    borderColor: "border-l-orange-400",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device, study without internet. Seven IndexedDB stores keep everything synced on reconnect.",
    borderColor: "border-l-violet-400",
  },
  {
    icon: BarChart3,
    title: "Fluency Analytics",
    description:
      "Words per minute, pause analysis, confidence scoring, Tajweed accuracy per rule, session improvement tracking.",
    borderColor: "border-l-rose-400",
  },
];

const stats = [
  { value: "114", label: "Surahs" },
  { value: "6,236", label: "Ayahs" },
  { value: "7+", label: "Editions" },
  { value: "100+", label: "Translations" },
];

const methods = [
  {
    name: "Mauritanian",
    detail: "95% accuracy gate before advancing to the next verse",
  },
  {
    name: "3\u00d73 Method",
    detail: "Read three times, recite three times, combine",
  },
  {
    name: "Sabaq System",
    detail: "Separate tracks for new, recent, and old review",
  },
  {
    name: "Similar Verse Trainer",
    detail: "Detect and drill confusing verse pairs",
  },
];

export default function SunsetMiragePage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden selection:bg-amber-400/30">
      {/* ============================================================= */}
      {/*  BACKGROUND — sunset gradient + blobs                          */}
      {/* ============================================================= */}
      <div
        className="fixed inset-0 z-0 bg-gradient-to-b from-violet-950 via-purple-900 to-orange-500"
        aria-hidden="true"
      />

      {/* Floating gradient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-rose-500/[0.15] blur-[120px]" />
        <div className="absolute top-1/3 -left-20 h-[500px] w-[500px] rounded-full bg-amber-500/[0.12] blur-[100px]" />
        <div className="absolute top-[55%] right-1/4 h-[400px] w-[400px] rounded-full bg-orange-400/[0.10] blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-violet-600/[0.15] blur-[130px]" />
        <div className="absolute top-[15%] left-[55%] h-[300px] w-[300px] rounded-full bg-rose-400/[0.08] blur-[80px]" />
        {/* Decorative floating orbs */}
        <div className="absolute top-[20%] left-[10%] h-3 w-3 rounded-full bg-amber-300/30" />
        <div className="absolute top-[40%] right-[15%] h-2 w-2 rounded-full bg-rose-300/25" />
        <div className="absolute top-[65%] left-[25%] h-4 w-4 rounded-full bg-orange-300/20" />
        <div className="absolute top-[80%] right-[30%] h-2.5 w-2.5 rounded-full bg-violet-300/20" />
        <div className="absolute top-[10%] right-[40%] h-1.5 w-1.5 rounded-full bg-amber-200/30" />
        <div className="absolute top-[50%] left-[60%] h-3.5 w-3.5 rounded-full bg-rose-200/15" />
      </div>

      {/* ============================================================= */}
      {/*  STICKY NAV                                                    */}
      {/* ============================================================= */}
      <nav className="sticky top-0 z-50 bg-white/[0.06] backdrop-blur-xl border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold text-white/90 hover:text-white transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded-sm"
          >
            QuranMemorizer
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-xl bg-white/[0.08] border border-white/[0.10] text-white/80 hover:bg-white/[0.14] hover:text-white transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Link href="/login">
                <LogIn className="size-4" aria-hidden="true" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold hover:opacity-90 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 border-0"
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
      <section className="relative z-10 px-6 pt-28 pb-24 lg:pt-40 lg:pb-36">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/[0.10] px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm mb-8">
            <span
              className="inline-block size-2 rounded-full bg-amber-400 animate-pulse"
              aria-hidden="true"
            />
            Now in Public Beta
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-tight text-balance text-white"
            style={{ textShadow: "0 2px 20px rgba(251,146,60,0.3)" }}
          >
            Memorize the Quran in the Light of Knowledge
          </h1>

          <p className="mt-8 text-lg lg:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            AI voice recognition, FSRS-6 spaced repetition, real-time Tajweed
            coaching, and page-accurate Mushaf rendering &mdash; all woven into
            an experience as warm and inviting as a sunset horizon.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold px-8 py-6 h-auto text-base hover:opacity-90 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 border-0"
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
              className="rounded-2xl bg-white/[0.08] border border-white/[0.10] text-white/80 px-8 py-6 h-auto text-base hover:bg-white/[0.14] hover:text-white transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 backdrop-blur-sm"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  STATS — warm glass circles                                    */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 pb-20">
        <div className="mx-auto max-w-3xl grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative flex flex-col items-center justify-center rounded-full aspect-square bg-white/[0.06] backdrop-blur-xl border border-white/[0.10]"
              style={{ boxShadow: "0 0 40px rgba(251,146,60,0.08)" }}
            >
              <p className="text-3xl lg:text-4xl font-bold text-white tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] font-medium text-white/40 tracking-widest uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FEATURES — warm glass cards                                   */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300/60 mb-4">
              Features
            </p>
            <h2
              className="text-3xl lg:text-5xl font-bold tracking-tight text-balance text-white"
              style={{ textShadow: "0 2px 15px rgba(251,146,60,0.2)" }}
            >
              Everything for Your Hifz Journey
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-7 border-l-2 ${feature.borderColor} hover:bg-white/[0.10] transition-opacity duration-200 group`}
                >
                  <div className="rounded-xl bg-white/[0.08] border border-white/[0.08] p-3 w-fit mb-5">
                    <Icon
                      className="size-5 text-white/50 group-hover:text-white/80 transition-opacity duration-200"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-white/90">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/35 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  TRADITIONAL METHODS                                           */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div
            className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-10 lg:p-16 overflow-hidden relative"
            style={{ boxShadow: "0 0 80px rgba(251,146,60,0.06)" }}
          >
            {/* Warm glow inside card */}
            <div
              className="absolute -bottom-20 -right-20 h-[200px] w-[200px] rounded-full bg-amber-500/[0.10] blur-[60px] pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300/60 mb-4">
                Proven Methods
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold tracking-tight text-balance text-white"
                style={{ textShadow: "0 2px 15px rgba(244,63,94,0.2)" }}
              >
                Centuries of Wisdom, Enhanced by Science
              </h2>
              <p className="mt-6 text-white/40 leading-relaxed max-w-2xl">
                The methods that produced millions of Huffaz &mdash; now
                available on every device, layered with FSRS-6 spaced repetition
                and AI-powered feedback. Choose your tradition; the system
                adapts.
              </p>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {methods.map((method) => (
                  <div
                    key={method.name}
                    className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-5 hover:bg-white/[0.08] transition-opacity duration-200"
                  >
                    <h3 className="text-sm font-semibold text-white/80">
                      {method.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/30">
                      {method.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  QUOTE                                                         */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight text-balance text-white"
            style={{ textShadow: "0 2px 20px rgba(251,146,60,0.25)" }}
          >
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </p>
          <p className="mt-8 text-sm font-medium text-white/30 tracking-wide">
            Surah Al-Qamar &mdash; 54:17
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  CTA — intensified sunset                                      */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28">
        <div className="relative mx-auto max-w-4xl rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-12 lg:p-20 text-center overflow-hidden">
          {/* Intensified sunset glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute -top-16 left-1/4 h-[250px] w-[250px] rounded-full bg-rose-500/[0.18] blur-[70px]" />
            <div className="absolute -bottom-16 right-1/4 h-[250px] w-[250px] rounded-full bg-amber-500/[0.18] blur-[70px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[180px] w-[350px] rounded-full bg-orange-400/[0.12] blur-[50px]" />
          </div>
          <div className="relative z-10">
            <h2
              className="text-3xl lg:text-5xl font-bold tracking-tight text-balance text-white"
              style={{ textShadow: "0 2px 20px rgba(251,146,60,0.3)" }}
            >
              Your Hifz Journey Begins at Dawn
            </h2>
            <p className="mt-6 text-white/40 max-w-lg mx-auto leading-relaxed">
              Join thousands of Muslims using science-backed technology to
              memorize the Book of Allah. Free forever. Available on every
              device.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold px-10 py-6 h-auto text-base hover:opacity-90 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 border-0"
              >
                <Link href="/register">
                  Create Free Account
                  <ChevronRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-white/20">
              No credit card required &mdash; works on any device
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FOOTER                                                        */}
      {/* ============================================================= */}
      <footer className="relative z-10 border-t border-white/[0.08] px-6 py-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; 2026 QuranMemorizer &mdash; Built for the Ummah
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="text-xs text-white/20 hover:text-white/40 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded-sm"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-xs text-white/20 hover:text-white/40 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
