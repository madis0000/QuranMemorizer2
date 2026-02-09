import Link from "next/link";
import {
  BookOpen,
  Brain,
  Eye,
  Headphones,
  LogIn,
  Mic,
  Shield,
  Trophy,
  UserPlus,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf Rendering",
    description:
      "Seven authentic Mushaf editions rendered with pixel-perfect fidelity to their physical counterparts \u2014 Madinah 1421H, 1441H, IndoPak, and more. Every page, every line, exactly as printed.",
    tall: true,
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud and receive instant, word-level feedback powered by dual-engine speech recognition with automatic Whisper fallback.",
    tall: false,
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "The most advanced scheduling algorithm in existence \u2014 99.6% superior to SM-2 in clinical trials, requiring 20\u201330% fewer reviews for identical retention rates.",
    tall: true,
  },
  {
    icon: Shield,
    title: "13-Rule Tajweed Detection",
    description:
      "Qalqalah, Ikhfa, Idgham, Iqlab, Ghunna, Madd \u2014 every rule detected, color-coded, and coached in real time.",
    tall: false,
  },
  {
    icon: Eye,
    title: "Eight Progressive Hide Modes",
    description:
      "From first-letter hints to full concealment, translation recall to reverse recitation \u2014 eight scientifically-grounded strategies for building lasting memory.",
    tall: false,
  },
  {
    icon: Trophy,
    title: "Fifty Achievements & Quran Leagues",
    description:
      "Bronze to Diamond, Talib to Imam. Compete in weekly leagues, earn badges, and ascend through five tiers of scholarly recognition.",
    tall: true,
  },
  {
    icon: Headphones,
    title: "Immersive Audio Experience",
    description:
      "Listen to renowned Qaris with ayah-by-ayah synchronization. Download for offline listening and practice at your own pace.",
    tall: false,
  },
  {
    icon: Wifi,
    title: "Offline-First Architecture",
    description:
      "A full Progressive Web App with IndexedDB storage. Your entire memorization journey continues without interruption, even without internet.",
    tall: true,
  },
];

const stats = [
  { number: "114", label: "Surahs" },
  { number: "6,236", label: "Ayahs" },
  { number: "7+", label: "Mushaf Editions" },
  { number: "100+", label: "Translations" },
];

const OrnamentalDivider = () => (
  <div className="flex items-center justify-center gap-4 py-8">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#A0522D]/40 to-transparent" />
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-[#A0522D]/60"
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
      />
    </svg>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#A0522D]/40 to-transparent" />
  </div>
);

const DotPatternOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      opacity: 0.03,
      backgroundImage: "radial-gradient(circle, #3C2415 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    }}
  />
);

export default function LandingInkAndParchment() {
  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#3C2415] relative">
      <DotPatternOverlay />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#A0522D]/20 bg-[#FBF7F0]/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#A0522D] rounded-md outline-none"
          >
            <BookOpen className="size-6 text-[#A0522D]" />
            <span className="font-serif text-xl font-bold tracking-tight text-[#3C2415]">
              QuranMemorizer
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-[#3C2415] hover:bg-[#A0522D]/10 hover:text-[#A0522D] focus-visible:ring-2 focus-visible:ring-[#A0522D]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
            <Button
              asChild
              className="bg-[#6B1D1D] text-[#FBF7F0] hover:bg-[#6B1D1D]/90 focus-visible:ring-2 focus-visible:ring-[#6B1D1D]"
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
      <section className="relative overflow-hidden py-24 md:py-36 lg:py-44">
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Bismillah ornament */}
          <div
            className="font-serif text-7xl sm:text-8xl md:text-9xl text-[#A0522D]/[0.07] select-none mb-8 leading-none"
            aria-hidden="true"
            dir="rtl"
          >
            &#xFDFD;
          </div>
          <h1 className="text-balance font-serif text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-[#3C2415] mb-6 leading-tight">
            The Scholar&rsquo;s Path to
            <br />
            <span className="text-[#A0522D]">Quran Memorization</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-[#3C2415]/70 leading-relaxed mb-10 font-serif">
            A timeless approach to <em className="italic">hifz</em> &mdash;
            uniting centuries of Islamic scholarship with the precision of
            modern science. Spaced repetition, voice recognition, and Tajweed
            mastery, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#6B1D1D] text-[#FBF7F0] hover:bg-[#6B1D1D]/85 h-12 px-8 text-base font-serif focus-visible:ring-2 focus-visible:ring-[#6B1D1D] transition-opacity"
            >
              <Link href="/register">Begin Your Journey</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              size="lg"
              className="text-[#A0522D] hover:bg-[#A0522D]/10 h-12 px-8 text-base font-serif focus-visible:ring-2 focus-visible:ring-[#A0522D] transition-opacity"
            >
              <Link href="/login">Continue Reading &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      <OrnamentalDivider />

      {/* Stats Section — styled as table of contents */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-2xl px-4">
          <h2 className="text-balance font-serif text-2xl md:text-3xl font-bold text-center mb-12 text-[#3C2415]">
            Table of Contents
          </h2>
          <div className="space-y-0">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-baseline justify-between border-b border-[#A0522D]/15 py-4 group"
              >
                <span className="font-serif text-lg text-[#3C2415]/80 group-hover:text-[#A0522D] transition-colors">
                  <span className="text-[#A0522D]/50 mr-3 text-sm">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {stat.label}
                </span>
                <span className="font-serif text-xl font-bold text-[#3C2415] tabular-nums tracking-wide">
                  {stat.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OrnamentalDivider />

      {/* Features — Masonry-style 2-column */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-balance font-serif text-3xl md:text-4xl font-bold text-center mb-4 text-[#3C2415]">
            Instruments of Knowledge
          </h2>
          <p className="text-center font-serif text-[#3C2415]/60 mb-16 max-w-lg mx-auto">
            Every tool a scholar needs, refined for the modern age.
          </p>

          <div className="columns-1 md:columns-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`break-inside-avoid mb-8 rounded-lg border border-[#A0522D]/15 bg-[#FBF7F0] p-6 md:p-8 hover:border-[#A0522D]/30 hover:shadow-lg hover:shadow-[#A0522D]/5 transition-shadow ${
                    feature.tall ? "min-h-[220px]" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-[#A0522D]/20 bg-[#A0522D]/5">
                      <Icon className="size-5 text-[#A0522D]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#3C2415] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[#3C2415]/65 leading-relaxed text-sm">
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

      <OrnamentalDivider />

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div
            className="font-serif text-6xl text-[#A0522D]/[0.08] select-none mb-6 leading-none"
            aria-hidden="true"
            dir="rtl"
          >
            &#xFDFD;
          </div>
          <h2 className="text-balance font-serif text-3xl md:text-4xl font-bold mb-6 text-[#3C2415]">
            Every Great Journey Begins
            <br />
            with a Single Verse
          </h2>
          <p className="font-serif text-[#3C2415]/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Join thousands of students walking the ancient path of memorization,
            illuminated by modern science.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#6B1D1D] text-[#FBF7F0] hover:bg-[#6B1D1D]/85 h-14 px-10 text-lg font-serif focus-visible:ring-2 focus-visible:ring-[#6B1D1D] transition-opacity"
          >
            <Link href="/register">Open the Book</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#A0522D]/20 py-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-[#A0522D]/60" />
              <span className="font-serif text-sm text-[#3C2415]/60">
                QuranMemorizer 2.0
              </span>
            </div>
            <p className="font-serif text-sm text-[#3C2415]/40">
              &copy; {new Date().getFullYear()} QuranMemorizer. Crafted with
              reverence.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="font-serif text-sm text-[#3C2415]/60 hover:text-[#A0522D] transition-colors focus-visible:ring-2 focus-visible:ring-[#A0522D] rounded-sm outline-none"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="font-serif text-sm text-[#3C2415]/60 hover:text-[#A0522D] transition-colors focus-visible:ring-2 focus-visible:ring-[#A0522D] rounded-sm outline-none"
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
