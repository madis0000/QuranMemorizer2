import Link from "next/link";
import {
  BookOpen,
  Brain,
  Eye,
  Flame,
  LogIn,
  Mic,
  Shield,
  Star,
  Trophy,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Mushaf Mode",
    description:
      "7 real Mushaf editions with exact page layouts. It looks just like your physical copy!",
    color: "bg-[#58CC02]",
    shadowColor: "shadow-[0_4px_0_0_#46A302]",
    hoverShadowColor: "hover:shadow-[0_6px_0_0_#46A302]",
    iconBg: "bg-[#58CC02]/10",
    iconColor: "text-[#58CC02]",
  },
  {
    icon: Mic,
    title: "Voice Check",
    description:
      "Recite out loud and get instant feedback. Our AI catches every mistake, word by word!",
    color: "bg-[#84D8FF]",
    shadowColor: "shadow-[0_4px_0_0_#5BB8E0]",
    hoverShadowColor: "hover:shadow-[0_6px_0_0_#5BB8E0]",
    iconBg: "bg-[#84D8FF]/10",
    iconColor: "text-[#1899D6]",
  },
  {
    icon: Brain,
    title: "Smart Review",
    description:
      "FSRS-6 knows exactly when you are about to forget. 30% fewer reviews than old methods!",
    color: "bg-[#FFD900]",
    shadowColor: "shadow-[0_4px_0_0_#E0BF00]",
    hoverShadowColor: "hover:shadow-[0_6px_0_0_#E0BF00]",
    iconBg: "bg-[#FFD900]/10",
    iconColor: "text-[#C4A700]",
  },
  {
    icon: Shield,
    title: "Tajweed Coach",
    description:
      "13 rules detected and color-coded live. Master pronunciation one rule at a time!",
    color: "bg-[#FF9600]",
    shadowColor: "shadow-[0_4px_0_0_#E08500]",
    hoverShadowColor: "hover:shadow-[0_6px_0_0_#E08500]",
    iconBg: "bg-[#FF9600]/10",
    iconColor: "text-[#FF9600]",
  },
  {
    icon: Eye,
    title: "Hide & Seek",
    description:
      "8 clever ways to test yourself. From tiny hints to full blackout \u2014 level up your recall!",
    color: "bg-[#CE82FF]",
    shadowColor: "shadow-[0_4px_0_0_#B56EE0]",
    hoverShadowColor: "hover:shadow-[0_6px_0_0_#B56EE0]",
    iconBg: "bg-[#CE82FF]/10",
    iconColor: "text-[#CE82FF]",
  },
  {
    icon: Trophy,
    title: "Leagues & Badges",
    description:
      "50+ achievements to unlock. Climb 5 league tiers. Compete with friends every week!",
    color: "bg-[#FF4B4B]",
    shadowColor: "shadow-[0_4px_0_0_#E03E3E]",
    hoverShadowColor: "hover:shadow-[0_6px_0_0_#E03E3E]",
    iconBg: "bg-[#FF4B4B]/10",
    iconColor: "text-[#FF4B4B]",
  },
];

const stats = [
  {
    number: "114",
    label: "Surahs",
    color: "bg-[#58CC02]",
    textColor: "text-white",
    shadowColor: "shadow-[0_4px_0_0_#46A302]",
  },
  {
    number: "6,236",
    label: "Ayahs",
    color: "bg-[#84D8FF]",
    textColor: "text-[#1A1A1A]",
    shadowColor: "shadow-[0_4px_0_0_#5BB8E0]",
  },
  {
    number: "7+",
    label: "Editions",
    color: "bg-[#FFD900]",
    textColor: "text-[#1A1A1A]",
    shadowColor: "shadow-[0_4px_0_0_#E0BF00]",
  },
  {
    number: "100+",
    label: "Translations",
    color: "bg-[#FF9600]",
    textColor: "text-white",
    shadowColor: "shadow-[0_4px_0_0_#E08500]",
  },
];

export default function LandingDuolingoPlayful() {
  return (
    <div className="min-h-screen bg-white text-[#3C3C3C]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b-2 border-[#E5E5E5] bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#58CC02] rounded-xl outline-none"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#58CC02] shadow-[0_3px_0_0_#46A302]">
              <BookOpen className="size-5 text-white" />
            </div>
            <span className="text-xl font-black text-[#3C3C3C]">
              QuranMemorizer
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="rounded-xl border-2 border-[#E5E5E5] text-[#AFAFAF] font-bold hover:bg-[#F7F7F7] hover:text-[#3C3C3C] focus-visible:ring-2 focus-visible:ring-[#58CC02] h-10"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-xl bg-[#58CC02] text-white font-bold hover:bg-[#4CAD02] shadow-[0_3px_0_0_#46A302] hover:shadow-[0_2px_0_0_#46A302] active:shadow-none focus-visible:ring-2 focus-visible:ring-[#58CC02] h-10 transition-transform hover:-translate-y-0.5"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                <span className="hidden sm:inline">Get Started</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-green-50 py-20 md:py-28 lg:py-36">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#58CC02]/10 border-2 border-[#58CC02]/20 px-5 py-2 mb-8">
            <Flame className="size-5 text-[#FF9600]" />
            <span className="font-bold text-sm text-[#58CC02]">
              Start your streak today!
            </span>
          </div>
          <h1 className="text-balance text-5xl font-black tracking-tight sm:text-6xl md:text-7xl text-[#3C3C3C] mb-6 leading-tight">
            The fun way to
            <br />
            <span className="text-[#58CC02]">memorize the Quran</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-[#777777] leading-relaxed mb-10">
            Bite-sized lessons. Smart reviews. Voice recognition. Tajweed
            coaching. 50+ achievements to unlock. Learning has never been this
            engaging!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-[#58CC02] text-white font-black h-14 px-10 text-lg shadow-[0_4px_0_0_#46A302] hover:shadow-[0_2px_0_0_#46A302] active:shadow-none hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#58CC02] transition-transform uppercase tracking-wide"
            >
              <Link href="/register">Get Started \u2014 It&rsquo;s Free</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              size="lg"
              className="rounded-2xl border-2 border-[#E5E5E5] text-[#1899D6] font-black h-14 px-10 text-lg shadow-[0_4px_0_0_#E5E5E5] hover:shadow-[0_2px_0_0_#E5E5E5] hover:bg-[#F7F7F7] hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#1899D6] transition-transform uppercase tracking-wide"
            >
              <Link href="/login">I Already Have an Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <div
                  className={`flex size-20 md:size-24 items-center justify-center rounded-full ${stat.color} ${stat.shadowColor} mb-3`}
                >
                  <span
                    className={`text-2xl md:text-3xl font-black tabular-nums ${stat.textColor}`}
                  >
                    {stat.number}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#AFAFAF] uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-yellow-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-balance text-3xl md:text-4xl font-black text-center mb-4 text-[#3C3C3C]">
            Packed with superpowers
          </h2>
          <p className="text-center text-[#AFAFAF] font-bold mb-14 max-w-md mx-auto">
            Every tool you need to become a Hafiz, all in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 ${feature.shadowColor} ${feature.hoverShadowColor} hover:-translate-y-2 transition-transform cursor-default`}
                >
                  <div
                    className={`flex size-16 items-center justify-center rounded-2xl ${feature.iconBg} mb-4`}
                  >
                    <Icon className={`size-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-black text-[#3C3C3C] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#777777] leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20 md:py-28">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Star className="size-8 text-[#FFD900] fill-[#FFD900]" />
            <Star className="size-10 text-[#FFD900] fill-[#FFD900]" />
            <Star className="size-8 text-[#FFD900] fill-[#FFD900]" />
          </div>
          <h2 className="text-balance text-3xl md:text-4xl font-black mb-6 text-[#3C3C3C]">
            Your streak starts now!
          </h2>
          <p className="text-[#777777] font-bold mb-10 max-w-md mx-auto">
            Join thousands of learners who are making Quran memorization a daily
            habit. Free forever.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-[#58CC02] text-white font-black h-16 px-12 text-xl shadow-[0_5px_0_0_#46A302] hover:shadow-[0_3px_0_0_#46A302] active:shadow-none hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#58CC02] transition-transform uppercase tracking-wide"
          >
            <Link href="/register">Start Learning for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#E5E5E5] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#58CC02]">
                <BookOpen className="size-4 text-white" />
              </div>
              <span className="text-sm font-bold text-[#AFAFAF]">
                QuranMemorizer 2.0
              </span>
            </div>
            <p className="text-sm font-bold text-[#E5E5E5]">
              &copy; {new Date().getFullYear()} QuranMemorizer. Made with
              dedication.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm font-bold text-[#AFAFAF] hover:text-[#58CC02] transition-colors focus-visible:ring-2 focus-visible:ring-[#58CC02] rounded-lg outline-none"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold text-[#AFAFAF] hover:text-[#58CC02] transition-colors focus-visible:ring-2 focus-visible:ring-[#58CC02] rounded-lg outline-none"
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
