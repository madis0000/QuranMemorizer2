"use client";

import { useCallback, useMemo, useState } from "react";
import {
  HIZB_DATA,
  JUZ_BOUNDARIES,
  SURAH_AYAH_COUNTS,
  SURAH_NAMES,
} from "@/data/hizb-data";
import { SUBJECT_THEMES } from "@/data/subject-themes";
import type { Surah } from "@/types/quran";
import {
  AlignLeft,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  Layers,
  Pause,
  Play,
  ScrollText,
  Settings2,
  Square,
  Tag,
} from "lucide-react";

import { getSurahForPage } from "@/lib/quran/mushaf-layout";
import { useSurahs } from "@/hooks/use-quran";
import type { MemorizeMode } from "@/stores/quranStore";
import {
  useSessionStore,
  type HideMode,
  type MistakeSensitivity,
  type RevealMode,
  type StartSessionConfig,
} from "@/stores/sessionStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MODES: Array<{
  value: MemorizeMode;
  label: string;
  icon: React.ReactNode;
  shortLabel: string;
}> = [
  {
    value: "mushaf",
    label: "Mushaf",
    shortLabel: "Mushaf",
    icon: <BookOpen className="h-3.5 w-3.5" />,
  },
  {
    value: "ayah",
    label: "Ayah",
    shortLabel: "Ayah",
    icon: <AlignLeft className="h-3.5 w-3.5" />,
  },
  {
    value: "surah",
    label: "Surah",
    shortLabel: "Surah",
    icon: <ScrollText className="h-3.5 w-3.5" />,
  },
  {
    value: "juz",
    label: "Juz",
    shortLabel: "Juz",
    icon: <Layers className="h-3.5 w-3.5" />,
  },
  {
    value: "hizb",
    label: "Hizb",
    shortLabel: "Hizb",
    icon: <Grid2x2 className="h-3.5 w-3.5" />,
  },
  {
    value: "subject",
    label: "Subject",
    shortLabel: "Subj",
    icon: <Tag className="h-3.5 w-3.5" />,
  },
];

interface MemorizeToolbarProps {
  memorizeMode: MemorizeMode;
  onModeChange: (mode: MemorizeMode) => void;
  isActive: boolean;
  onStartSession: (config: StartSessionConfig) => void;
  onEndSession: () => void;
  /** Called when user clicks Save & Exit to pause session to DB */
  onSaveAndExit?: () => void;
  /** Extra action buttons rendered in the toolbar (e.g. sidebar toggle) */
  extraActions?: React.ReactNode;
}

export function MemorizeToolbar({
  memorizeMode,
  onModeChange,
  isActive,
  onStartSession,
  onEndSession,
  onSaveAndExit,
  extraActions,
}: MemorizeToolbarProps) {
  const session = useSessionStore();
  const { data: surahs } = useSurahs();

  // === Per-mode local picker state ===
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [startAyah, setStartAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(7);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedJuz, setSelectedJuz] = useState(30);
  const [selectedHizb, setSelectedHizb] = useState(59);
  const [selectedSubject, setSelectedSubject] = useState(
    SUBJECT_THEMES[0]?.id ?? ""
  );

  const maxAyahs = SURAH_AYAH_COUNTS[selectedSurah] ?? 7;

  const handleSurahChange = useCallback((surahNum: number) => {
    setSelectedSurah(surahNum);
    setStartAyah(1);
    setEndAyah(SURAH_AYAH_COUNTS[surahNum] ?? 7);
  }, []);

  // Build verse list for juz mode
  const buildJuzVerseList = useCallback((juzNumber: number) => {
    const juzStart = JUZ_BOUNDARIES[juzNumber - 1];
    const juzEnd = juzNumber < 30 ? JUZ_BOUNDARIES[juzNumber] : null;

    const verses: Array<{ surahNumber: number; ayahNumber: number }> = [];
    const startSurah = juzStart.startSurah;
    const startAy = juzStart.startAyah;
    let endSurah = juzEnd ? juzEnd.startSurah : 114;
    let endAy = juzEnd ? juzEnd.startAyah - 1 : SURAH_AYAH_COUNTS[114];

    // If juzEnd starts at ayah 1 of a new surah, the previous juz ends at the last ayah of the preceding surah
    if (juzEnd && juzEnd.startAyah === 1) {
      endSurah = juzEnd.startSurah - 1;
      endAy = SURAH_AYAH_COUNTS[endSurah] ?? 7;
    }

    for (let s = startSurah; s <= endSurah; s++) {
      const ayahCount = SURAH_AYAH_COUNTS[s] ?? 7;
      const from = s === startSurah ? startAy : 1;
      const to = s === endSurah ? endAy : ayahCount;
      for (let a = from; a <= to; a++) {
        verses.push({ surahNumber: s, ayahNumber: a });
      }
    }
    return verses;
  }, []);

  // Build verse list for hizb mode
  const buildHizbVerseList = useCallback((hizbNumber: number) => {
    const hizbStart = HIZB_DATA[hizbNumber - 1];
    const hizbEnd = hizbNumber < 60 ? HIZB_DATA[hizbNumber] : null;

    const verses: Array<{ surahNumber: number; ayahNumber: number }> = [];
    const startSurah = hizbStart.startSurah;
    const startAy = hizbStart.startAyah;
    let endSurah = hizbEnd ? hizbEnd.startSurah : 114;
    let endAy = hizbEnd ? hizbEnd.startAyah - 1 : SURAH_AYAH_COUNTS[114];

    if (hizbEnd && hizbEnd.startAyah === 1) {
      endSurah = hizbEnd.startSurah - 1;
      endAy = SURAH_AYAH_COUNTS[endSurah] ?? 7;
    }

    for (let s = startSurah; s <= endSurah; s++) {
      const ayahCount = SURAH_AYAH_COUNTS[s] ?? 7;
      const from = s === startSurah ? startAy : 1;
      const to = s === endSurah ? endAy : ayahCount;
      for (let a = from; a <= to; a++) {
        verses.push({ surahNumber: s, ayahNumber: a });
      }
    }
    return verses;
  }, []);

  const handleStart = useCallback(() => {
    switch (memorizeMode) {
      case "mushaf": {
        const surah = getSurahForPage(selectedPage);
        const totalAyahsForSurah = SURAH_AYAH_COUNTS[surah] ?? 7;
        onStartSession({
          mode: "memorize",
          targetType: "mushaf",
          surahNumber: surah,
          startAyah: 1,
          endAyah: totalAyahsForSurah,
          pageNumber: selectedPage,
        });
        break;
      }
      case "ayah": {
        const clampedStart = Math.max(1, Math.min(startAyah, maxAyahs));
        const clampedEnd = Math.max(clampedStart, Math.min(endAyah, maxAyahs));
        onStartSession({
          mode: "memorize",
          targetType: "ayah",
          surahNumber: selectedSurah,
          startAyah: clampedStart,
          endAyah: clampedEnd,
        });
        break;
      }
      case "surah": {
        const totalAyahs = SURAH_AYAH_COUNTS[selectedSurah] ?? 7;
        onStartSession({
          mode: "memorize",
          targetType: "surah",
          surahNumber: selectedSurah,
          startAyah: 1,
          endAyah: totalAyahs,
        });
        break;
      }
      case "juz": {
        const verses = buildJuzVerseList(selectedJuz);
        if (verses.length === 0) return;
        const first = verses[0];
        const last = verses[verses.length - 1];
        onStartSession({
          mode: "memorize",
          targetType: "juz",
          surahNumber: first.surahNumber,
          startAyah: first.ayahNumber,
          endAyah:
            first.surahNumber === last.surahNumber
              ? last.ayahNumber
              : (SURAH_AYAH_COUNTS[first.surahNumber] ?? 7),
          verseList: verses,
          juzNumber: selectedJuz,
        });
        break;
      }
      case "hizb": {
        const verses = buildHizbVerseList(selectedHizb);
        if (verses.length === 0) return;
        const first = verses[0];
        const last = verses[verses.length - 1];
        onStartSession({
          mode: "memorize",
          targetType: "hizb",
          surahNumber: first.surahNumber,
          startAyah: first.ayahNumber,
          endAyah:
            first.surahNumber === last.surahNumber
              ? last.ayahNumber
              : (SURAH_AYAH_COUNTS[first.surahNumber] ?? 7),
          verseList: verses,
          hizbNumber: selectedHizb,
        });
        break;
      }
      case "subject": {
        const theme = SUBJECT_THEMES.find((t) => t.id === selectedSubject);
        if (!theme || theme.verses.length === 0) return;
        const first = theme.verses[0];
        const last = theme.verses[theme.verses.length - 1];
        onStartSession({
          mode: "memorize",
          targetType: "subject",
          surahNumber: first.surahNumber,
          startAyah: first.ayahNumber,
          endAyah:
            first.surahNumber === last.surahNumber
              ? last.ayahNumber
              : (SURAH_AYAH_COUNTS[first.surahNumber] ?? 7),
          verseList: theme.verses,
          subjectId: selectedSubject,
        });
        break;
      }
    }
  }, [
    memorizeMode,
    selectedSurah,
    startAyah,
    endAyah,
    maxAyahs,
    selectedPage,
    selectedJuz,
    selectedHizb,
    selectedSubject,
    onStartSession,
    buildJuzVerseList,
    buildHizbVerseList,
  ]);

  // Surah options for select
  const surahOptions = useMemo(() => {
    if (surahs) {
      return surahs.map((s: Surah) => ({
        value: s.number,
        label: `${s.number}. ${s.englishName}`,
      }));
    }
    // Fallback to SURAH_NAMES
    return Object.entries(SURAH_NAMES).map(([num, name]) => ({
      value: parseInt(num),
      label: `${num}. ${name}`,
    }));
  }, [surahs]);

  const currentModeConfig =
    MODES.find((m) => m.value === memorizeMode) ?? MODES[0];

  return (
    <header className="shrink-0 border-b border-[#D1E0D8]/40 bg-[#F8FAF9] dark:border-[#1E3228] dark:bg-[#121E18]">
      <div className="flex h-11 items-center gap-2 px-3">
        {/* Mode Selector — dropdown on mobile, segmented on sm+ */}
        <div className="flex items-center">
          {/* Mobile: dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs sm:hidden"
                disabled={isActive}
              >
                {currentModeConfig.icon}
                {currentModeConfig.shortLabel}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {MODES.map((m) => (
                <DropdownMenuItem
                  key={m.value}
                  onClick={() => onModeChange(m.value)}
                  className={memorizeMode === m.value ? "font-semibold" : ""}
                >
                  <span className="mr-2">{m.icon}</span>
                  {m.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop: segmented buttons */}
          <div className="hidden sm:flex items-center gap-0.5 rounded-md border border-[#D1E0D8]/40 dark:border-[#1E3228] p-0.5 bg-white/50 dark:bg-white/5">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => !isActive && onModeChange(m.value)}
                disabled={isActive}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                  memorizeMode === m.value
                    ? "bg-[#059669] text-white dark:bg-[#00E5A0] dark:text-[#0A1210]"
                    : "text-muted-foreground hover:bg-accent disabled:opacity-50"
                }`}
              >
                {m.icon}
                <span className="hidden md:inline">{m.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-[#D1E0D8]/40 dark:bg-[#1E3228]" />

        {/* Mode-specific inline picker controls */}
        <div className="flex flex-1 items-center gap-2 overflow-hidden min-w-0">
          {!isActive ? (
            <InlinePickerControls
              mode={memorizeMode}
              surahOptions={surahOptions}
              selectedSurah={selectedSurah}
              onSurahChange={handleSurahChange}
              startAyah={startAyah}
              endAyah={endAyah}
              maxAyahs={maxAyahs}
              onStartAyahChange={setStartAyah}
              onEndAyahChange={setEndAyah}
              selectedPage={selectedPage}
              onPageChange={setSelectedPage}
              selectedJuz={selectedJuz}
              onJuzChange={setSelectedJuz}
              selectedHizb={selectedHizb}
              onHizbChange={setSelectedHizb}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
            />
          ) : (
            <ActiveSessionLabel mode={memorizeMode} session={session} />
          )}
        </div>

        {/* Right side: settings + start/end */}
        <div className="flex items-center gap-1.5">
          {isActive && <HideModeMenu session={session} />}
          {extraActions}

          {!isActive ? (
            <Button
              size="sm"
              className="h-7 gap-1 px-3 text-xs bg-[#059669] hover:bg-[#047857] text-white dark:bg-[#00E5A0] dark:text-[#0A1210] dark:hover:bg-[#00CC8E]"
              onClick={handleStart}
            >
              <Play className="h-3 w-3" />
              Start
            </Button>
          ) : (
            <>
              {onSaveAndExit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-3 text-xs"
                  onClick={onSaveAndExit}
                >
                  <Pause className="h-3 w-3" />
                  Save
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="h-7 gap-1 px-3 text-xs"
                onClick={onEndSession}
              >
                <Square className="h-3 w-3" />
                End
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// === Inline Picker Sub-components ===

interface InlinePickerProps {
  mode: MemorizeMode;
  surahOptions: Array<{ value: number; label: string }>;
  selectedSurah: number;
  onSurahChange: (v: number) => void;
  startAyah: number;
  endAyah: number;
  maxAyahs: number;
  onStartAyahChange: (v: number) => void;
  onEndAyahChange: (v: number) => void;
  selectedPage: number;
  onPageChange: (v: number) => void;
  selectedJuz: number;
  onJuzChange: (v: number) => void;
  selectedHizb: number;
  onHizbChange: (v: number) => void;
  selectedSubject: string;
  onSubjectChange: (v: string) => void;
}

const selectClass =
  "h-7 rounded border border-[#D1E0D8]/60 dark:border-[#1E3228] bg-white dark:bg-[#0A1210] text-xs px-1.5 focus:outline-none focus:ring-1 focus:ring-[#059669] dark:focus:ring-[#00E5A0] min-w-0";
const inputClass =
  "h-7 w-14 rounded border border-[#D1E0D8]/60 dark:border-[#1E3228] bg-white dark:bg-[#0A1210] text-xs px-1.5 text-center focus:outline-none focus:ring-1 focus:ring-[#059669] dark:focus:ring-[#00E5A0]";

function InlinePickerControls(props: InlinePickerProps) {
  switch (props.mode) {
    case "mushaf":
      return (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              props.onPageChange(Math.max(1, props.selectedPage - 1))
            }
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <span className="text-xs font-medium tabular-nums">Page</span>
          <input
            type="number"
            min={1}
            max={604}
            value={props.selectedPage}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (v >= 1 && v <= 604) props.onPageChange(v);
            }}
            className={inputClass}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              props.onPageChange(Math.min(604, props.selectedPage + 1))
            }
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            of 604
          </span>
        </div>
      );

    case "ayah":
      return (
        <div className="flex items-center gap-1.5 overflow-hidden">
          <select
            value={props.selectedSurah}
            onChange={(e) => props.onSurahChange(parseInt(e.target.value))}
            className={`${selectClass} max-w-[140px] truncate`}
          >
            {props.surahOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={props.maxAyahs}
            value={props.startAyah}
            onChange={(e) =>
              props.onStartAyahChange(
                Math.max(1, parseInt(e.target.value) || 1)
              )
            }
            className={inputClass}
            title="From ayah"
          />
          <span className="text-xs text-muted-foreground">-</span>
          <input
            type="number"
            min={props.startAyah}
            max={props.maxAyahs}
            value={props.endAyah}
            onChange={(e) =>
              props.onEndAyahChange(
                Math.max(
                  props.startAyah,
                  parseInt(e.target.value) || props.startAyah
                )
              )
            }
            className={inputClass}
            title="To ayah"
          />
        </div>
      );

    case "surah":
      return (
        <div className="flex items-center gap-1.5">
          <select
            value={props.selectedSurah}
            onChange={(e) => props.onSurahChange(parseInt(e.target.value))}
            className={`${selectClass} max-w-[200px]`}
          >
            {props.surahOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            {SURAH_AYAH_COUNTS[props.selectedSurah] ?? "?"} ayahs
          </span>
        </div>
      );

    case "juz":
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium">Juz</span>
          <select
            value={props.selectedJuz}
            onChange={(e) => props.onJuzChange(parseInt(e.target.value))}
            className={`${selectClass} w-20`}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            {
              SURAH_NAMES[
                JUZ_BOUNDARIES[props.selectedJuz - 1]?.startSurah ?? 1
              ]
            }
          </span>
        </div>
      );

    case "hizb":
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium">Hizb</span>
          <select
            value={props.selectedHizb}
            onChange={(e) => props.onHizbChange(parseInt(e.target.value))}
            className={`${selectClass} w-20`}
          >
            {HIZB_DATA.map((h) => (
              <option key={h.number} value={h.number}>
                {h.number}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            Juz {HIZB_DATA[props.selectedHizb - 1]?.juz ?? "?"}
          </span>
        </div>
      );

    case "subject":
      return (
        <div className="flex items-center gap-1.5">
          <select
            value={props.selectedSubject}
            onChange={(e) => props.onSubjectChange(e.target.value)}
            className={`${selectClass} max-w-[200px]`}
          >
            {SUBJECT_THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nameEn}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            {SUBJECT_THEMES.find((t) => t.id === props.selectedSubject)?.verses
              .length ?? 0}{" "}
            verses
          </span>
        </div>
      );
  }
}

interface ActiveSessionData {
  surahNumber: number;
  currentAyah: number;
  startAyah: number;
  endAyah: number;
  currentPageNumber: number;
  juzNumber: number | null;
  hizbNumber: number | null;
  subjectId: string | null;
  verseList: Array<{ surahNumber: number; ayahNumber: number }>;
  currentVerseIndex: number;
}

function ActiveSessionLabel({
  mode,
  session,
}: {
  mode: MemorizeMode;
  session: ActiveSessionData;
}) {
  const currentVerse =
    session.verseList.length > 0
      ? session.verseList[session.currentVerseIndex]
      : null;
  const displaySurah = currentVerse?.surahNumber ?? session.surahNumber;
  const displayAyah = currentVerse?.ayahNumber ?? session.currentAyah;

  switch (mode) {
    case "mushaf":
      return <MushafPageNav />;
    case "ayah":
      return (
        <span className="text-xs font-medium truncate">
          {SURAH_NAMES[session.surahNumber] ?? `Surah ${session.surahNumber}`} :{" "}
          {session.startAyah}-{session.endAyah}
        </span>
      );
    case "surah":
      return (
        <span className="text-xs font-medium truncate">
          {SURAH_NAMES[session.surahNumber] ?? `Surah ${session.surahNumber}`} —
          Ayah {session.currentAyah}
        </span>
      );
    case "juz":
      return (
        <span className="text-xs font-medium truncate">
          Juz {session.juzNumber} — {SURAH_NAMES[displaySurah]} {displaySurah}:
          {displayAyah}
        </span>
      );
    case "hizb":
      return (
        <span className="text-xs font-medium truncate">
          Hizb {session.hizbNumber} — {SURAH_NAMES[displaySurah]} {displaySurah}
          :{displayAyah}
        </span>
      );
    case "subject": {
      const theme = SUBJECT_THEMES.find((t) => t.id === session.subjectId);
      return (
        <span className="text-xs font-medium truncate">
          {theme?.nameEn ?? "Subject"} — {displaySurah}:{displayAyah}
        </span>
      );
    }
  }
}

/** Mushaf page navigator — reads and writes the store directly. */
function MushafPageNav() {
  const currentPage = useSessionStore((s) => s.currentPageNumber);

  const handlePageNav = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > 604) return;
    // Single atomic update to avoid intermediate re-renders that
    // could trigger useMushafNav's init effect on remount.
    useSessionStore.setState({
      currentPageNumber: newPage,
      mushafCurrentAyahKey: null,
      revealedWordKeys: new Set<string>(),
    });
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        disabled={currentPage <= 1}
        onClick={() => handlePageNav(currentPage - 1)}
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>
      <span className="text-xs font-medium tabular-nums">
        Page {currentPage}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        disabled={currentPage >= 604}
        onClick={() => handlePageNav(currentPage + 1)}
      >
        <ChevronRight className="h-3 w-3" />
      </Button>
      <span className="text-[10px] text-muted-foreground hidden sm:inline">
        of 604
      </span>
    </div>
  );
}

interface HideModeSession {
  hideMode: HideMode;
  hideDifficulty: number;
  revealMode: RevealMode;
  mistakeSensitivity: MistakeSensitivity;
  setHideMode: (mode: HideMode) => void;
  setHideDifficulty: (level: number) => void;
  setRevealMode: (mode: RevealMode) => void;
  setMistakeSensitivity: (sensitivity: MistakeSensitivity) => void;
}

function HideModeMenu({ session }: { session: HideModeSession }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Settings2 className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[400px] overflow-y-auto"
      >
        <DropdownMenuLabel className="text-xs">Hide Mode</DropdownMenuLabel>
        {(
          [
            { value: "full_hide", label: "Full Hide" },
            { value: "first_letter", label: "First Letter" },
            { value: "random_blank", label: "Random Blank" },
            { value: "keyword_mode", label: "Keywords Only" },
            { value: "translation_recall", label: "Translation Recall" },
            { value: "context_recall", label: "Context Recall" },
            { value: "reverse_recall", label: "Reverse Recall" },
            { value: "audio_recall", label: "Audio Recall" },
          ] as { value: HideMode; label: string }[]
        ).map((mode) => (
          <DropdownMenuItem
            key={mode.value}
            onClick={() => session.setHideMode(mode.value)}
            className={`text-xs ${session.hideMode === mode.value ? "font-semibold" : ""}`}
          >
            {mode.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />

        {session.hideMode === "random_blank" && (
          <>
            <DropdownMenuLabel className="text-xs">
              Difficulty
            </DropdownMenuLabel>
            {[1, 2, 3, 4, 5].map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() => session.setHideDifficulty(level)}
                className={`text-xs ${session.hideDifficulty === level ? "font-semibold" : ""}`}
              >
                Level {level} ({level * 20}%)
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel className="text-xs">Reveal Mode</DropdownMenuLabel>
        {(["word", "phrase", "ayah", "line"] as RevealMode[]).map((mode) => (
          <DropdownMenuItem
            key={mode}
            onClick={() => session.setRevealMode(mode)}
            className={`text-xs ${session.revealMode === mode ? "font-semibold" : ""}`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs">Sensitivity</DropdownMenuLabel>
        {(["strict", "normal", "lenient"] as MistakeSensitivity[]).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => session.setMistakeSensitivity(s)}
            className={`text-xs ${session.mistakeSensitivity === s ? "font-semibold" : ""}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
