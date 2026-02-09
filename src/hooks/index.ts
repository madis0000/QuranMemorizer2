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

// Voice search hook ("Shazam for Quran")
export { useVoiceSearch } from "./use-voice-search";
export type {
  VoiceSearchResultItem,
  VoiceSearchStatus,
} from "./use-voice-search";

// Circles (social) hooks
export {
  circleKeys,
  useCircles,
  useCircle,
  useCreateCircle,
  useJoinCircle,
  useLeaveCircle,
  useKickMember,
  useCircleActivity,
  useCircleChallenges,
  useCreateChallenge,
  useUpdateCircle,
  useDeleteCircle,
} from "./use-circles";
export type {
  CircleListItem,
  CircleMemberItem,
  CircleChallengeItem,
  CircleActivityItem,
  CircleDetail,
} from "./use-circles";
