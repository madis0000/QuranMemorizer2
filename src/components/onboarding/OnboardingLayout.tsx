"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  nextDisabled?: boolean;
  dir?: "ltr" | "rtl";
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextLabel = "Next",
  backLabel = "Back",
  showBack = true,
  nextDisabled = false,
  dir = "ltr",
}: OnboardingLayoutProps) {
  const isRtl = dir === "rtl";

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={dir}>
      {/* Progress indicator */}
      <div className="w-full px-6 pt-8">
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentStep
                  ? "w-8 bg-primary"
                  : i < currentStep
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">{children}</div>
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-8">
        <div className="flex justify-between max-w-lg mx-auto">
          {showBack && currentStep > 0 ? (
            <Button variant="ghost" onClick={onBack} className="gap-2">
              {isRtl ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
              {backLabel}
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={onNext} disabled={nextDisabled} className="gap-2">
            {nextLabel}
            {isRtl ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
