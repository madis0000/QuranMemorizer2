import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
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
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const gold = "#C9A84C";
const warmWhite = "#FFF5E8";

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions rendered with exact physical layouts. Madinah, IndoPak, and beyond \u2014 every page as it was printed.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud and receive instant word-level feedback. Web Speech API with Whisper AI fallback for perfect accuracy.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Science-backed scheduling achieving 30% fewer reviews while maintaining higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time color-coded coaching with audio analysis and animated pronunciation guides for every rule.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall. Eight distinct strategies to strengthen every memory pathway.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five competitive tiers from Talib to Imam with weekly promotions, daily challenges, and streak multipliers.",
  },
  {
    icon: Headphones,
    title: "Follow Renowned Qaris",
    description:
      "Ayah-by-ayah playback with word-level highlighting, adjustable speed, and full offline audio downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device. Study without internet. Everything syncs seamlessly when you reconnect.",
  },
];

const credits = [
  { label: "SURAHS", value: "114" },
  { label: "AYAHS", value: "6,236" },
  { label: "EDITIONS", value: "7+" },
  { label: "TRANSLATIONS", value: "100+" },
  { label: "ACHIEVEMENTS", value: "50+" },
  { label: "HIDE MODES", value: "8" },
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

export default function CinematicWidescreenLanding() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FFF5E8] antialiased">
      {/* ---- Sticky Nav ---- */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-medium uppercase tracking-[0.15em] text-[#C9A84C] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
          >
            QuranMemorizer
          </Link>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#FFF5E8]/50 transition-opacity duration-200 hover:bg-transparent hover:text-[#FFF5E8] focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="border border-white/10 text-sm text-[#FFF5E8]/80 transition-opacity duration-200 hover:bg-white/5 hover:text-[#FFF5E8] focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ---- Hero: Full Viewport Cinematic ---- */}
      <section className="relative flex min-h-screen flex-col">
        {/* Top letterbox bar */}
        <div className="h-12 bg-black sm:h-16" aria-hidden="true" />

        {/* Main hero content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <p className="mb-6 text-xs font-light uppercase tracking-[0.3em] text-[#C9A84C]/60">
            A Memorization Experience by
          </p>
          <h1 className="text-balance text-center text-5xl font-extralight uppercase leading-tight tracking-[0.15em] text-[#FFF5E8] sm:text-6xl lg:text-8xl">
            Quran
            <br />
            Memorizer
          </h1>
          <div
            className="mx-auto mt-8 h-px w-24 bg-[#C9A84C]/30"
            aria-hidden="true"
          />
          <p className="mx-auto mt-8 max-w-lg text-center text-base font-light leading-relaxed text-[#FFF5E8]/40">
            Page-accurate Mushaf rendering. AI-powered voice recognition. FSRS-6
            spaced repetition. Thirteen-rule Tajweed detection. An experience
            worthy of the words it serves.
          </p>
          <div className="mt-12">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 text-sm font-light uppercase tracking-[0.2em] text-[#C9A84C] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
            >
              Begin Your Journey
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Bottom letterbox bar */}
        <div className="h-12 bg-black sm:h-16" aria-hidden="true" />
      </section>

      {/* ---- Film Credits Stats ---- */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-3">
            {credits.map((credit) => (
              <div key={credit.label} className="text-center">
                <div className="text-[10px] font-light uppercase tracking-[0.3em] text-[#FFF5E8]/30">
                  {credit.label}
                </div>
                <div className="tabular-nums mt-2 text-3xl font-extralight text-[#C9A84C] sm:text-4xl">
                  {credit.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Hairline divider ---- */}
      <div
        className="mx-auto max-w-2xl border-t border-white/5"
        aria-hidden="true"
      />

      {/* ---- Features ---- */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 text-center">
            <p className="mb-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A84C]/60">
              Act II
            </p>
            <h2 className="text-balance text-3xl font-extralight uppercase tracking-[0.1em] text-[#FFF5E8] sm:text-4xl">
              The Complete Experience
            </h2>
          </div>
          <div className="grid gap-12 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="border-b border-white/5 pb-10"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <Icon className="size-5 text-[#C9A84C]/60" />
                    <h3 className="text-lg font-light uppercase tracking-[0.05em] text-[#FFF5E8]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm font-light leading-relaxed text-[#FFF5E8]/35">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Hairline divider ---- */}
      <div
        className="mx-auto max-w-2xl border-t border-white/5"
        aria-hidden="true"
      />

      {/* ---- Interlude: Quote ---- */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div
            className="mx-auto mb-8 h-px w-16 bg-[#C9A84C]/30"
            aria-hidden="true"
          />
          <blockquote className="text-2xl font-extralight italic leading-relaxed text-[#FFF5E8]/60 sm:text-3xl">
            &ldquo;And We have certainly made the Qur&rsquo;an easy for
            remembrance, so is there any who will remember?&rdquo;
          </blockquote>
          <cite className="mt-6 block text-xs font-light uppercase tracking-[0.2em] text-[#C9A84C]/50">
            Surah Al-Qamar &middot; 54:17
          </cite>
          <div
            className="mx-auto mt-8 h-px w-16 bg-[#C9A84C]/30"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ---- Hairline divider ---- */}
      <div
        className="mx-auto max-w-2xl border-t border-white/5"
        aria-hidden="true"
      />

      {/* ---- Methods ---- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-center text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A84C]/60">
            Act III
          </p>
          <h2 className="mb-16 text-center text-3xl font-extralight uppercase tracking-[0.1em] text-[#FFF5E8]">
            Your Method, Your Pace
          </h2>
          <div className="space-y-8">
            {[
              {
                name: "Mauritanian Method",
                desc: "Mastery gates \u2014 achieve 95%+ accuracy before advancing to the next verse.",
              },
              {
                name: "3\u00d73 Method",
                desc: "Read verse 3 times, recite from memory 3 times, then combine with previous verses.",
              },
              {
                name: "Ottoman Method",
                desc: "Page-by-page memorization with bi-weekly review cycles for long-term retention.",
              },
              {
                name: "Sabaq / Sabqi / Manzil",
                desc: "New lesson, recent review, and older review tracked separately for optimal recall.",
              },
            ].map((method) => (
              <div key={method.name} className="border-b border-white/5 pb-8">
                <h3 className="mb-2 text-base font-light uppercase tracking-[0.05em] text-[#C9A84C]">
                  {method.name}
                </h3>
                <p className="text-sm font-light leading-relaxed text-[#FFF5E8]/35">
                  {method.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Hairline divider ---- */}
      <div
        className="mx-auto max-w-2xl border-t border-white/5"
        aria-hidden="true"
      />

      {/* ---- CTA ---- */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A84C]/60">
            Now Showing
          </p>
          <h2 className="text-balance text-3xl font-extralight uppercase tracking-[0.1em] text-[#FFF5E8] sm:text-4xl">
            Your Hifz begins here
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-[#FFF5E8]/35">
            Free forever. No ads. No distractions. Just you, the Quran, and the
            most cinematic memorization experience ever crafted.
          </p>
          <div className="mt-12 flex flex-col items-center gap-6">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 text-sm font-light uppercase tracking-[0.2em] text-[#C9A84C] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
            >
              Create Free Account
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/quran"
              className="text-xs font-light uppercase tracking-[0.15em] text-[#FFF5E8]/30 transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
            >
              or explore the Mushaf
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer: End Credits ---- */}
      <footer className="border-t border-white/5 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-8 text-[10px] font-light uppercase tracking-[0.3em] text-[#FFF5E8]/20">
            End Credits
          </p>
          <Link
            href="/"
            className="mb-6 block text-sm font-light uppercase tracking-[0.15em] text-[#C9A84C]/60 transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
          >
            QuranMemorizer 2.0
          </Link>
          <nav className="mb-8 flex flex-wrap justify-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-light uppercase tracking-[0.1em] text-[#FFF5E8]/20 transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="text-[10px] font-light uppercase tracking-[0.2em] text-[#FFF5E8]/10">
            &copy; 2026 QuranMemorizer &middot; Built with love for the Ummah
          </div>
        </div>
      </footer>
    </div>
  );
}
