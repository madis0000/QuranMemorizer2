"use client";

/**
 * DownloadManager
 *
 * Full download management panel. Displays downloaded surahs, storage usage,
 * and provides controls for bulk download/delete operations.
 */
import { useCallback, useEffect, useState } from "react";
import {
  Download,
  HardDrive,
  Loader2,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";

import { getAudioDownloadManager } from "@/lib/audio/download-manager";
import { cn } from "@/lib/utils";
import { useAudioDownload } from "@/hooks/use-audio-download";
import { useSurahs } from "@/hooks/use-quran";
import { useAudioStore } from "@/stores/audioStore";
import { DownloadButton } from "@/components/audio/DownloadButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// ===== Helpers =====

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

// ===== Downloaded Surah Info =====

interface DownloadedSurahInfo {
  surahNumber: number;
  surahName: string;
  englishName: string;
  ayahCount: number;
  totalAyahs: number;
  totalSize: number;
  isComplete: boolean;
}

// ===== Component =====

export function DownloadManager({ className }: { className?: string }) {
  const { data: surahs, isLoading: surahsLoading } = useSurahs();
  const { storageUsed, deleteAll, refreshStorageUsed, downloadSurah } =
    useAudioDownload();
  const currentReciter = useAudioStore((s) => s.currentReciter);

  const [downloadedSurahs, setDownloadedSurahs] = useState<
    DownloadedSurahInfo[]
  >([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load downloaded surah info
  const refreshList = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const manager = getAudioDownloadManager();
      const downloaded = await manager.getDownloadedSurahs(currentReciter);

      if (!surahs) {
        setDownloadedSurahs([]);
        return;
      }

      const infos: DownloadedSurahInfo[] = downloaded.map((d) => {
        const surah = surahs.find((s) => s.number === d.surahNumber);
        return {
          surahNumber: d.surahNumber,
          surahName: surah?.name ?? "",
          englishName: surah?.englishName ?? `Surah ${d.surahNumber}`,
          ayahCount: d.ayahCount,
          totalAyahs: surah?.numberOfAyahs ?? d.ayahCount,
          totalSize: d.totalSize,
          isComplete: d.ayahCount >= (surah?.numberOfAyahs ?? d.ayahCount),
        };
      });

      setDownloadedSurahs(infos);
    } finally {
      setIsLoadingList(false);
    }
  }, [currentReciter, surahs]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  // Periodically refresh while bulk downloading
  useEffect(() => {
    if (!isBulkDownloading) return;
    const interval = setInterval(() => {
      refreshList();
      refreshStorageUsed();
    }, 3000);
    return () => clearInterval(interval);
  }, [isBulkDownloading, refreshList, refreshStorageUsed]);

  // Bulk download all 114 surahs
  const handleDownloadAll = useCallback(async () => {
    if (!surahs) return;
    setIsBulkDownloading(true);

    // Download one at a time to avoid overwhelming the network
    for (const surah of surahs) {
      downloadSurah(surah.number, surah.numberOfAyahs);
      // Small delay between queuing downloads
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // The actual downloads happen in the background.
    // We stop the bulk downloading indicator after a delay.
    setTimeout(() => {
      setIsBulkDownloading(false);
      refreshList();
      refreshStorageUsed();
    }, 2000);
  }, [surahs, downloadSurah, refreshList, refreshStorageUsed]);

  // Download a specific juz (by surah range)
  const handleDownloadJuz = useCallback(
    async (juzNumber: number) => {
      if (!surahs) return;

      // Juz-to-surah mapping (simplified: download surahs that start in this juz)
      const juzSurahStarts: Record<number, number[]> = {
        1: [1, 2],
        2: [2],
        3: [2, 3],
        4: [3, 4],
        5: [4],
        6: [4, 5],
        7: [5, 6],
        8: [6, 7],
        9: [7, 8],
        10: [8, 9],
        11: [9, 10, 11],
        12: [11, 12],
        13: [12, 13, 14],
        14: [15, 16],
        15: [17, 18],
        16: [18, 19, 20],
        17: [21, 22],
        18: [23, 24, 25],
        19: [25, 26, 27],
        20: [27, 28, 29],
        21: [29, 30, 31, 32, 33],
        22: [33, 34, 35, 36],
        23: [36, 37, 38, 39],
        24: [39, 40, 41],
        25: [41, 42, 43, 44, 45],
        26: [46, 47, 48, 49, 50, 51],
        27: [51, 52, 53, 54, 55, 56, 57],
        28: [58, 59, 60, 61, 62, 63, 64, 65, 66],
        29: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
        30: [
          78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
          95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
          110, 111, 112, 113, 114,
        ],
      };

      const surahNumbers = juzSurahStarts[juzNumber];
      if (!surahNumbers) return;

      // Deduplicate
      const uniqueSurahs = [...new Set(surahNumbers)];

      for (const surahNum of uniqueSurahs) {
        const surah = surahs.find((s) => s.number === surahNum);
        if (surah) {
          downloadSurah(surah.number, surah.numberOfAyahs);
        }
      }
    },
    [surahs, downloadSurah]
  );

  // Delete all
  const handleDeleteAll = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteAll();
      setDownloadedSurahs([]);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteAll]);

  const totalDownloaded = downloadedSurahs.filter((s) => s.isComplete).length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Offline Audio Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{formatBytes(storageUsed)}</p>
              <p className="text-sm text-muted-foreground">
                {totalDownloaded} of 114 surahs downloaded
              </p>
            </div>
            <div className="flex items-center gap-2">
              {totalDownloaded > 0 ? (
                <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>

          <Progress value={(totalDownloaded / 114) * 100} />

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleDownloadAll}
              disabled={isBulkDownloading || surahsLoading}
              size="sm"
            >
              {isBulkDownloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download All Surahs
            </Button>

            {downloadedSurahs.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                disabled={isDeleting}
                size="sm"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Juz Download */}
      <Card>
        <CardHeader>
          <CardTitle>Download by Juz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
              <Button
                key={juz}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleDownloadJuz(juz)}
              >
                Juz {juz}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Downloaded Surahs List */}
      <Card>
        <CardHeader>
          <CardTitle>Downloaded Surahs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingList ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : downloadedSurahs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <WifiOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No surahs downloaded yet.</p>
              <p className="text-sm mt-1">
                Download surahs to listen offline without an internet
                connection.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {downloadedSurahs.map((info) => (
                <div
                  key={info.surahNumber}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-mono text-muted-foreground w-8 text-right shrink-0">
                      {info.surahNumber}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{info.englishName}</p>
                      <p className="text-xs text-muted-foreground">
                        {info.isComplete
                          ? `${info.ayahCount} ayahs`
                          : `${info.ayahCount}/${info.totalAyahs} ayahs`}{" "}
                        &middot; {formatBytes(info.totalSize)}
                      </p>
                    </div>
                  </div>
                  <DownloadButton
                    surahNumber={info.surahNumber}
                    totalAyahs={info.totalAyahs}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Surahs for Download */}
      {surahs && !surahsLoading && (
        <Card>
          <CardHeader>
            <CardTitle>All Surahs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {surahs.map((surah) => (
                <div
                  key={surah.number}
                  className="flex items-center justify-between py-2 px-3 rounded hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-mono text-muted-foreground w-8 text-right shrink-0">
                      {surah.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {surah.englishName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {surah.numberOfAyahs} ayahs
                      </p>
                    </div>
                  </div>
                  <DownloadButton
                    surahNumber={surah.number}
                    totalAyahs={surah.numberOfAyahs}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
