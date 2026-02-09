import Link from "next/link";
import {
  BookOpen,
  Brain,
  Crown,
  Eye,
  Headphones,
  LogIn,
  Mic,
  Shield,
  Star,
  Trophy,
  UserPlus,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "Seven authentic editions rendered with absolute fidelity. Each page mirrors its physical Mushaf down to the last diacritical mark.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Dual-engine speech processing with automatic Whisper fallback delivers word-level precision in every recitation session.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "The pinnacle of memory science \u2014 clinically proven 99.6% superiority, requiring 30% fewer reviews for lasting retention.",
  },
  {
    icon: Shield,
    title: "13-Rule Tajweed System",
    description:
      "From Qalqalah to Madd, every rule is detected, illuminated in color, and coached with scholarly precision.",
  },
  {
    icon: Eye,
    title: "Eight Progressive Modes",
    description:
      "A graduated path from gentle hints to complete concealment. Eight strategies crafted for mastery at every level.",
  },
  {
    icon: Trophy,
    title: "Achievements & Leagues",
    description:
      "Fifty distinguished achievements across five tiers. Weekly leagues from Talib to Imam honor your dedication.",
  },
  {
    icon: Headphones,
    title: "Immersive Audio",
    description:
      "Ayah-synchronized playback from renowned Qaris. Download entire collections for offline contemplation.",
  },
  {
    icon: Wifi,
    title: "Offline Excellence",
    description:
      "A complete Progressive Web App with IndexedDB persistence. Your journey continues uninterrupted, always.",
  },
];

const stats = [
  { number: "114", label: "Surahs" },
  { number: "6,236", label: "Ayahs" },
  { number: "7+", label: "Mushaf Editions" },
  { number: "100+", label: "Translations" },
];

const IslamicStarPattern = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      opacity: 0.05,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5l6.18 13.82L50 25l-13.82 6.18L30 45l-6.18-13.82L10 25l13.82-6.18L30 5z' fill='%23D4A84B' fill-opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: "60px 60px",
    }}
  />
);

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-4 py-4">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4A84B]/30 to-transparent" />
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="text-[#D4A84B]/50"
    >
      <path
        d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
        fill="currentColor"
      />
    </svg>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4A84B]/30 to-transparent" />
  </div>
);

export default function LandingLuxuryIslamic() {
  return (
    <div className="min-h-screen bg-[#0A2E1F] text-[#FFF8E7] relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#D4A84B]/10 bg-[#0A2E1F]/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#D4A84B] rounded-md outline-none"
          >
            <Crown className="size-6 text-[#D4A84B]" />
            <span className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                QuranMemorizer
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-[#FFF8E7]/60 hover:text-[#D4A84B] hover:bg-[#D4A84B]/10 focus-visible:ring-2 focus-visible:ring-[#D4A84B]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
            <Button
              asChild
              className="bg-[#D4A84B] text-[#0A2E1F] font-semibold hover:bg-[#D4A84B]/90 focus-visible:ring-2 focus-visible:ring-[#D4A84B] transition-opacity"
              style={{
                boxShadow: "0 0 20px rgba(212, 168, 75, 0.2)",
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
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <IslamicStarPattern />
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212, 168, 75, 0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-5 py-1.5 mb-10">
            <Star className="size-3.5 text-[#D4A84B] fill-[#D4A84B]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A84B]">
              The Definitive Experience
            </span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              The Art of
            </span>
            <br />
            <span className="text-[#FFF8E7]">Quran Memorization</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-[#FFF8E7]/50 leading-relaxed mb-12">
            Where centuries of Islamic scholarly tradition meet the finest
            advances in learning science. A memorization experience worthy of
            the Noble Quran.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#D4A84B] text-[#0A2E1F] font-bold h-13 px-10 text-base hover:bg-[#D4A84B]/90 focus-visible:ring-2 focus-visible:ring-[#D4A84B] transition-opacity"
              style={{
                boxShadow:
                  "0 0 30px rgba(212, 168, 75, 0.3), 0 0 60px rgba(212, 168, 75, 0.1)",
              }}
            >
              <Link href="/register">Begin Your Legacy</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              size="lg"
              className="text-[#D4A84B]/80 hover:text-[#D4A84B] hover:bg-[#D4A84B]/10 h-13 px-10 text-base border border-[#D4A84B]/20 hover:border-[#D4A84B]/40 focus-visible:ring-2 focus-visible:ring-[#D4A84B] transition-opacity"
            >
              <Link href="/login">Welcome Back &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        <GoldDivider />
      </div>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold tabular-nums mb-1 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#FFF8E7]/30">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        <GoldDivider />
      </div>

      {/* Features Grid */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-balance text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              Exquisite Craftsmanship
            </span>
          </h2>
          <p className="text-center text-[#FFF8E7]/40 mb-16 max-w-lg mx-auto">
            Every detail refined. Every feature considered. Built with the
            reverence this sacred text deserves.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-[#D4A84B]/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 hover:border-[#D4A84B]/20 hover:bg-white/[0.06] transition-opacity"
                  style={{
                    transition:
                      "border-color 0.3s, background-color 0.3s, box-shadow 0.3s",
                  }}
                >
                  <div
                    className="flex size-11 items-center justify-center rounded-lg border border-[#D4A84B]/15 bg-[#D4A84B]/5 mb-4 group-hover:border-[#D4A84B]/30 transition-colors"
                    style={{ transition: "border-color 0.3s" }}
                  >
                    <Icon className="size-5 text-[#D4A84B]" />
                  </div>
                  <h3 className="text-base font-bold text-[#FFF8E7] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#FFF8E7]/35 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        <GoldDivider />
      </div>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212, 168, 75, 0.04) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto max-w-2xl px-4 text-center relative z-10">
          <Crown className="size-12 text-[#D4A84B]/30 mx-auto mb-8" />
          <h2 className="text-balance text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              Your Legacy Awaits
            </span>
          </h2>
          <p className="text-[#FFF8E7]/40 mb-12 max-w-lg mx-auto leading-relaxed">
            Step into the noble tradition of Quran memorization. Join those who
            carry the words of the Creator in their hearts.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#D4A84B] text-[#0A2E1F] font-bold h-14 px-12 text-lg hover:bg-[#D4A84B]/90 focus-visible:ring-2 focus-visible:ring-[#D4A84B] transition-opacity"
            style={{
              boxShadow:
                "0 0 40px rgba(212, 168, 75, 0.3), 0 0 80px rgba(212, 168, 75, 0.1)",
            }}
          >
            <Link href="/register">Enter the Gates</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10">
        {/* Gold geometric border */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4A84B]/30 to-transparent" />
        <div className="flex items-center justify-center -mt-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                className="text-[#D4A84B]/30"
              >
                <path
                  d="M4 0L5 3L8 4L5 5L4 8L3 5L0 4L3 3L4 0Z"
                  fill="currentColor"
                />
              </svg>
            ))}
          </div>
        </div>
        <div className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Crown className="size-4 text-[#D4A84B]/40" />
                <span className="text-sm text-[#FFF8E7]/30">
                  QuranMemorizer 2.0
                </span>
              </div>
              <p className="text-sm text-[#FFF8E7]/15">
                &copy; {new Date().getFullYear()} QuranMemorizer. All rights
                reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className="text-sm text-[#FFF8E7]/30 hover:text-[#D4A84B] transition-colors focus-visible:ring-2 focus-visible:ring-[#D4A84B] rounded-sm outline-none"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-[#FFF8E7]/30 hover:text-[#D4A84B] transition-colors focus-visible:ring-2 focus-visible:ring-[#D4A84B] rounded-sm outline-none"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
