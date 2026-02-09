import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Trees } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F0F5F2] px-4 dark:bg-[#080F0B]">
      {/* Ambient orbs (dark mode) */}
      <div
        className="pointer-events-none absolute left-1/3 top-1/4 opacity-0 dark:opacity-100"
        style={{
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/3 opacity-0 dark:opacity-100"
        style={{
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      {/* Light mode gradient */}
      <div
        className="pointer-events-none absolute inset-0 dark:opacity-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(5,150,105,0.04) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#059669] transition-opacity hover:opacity-80 dark:text-[#00E5A0]"
          >
            <Trees
              className="size-8"
              style={{ filter: "drop-shadow(0 0 8px rgba(0,229,160,0.4))" }}
            />
          </Link>
          <h1 className="text-2xl font-light tracking-tight text-[#1A2E22] dark:text-[#E8F0EC]">
            QuranMemorizer
          </h1>
          <p className="text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
            Your living garden of Quran memorization
          </p>
        </div>

        {/* Form Container */}
        {children}

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-light text-[#5A7B6B] transition-colors hover:text-[#059669] dark:text-[#6B8B7B] dark:hover:text-[#00E5A0]"
          >
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
