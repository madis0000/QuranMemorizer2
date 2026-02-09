"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="flex justify-center p-8">Loading...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/quran";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    errorParam === "CredentialsSignin"
      ? "Invalid email or password."
      : errorParam
        ? "An error occurred. Please try again."
        : ""
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOAuthSignIn(provider: string) {
    setError("");
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div
      className="rounded-2xl border border-[#D1E0D8] bg-white/80 p-8 backdrop-blur-sm dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]/90"
      style={{ boxShadow: "0 0 30px rgba(0,229,160,0.06)" }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-xl font-light text-[#1A2E22] dark:text-[#E8F0EC]">
          Welcome back
        </h2>
        <p className="mt-1 text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
          Sign in to continue your memorization journey
        </p>
      </div>

      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-light text-[#1A2E22] dark:text-[#E8F0EC]"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
            className="border-[#D1E0D8] bg-[#F0F5F2]/50 text-[#1A2E22] placeholder:text-[#5A7B6B]/50 focus:border-[#059669] focus:ring-[#059669] dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/50 dark:text-[#E8F0EC] dark:placeholder:text-[#6B8B7B]/50 dark:focus:border-[#00E5A0] dark:focus:ring-[#00E5A0]"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-light text-[#1A2E22] dark:text-[#E8F0EC]"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
            className="border-[#D1E0D8] bg-[#F0F5F2]/50 text-[#1A2E22] placeholder:text-[#5A7B6B]/50 focus:border-[#059669] focus:ring-[#059669] dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/50 dark:text-[#E8F0EC] dark:placeholder:text-[#6B8B7B]/50 dark:focus:border-[#00E5A0] dark:focus:ring-[#00E5A0]"
          />
        </div>

        <Button
          type="submit"
          className="w-full border border-[#059669]/30 bg-[#059669]/15 text-[#059669] transition-all duration-200 hover:bg-[#059669]/25 dark:border-[#00E5A0]/30 dark:bg-[#00E5A0]/15 dark:text-[#00E5A0] dark:shadow-[0_0_20px_rgba(0,229,160,0.15)] dark:hover:bg-[#00E5A0]/25 dark:hover:shadow-[0_0_30px_rgba(0,229,160,0.25)]"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#D1E0D8] dark:border-[#00E5A0]/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-[#5A7B6B] dark:bg-[#0F1A14] dark:text-[#6B8B7B]">
            Or continue with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {(["Google", "Facebook", "Apple"] as const).map((provider) => (
          <Button
            key={provider}
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => handleOAuthSignIn(provider.toLowerCase())}
            className="border-[#D1E0D8] bg-transparent text-[#1A2E22] hover:border-[#059669]/30 hover:bg-[#059669]/5 dark:border-[#00E5A0]/10 dark:text-[#E8F0EC] dark:hover:border-[#00E5A0]/20 dark:hover:bg-[#00E5A0]/5"
          >
            {provider}
          </Button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#059669] hover:text-[#059669]/80 dark:text-[#00E5A0] dark:hover:text-[#00E5A0]/80"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
