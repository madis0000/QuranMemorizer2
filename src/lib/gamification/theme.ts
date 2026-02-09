/**
 * Gamification Theme Tokens — Enchanted Forest Design System
 *
 * All colors/classes mapped to the forest green + gold palette used
 * across the app. Import these tokens instead of hardcoding colors.
 */

// --- Rarity Themes ---
export const RARITY_THEME = {
  common: {
    bg: "bg-[#059669]/10 dark:bg-[#00E5A0]/10",
    border: "border-[#059669]/30 dark:border-[#00E5A0]/30",
    text: "text-[#059669] dark:text-[#00E5A0]",
    badge:
      "bg-[#059669]/15 text-[#059669] dark:bg-[#00E5A0]/15 dark:text-[#00E5A0]",
    gradient:
      "from-[#059669] to-[#047857] dark:from-[#00E5A0]/20 dark:to-[#00E5A0]/10",
    particle: "#059669",
    particleDark: "#00E5A0",
    label: "Common",
  },
  rare: {
    bg: "bg-[#0d9488]/10 dark:bg-[#2dd4bf]/10",
    border: "border-[#0d9488]/30 dark:border-[#2dd4bf]/30",
    text: "text-[#0d9488] dark:text-[#2dd4bf]",
    badge:
      "bg-[#0d9488]/15 text-[#0d9488] dark:bg-[#2dd4bf]/15 dark:text-[#2dd4bf]",
    gradient:
      "from-[#0d9488] to-[#0f766e] dark:from-[#2dd4bf]/20 dark:to-[#2dd4bf]/10",
    particle: "#0d9488",
    particleDark: "#2dd4bf",
    label: "Rare",
  },
  epic: {
    bg: "bg-[#065f46]/10 dark:bg-[#34d399]/10",
    border: "border-[#065f46]/30 dark:border-[#34d399]/30",
    text: "text-[#065f46] dark:text-[#34d399]",
    badge:
      "bg-[#065f46]/15 text-[#065f46] dark:bg-[#34d399]/15 dark:text-[#34d399]",
    gradient:
      "from-[#065f46] to-[#064e3b] dark:from-[#34d399]/20 dark:to-[#34d399]/10",
    particle: "#065f46",
    particleDark: "#34d399",
    label: "Epic",
  },
  legendary: {
    bg: "bg-[#FFD700]/10 dark:bg-[#FFD700]/10",
    border: "border-[#FFD700]/30 dark:border-[#FFD700]/30",
    text: "text-[#B8860B] dark:text-[#FFD700]",
    badge:
      "bg-[#FFD700]/15 text-[#B8860B] dark:bg-[#FFD700]/15 dark:text-[#FFD700]",
    gradient:
      "from-[#FFD700] to-[#B8860B] dark:from-[#FFD700]/20 dark:to-[#FFD700]/10",
    particle: "#B8860B",
    particleDark: "#FFD700",
    label: "Legendary",
  },
} as const;

// --- League Themes ---
export const LEAGUE_THEME = {
  talib: {
    bg: "bg-[#059669]/10 dark:bg-[#00E5A0]/10",
    border: "border-[#059669]/30 dark:border-[#00E5A0]/30",
    text: "text-[#059669] dark:text-[#00E5A0]",
    gradient: "from-[#059669] to-[#047857]",
    icon: "text-[#059669] dark:text-[#00E5A0]",
    label: "Talib",
  },
  qari: {
    bg: "bg-[#0d9488]/10 dark:bg-[#2dd4bf]/10",
    border: "border-[#0d9488]/30 dark:border-[#2dd4bf]/30",
    text: "text-[#0d9488] dark:text-[#2dd4bf]",
    gradient: "from-[#0d9488] to-[#0f766e]",
    icon: "text-[#0d9488] dark:text-[#2dd4bf]",
    label: "Qari",
  },
  hafiz: {
    bg: "bg-[#065f46]/10 dark:bg-[#34d399]/10",
    border: "border-[#065f46]/30 dark:border-[#34d399]/30",
    text: "text-[#065f46] dark:text-[#34d399]",
    gradient: "from-[#065f46] to-[#064e3b]",
    icon: "text-[#065f46] dark:text-[#34d399]",
    label: "Hafiz",
  },
  sheikh: {
    bg: "bg-[#FFD700]/10 dark:bg-[#FFD700]/10",
    border: "border-[#FFD700]/30 dark:border-[#FFD700]/30",
    text: "text-[#B8860B] dark:text-[#FFD700]",
    gradient: "from-[#B8860B] to-[#8B6914]",
    icon: "text-[#B8860B] dark:text-[#FFD700]",
    label: "Sheikh",
  },
  imam: {
    bg: "bg-[#FFD700]/15 dark:bg-[#FFD700]/15",
    border: "border-[#FFD700]/50 dark:border-[#FFD700]/50",
    text: "text-[#8B6914] dark:text-[#FFD700]",
    gradient: "from-[#FFD700] to-[#B8860B]",
    icon: "text-[#FFD700] dark:text-[#FFD700]",
    label: "Imam",
  },
} as const;

// --- Mastery Themes ---
export const MASTERY_THEME = {
  none: {
    bg: "bg-[#D1E0D8]/50 dark:bg-[#1a2e23]/50",
    border: "border-[#D1E0D8] dark:border-[#00E5A0]/10",
    text: "text-muted-foreground",
    color: "#D1E0D8",
    colorDark: "#1a2e23",
  },
  bronze: {
    bg: "bg-[#92400e]/10 dark:bg-[#92400e]/15",
    border: "border-[#92400e]/30 dark:border-[#b45309]/30",
    text: "text-[#92400e] dark:text-[#d97706]",
    color: "#92400e",
    colorDark: "#d97706",
  },
  silver: {
    bg: "bg-[#6b7280]/10 dark:bg-[#9ca3af]/10",
    border: "border-[#6b7280]/30 dark:border-[#9ca3af]/30",
    text: "text-[#6b7280] dark:text-[#9ca3af]",
    color: "#6b7280",
    colorDark: "#9ca3af",
  },
  gold: {
    bg: "bg-[#FFD700]/10 dark:bg-[#FFD700]/10",
    border: "border-[#FFD700]/30 dark:border-[#FFD700]/30",
    text: "text-[#B8860B] dark:text-[#FFD700]",
    color: "#B8860B",
    colorDark: "#FFD700",
  },
  platinum: {
    bg: "bg-[#059669]/10 dark:bg-[#00E5A0]/10",
    border: "border-[#059669]/30 dark:border-[#00E5A0]/30",
    text: "text-[#059669] dark:text-[#00E5A0]",
    color: "#059669",
    colorDark: "#00E5A0",
  },
  master: {
    bg: "bg-[#065f46]/10 dark:bg-[#34d399]/10",
    border: "border-[#065f46]/30 dark:border-[#34d399]/30",
    text: "text-[#065f46] dark:text-[#34d399]",
    color: "#065f46",
    colorDark: "#34d399",
  },
} as const;

// --- Heatmap Themes (5-level green scale) ---
export const HEATMAP_THEME = {
  level0: "bg-[#D1E0D8]/50 dark:bg-[#1a2e23]/30",
  level1: "bg-[#059669]/20 dark:bg-[#00E5A0]/15",
  level2: "bg-[#059669]/40 dark:bg-[#00E5A0]/30",
  level3: "bg-[#059669]/60 dark:bg-[#00E5A0]/50",
  level4: "bg-[#059669] dark:bg-[#00E5A0]/80",
  colors: {
    level0: { light: "#D1E0D8", dark: "#1a2e23" },
    level1: { light: "#a7f3d0", dark: "rgba(0,229,160,0.25)" },
    level2: { light: "#6ee7b7", dark: "rgba(0,229,160,0.45)" },
    level3: { light: "#34d399", dark: "rgba(0,229,160,0.65)" },
    level4: { light: "#059669", dark: "rgba(0,229,160,0.85)" },
  },
} as const;

// --- Accuracy Themes (for charts) ---
export const ACCURACY_THEME = {
  excellent: { light: "#059669", dark: "#00E5A0" }, // 90-100%
  good: { light: "#0d9488", dark: "#2dd4bf" }, // 75-89%
  fair: { light: "#FFD700", dark: "#FFD700" }, // 60-74%
  poor: { light: "#B8860B", dark: "#d97706" }, // below 60%
  line: { light: "#059669", dark: "#00E5A0" }, // trend line
  fill: { light: "rgba(5,150,105,0.1)", dark: "rgba(0,229,160,0.1)" },
  grid: { light: "#D1E0D8", dark: "rgba(0,229,160,0.1)" },
} as const;

// --- Category Themes ---
export const CATEGORY_THEME = {
  practice: {
    bg: "bg-[#059669]/10 dark:bg-[#00E5A0]/10",
    text: "text-[#059669] dark:text-[#00E5A0]",
    icon: "text-[#059669] dark:text-[#00E5A0]",
  },
  streak: {
    bg: "bg-[#FFD700]/10 dark:bg-[#FFD700]/10",
    text: "text-[#B8860B] dark:text-[#FFD700]",
    icon: "text-[#FFD700]",
  },
  memorization: {
    bg: "bg-[#0d9488]/10 dark:bg-[#2dd4bf]/10",
    text: "text-[#0d9488] dark:text-[#2dd4bf]",
    icon: "text-[#0d9488] dark:text-[#2dd4bf]",
  },
  tajweed: {
    bg: "bg-[#065f46]/10 dark:bg-[#34d399]/10",
    text: "text-[#065f46] dark:text-[#34d399]",
    icon: "text-[#065f46] dark:text-[#34d399]",
  },
  speed: {
    bg: "bg-[#059669]/10 dark:bg-[#00E5A0]/10",
    text: "text-[#059669] dark:text-[#00E5A0]",
    icon: "text-[#059669] dark:text-[#00E5A0]",
  },
  special: {
    bg: "bg-[#FFD700]/10 dark:bg-[#FFD700]/10",
    text: "text-[#B8860B] dark:text-[#FFD700]",
    icon: "text-[#B8860B] dark:text-[#FFD700]",
  },
  secret: {
    bg: "bg-[#065f46]/10 dark:bg-[#34d399]/10",
    text: "text-[#065f46] dark:text-[#34d399]",
    icon: "text-[#065f46] dark:text-[#34d399]",
  },
} as const;

// --- Podium/Ranking Themes ---
export const PODIUM_THEME = {
  first: {
    bg: "bg-[#FFD700]/10 dark:bg-[#FFD700]/15",
    border: "border-[#FFD700]/30 dark:border-[#FFD700]/40",
    text: "text-[#B8860B] dark:text-[#FFD700]",
    gradient: "from-[#FFD700] to-[#B8860B]",
  },
  second: {
    bg: "bg-[#6b7280]/10 dark:bg-[#9ca3af]/10",
    border: "border-[#6b7280]/30 dark:border-[#9ca3af]/30",
    text: "text-[#6b7280] dark:text-[#9ca3af]",
    gradient: "from-[#9ca3af] to-[#6b7280]",
  },
  third: {
    bg: "bg-[#92400e]/10 dark:bg-[#b45309]/10",
    border: "border-[#92400e]/30 dark:border-[#b45309]/30",
    text: "text-[#92400e] dark:text-[#b45309]",
    gradient: "from-[#b45309] to-[#92400e]",
  },
} as const;
