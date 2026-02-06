import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4 dark:from-green-950/20 dark:via-background dark:to-green-950/20">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / App Name */}
        <div className="flex flex-col items-center space-y-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-xl font-bold text-white shadow-md">
              Q
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">QuranMemorizer</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered Quran memorization
          </p>
        </div>

        {/* Form Container */}
        {children}

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-green-600"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
