import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data hoisted outside the component                         */
/* ------------------------------------------------------------------ */

const systemModules = [
  {
    id: "MUSHAF_ENGINE",
    status: "ACTIVE",
    detail: "7 editions, page-accurate rendering, glyph-level precision",
  },
  {
    id: "VOICE_AI",
    status: "ACTIVE",
    detail: "Web Speech API + Whisper fallback, word-level analysis",
  },
  {
    id: "FSRS_6_SRS",
    status: "ACTIVE",
    detail: "21 parameters, 700M+ training reviews, 30% fewer sessions",
  },
  {
    id: "TAJWEED_DETECT",
    status: "ACTIVE",
    detail: "13 rules, real-time coaching, color-coded feedback",
  },
  {
    id: "HIDE_MODES",
    status: "ACTIVE",
    detail: "8 progressive strategies: first-letter to full recall",
  },
  {
    id: "LEAGUE_SYSTEM",
    status: "ACTIVE",
    detail: "5 tiers, weekly promotion/demotion, 50+ achievements",
  },
  {
    id: "AUDIO_ENGINE",
    status: "ACTIVE",
    detail: "Ayah-by-ayah playback, word-level sync, offline download",
  },
  {
    id: "PWA_OFFLINE",
    status: "ACTIVE",
    detail: "IndexedDB x7 stores, background sync, install anywhere",
  },
  {
    id: "FLUENCY_METRICS",
    status: "ACTIVE",
    detail: "WPM, pause analysis, confidence scoring, trend graphs",
  },
  {
    id: "SIMILAR_VERSE",
    status: "ACTIVE",
    detail: "70%+ overlap detection, side-by-side diff, targeted drills",
  },
];

const bootSequence = [
  "Initializing Mushaf rendering engine...",
  "Loading 114 surahs, 6,236 ayahs...",
  "Calibrating FSRS-6 spaced repetition parameters...",
  "Activating 13-rule Tajweed detection...",
  "Starting voice recognition pipeline...",
  "Connecting league system...",
  "All systems operational.",
];

const statsLine = [
  { key: "SURAHS", val: "114" },
  { key: "AYAHS", val: "6236" },
  { key: "EDITIONS", val: "7+" },
  { key: "TRANSLATIONS", val: "100+" },
  { key: "ACHIEVEMENTS", val: "50+" },
  { key: "HIDE_MODES", val: "8" },
];

export default function RetroTerminalPage() {
  return (
    <div className="relative min-h-screen bg-black text-[#00FF41] font-mono selection:bg-[#00FF41] selection:text-black overflow-hidden">
      {/* ============================================================= */}
      {/*  CRT SCANLINE OVERLAY                                          */}
      {/* ============================================================= */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* CRT green glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,255,65,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ============================================================= */}
      {/*  STICKY NAV                                                    */}
      {/* ============================================================= */}
      <nav className="sticky top-0 z-50 bg-black/90 border-b border-[#00FF41]/30 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="text-sm font-bold tracking-wider hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#00FF41] focus-visible:outline-none"
          >
            [QURANMEMORIZER v2.0.0]
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-none border border-[#00FF41]/40 bg-transparent text-[#00FF41] font-mono text-xs tracking-wider hover:bg-[#00FF41]/10 hover:text-[#00FF41] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#00FF41]"
            >
              <Link href="/login">
                <LogIn className="size-3.5" aria-hidden="true" />
                LOGIN
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-none border border-[#00FF41] bg-[#00FF41] text-black font-mono font-bold text-xs tracking-wider hover:bg-[#00FF41]/80 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white"
            >
              <Link href="/register">
                <UserPlus className="size-3.5" aria-hidden="true" />
                REGISTER
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ============================================================= */}
      {/*  HERO — Terminal prompt                                        */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          {/* System badge */}
          <div className="mb-10 inline-block border border-[#00FF41]/30 px-4 py-1.5">
            <span className="text-xs tracking-widest text-[#00FF41]/60">
              &gt; SYSTEM ONLINE &mdash; v2.0.0 &mdash; ALL MODULES OPERATIONAL
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-[#00FF41]/50">user@quranmemorizer:~$</p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none text-balance">
              &gt; MEMORIZE_THE_QURAN
              <span className="animate-pulse text-[#00FF41]">|</span>
            </h1>
          </div>

          <div className="mt-12 max-w-2xl space-y-2">
            <p className="text-sm text-[#00FF41]/70 leading-relaxed">
              &gt; Science-backed spaced repetition. AI voice recognition.
            </p>
            <p className="text-sm text-[#00FF41]/70 leading-relaxed">
              &gt; 13-rule Tajweed detection. Page-accurate Mushaf rendering.
            </p>
            <p className="text-sm text-[#00FF41]/70 leading-relaxed">
              &gt; Competitive leagues. 50+ achievements. Offline-first PWA.
            </p>
            <p className="text-sm text-[#00FF41]/50 leading-relaxed">
              &gt; Type START to begin your Hifz journey...
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="rounded-none border-2 border-[#00FF41] bg-[#00FF41] text-black font-mono font-bold text-sm tracking-wider px-8 py-5 h-auto hover:bg-[#00FF41]/80 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white"
            >
              <Link href="/register">[EXECUTE: START_MEMORIZATION]</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="rounded-none border-2 border-[#00FF41]/40 bg-transparent text-[#00FF41] font-mono text-sm tracking-wider px-8 py-5 h-auto hover:bg-[#00FF41]/10 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#00FF41]"
            >
              <Link href="/login">[EXECUTE: LOGIN_EXISTING]</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  STATS — system metrics bar                                    */}
      {/* ============================================================= */}
      <section className="relative z-10 border-y border-[#00FF41]/20 bg-[#00FF41]/[0.03]">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-xs text-[#00FF41]/40 mb-3">
            &gt; system.metrics.current()
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {statsLine.map((s, i) => (
              <span key={s.key} className="text-sm">
                <span className="text-[#00FF41]/50">{s.key}:</span>{" "}
                <span className="font-bold tabular-nums">{s.val}</span>
                {i < statsLine.length - 1 ? (
                  <span className="text-[#00FF41]/20 ml-6" aria-hidden="true">
                    |
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  BOOT SEQUENCE                                                 */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs text-[#00FF41]/40 mb-8 tracking-widest uppercase">
            &gt; boot_log
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-12 text-balance">
            SYSTEM INITIALIZATION
          </h2>
          <div className="border border-[#00FF41]/20 p-6 lg:p-8 space-y-3">
            {bootSequence.map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs text-[#00FF41]/30 tabular-nums shrink-0 mt-0.5">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <span
                  className={`text-sm ${
                    i === bootSequence.length - 1
                      ? "font-bold text-[#00FF41]"
                      : "text-[#00FF41]/60"
                  }`}
                >
                  {line}
                </span>
                <span className="text-xs text-[#00FF41]/30 ml-auto shrink-0">
                  {i === bootSequence.length - 1 ? "[  OK  ]" : "[ DONE ]"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  MODULES — system status table                                 */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28 border-t border-[#00FF41]/10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs text-[#00FF41]/40 mb-8 tracking-widest uppercase">
            &gt; modules.list_all()
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-12 text-balance">
            ACTIVE MODULES
          </h2>

          {/* Table header */}
          <div className="border border-[#00FF41]/20 overflow-hidden">
            <div className="grid grid-cols-12 gap-0 border-b border-[#00FF41]/20 bg-[#00FF41]/[0.05] px-4 py-3 text-xs font-bold tracking-wider text-[#00FF41]/60">
              <div className="col-span-1">#</div>
              <div className="col-span-3">MODULE_ID</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-7">DESCRIPTION</div>
            </div>

            {/* Table rows */}
            {systemModules.map((mod, i) => (
              <div
                key={mod.id}
                className="grid grid-cols-12 gap-0 border-b border-[#00FF41]/10 px-4 py-3 text-sm hover:bg-[#00FF41]/[0.04] transition-colors duration-150"
              >
                <div className="col-span-1 text-[#00FF41]/30 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-3 font-bold truncate">{mod.id}</div>
                <div className="col-span-1">
                  <span className="text-xs font-bold text-[#00FF41]">
                    {mod.status}
                  </span>
                </div>
                <div className="col-span-7 text-[#00FF41]/50 truncate">
                  {mod.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  METHODOLOGY                                                   */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28 border-t border-[#00FF41]/10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs text-[#00FF41]/40 mb-8 tracking-widest uppercase">
            &gt; methodology.describe()
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-12 text-balance">
            ALGORITHMS &amp; METHODS
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-[#00FF41]/20 p-6">
              <h3 className="text-base font-bold mb-4">
                &gt; FSRS-6_SPACED_REPETITION
              </h3>
              <div className="space-y-2 text-sm text-[#00FF41]/50">
                <p>Three Component Model:</p>
                <p className="pl-4">- Stability (memory strength)</p>
                <p className="pl-4">- Retrievability (recall probability)</p>
                <p className="pl-4">- Difficulty (item complexity)</p>
                <p className="mt-3">
                  Result: 30% fewer reviews at higher retention.
                </p>
              </div>
            </div>
            <div className="border border-[#00FF41]/20 p-6">
              <h3 className="text-base font-bold mb-4">
                &gt; TRADITIONAL_METHODS
              </h3>
              <div className="space-y-2 text-sm text-[#00FF41]/50">
                <p>Digitized classical approaches:</p>
                <p className="pl-4">- Mauritanian: 95% accuracy gate</p>
                <p className="pl-4">- 3x3: Read 3x, recite 3x, combine</p>
                <p className="pl-4">- Sabaq/Sabqi/Manzil: layered review</p>
                <p className="pl-4">- Ottoman: page-by-page cycles</p>
              </div>
            </div>
            <div className="border border-[#00FF41]/20 p-6">
              <h3 className="text-base font-bold mb-4">
                &gt; TAJWEED_ANALYSIS
              </h3>
              <div className="space-y-2 text-sm text-[#00FF41]/50">
                <p>6-layer detection pipeline:</p>
                <p className="pl-4">1. Character-level text analysis</p>
                <p className="pl-4">2. API rule mapping (30+ variants)</p>
                <p className="pl-4">3. HTML word segmentation</p>
                <p className="pl-4">4. FFT audio analysis (2048-point)</p>
                <p className="pl-4">5. Real-time coaching panel</p>
                <p className="pl-4">6. Animated visual guides</p>
              </div>
            </div>
            <div className="border border-[#00FF41]/20 p-6">
              <h3 className="text-base font-bold mb-4">
                &gt; SIMILAR_VERSE_ENGINE
              </h3>
              <div className="space-y-2 text-sm text-[#00FF41]/50">
                <p>Mutashabihat detection system:</p>
                <p className="pl-4">- 70%+ word overlap identification</p>
                <p className="pl-4">- Side-by-side diff highlighting</p>
                <p className="pl-4">- Targeted continuation drills</p>
                <p className="pl-4">- &ldquo;Which surah?&rdquo; rapid quiz</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  QUOTE                                                         */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28 border-t border-[#00FF41]/10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs text-[#00FF41]/40 mb-8 tracking-widest uppercase">
            &gt; quran.cite(54, 17)
          </p>
          <p className="text-2xl lg:text-4xl font-bold leading-tight text-balance">
            &ldquo;AND WE HAVE CERTAINLY MADE THE QUR&rsquo;AN EASY FOR
            REMEMBRANCE.&rdquo;
          </p>
          <p className="mt-6 text-sm text-[#00FF41]/40">
            {/* SURAH AL-QAMAR — VERSE 17 */}
            SURAH AL-QAMAR &mdash; VERSE 17
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  CTA                                                           */}
      {/* ============================================================= */}
      <section className="relative z-10 px-6 py-20 lg:py-28 border-t border-[#00FF41]/10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="border-2 border-[#00FF41]/30 p-10 lg:p-16">
            <p className="text-xs text-[#00FF41]/40 mb-6 tracking-widest">
              &gt; AWAITING USER INPUT...
            </p>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight text-balance">
              READY TO EXECUTE?
            </h2>
            <p className="mt-6 text-sm text-[#00FF41]/50 max-w-md mx-auto">
              All modules loaded. All systems green. The only missing variable
              is you. Initialize your Hifz journey now.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                className="rounded-none border-2 border-[#00FF41] bg-[#00FF41] text-black font-mono font-bold text-sm tracking-wider px-10 py-5 h-auto hover:bg-[#00FF41]/80 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white"
              >
                <Link href="/register">[EXECUTE: CREATE_ACCOUNT]</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-[#00FF41]/30">
              FREE &mdash; NO_CREDIT_CARD &mdash; ALL_PLATFORMS
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FOOTER                                                        */}
      {/* ============================================================= */}
      <footer className="relative z-10 border-t border-[#00FF41]/20 px-6 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <p className="text-xs text-[#00FF41]/30">
            &copy; 2026 QURANMEMORIZER &mdash; PID 1 &mdash; UPTIME 99.9%
          </p>
          <p className="text-xs text-[#00FF41]/20">[EOF]</p>
        </div>
      </footer>
    </div>
  );
}
