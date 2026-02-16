"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getHizbsInSurah,
  SURAH_MAWDUAT,
  type SurahSection,
} from "@/data/surah-mawduat";
import { ArrowLeft, BookOpen, Droplets, Sparkles } from "lucide-react";

import type { FlowerStage, SurahTree } from "@/lib/gamification/surah-trees";
import { Progress } from "@/components/ui/progress";

// ============================================================
// Arabic surah names (duplicated from JannatiSurahPanel for self-containment)
// ============================================================
const SURAH_ARABIC: Record<number, string> = {
  1: "الفاتحة",
  2: "البقرة",
  3: "آل عمران",
  4: "النساء",
  5: "المائدة",
  6: "الأنعام",
  7: "الأعراف",
  8: "الأنفال",
  9: "التوبة",
  10: "يونس",
  11: "هود",
  12: "يوسف",
  13: "الرعد",
  14: "إبراهيم",
  15: "الحجر",
  16: "النحل",
  17: "الإسراء",
  18: "الكهف",
  19: "مريم",
  20: "طه",
  21: "الأنبياء",
  22: "الحج",
  23: "المؤمنون",
  24: "النور",
  25: "الفرقان",
  26: "الشعراء",
  27: "النمل",
  28: "القصص",
  29: "العنكبوت",
  30: "الروم",
  31: "لقمان",
  32: "السجدة",
  33: "الأحزاب",
  34: "سبأ",
  35: "فاطر",
  36: "يس",
  37: "الصافات",
  38: "ص",
  39: "الزمر",
  40: "غافر",
  41: "فصلت",
  42: "الشورى",
  43: "الزخرف",
  44: "الدخان",
  45: "الجاثية",
  46: "الأحقاف",
  47: "محمد",
  48: "الفتح",
  49: "الحجرات",
  50: "ق",
  51: "الذاريات",
  52: "الطور",
  53: "النجم",
  54: "القمر",
  55: "الرحمن",
  56: "الواقعة",
  57: "الحديد",
  58: "المجادلة",
  59: "الحشر",
  60: "الممتحنة",
  61: "الصف",
  62: "الجمعة",
  63: "المنافقون",
  64: "التغابن",
  65: "الطلاق",
  66: "التحريم",
  67: "الملك",
  68: "القلم",
  69: "الحاقة",
  70: "المعارج",
  71: "نوح",
  72: "الجن",
  73: "المزمل",
  74: "المدثر",
  75: "القيامة",
  76: "الإنسان",
  77: "المرسلات",
  78: "النبأ",
  79: "النازعات",
  80: "عبس",
  81: "التكوير",
  82: "الانفطار",
  83: "المطففين",
  84: "الانشقاق",
  85: "البروج",
  86: "الطارق",
  87: "الأعلى",
  88: "الغاشية",
  89: "الفجر",
  90: "البلد",
  91: "الشمس",
  92: "الليل",
  93: "الضحى",
  94: "الشرح",
  95: "التين",
  96: "العلق",
  97: "القدر",
  98: "البينة",
  99: "الزلزلة",
  100: "العاديات",
  101: "القارعة",
  102: "التكاثر",
  103: "العصر",
  104: "الهمزة",
  105: "الفيل",
  106: "قريش",
  107: "الماعون",
  108: "الكوثر",
  109: "الكافرون",
  110: "النصر",
  111: "المسد",
  112: "الإخلاص",
  113: "الفلق",
  114: "الناس",
};

// ============================================================
// Flower stage → visual properties
// ============================================================
const STAGE_ORDER: FlowerStage[] = ["seed", "sprout", "bud", "bloom", "wilted"];

function getStageWeight(stage: FlowerStage): number {
  switch (stage) {
    case "bloom":
      return 1.0;
    case "bud":
      return 0.6;
    case "sprout":
      return 0.3;
    case "wilted":
      return 0.1;
    default:
      return 0;
  }
}

const STAGE_COLORS: Record<FlowerStage, string> = {
  seed: "bg-muted/30",
  sprout: "bg-emerald-300/50 dark:bg-emerald-700/40",
  bud: "bg-emerald-500/60 dark:bg-emerald-500/50",
  bloom: "bg-amber-400/70 dark:bg-amber-500/60",
  wilted: "bg-orange-800/50 dark:bg-orange-900/50",
};

// ============================================================
// Compute section stats from tree's flower data
// ============================================================
interface SectionStats {
  section: SurahSection;
  totalAyahs: number;
  bloomCount: number;
  budCount: number;
  sproutCount: number;
  wiltedCount: number;
  seedCount: number;
  mastery: number; // 0-100 weighted score
  flowers: Array<{ ayahNumber: number; stage: FlowerStage }>;
}

function computeSectionStats(
  tree: SurahTree,
  section: SurahSection
): SectionStats {
  const flowers = tree.flowers.filter(
    (f) => f.ayahNumber >= section.startAyah && f.ayahNumber <= section.endAyah
  );
  const totalAyahs = section.endAyah - section.startAyah + 1;

  let bloomCount = 0;
  let budCount = 0;
  let sproutCount = 0;
  let wiltedCount = 0;
  let seedCount = 0;
  let weightSum = 0;

  for (const f of flowers) {
    weightSum += getStageWeight(f.stage);
    switch (f.stage) {
      case "bloom":
        bloomCount++;
        break;
      case "bud":
        budCount++;
        break;
      case "sprout":
        sproutCount++;
        break;
      case "wilted":
        wiltedCount++;
        break;
      default:
        seedCount++;
        break;
    }
  }

  // Fill remaining as seeds
  seedCount += totalAyahs - flowers.length;

  const mastery =
    totalAyahs > 0 ? Math.round((weightSum / totalAyahs) * 100) : 0;

  return {
    section,
    totalAyahs,
    bloomCount,
    budCount,
    sproutCount,
    wiltedCount,
    seedCount,
    mastery,
    flowers: flowers.map((f) => ({ ayahNumber: f.ayahNumber, stage: f.stage })),
  };
}

// ============================================================
// Mini-tree SVG for a section (represents a branch/subtree)
// ============================================================
function SectionMiniTree({
  stats,
  index,
}: {
  stats: SectionStats;
  index: number;
}) {
  const { mastery, section } = stats;

  // Tree grows with mastery
  const scale = 0.6 + (mastery / 100) * 0.4;
  const trunkH = 24 + mastery * 0.12;
  const canopyR = 16 + mastery * 0.12;

  // Color shifts with mastery
  const canopyFill =
    mastery >= 80
      ? "#fbbf24" // golden
      : mastery >= 50
        ? "#34d399" // green
        : mastery >= 20
          ? "#a7f3d0" // light green
          : "#d1d5db"; // gray

  const canopyStroke =
    mastery >= 80
      ? "#d97706"
      : mastery >= 50
        ? "#059669"
        : mastery >= 20
          ? "#6ee7b7"
          : "#9ca3af";

  // Flower dots on canopy
  const flowerSlots = Math.min(stats.totalAyahs, 8);
  const flowerAngleStep = (Math.PI * 1.6) / Math.max(flowerSlots - 1, 1);
  const startAngle = Math.PI * 0.7;

  return (
    <svg width={80} height={80} viewBox="0 0 80 80" className="flex-shrink-0">
      {/* Glow for high mastery */}
      {mastery >= 70 && (
        <defs>
          <filter
            id={`sec-glow-${index}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      <g transform={`translate(40, 72) scale(${scale})`}>
        {/* Roots */}
        <path
          d="M0 0 L-8 8 M0 0 L0 9 M0 0 L8 8"
          fill="none"
          stroke="#8B6914"
          strokeWidth={1}
          opacity={0.4}
        />

        {/* Trunk */}
        <rect
          x={-3}
          y={-trunkH}
          width={6}
          height={trunkH}
          rx={2}
          fill="#8B6914"
          stroke="#5C4A10"
          strokeWidth={0.5}
        />

        {/* Branch nubs */}
        <line
          x1={-3}
          y1={-trunkH * 0.6}
          x2={-8}
          y2={-trunkH * 0.7}
          stroke="#8B6914"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={3}
          y1={-trunkH * 0.4}
          x2={8}
          y2={-trunkH * 0.5}
          stroke="#8B6914"
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Canopy */}
        <circle
          cx={0}
          cy={-trunkH - canopyR * 0.4}
          r={canopyR}
          fill={canopyFill}
          stroke={canopyStroke}
          strokeWidth={1}
          opacity={0.85}
          filter={mastery >= 70 ? `url(#sec-glow-${index})` : undefined}
        />

        {/* Smaller second canopy layer for depth */}
        <circle
          cx={-canopyR * 0.3}
          cy={-trunkH - canopyR * 0.7}
          r={canopyR * 0.65}
          fill={canopyFill}
          stroke={canopyStroke}
          strokeWidth={0.5}
          opacity={0.6}
        />

        {/* Flower dots on canopy edge */}
        {Array.from({ length: flowerSlots }).map((_, fi) => {
          const angle = startAngle + fi * flowerAngleStep;
          const fx = Math.cos(angle) * (canopyR * 0.7);
          const fy =
            -trunkH - canopyR * 0.4 + Math.sin(angle) * (canopyR * 0.7);

          // Map flower index to actual flower stage
          const flowerIdx = Math.floor((fi / flowerSlots) * stats.totalAyahs);
          const flower = stats.flowers[flowerIdx];
          const stage = flower?.stage ?? "seed";

          if (stage === "seed") return null;

          const dotColor =
            stage === "bloom"
              ? "#fbbf24"
              : stage === "bud"
                ? "#34d399"
                : stage === "sprout"
                  ? "#a7f3d0"
                  : "#92400e";

          return (
            <circle
              key={fi}
              cx={fx}
              cy={fy}
              r={stage === "bloom" ? 2.5 : 1.8}
              fill={dotColor}
              opacity={0.9}
            />
          );
        })}
      </g>
    </svg>
  );
}

// ============================================================
// Section Card — one thematic section rendered as a card
// ============================================================
function SectionCard({
  stats,
  index,
  surahNumber,
  onPractice,
}: {
  stats: SectionStats;
  index: number;
  surahNumber: number;
  onPractice: (startAyah: number, endAyah: number) => void;
}) {
  const { section, totalAyahs, bloomCount, mastery } = stats;

  const stageDistribution = [
    { label: "Bloom", count: stats.bloomCount, color: "bg-amber-400" },
    { label: "Bud", count: stats.budCount, color: "bg-emerald-400" },
    { label: "Sprout", count: stats.sproutCount, color: "bg-emerald-200" },
    { label: "Wilted", count: stats.wiltedCount, color: "bg-orange-700" },
    { label: "Seed", count: stats.seedCount, color: "bg-muted" },
  ].filter((s) => s.count > 0);

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Mini tree */}
        <SectionMiniTree stats={stats} index={index} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: section.color }}
            />
            <h4 className="text-sm font-semibold truncate">{section.name}</h4>
          </div>
          <p className="text-xs text-muted-foreground font-arabic" dir="rtl">
            {section.nameAr}
          </p>

          {/* Ayah range */}
          <p className="text-[11px] text-muted-foreground mt-1">
            Ayahs {section.startAyah}-{section.endAyah} ({totalAyahs} ayahs)
          </p>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
              <span>
                {bloomCount}/{totalAyahs} memorized
              </span>
              <span className="font-medium">{mastery}%</span>
            </div>
            <Progress value={mastery} className="h-1.5" />
          </div>

          {/* Flower stage distribution bar */}
          <div className="flex h-2 rounded-full overflow-hidden mt-2 bg-muted/30">
            {stageDistribution.map((s, si) => (
              <div
                key={si}
                className={`${s.color} transition-all`}
                style={{ width: `${(s.count / totalAyahs) * 100}%` }}
                title={`${s.label}: ${s.count}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Practice button */}
      <button
        onClick={() => onPractice(section.startAyah, section.endAyah)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
      >
        <Droplets className="h-3 w-3" />
        Practice this section
      </button>
    </div>
  );
}

// ============================================================
// Hizb Marker — shows where hizb boundaries fall
// ============================================================
function HizbMarkers({
  hizbs,
  totalAyahs,
}: {
  hizbs: Array<{ hizbNumber: number; juz: number; startAyah: number }>;
  totalAyahs: number;
}) {
  if (hizbs.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
        <BookOpen className="h-3.5 w-3.5" />
        Hizb Boundaries
      </p>
      <div className="relative h-6 bg-muted/30 rounded-full overflow-hidden">
        {/* Hizb markers */}
        {hizbs.map((h) => {
          const pct = ((h.startAyah - 1) / totalAyahs) * 100;
          return (
            <div
              key={h.hizbNumber}
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500/60"
              style={{ left: `${pct}%` }}
              title={`Hizb ${h.hizbNumber} (Juz ${h.juz}) — Ayah ${h.startAyah}`}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-blue-500 font-medium whitespace-nowrap">
                H{h.hizbNumber}
              </div>
            </div>
          );
        })}
        {/* Scale */}
        <div className="absolute bottom-0 left-1 text-[8px] text-muted-foreground/60">
          1
        </div>
        <div className="absolute bottom-0 right-1 text-[8px] text-muted-foreground/60">
          {totalAyahs}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main component
// ============================================================
interface SurahCompositionViewProps {
  tree: SurahTree;
  onBack: () => void;
  hideHeader?: boolean;
}

export function SurahCompositionView({
  tree,
  onBack,
  hideHeader,
}: SurahCompositionViewProps) {
  const router = useRouter();
  const sections = SURAH_MAWDUAT[tree.surahNumber];
  const arabicName = SURAH_ARABIC[tree.surahNumber] ?? "";

  // For surahs without detailed mawdu'at data, create a single section
  const effectiveSections: SurahSection[] = sections ?? [
    {
      name: tree.surahName,
      nameAr: arabicName,
      startAyah: 1,
      endAyah: tree.totalAyahs,
      color: "#3b82f6",
    },
  ];

  const hizbs = useMemo(
    () => getHizbsInSurah(tree.surahNumber, tree.totalAyahs),
    [tree.surahNumber, tree.totalAyahs]
  );

  const sectionStats = useMemo(() => {
    return effectiveSections.map((section) =>
      computeSectionStats(tree, section)
    );
  }, [tree, effectiveSections]);

  const overallMastery = useMemo(() => {
    if (sectionStats.length === 0) return 0;
    const total = sectionStats.reduce(
      (sum, s) => sum + s.mastery * s.totalAyahs,
      0
    );
    const totalAyahs = sectionStats.reduce((sum, s) => sum + s.totalAyahs, 0);
    return totalAyahs > 0 ? Math.round(total / totalAyahs) : 0;
  }, [sectionStats]);

  const handlePractice = (startAyah: number, endAyah: number) => {
    router.push(
      `/memorize?surah=${tree.surahNumber}&start=${startAyah}&end=${endAyah}`
    );
  };

  return (
    <div className="space-y-4">
      {/* Header (hidden when inside SurahPopup which provides its own) */}
      {!hideHeader && (
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">
                {tree.surahNumber}. {tree.surahName}
              </h3>
              <span className="text-lg font-arabic" dir="rtl">
                {arabicName}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {tree.totalAyahs} ayahs — {sectionStats.length} thematic sections
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {overallMastery}%
            </span>
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Overall Mastery</span>
          <span className="font-medium">
            {tree.bloomCount}/{tree.totalAyahs} blooming
          </span>
        </div>
        <Progress value={overallMastery} className="h-2" />
      </div>

      {/* Hizb boundaries */}
      <HizbMarkers hizbs={hizbs} totalAyahs={tree.totalAyahs} />

      {/* Section composition strip — visual map of all sections */}
      <div className="flex h-8 rounded-lg overflow-hidden border border-border">
        {sectionStats.map((stats, i) => {
          const widthPct = (stats.totalAyahs / tree.totalAyahs) * 100;
          return (
            <div
              key={i}
              className="relative flex items-center justify-center text-[8px] font-medium text-white/90 overflow-hidden transition-all hover:brightness-110"
              style={{
                width: `${widthPct}%`,
                backgroundColor: stats.section.color,
                opacity: 0.5 + (stats.mastery / 100) * 0.5,
              }}
              title={`${stats.section.name}: ${stats.mastery}%`}
            >
              {widthPct > 8 && (
                <span className="truncate px-1">
                  {stats.section.name.split(" ")[0]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Section cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sectionStats.map((stats, i) => (
          <SectionCard
            key={i}
            stats={stats}
            index={i}
            surahNumber={tree.surahNumber}
            onPractice={handlePractice}
          />
        ))}
      </div>
    </div>
  );
}
