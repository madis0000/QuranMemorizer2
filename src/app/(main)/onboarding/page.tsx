"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle } from "lucide-react";

import { getDirection, t as translate, type Locale } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";
import { useQuranStore, type MushafEdition } from "@/stores/quranStore";
import { useUserStore } from "@/stores/userStore";
import { EditionStep } from "@/components/onboarding/EditionStep";
import {
  ExperienceStep,
  type ExperienceLevel,
} from "@/components/onboarding/ExperienceStep";
import { GoalStep, type GoalType } from "@/components/onboarding/GoalStep";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { TimeStep, type DailyTime } from "@/components/onboarding/TimeStep";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { Button } from "@/components/ui/button";

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const { setLanguage, setOnboarded } = useUserStore();
  const { setMushafEdition } = useQuranStore();
  const { t, locale, dir } = useTranslation();

  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(locale);
  const [selectedEdition, setSelectedEdition] =
    useState<MushafEdition>("madinah_1421");
  const [selectedGoal, setSelectedGoal] = useState<GoalType>("memorize");
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceLevel>("beginner");
  const [selectedTime, setSelectedTime] = useState<DailyTime>(15);

  // Use the selected language for translations during onboarding,
  // since the user may change language in step 0 before saving.
  const tLocal = useCallback(
    (key: string) => translate(key, selectedLanguage),
    [selectedLanguage]
  );
  const localDir = getDirection(selectedLanguage);

  const handleLanguageSelect = (lang: Locale) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    setMushafEdition(selectedEdition);
    setOnboarded(true);
    router.push("/quran");
  };

  // Summary step (last step)
  if (step === TOTAL_STEPS - 1) {
    return (
      <OnboardingLayout
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onNext={handleComplete}
        onBack={handleBack}
        nextLabel={tLocal("onboarding.get_started")}
        backLabel={tLocal("common.back")}
        dir={localDir}
      >
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-[#059669] dark:text-[#00E5A0]" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {tLocal("onboarding.summary")}
            </h2>
            <p className="text-muted-foreground">
              {tLocal("onboarding.summary_desc")}
            </p>
          </div>
          <div className="bg-card border rounded-xl p-4 space-y-3 text-start">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {tLocal("settings.language")}
              </span>
              <span className="font-medium">
                {selectedLanguage.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {tLocal("onboarding.choose_edition")}
              </span>
              <span className="font-medium">
                {tLocal(`onboarding.edition_${selectedEdition}`)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {tLocal("onboarding.set_goal")}
              </span>
              <span className="font-medium">
                {tLocal(`onboarding.goal_${selectedGoal}`)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {tLocal("onboarding.experience")}
              </span>
              <span className="font-medium">
                {tLocal(`onboarding.exp_${selectedExperience}`)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {tLocal("onboarding.daily_time")}
              </span>
              <span className="font-medium">
                {tLocal(`onboarding.time_${selectedTime}`)}
              </span>
            </div>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  const stepContent = [
    <WelcomeStep
      key="welcome"
      selectedLanguage={selectedLanguage}
      onSelect={handleLanguageSelect}
      welcomeText={tLocal("onboarding.welcome")}
      chooseLanguageText={tLocal("onboarding.choose_language")}
    />,
    <EditionStep
      key="edition"
      selected={selectedEdition}
      onSelect={setSelectedEdition}
      title={tLocal("onboarding.choose_edition")}
      t={tLocal}
    />,
    <GoalStep
      key="goal"
      selected={selectedGoal}
      onSelect={setSelectedGoal}
      title={tLocal("onboarding.set_goal")}
      t={tLocal}
    />,
    <ExperienceStep
      key="experience"
      selected={selectedExperience}
      onSelect={setSelectedExperience}
      title={tLocal("onboarding.experience")}
      t={tLocal}
    />,
    <TimeStep
      key="time"
      selected={selectedTime}
      onSelect={setSelectedTime}
      title={tLocal("onboarding.daily_time")}
      t={tLocal}
    />,
  ];

  return (
    <OnboardingLayout
      currentStep={step}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onBack={handleBack}
      nextLabel={tLocal("common.next")}
      backLabel={tLocal("common.back")}
      dir={localDir}
    >
      {stepContent[step]}
    </OnboardingLayout>
  );
}
