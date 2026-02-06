import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Brain,
  Flame,
  Globe,
  Headphones,
  Mic,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "Read Quran with exact page layouts matching your physical Mushaf (Madinah 1421H, 1441H, IndoPak)",
  },
  {
    icon: Brain,
    title: "AI Memorization",
    description:
      "Real-time mistake detection with word-level feedback and hidden verse mode for testing",
  },
  {
    icon: Mic,
    title: "Voice Search",
    description:
      "Like Shazam for Quran - recite any verse and instantly find it",
  },
  {
    icon: Headphones,
    title: "Listen & Learn",
    description: "Follow along with multiple renowned Qaris at your own pace",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track your streaks, accuracy, and memorization journey with detailed analytics",
  },
  {
    icon: Flame,
    title: "Gamification",
    description: "Stay motivated with badges, challenges, and leaderboards",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <Smartphone className="h-4 w-4" />
              Now available as a Web App
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
              Memorize the Quran
              <br />
              <span className="text-primary">with AI Assistance</span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              A comprehensive Quran memorization web app featuring AI-powered
              voice recognition, real-time mistake detection, page-accurate
              Mushaf rendering, and gamified learning experiences.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="text-lg">
                <Link href="/quran">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Reading
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/memorize">
                  <Brain className="mr-2 h-5 w-5" />
                  Start Memorizing
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
              <div>
                <p className="text-3xl font-bold text-primary">114</p>
                <p className="text-sm text-muted-foreground">Surahs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">6,236</p>
                <p className="text-sm text-muted-foreground">Ayahs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">7+</p>
                <p className="text-sm text-muted-foreground">Mushaf Editions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">Translations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Everything You Need to Memorize
            </h2>
            <p className="text-lg text-muted-foreground">
              Inspired by Tarteel.ai, built for the web
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Begin Your Memorization Journey
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of Muslims improving their Quran recitation
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/quran">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">QuranMemorizer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for the Ummah
            </p>
            <div className="flex items-center gap-4">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Available worldwide
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
