"use client";

import { useCallback, useState } from "react";
import type { TajweedRuleType } from "@/types/quran";
import { BookOpen, GraduationCap, Target } from "lucide-react";

import { getRulesByStage, MASTERY_STAGES } from "@/lib/tajweed/rule-mapper";
import { useTajweedStore } from "@/stores/tajweedStore";
import { TajweedCoach } from "@/components/tajweed/TajweedCoach";
import { TajweedMasteryPath } from "@/components/tajweed/TajweedMasteryPath";
import { TajweedPractice } from "@/components/tajweed/TajweedPractice";
import { TajweedRuleCard } from "@/components/tajweed/TajweedRuleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TajweedPage() {
  const {
    currentStage,
    masteryLevels,
    activeRule,
    setActiveRule,
    setCurrentStage,
  } = useTajweedStore();

  const [practicingRule, setPracticingRule] = useState<TajweedRuleType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("path");

  // Get rules for the current stage
  const currentStageInfo = MASTERY_STAGES[currentStage - 1];
  const currentStageRules = getRulesByStage(currentStage);

  const handleRuleClick = useCallback(
    (ruleType: TajweedRuleType) => {
      setActiveRule(ruleType);
    },
    [setActiveRule]
  );

  const handlePracticeStage = useCallback(
    (stage: number) => {
      setCurrentStage(stage);
      setActiveTab("practice");
    },
    [setCurrentStage]
  );

  const handleStartPractice = useCallback((ruleType: TajweedRuleType) => {
    setPracticingRule(ruleType);
  }, []);

  const handlePracticeComplete = useCallback(
    (_score: number) => {
      setPracticingRule(null);
      // Could show a completion dialog here
      setActiveRule(null);
    },
    [setActiveRule]
  );

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Tajweed Learning</h1>
              <p className="text-muted-foreground">
                Master the rules of Quranic recitation step by step
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left/Main Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="path">
                  <GraduationCap className="mr-1 h-4 w-4" />
                  Mastery Path
                </TabsTrigger>
                <TabsTrigger value="practice">
                  <Target className="mr-1 h-4 w-4" />
                  Practice
                </TabsTrigger>
                <TabsTrigger value="rules">
                  <BookOpen className="mr-1 h-4 w-4" />
                  All Rules
                </TabsTrigger>
              </TabsList>

              {/* Mastery Path Tab */}
              <TabsContent value="path" className="mt-4">
                <TajweedMasteryPath onPracticeStage={handlePracticeStage} />
              </TabsContent>

              {/* Practice Tab */}
              <TabsContent value="practice" className="mt-4">
                {practicingRule ? (
                  <TajweedPractice
                    ruleType={practicingRule}
                    onComplete={handlePracticeComplete}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <h3 className="mb-1 text-sm font-semibold">
                        Stage {currentStage}: {currentStageInfo?.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {currentStageInfo?.description}
                      </p>
                    </div>

                    <h4 className="text-sm font-medium text-muted-foreground">
                      Select a rule to practice:
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {currentStageRules.map((ruleInfo) => (
                        <div
                          key={ruleInfo.type}
                          className="cursor-pointer"
                          onClick={() => handleStartPractice(ruleInfo.type)}
                        >
                          <TajweedRuleCard
                            ruleType={ruleInfo.type}
                            masteryLevel={masteryLevels[ruleInfo.type]}
                            isActive={activeRule === ruleInfo.type}
                            onClick={handleRuleClick}
                          />
                        </div>
                      ))}
                    </div>

                    {currentStageRules.length === 0 && (
                      <p className="py-8 text-center text-muted-foreground">
                        No rules defined for this stage yet.
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* All Rules Tab */}
              <TabsContent value="rules" className="mt-4">
                <div className="space-y-6">
                  {MASTERY_STAGES.map((stage) => {
                    const stageRules = getRulesByStage(stage.stage);
                    return (
                      <div key={stage.stage}>
                        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                          Stage {stage.stage}: {stage.name}{" "}
                          <span className="font-normal">
                            ({stage.nameArabic})
                          </span>
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                          {stageRules.map((ruleInfo) => (
                            <TajweedRuleCard
                              key={ruleInfo.type}
                              ruleType={ruleInfo.type}
                              masteryLevel={masteryLevels[ruleInfo.type]}
                              isActive={activeRule === ruleInfo.type}
                              onClick={handleRuleClick}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Coach Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {activeRule ? (
                <TajweedCoach
                  ruleType={activeRule}
                  onClose={() => setActiveRule(null)}
                />
              ) : (
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="mb-2 text-sm font-semibold">Tajweed Coach</h3>
                  <p className="text-xs text-muted-foreground">
                    Click on any Tajweed rule card to see detailed information,
                    tips, and practice guidance here.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Rules you have mastered</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span>Rules in progress</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span>Rules not yet started</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
