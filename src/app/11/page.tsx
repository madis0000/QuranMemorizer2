import Link from "next/link";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data hoisted outside the component                         */
/* ------------------------------------------------------------------ */

const features = [
  {
    number: "01",
    title: "PAGE-ACCURATE MUSHAF",
    description:
      "Seven editions rendered pixel-for-pixel against their physical counterparts. Madinah, IndoPak, Uthmani — every glyph in its place.",
  },
  {
    number: "02",
    title: "FSRS-6 SPACED REPETITION",
    description:
      "The algorithm that beat SM-2 in 99.6% of A/B tests. Fewer reviews, higher retention — 21 parameters trained on 700 million data points.",
  },
  {
    number: "03",
    title: "AI VOICE RECOGNITION",
    description:
      "Recite. We listen. Web Speech API handles real-time feedback, Whisper AI catches what it misses. Word-level precision.",
  },
  {
    number: "04",
    title: "13-RULE TAJWEED ENGINE",
    description:
      "Qalqalah. Ikhfa. Idgham. Thirteen rules detected in real-time with color-coded coaching, audio analysis, and animated guides.",
  },
  {
    number: "05",
    title: "8 HIDE MODES",
    description:
      "First letter. Random blank. Full hide. Translation recall. Audio recall. Reverse. Context. Keyword. Eight paths to total recall.",
  },
  {
    number: "06",
    title: "QURAN-THEMED LEAGUES",
    description:
      "Five tiers from Talib to Imam. Weekly competition. Promotion. Demotion. 50+ achievements. Your memorization has stakes now.",
  },
  {
    number: "07",
    title: "OFFLINE-FIRST PWA",
    description:
      "Install it. Disconnect. Keep going. IndexedDB stores everything. Background sync reconciles when you return.",
  },
  {
    number: "08",
    title: "100+ TRANSLATIONS",
    description:
      "Every major language. Every major scholar. Side-by-side or inline — the meaning is never more than a glance away.",
  },
];

const stats = [
  { value: "114", label: "SURAHS" },
  { value: "6,236", label: "AYAHS" },
  { value: "7+", label: "EDITIONS" },
  { value: "100+", label: "TRANSLATIONS" },
];

export default function BrutalistRawPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-red-600 selection:text-white">
      {/* ============================================================= */}
      {/*  STICKY NAV                                                    */}
      {/* ============================================================= */}
      <nav className="sticky top-0 z-50 bg-white border-b-3 border-black">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-black uppercase tracking-tighter focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
          >
            QURANMEMORIZER
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-none border-3 border-black bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <Link href="/login">
                <LogIn className="size-4" aria-hidden="true" />
                LOGIN
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-none border-3 border-black bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:border-red-600 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <Link href="/register">
                <UserPlus className="size-4" aria-hidden="true" />
                REGISTER
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ============================================================= */}
      {/*  HERO                                                          */}
      {/* ============================================================= */}
      <section className="py-32 lg:py-48 px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-7xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none text-balance">
            MEMORIZE
            <br />
            THE
            <br />
            <span className="text-red-600">QURAN</span>
          </h1>
          <div className="mt-16 max-w-2xl">
            <p className="text-xl lg:text-2xl font-bold leading-tight">
              No fluff. No gimmicks. Science-backed spaced repetition, AI voice
              recognition, and page-accurate Mushaf rendering &mdash; built for
              people who are serious about Hifz.
            </p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="rounded-none border-3 border-black bg-red-600 text-white font-black uppercase text-sm tracking-widest px-10 py-6 h-auto hover:bg-red-700 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black"
            >
              <Link href="/register">
                START NOW
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="rounded-none border-3 border-black bg-white text-black font-black uppercase text-sm tracking-widest px-10 py-6 h-auto hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <Link href="/login">I HAVE AN ACCOUNT</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  STATS BAR                                                     */}
      {/* ============================================================= */}
      <section className="border-y-3 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 py-10 ${i < stats.length - 1 ? "border-r-3 border-white/20" : ""}`}
            >
              <p className="text-5xl lg:text-6xl font-black tabular-nums">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-black tracking-[0.3em] text-white/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/*  MANIFESTO                                                     */}
      {/* ============================================================= */}
      <section className="py-32 lg:py-48 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="border-t-3 border-black pt-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-black/40">
              MANIFESTO
            </p>
          </div>
          <div className="mt-16 max-w-4xl">
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-balance">
              EVERY APP PROMISED YOU&rsquo;D MEMORIZE THE QURAN. NONE DELIVERED.
            </h2>
            <p className="mt-12 text-lg lg:text-xl font-bold leading-relaxed text-black/70">
              They gave you pretty interfaces and shallow features. We built a
              system &mdash; FSRS-6 scheduling that&rsquo;s mathematically
              superior, voice AI that hears every syllable, Tajweed detection
              that coaches in real-time, and a competitive league system that
              makes you show up every single day. This isn&rsquo;t an app.
              It&rsquo;s a commitment engine.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FEATURES — NUMBERED LIST                                      */}
      {/* ============================================================= */}
      <section className="py-32 lg:py-48 px-6 border-t-3 border-black">
        <div className="mx-auto max-w-7xl">
          <div className="border-t-3 border-black pt-8 mb-24">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-black/40">
              CAPABILITIES
            </p>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-20 text-balance">
            WHAT&rsquo;S INSIDE
          </h2>
          <div className="space-y-0">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="border-t-3 border-black py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12"
              >
                <div className="lg:col-span-1">
                  <span className="text-4xl lg:text-5xl font-black text-black/20 tabular-nums">
                    {feature.number}
                  </span>
                </div>
                <div className="lg:col-span-3">
                  <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight">
                    {feature.title}
                  </h3>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-base lg:text-lg font-bold text-black/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t-3 border-black" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  THE METHOD                                                    */}
      {/* ============================================================= */}
      <section className="py-32 lg:py-48 px-6 bg-black text-white">
        <div className="mx-auto max-w-7xl">
          <div className="border-t-3 border-white/20 pt-8 mb-24">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">
              THE METHOD
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-balance">
                TRADITIONAL WISDOM. MODERN SCIENCE.
              </h2>
            </div>
            <div className="space-y-8">
              <p className="text-lg font-bold text-white/70 leading-relaxed">
                The Mauritanian method demands 95% accuracy before advancing.
                The 3&times;3 method builds through repetition. The Sabaq system
                separates new learning from review. We digitized all of them
                &mdash; then layered FSRS-6 on top.
              </p>
              <p className="text-lg font-bold text-white/70 leading-relaxed">
                Similar verse detection catches the #1 mistake every Hafiz
                makes: confusing verses with 70%+ word overlap. Side-by-side
                comparison. Targeted drills. No more mix-ups.
              </p>
              <div className="pt-8">
                <Button
                  asChild
                  className="rounded-none border-3 border-white bg-white text-black font-black uppercase text-sm tracking-widest px-10 py-6 h-auto hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  <Link href="/register">
                    BEGIN YOUR HIFZ JOURNEY
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  BOLD QUOTE                                                    */}
      {/* ============================================================= */}
      <section className="py-32 lg:py-48 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-balance">
            &ldquo;AND WE HAVE CERTAINLY MADE THE QUR&rsquo;AN EASY FOR
            REMEMBRANCE.&rdquo;
          </p>
          <p className="mt-10 text-lg font-black uppercase tracking-[0.3em] text-black/40">
            SURAH AL-QAMAR &mdash; 54:17
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FINAL CTA                                                     */}
      {/* ============================================================= */}
      <section className="py-32 lg:py-48 px-6 border-t-3 border-black">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-balance">
            STOP SCROLLING.
            <br />
            <span className="text-red-600">START MEMORIZING.</span>
          </h2>
          <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              className="rounded-none border-3 border-black bg-red-600 text-white font-black uppercase text-sm tracking-widest px-12 py-7 h-auto hover:bg-black hover:border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black"
            >
              <Link href="/register">
                CREATE FREE ACCOUNT
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm font-black uppercase tracking-widest text-black/40">
            FREE FOREVER &mdash; NO CREDIT CARD &mdash; NO NONSENSE
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FOOTER                                                        */}
      {/* ============================================================= */}
      <footer className="border-t-3 border-black px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-widest text-black/40">
            &copy; 2026 QURANMEMORIZER &mdash; BUILT FOR THE UMMAH
          </p>
        </div>
      </footer>
    </div>
  );
}
