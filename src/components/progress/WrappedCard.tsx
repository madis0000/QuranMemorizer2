"use client";

import { cn } from "@/lib/utils";

interface WrappedCardProps {
  title: string;
  value: string;
  subtitle?: string;
  gradient: string; // CSS gradient class or Tailwind
  className?: string;
}

/**
 * Single story card for the Quran Wrapped sequence.
 * Designed to look like a Spotify Wrapped card.
 */
export function WrappedCard({
  title,
  value,
  subtitle,
  gradient,
  className,
}: WrappedCardProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 w-64 h-80 rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden",
        gradient,
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />

      {/* Content */}
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">
          {title}
        </p>
      </div>

      <div className="relative z-10">
        <p className="text-4xl font-bold leading-tight">{value}</p>
        {subtitle && <p className="text-sm mt-2 opacity-80">{subtitle}</p>}
      </div>

      {/* Quran Wrapped branding */}
      <div className="relative z-10">
        <p className="text-[10px] opacity-50">Quran Wrapped</p>
      </div>
    </div>
  );
}
