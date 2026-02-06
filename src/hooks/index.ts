// Quran data hooks
export {
  useSurahs,
  useSurah,
  useAyahs,
  useAyah,
  useAyahWords,
  usePage,
  useJuz,
  useAvailableTranslations,
  useTranslation,
  useReciters,
  useSearch,
  useBookmarks,
  useAddBookmark,
  useDeleteBookmark,
  useReadingProgress,
  useSaveReadingProgress,
  useOfflineStatus,
  useOfflineStats,
  usePrefetchSurah,
  usePrefetchPage,
  quranKeys,
} from "./use-quran";

// Progress & user data hooks
export {
  progressKeys,
  useSessions,
  useCreateSession,
  useStreaks,
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useSettings,
  useUpdateSettings,
  useBookmarks as useUserBookmarks,
  useCreateBookmark,
  useDeleteBookmark as useRemoveBookmark,
  useBadges,
} from "./use-progress";

// Audio player hook
export { useAudioPlayer } from "./use-audio-player";

// Voice recognition hook
export { useVoiceRecognition } from "./use-voice-recognition";
