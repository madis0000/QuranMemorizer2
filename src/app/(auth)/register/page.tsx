"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validateForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): FormErrors {
  const errors: FormErrors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validateForm(
      name,
      email,
      password,
      confirmPassword
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: "An account with this email already exists." });
        } else if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({
            general: data.message || "Registration failed. Please try again.",
          });
        }
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/quran");
        router.refresh();
      }
    } catch {
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
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
          Create account
        </h2>
        <p className="mt-1 text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
          Start your Quran memorization journey today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-light text-[#1A2E22] dark:text-[#E8F0EC]"
          >
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="name"
            aria-invalid={!!errors.name}
            className="border-[#D1E0D8] bg-[#F0F5F2]/50 text-[#1A2E22] placeholder:text-[#5A7B6B]/50 focus:border-[#059669] focus:ring-[#059669] dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/50 dark:text-[#E8F0EC] dark:placeholder:text-[#6B8B7B]/50 dark:focus:border-[#00E5A0] dark:focus:ring-[#00E5A0]"
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

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
            aria-invalid={!!errors.email}
            className="border-[#D1E0D8] bg-[#F0F5F2]/50 text-[#1A2E22] placeholder:text-[#5A7B6B]/50 focus:border-[#059669] focus:ring-[#059669] dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/50 dark:text-[#E8F0EC] dark:placeholder:text-[#6B8B7B]/50 dark:focus:border-[#00E5A0] dark:focus:ring-[#00E5A0]"
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
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
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            className="border-[#D1E0D8] bg-[#F0F5F2]/50 text-[#1A2E22] placeholder:text-[#5A7B6B]/50 focus:border-[#059669] focus:ring-[#059669] dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/50 dark:text-[#E8F0EC] dark:placeholder:text-[#6B8B7B]/50 dark:focus:border-[#00E5A0] dark:focus:ring-[#00E5A0]"
          />
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-light text-[#1A2E22] dark:text-[#E8F0EC]"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            className="border-[#D1E0D8] bg-[#F0F5F2]/50 text-[#1A2E22] placeholder:text-[#5A7B6B]/50 focus:border-[#059669] focus:ring-[#059669] dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/50 dark:text-[#E8F0EC] dark:placeholder:text-[#6B8B7B]/50 dark:focus:border-[#00E5A0] dark:focus:ring-[#00E5A0]"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full border border-[#059669]/30 bg-[#059669]/15 text-[#059669] transition-all duration-200 hover:bg-[#059669]/25 dark:border-[#00E5A0]/30 dark:bg-[#00E5A0]/15 dark:text-[#00E5A0] dark:shadow-[0_0_20px_rgba(0,229,160,0.15)] dark:hover:bg-[#00E5A0]/25 dark:hover:shadow-[0_0_30px_rgba(0,229,160,0.25)]"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm font-light text-[#5A7B6B] dark:text-[#6B8B7B]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#059669] hover:text-[#059669]/80 dark:text-[#00E5A0] dark:hover:text-[#00E5A0]/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
