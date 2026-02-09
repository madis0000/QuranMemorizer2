"use client";

import { useMemo } from "react";
import { GraduationCap, Plus } from "lucide-react";

import { getDailySchedule } from "@/lib/curriculum/daily-scheduler";
import type { StudyPlan } from "@/lib/curriculum/plan-generator";
import {
  useCompleteDailyTarget,
  useCreatePlan,
  usePlans,
} from "@/hooks/use-curriculum";
import { CalendarView } from "@/components/curriculum/CalendarView";
import { DailyTargetList } from "@/components/curriculum/DailyTargetList";
import { PlanWizard } from "@/components/curriculum/PlanWizard";
import { StudyPlanCard } from "@/components/curriculum/StudyPlanCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CurriculumPage() {
  const { data: plansData, isLoading } = usePlans();
  const createPlan = useCreatePlan();
  const completeDailyTarget = useCompleteDailyTarget();

  const activePlan = plansData?.activePlan ?? null;
  const planHistory = plansData?.planHistory ?? [];

  // Compute daily schedule (no FSRS cards passed here - those come from separate query)
  const dailySchedule = useMemo(() => {
    return getDailySchedule(activePlan, []);
  }, [activePlan]);

  const handlePlanCreated = (plan: StudyPlan) => {
    createPlan.mutate(plan);
  };

  const handleCompleteToday = () => {
    const today = new Date().toISOString().split("T")[0];
    completeDailyTarget.mutate(today);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              Curriculum
            </h1>
            <p className="text-muted-foreground">
              Plan and track your memorization journey
            </p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No active plan: show the wizard
  if (!activePlan) {
    return (
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              Curriculum
            </h1>
            <p className="text-muted-foreground">
              Create a personalized study plan for your memorization journey
            </p>
          </div>

          <PlanWizard onPlanCreated={handlePlanCreated} />

          {/* Past plans */}
          {planHistory.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Past Plans</h2>
              <div className="space-y-3">
                {planHistory.map((plan) => (
                  <StudyPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active plan: show dashboard
  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              Curriculum
            </h1>
            <p className="text-muted-foreground">
              Your active study plan and daily targets
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Creating a new plan will archive the current one
              const confirmed = window.confirm(
                "Creating a new plan will archive your current plan. Continue?"
              );
              if (confirmed) {
                // Reset by navigating - the wizard will show since we archived
                window.location.reload();
              }
            }}
          >
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="plan">Plan Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <StudyPlanCard plan={activePlan} />
            <DailyTargetList
              schedule={dailySchedule}
              onComplete={handleCompleteToday}
              isCompletePending={completeDailyTarget.isPending}
            />
          </TabsContent>

          <TabsContent value="plan">
            <StudyPlanCard plan={activePlan} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView plan={activePlan} />
          </TabsContent>
        </Tabs>

        {/* Past plans */}
        {planHistory.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Past Plans</h2>
            <div className="space-y-3">
              {planHistory.map((plan) => (
                <StudyPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
