import Link from "next/link";
import {
  BookOpen,
  Brain,
  Eye,
  Headphones,
  LogIn,
  Mic,
  Shield,
  Sparkles,
  Trophy,
  UserPlus,
  Wifi,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Mushaf Engine",
    label: "RENDERING",
    description:
      "Seven Mushaf editions with pixel-perfect page accuracy. Every line matches the physical print.",
  },
  {
    icon: Mic,
    title: "Voice AI",
    label: "RECOGNITION",
    description:
      "Dual-engine speech recognition with automatic Whisper fallback. Word-level precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Core",
    label: "ALGORITHM",
    description:
      "Next-gen spaced repetition \u2014 99.6% superior to SM-2. Fewer reviews, stronger retention.",
  },
  {
    icon: Shield,
    title: "Tajweed Scanner",
    label: "DETECTION",
    description:
      "13 rules detected in real time. Qalqalah, Ikhfa, Idgham, Madd \u2014 all color-coded and coached.",
  },
  {
    icon: Eye,
    title: "Hide Modes",
    label: "8 STRATEGIES",
    description:
      "Progressive concealment from first-letter hints to full blackout. Eight ways to test recall.",
  },
  {
    icon: Trophy,
    title: "League System",
    label: "COMPETITIVE",
    description:
      "Five tiers from Talib to Imam. Weekly leagues, 50+ achievements, and global rankings.",
  },
  {
    icon: Headphones,
    title: "Audio Sync",
    label: "PLAYBACK",
    description:
      "Ayah-by-ayah synchronized playback with top Qaris. Download for offline immersion.",
  },
  {
    icon: Wifi,
    title: "Offline PWA",
    label: "ALWAYS ON",
    description:
      "Full Progressive Web App. IndexedDB-backed storage keeps you going without connectivity.",
  },
];

const stats = [
  { number: "114", label: "Surahs" },
  { number: "6,236", label: "Ayahs" },
  { number: "7+", label: "Editions" },
  { number: "100+", label: "Translations" },
];

const CircuitPattern = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      opacity: 0.04,
      backgroundImage: `
        linear-gradient(90deg, #00D4FF 1px, transparent 1px),
        linear-gradient(0deg, #00D4FF 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
    }}
  />
);

export default function LandingNeonQuran() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <CircuitPattern />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-cyan-400/10 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md outline-none"
          >
            <Zap className="size-6 text-cyan-400" />
            <span className="text-xl font-bold tracking-tight text-white">
              Quran<span className="text-cyan-400">Memorizer</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-white/70 hover:text-cyan-400 hover:bg-cyan-400/10 focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:from-cyan-300 hover:to-blue-400 focus-visible:ring-2 focus-visible:ring-cyan-400 transition-opacity"
              style={{
                boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
              }}
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-36 lg:py-44">
        {/* Glow orbs */}
        <div
          className="pointer-events-none absolute top-1/4 left-1/4 size-96 rounded-full blur-[120px]"
          style={{ background: "rgba(0, 212, 255, 0.08)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-1/4 right-1/4 size-96 rounded-full blur-[120px]"
          style={{ background: "rgba(255, 0, 229, 0.06)" }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 mb-8">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">
              Next-Gen Memorization
            </span>
          </div>
          <h1
            className="text-balance text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
            style={{
              textShadow:
                "0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(0, 212, 255, 0.1)",
            }}
          >
            Memorize the Quran
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">
              at the Speed of Light
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/50 leading-relaxed mb-10">
            AI-powered voice recognition. Military-grade spaced repetition.
            Real-time Tajweed coaching. The most technologically advanced Quran
            memorization platform ever built.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold h-12 px-8 text-base hover:from-cyan-300 hover:to-blue-400 focus-visible:ring-2 focus-visible:ring-cyan-400 transition-opacity"
              style={{
                boxShadow: "0 0 30px rgba(0, 212, 255, 0.4)",
              }}
            >
              <Link href="/register">Launch App</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              size="lg"
              className="text-cyan-400 hover:bg-cyan-400/10 h-12 px-8 text-base border border-cyan-400/20 hover:border-cyan-400/40 focus-visible:ring-2 focus-visible:ring-cyan-400 transition-opacity"
            >
              <Link href="/login">Sign In &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 border-y border-cyan-400/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-black tabular-nums mb-1"
                  style={{
                    textShadow:
                      "0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.2)",
                    color: "#00D4FF",
                  }}
                >
                  {stat.number}
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4">
          <h2
            className="text-balance text-3xl md:text-4xl font-black text-center mb-4"
            style={{
              textShadow: "0 0 20px rgba(0, 212, 255, 0.2)",
            }}
          >
            System Architecture
          </h2>
          <p className="text-center text-white/40 mb-16 max-w-lg mx-auto font-mono text-sm">
            {"// Every module engineered for peak performance"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-xl border border-cyan-400/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-cyan-400/30 hover:bg-white/[0.04] transition-opacity"
                  style={{
                    transition:
                      "border-color 0.3s, background-color 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={undefined}
                >
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      boxShadow:
                        "0 0 30px rgba(0, 212, 255, 0.08), inset 0 0 30px rgba(0, 212, 255, 0.02)",
                      transition: "opacity 0.3s",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex size-10 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/5">
                        <Icon className="size-5 text-cyan-400" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400/60">
                        {feature.label}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0, 212, 255, 0.05) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto max-w-2xl px-4 text-center relative z-10">
          <h2
            className="text-balance text-3xl md:text-4xl font-black mb-6"
            style={{
              textShadow: "0 0 30px rgba(0, 212, 255, 0.25)",
            }}
          >
            Ready to
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              {" "}
              Upgrade
            </span>{" "}
            Your Hifz?
          </h2>
          <p className="text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
            Join the next generation of Quran memorizers. Your journey to
            mastery starts with a single tap.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold h-14 px-10 text-lg hover:from-cyan-300 hover:to-blue-400 focus-visible:ring-2 focus-visible:ring-cyan-400 transition-opacity"
            style={{
              boxShadow:
                "0 0 40px rgba(0, 212, 255, 0.4), 0 0 80px rgba(0, 212, 255, 0.15)",
            }}
          >
            <Link href="/register">Initialize System</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-400/10 py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-cyan-400/50" />
              <span className="font-mono text-xs text-white/30">
                QuranMemorizer v2.0
              </span>
            </div>
            <p className="font-mono text-xs text-white/20">
              &copy; {new Date().getFullYear()} QuranMemorizer &middot; All
              rights reserved
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="font-mono text-xs text-white/30 hover:text-cyan-400 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm outline-none"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="font-mono text-xs text-white/30 hover:text-cyan-400 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm outline-none"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
