import Link from "next/link";

const features = [
  {
    title: "Page-Accurate Mushaf",
    description:
      "Seven editions rendered exactly as printed. Every line in its rightful place.",
  },
  {
    title: "AI Voice Recognition",
    description:
      "Speak and be understood. Dual-engine recognition with word-level feedback.",
  },
  {
    title: "FSRS-6 Spaced Repetition",
    description:
      "The most efficient scheduling algorithm. Fewer reviews, stronger memory.",
  },
  {
    title: "13-Rule Tajweed Detection",
    description:
      "Every rule identified, color-coded, and gently coached in real time.",
  },
  {
    title: "Eight Hide Modes",
    description:
      "Progressive concealment strategies that build recall from the ground up.",
  },
  {
    title: "Achievements and Leagues",
    description:
      "Fifty milestones to earn. Five tiers to climb. Weekly competition.",
  },
  {
    title: "Immersive Audio",
    description:
      "Synchronized ayah-by-ayah playback with offline download support.",
  },
  {
    title: "Offline First",
    description:
      "A full PWA. Your practice continues without interruption, anywhere.",
  },
];

const stats = [
  { number: "114", label: "Surahs" },
  { number: "6,236", label: "Ayahs" },
  { number: "7+", label: "Mushaf Editions" },
  { number: "100+", label: "Translations" },
];

export default function LandingMinimalistZen() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-3xl">
          <Link
            href="/"
            className="text-sm tracking-widest uppercase text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded-sm outline-none"
          >
            QuranMemorizer
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded-sm outline-none underline-offset-4 hover:underline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm text-[#6B8F71] hover:text-[#5a7a60] transition-colors focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded-sm outline-none underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-32 md:py-44 lg:py-56">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h1 className="text-balance text-6xl lg:text-8xl font-light tracking-tighter text-[#1A1A1A] mb-8 leading-[0.95]">
            Memorize
            <br />
            the Quran
          </h1>
          <p className="text-[#1A1A1A]/40 text-lg leading-relaxed mb-12 max-w-sm mx-auto">
            Science-backed memorization. Voice recognition. Tajweed mastery.
            Nothing more than you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/register"
              className="text-[#6B8F71] text-base underline underline-offset-4 hover:text-[#5a7a60] transition-colors focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded-sm outline-none"
            >
              Begin
            </Link>
            <Link
              href="/login"
              className="text-[#1A1A1A]/30 text-base underline underline-offset-4 hover:text-[#1A1A1A]/60 transition-colors focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded-sm outline-none"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-light tabular-nums text-[#1A1A1A] mb-1">
                  {stat.number}
                </div>
                <div className="text-xs uppercase tracking-widest text-[#1A1A1A]/30">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-xl mx-auto px-4">
        <div className="h-px bg-[#1A1A1A]/10" />
      </div>

      {/* Features — vertical list */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-balance text-3xl md:text-4xl font-light tracking-tight text-center mb-20 text-[#1A1A1A]">
            Everything you need
          </h2>

          <div>
            {features.map((feature, i) => (
              <div key={feature.title}>
                <div className="py-8 md:py-10">
                  <h3 className="text-lg font-normal text-[#1A1A1A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#1A1A1A]/40 leading-relaxed text-sm max-w-md">
                    {feature.description}
                  </p>
                </div>
                {i < features.length - 1 ? (
                  <div className="h-px bg-[#1A1A1A]/[0.06]" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-xl mx-auto px-4">
        <div className="h-px bg-[#1A1A1A]/10" />
      </div>

      {/* CTA Section */}
      <section className="py-32 md:py-44">
        <div className="container mx-auto max-w-xl px-4 text-center">
          <h2 className="text-balance text-3xl md:text-5xl font-light tracking-tight mb-8 text-[#1A1A1A]">
            Start today
          </h2>
          <Link
            href="/register"
            className="text-[#6B8F71] text-lg underline underline-offset-8 hover:text-[#5a7a60] transition-colors focus-visible:ring-2 focus-visible:ring-[#6B8F71] rounded-sm outline-none"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12">
        <div className="container mx-auto px-4 max-w-xl">
          <p className="text-center text-xs text-[#1A1A1A]/20">
            &copy; {new Date().getFullYear()} QuranMemorizer
          </p>
        </div>
      </footer>
    </div>
  );
}
