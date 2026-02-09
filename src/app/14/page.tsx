import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data hoisted outside the component                         */
/* ------------------------------------------------------------------ */

const features = [
  {
    headline: "The Mushaf, Rendered Faithfully",
    body: "Seven editions of the Holy Quran, each rendered to match its physical counterpart with glyph-level precision. The Madinah Mushaf, the IndoPak Nastaleeq, the Uthmani script \u2014 every page, every line, every word exactly where it belongs. Navigate by page, by surah, by juz. Bookmark your place. Resume where you left off. This is not a text viewer; it is a digital Mushaf.",
  },
  {
    headline: "Voice Recognition That Truly Listens",
    body: "Recite aloud, and the system follows along word by word. The primary engine \u2014 the Web Speech API tuned for Arabic \u2014 handles real-time recognition. When it falters, a secondary engine (Whisper, trained specifically on Quranic Arabic by Tarteel AI) catches what was missed. Mistakes are identified with LCS and Levenshtein algorithms across three sensitivity levels. You will know exactly where you stumbled.",
  },
  {
    headline: "FSRS-6: The Science of Remembering",
    body: "The Free Spaced Repetition Scheduler, sixth generation, has been validated against 700 million reviews. It models memory with three components \u2014 Stability, Retrievability, and Difficulty \u2014 across 21 optimizable parameters. In controlled A/B tests it achieved 99.6% superiority over the SM-2 algorithm, requiring 30% fewer reviews for identical retention. Every verse you memorize is scheduled with mathematical precision.",
  },
  {
    headline: "Tajweed: Thirteen Rules, Real-Time Coaching",
    body: "From Qalqalah to Ikhfa, from Idgham to Madd \u2014 thirteen rules are detected as you recite. Each is color-coded on the text itself: blue for Qalqalah, green for Ikhfa, magenta for Idgham with Ghunna. Audio analysis via 2048-point FFT measures duration, nasality, smoothness, and clarity. A coaching panel appears in real-time to guide your pronunciation. Animated visualizations explain each rule as you encounter it.",
  },
  {
    headline: "Eight Ways to Test Your Memory",
    body: "Full Hide blanks every word. First Letter reveals only the opening character. Random Blank progressively obscures from 20% to 100%. Translation Recall shows the English; you provide the Arabic. Audio Recall plays the verse; you recite without text. Reverse Recall gives the last word; you recite backward. Context Recall removes one verse from its surroundings. Keyword Mode strips particles, leaving only content words.",
  },
  {
    headline: "Competition Worthy of the Quran",
    body: "Five leagues, named for stations of knowledge: Talib, Qari, Hafiz, Sheikh, and Imam. Each week the top performers are promoted; the bottom are demoted. Experience points are earned through practice sessions, perfect accuracy, streak maintenance, and completing challenges. Fifty achievements \u2014 from Common to Legendary \u2014 mark milestones along the journey. A Garden of Jannah grows with every verse memorized.",
  },
];

const statsItems = [
  { label: "Surahs", value: "114" },
  { label: "Ayahs", value: "6,236" },
  { label: "Editions", value: "7+" },
  { label: "Translations", value: "100+" },
  { label: "Tajweed Rules", value: "13" },
  { label: "Hide Modes", value: "8" },
  { label: "Achievements", value: "50+" },
  { label: "Leagues", value: "5" },
];

const pullQuote =
  "We did not build another Quran app. We built the system that every serious student of the Quran has been waiting for \u2014 one that respects both the sacred tradition and the science of memory.";

export default function NewspaperEditorialPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB] text-black font-serif selection:bg-black selection:text-[#F5F0EB]">
      {/* ============================================================= */}
      {/*  STICKY NAV                                                    */}
      {/* ============================================================= */}
      <nav className="sticky top-0 z-50 bg-[#F5F0EB]/95 backdrop-blur-sm border-b border-black/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="text-sm font-bold tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
          >
            The QuranMemorizer
          </Link>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              className="rounded-none bg-transparent text-black font-serif text-sm underline underline-offset-4 decoration-black/30 hover:decoration-black hover:bg-transparent transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black"
            >
              <Link href="/login">
                <LogIn className="size-3.5" aria-hidden="true" />
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-none border border-black bg-black text-[#F5F0EB] font-serif text-sm px-5 hover:bg-black/80 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black"
            >
              <Link href="/register">
                <UserPlus className="size-3.5" aria-hidden="true" />
                Subscribe
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ============================================================= */}
      {/*  MASTHEAD                                                      */}
      {/* ============================================================= */}
      <header className="px-6 pt-12 pb-8 border-b border-black">
        <div className="mx-auto max-w-6xl text-center">
          {/* Top rule */}
          <div className="border-t-2 border-black mb-6" aria-hidden="true" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-4 font-sans">
            Vol. II &mdash; Issue No. 1 &mdash; Est. 2026
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-[6.5rem] font-bold tracking-tight leading-none text-balance">
            The QuranMemorizer
          </h1>
          <p className="mt-4 text-[10px] tracking-[0.4em] uppercase text-black/40 font-sans">
            The World&rsquo;s Most Advanced Platform for Quran Memorization
          </p>
          {/* Bottom rule */}
          <div className="border-t-2 border-black mt-6" aria-hidden="true" />
        </div>
      </header>

      {/* ============================================================= */}
      {/*  HERO — Lead story                                             */}
      {/* ============================================================= */}
      <section className="px-6 py-12 lg:py-16 border-b border-black/10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main headline */}
            <div className="lg:col-span-8 lg:border-r lg:border-black/10 lg:pr-12">
              <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-3 font-sans">
                LEAD STORY &mdash; PAGE A1
              </p>
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight text-balance">
                AI, Spaced Repetition, and the Sacred Text: A New Chapter in
                Quran Memorization
              </h2>
              <div
                className="mt-4 border-t border-black/10 pt-4"
                aria-hidden="true"
              />
              <p className="text-lg leading-relaxed text-black/70">
                A platform combining FSRS-6 scheduling algorithms, dual-engine
                voice recognition, 13-rule Tajweed detection, and page-accurate
                Mushaf rendering launches publicly today, promising to redefine
                how millions of Muslims approach the memorization of the Holy
                Quran. The system, built on Next.js with TypeScript, supports
                offline use, competitive leagues, and eight distinct
                memorization strategies.
              </p>
              <div className="mt-8 flex gap-4">
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-none bg-transparent text-black font-serif text-base underline underline-offset-4 decoration-2 decoration-black/50 hover:decoration-black hover:bg-transparent p-0 h-auto transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black"
                >
                  <Link href="/register">Begin reading &rarr;</Link>
                </Button>
              </div>
            </div>

            {/* Sidebar stats */}
            <aside className="lg:col-span-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-4 font-sans">
                BY THE NUMBERS
              </p>
              <div className="space-y-0">
                {statsItems.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-baseline justify-between border-b border-black/10 py-3"
                  >
                    <span className="text-sm text-black/60">{stat.label}</span>
                    <span className="text-2xl font-bold tabular-nums">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  BREAKING NEWS TICKER                                          */}
      {/* ============================================================= */}
      <section className="bg-black text-[#F5F0EB] px-6 py-3">
        <div className="mx-auto max-w-6xl flex items-center gap-4 overflow-hidden">
          <span className="shrink-0 bg-red-600 text-white text-[10px] font-bold font-sans tracking-widest uppercase px-3 py-1">
            BREAKING
          </span>
          <p className="text-sm truncate">
            FSRS-6 algorithm validated on 700M+ reviews &mdash; 99.6%
            superiority over SM-2 &mdash; Dual-engine voice AI now live &mdash;
            13-rule Tajweed detection active &mdash; Five competitive leagues
            open for enrollment
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FEATURES — Newspaper columns                                  */}
      {/* ============================================================= */}
      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-8 font-sans">
            FEATURES &mdash; PAGE A2
          </p>
          <div className="columns-1 lg:columns-3 gap-8 space-y-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="break-inside-avoid border-t border-black/10 pt-6"
              >
                <h3 className="text-xl font-bold leading-snug mb-3 text-balance">
                  {feature.headline}
                </h3>
                <p className="text-sm leading-relaxed text-black/60">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  PULL QUOTE                                                    */}
      {/* ============================================================= */}
      <section className="px-6 py-16 lg:py-20 border-y border-black/10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative">
            <span
              className="absolute -top-8 left-0 text-8xl leading-none text-black/10 font-bold"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote className="relative z-10 px-8 lg:px-16">
              <p className="text-2xl lg:text-3xl font-bold leading-snug italic text-balance">
                {pullQuote}
              </p>
            </blockquote>
            <span
              className="absolute -bottom-14 right-0 text-8xl leading-none text-black/10 font-bold"
              aria-hidden="true"
            >
              &rdquo;
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  EDITORIAL — Quranic verse                                     */}
      {/* ============================================================= */}
      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-4 font-sans">
                EDITORIAL &mdash; PAGE A3
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold leading-snug text-balance">
                The Promise of Ease
              </h2>
            </div>
            <div className="lg:col-span-8 lg:border-l lg:border-black/10 lg:pl-8">
              <p className="text-lg leading-relaxed text-black/70 mb-6">
                &ldquo;And We have certainly made the Qur&rsquo;an easy for
                remembrance, so is there any who will remember?&rdquo; The verse
                from Surah Al-Qamar (54:17) is repeated four times in the surah
                &mdash; an emphasis that is itself a teaching on the nature of
                divine facilitation.
              </p>
              <p className="text-lg leading-relaxed text-black/70 mb-6">
                This platform takes that promise seriously. The technology
                exists to make memorization more efficient, more accessible, and
                more enduring than ever before. Spaced repetition ensures that
                what is learned is not forgotten. Voice recognition provides a
                practice partner that never tires. Tajweed coaching preserves
                the beauty of recitation.
              </p>
              <p className="text-lg leading-relaxed text-black/70">
                The Quran was made easy. We simply removed the remaining
                barriers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  METHODS — Sidebar feature                                     */}
      {/* ============================================================= */}
      <section className="px-6 py-16 lg:py-20 border-t border-black/10">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-8 font-sans">
            METHODS &mdash; PAGE B1
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold leading-snug mb-6 text-balance">
                Four Centuries of Pedagogy, One Application
              </h2>
              <p className="text-base leading-relaxed text-black/60 mb-4">
                The Mauritanian method demands mastery &mdash; 95% accuracy
                before a student advances to the next verse. The 3&times;3
                method builds through structured repetition. The Ottoman method
                organizes review in bi-weekly page cycles. The
                Sabaq/Sabqi/Manzil system separates new learning from recent
                review from deep review.
              </p>
              <p className="text-base leading-relaxed text-black/60">
                Each method has been digitized faithfully, with FSRS-6
                scheduling layered on top to optimize review timing. Users
                select their preferred tradition in settings; the system adapts
                accordingly.
              </p>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold leading-snug mb-6 text-balance">
                The Similar Verse Problem, Solved
              </h2>
              <p className="text-base leading-relaxed text-black/60 mb-4">
                Every Hafiz knows the frustration: two verses share 70% of their
                words, and the mind confuses them. The mutashabihat &mdash;
                similar verses &mdash; are the leading cause of recitation
                errors among memorizers.
              </p>
              <p className="text-base leading-relaxed text-black/60">
                The Similar Verse Trainer automatically detects verse pairs with
                high word overlap, highlights the differences side-by-side, and
                generates targeted drills. Given a verse, recite the correct
                continuation &mdash; not the similar one. Given an opening,
                identify which surah. Difficulty scales with your mistake
                history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  CTA                                                           */}
      {/* ============================================================= */}
      <section className="px-6 py-16 lg:py-20 border-t-2 border-black">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-6 font-sans">
            CLASSIFIED ADVERTISEMENT
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight text-balance">
            Read the Next Chapter of Your Hifz Journey
          </h2>
          <p className="mt-6 text-lg text-black/50 max-w-xl mx-auto leading-relaxed">
            Free to use. No subscription required. Available on any device with
            a web browser. Install offline. Begin today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <Button
              asChild
              variant="ghost"
              className="rounded-none bg-transparent text-black font-serif text-lg underline underline-offset-4 decoration-2 decoration-black hover:decoration-black/50 hover:bg-transparent p-0 h-auto transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black"
            >
              <Link href="/register">Create your free account &rarr;</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-black/30 font-sans tracking-wide">
            No credit card &mdash; No time limit &mdash; All platforms
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FOOTER                                                        */}
      {/* ============================================================= */}
      <footer className="border-t-2 border-black px-6 py-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-black/30 font-sans">
            &copy; 2026 The QuranMemorizer &mdash; All rights reserved
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="text-xs text-black/30 font-sans underline underline-offset-2 hover:text-black/60 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs text-black/30 font-sans underline underline-offset-2 hover:text-black/60 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
