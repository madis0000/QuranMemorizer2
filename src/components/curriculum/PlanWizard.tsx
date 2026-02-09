"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Layers,
  Settings2,
  Target,
} from "lucide-react";

import {
  generateStudyPlan,
  getGoalVerseCount,
  SURAH_NAMES,
  SURAH_VERSE_COUNTS,
  type StudyMethod,
  type StudyPlanGoal,
} from "@/lib/curriculum/plan-generator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlanWizardProps {
  onPlanCreated: (plan: ReturnType<typeof generateStudyPlan>) => void;
  className?: string;
}

type GoalType = "surah" | "juz" | "pages" | "custom";

const STEPS = [
  { label: "Goal Type", icon: Target },
  { label: "Target", icon: BookOpen },
  { label: "Method", icon: Settings2 },
  { label: "Time", icon: Clock },
  { label: "Schedule", icon: Calendar },
  { label: "Review", icon: Check },
] as const;

const METHOD_DESCRIPTIONS: Record<
  StudyMethod,
  { title: string; description: string }
> = {
  sabaq: {
    title: "Sabaq Method",
    description:
      "Traditional method: learn new verses (Sabaq), review recent ones (Sabqi), and consolidate older memorization (Manzil).",
  },
  "3x3": {
    title: "3x3 Method",
    description:
      "Read each passage 3 times, then recite from memory 3 times, then review 3 times. Slower but thorough.",
  },
  ottoman: {
    title: "Ottoman Method",
    description:
      "Page-by-page memorization. Focus on memorizing a full page before moving to the next.",
  },
  adaptive: {
    title: "Adaptive (AI)",
    description:
      "Uses spaced repetition (FSRS) to dynamically adjust your review schedule based on performance.",
  },
};

const TIME_OPTIONS = [
  { value: 5, label: "5 min", desc: "Quick daily review" },
  { value: 15, label: "15 min", desc: "Light memorization" },
  { value: 30, label: "30 min", desc: "Regular practice" },
  { value: 60, label: "60 min", desc: "Intensive study" },
] as const;

export function PlanWizard({ onPlanCreated, className }: PlanWizardProps) {
  const [step, setStep] = useState(0);
  const [goalType, setGoalType] = useState<GoalType>("surah");
  const [targetSurah, setTargetSurah] = useState(1);
  const [targetJuz, setTargetJuz] = useState(30);
  const [targetPages, setTargetPages] = useState(10);
  const [method, setMethod] = useState<StudyMethod>("sabaq");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [deadlineDays, setDeadlineDays] = useState(30);

  const goal: StudyPlanGoal = useMemo(() => {
    switch (goalType) {
      case "surah":
        return { type: "surah", target: targetSurah };
      case "juz":
        return { type: "juz", target: targetJuz };
      case "pages":
        return { type: "pages", target: targetPages };
      case "custom":
        return {
          type: "custom",
          target: 0,
          startSurah: 1,
          startAyah: 1,
          endSurah: 114,
          endAyah: 6,
        };
      default:
        return { type: "surah", target: 1 };
    }
  }, [goalType, targetSurah, targetJuz, targetPages]);

  const totalVerses = useMemo(() => getGoalVerseCount(goal), [goal]);

  const startDate = new Date().toISOString().split("T")[0];
  const deadline = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + deadlineDays);
    return d.toISOString().split("T")[0];
  }, [deadlineDays]);

  const previewPlan = useMemo(() => {
    if (step < 5) return null;
    return generateStudyPlan(goal, method, dailyMinutes, startDate, deadline);
  }, [step, goal, method, dailyMinutes, startDate, deadline]);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleCreate = () => {
    const plan = generateStudyPlan(
      goal,
      method,
      dailyMinutes,
      startDate,
      deadline
    );
    onPlanCreated(plan);
  };

  return (
    <Card className={cn("max-w-lg mx-auto", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Create Study Plan</CardTitle>
        {/* Step indicator */}
        <div className="flex items-center gap-1 mt-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center">
                <button
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors",
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                        ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-4 h-0.5 mx-0.5",
                      i < step ? "bg-primary/40" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Goal Type */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              What would you like to memorize?
            </p>
            {(["surah", "juz", "pages", "custom"] as GoalType[]).map((type) => (
              <button
                key={type}
                onClick={() => setGoalType(type)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-colors",
                  goalType === type
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      goalType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {type === "surah" && <BookOpen className="h-4 w-4" />}
                    {type === "juz" && <Layers className="h-4 w-4" />}
                    {type === "pages" && <Target className="h-4 w-4" />}
                    {type === "custom" && <Settings2 className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm capitalize">{type}</p>
                    <p className="text-xs text-muted-foreground">
                      {type === "surah" && "Memorize a complete surah"}
                      {type === "juz" && "Memorize a complete juz (part)"}
                      {type === "pages" && "Memorize a number of pages"}
                      {type === "custom" && "Set a custom verse range"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Target Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {goalType === "surah" &&
                "Which surah would you like to memorize?"}
              {goalType === "juz" && "Which juz would you like to memorize?"}
              {goalType === "pages" && "How many pages?"}
              {goalType === "custom" && "Set your custom range"}
            </p>

            {goalType === "surah" && (
              <div className="space-y-2">
                <Label htmlFor="surah-select">Select Surah</Label>
                <select
                  id="surah-select"
                  value={targetSurah}
                  onChange={(e) => setTargetSurah(parseInt(e.target.value, 10))}
                  className="w-full p-2 rounded-md border bg-background text-sm"
                >
                  {SURAH_NAMES.map((name, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}. {name} ({SURAH_VERSE_COUNTS[i]} verses)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {SURAH_VERSE_COUNTS[targetSurah - 1]} verses to memorize
                </p>
              </div>
            )}

            {goalType === "juz" && (
              <div className="space-y-2">
                <Label htmlFor="juz-select">Select Juz</Label>
                <select
                  id="juz-select"
                  value={targetJuz}
                  onChange={(e) => setTargetJuz(parseInt(e.target.value, 10))}
                  className="w-full p-2 rounded-md border bg-background text-sm"
                >
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Juz {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {goalType === "pages" && (
              <div className="space-y-2">
                <Label htmlFor="pages-input">Number of Pages</Label>
                <Input
                  id="pages-input"
                  type="number"
                  min={1}
                  max={604}
                  value={targetPages}
                  onChange={(e) =>
                    setTargetPages(
                      Math.max(1, parseInt(e.target.value, 10) || 1)
                    )
                  }
                />
              </div>
            )}

            {goalType === "custom" && (
              <p className="text-sm text-muted-foreground">
                Custom range will cover the entire Quran by default. You can
                adjust this in the plan settings after creation.
              </p>
            )}

            <div className="p-3 rounded-lg bg-accent/30 text-sm">
              <span className="font-medium">Total: </span>
              {totalVerses} verses
            </div>
          </div>
        )}

        {/* Step 3: Method */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose your memorization method
            </p>
            {(Object.keys(METHOD_DESCRIPTIONS) as StudyMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-colors",
                  method === m
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent/50"
                )}
              >
                <p className="font-medium text-sm">
                  {METHOD_DESCRIPTIONS[m].title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {METHOD_DESCRIPTIONS[m].description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Time Commitment */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              How much time can you dedicate daily?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDailyMinutes(opt.value)}
                  className={cn(
                    "p-3 rounded-lg border text-center transition-colors",
                    dailyMinutes === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/50"
                  )}
                >
                  <p className="font-bold text-lg">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-time">Or set custom time (minutes)</Label>
              <Input
                id="custom-time"
                type="number"
                min={5}
                max={180}
                value={dailyMinutes}
                onChange={(e) =>
                  setDailyMinutes(
                    Math.max(5, parseInt(e.target.value, 10) || 5)
                  )
                }
              />
            </div>
          </div>
        )}

        {/* Step 5: Deadline */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              When would you like to complete this plan?
            </p>
            <div className="space-y-2">
              <Label htmlFor="deadline-days">Days from today</Label>
              <Input
                id="deadline-days"
                type="number"
                min={7}
                max={365}
                value={deadlineDays}
                onChange={(e) =>
                  setDeadlineDays(
                    Math.max(7, parseInt(e.target.value, 10) || 7)
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Target date:{" "}
                {new Date(deadline).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Quick presets */}
            <div className="flex flex-wrap gap-2">
              {[7, 14, 30, 60, 90, 180].map((d) => (
                <Button
                  key={d}
                  variant={deadlineDays === d ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDeadlineDays(d)}
                >
                  {d < 30 ? `${d} days` : `${d / 30} month${d > 30 ? "s" : ""}`}
                </Button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-accent/30 text-sm space-y-1">
              <p>
                <span className="font-medium">Verses: </span>
                {totalVerses}
              </p>
              <p>
                <span className="font-medium">Daily estimate: </span>~
                {Math.ceil(totalVerses / deadlineDays)} new verses/day
              </p>
              <p>
                <span className="font-medium">Time: </span>
                {dailyMinutes} min/day for {deadlineDays} days
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Review & Confirm */}
        {step === 5 && previewPlan && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review your study plan before creating it.
            </p>

            <div className="space-y-2 p-3 rounded-lg bg-accent/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan Name</span>
                <span className="font-medium">{previewPlan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Verses</span>
                <span className="font-medium">{totalVerses}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">
                  {METHOD_DESCRIPTIONS[method].title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Time</span>
                <span className="font-medium">{dailyMinutes} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{deadlineDays} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Schedule Days</span>
                <span className="font-medium">
                  {previewPlan.schedule.length} days
                </span>
              </div>
            </div>

            <Button onClick={handleCreate} className="w-full">
              <Check className="h-4 w-4" />
              Create Plan
            </Button>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length - 1 && (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
