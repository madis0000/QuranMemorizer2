"use client";

/**
 * DownloadButton
 *
 * A compact button that manages downloading/deleting a surah's audio.
 * Shows different states: not downloaded, downloading (with progress ring),
 * downloaded (checkmark), and error (retry).
 */
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, Download, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAudioDownload } from "@/hooks/use-audio-download";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DownloadButtonProps {
  surahNumber: number;
  totalAyahs: number;
  className?: string;
}

type ButtonState = "idle" | "downloading" | "completed" | "error";

export function DownloadButton({
  surahNumber,
  totalAyahs,
  className,
}: DownloadButtonProps) {
  const {
    downloadSurah,
    cancelDownload,
    deleteSurah,
    checkIsDownloaded,
    getTaskForSurah,
  } = useAudioDownload();

  const [cachedIsDownloaded, setCachedIsDownloaded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Check download status on mount and when tasks change
  const task = getTaskForSurah(surahNumber);

  // Derive button state from task (no setState in effect)
  let buttonState: ButtonState = "idle";
  let progress = 0;

  if (task) {
    if (task.status === "downloading") {
      buttonState = "downloading";
      progress =
        totalAyahs > 0
          ? Math.round((task.downloadedAyahs / totalAyahs) * 100)
          : 0;
    } else if (task.status === "completed") {
      buttonState = "completed";
      progress = 100;
    } else if (task.status === "error") {
      buttonState = "error";
    }
  } else if (cachedIsDownloaded) {
    buttonState = "completed";
    progress = 100;
  }

  // Check IndexedDB on mount for initial cached state
  useEffect(() => {
    let cancelled = false;
    if (!task) {
      checkIsDownloaded(surahNumber, totalAyahs).then((downloaded) => {
        if (!cancelled) {
          setCachedIsDownloaded(downloaded);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [task, surahNumber, totalAyahs, checkIsDownloaded]);

  const handleClick = useCallback(() => {
    switch (buttonState) {
      case "idle":
        downloadSurah(surahNumber, totalAyahs);
        break;
      case "downloading":
        cancelDownload(surahNumber);
        break;
      case "completed":
        setShowDelete((prev) => !prev);
        break;
      case "error":
        // Retry
        downloadSurah(surahNumber, totalAyahs);
        break;
    }
  }, [buttonState, surahNumber, totalAyahs, downloadSurah, cancelDownload]);

  const handleDelete = useCallback(async () => {
    await deleteSurah(surahNumber);
    setCachedIsDownloaded(false);
    setShowDelete(false);
  }, [surahNumber, deleteSurah]);

  // SVG circular progress ring parameters
  const ringSize = 36;
  const strokeWidth = 3;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <TooltipProvider>
      <div className={cn("inline-flex items-center gap-1", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-9 w-9",
                buttonState === "completed" &&
                  "text-green-600 dark:text-green-400",
                buttonState === "error" && "text-destructive"
              )}
              onClick={handleClick}
            >
              {buttonState === "idle" && <Download className="h-4 w-4" />}

              {buttonState === "downloading" && (
                <div className="relative flex items-center justify-center">
                  <svg
                    width={ringSize}
                    height={ringSize}
                    className="absolute -rotate-90"
                  >
                    {/* Background ring */}
                    <circle
                      cx={ringSize / 2}
                      cy={ringSize / 2}
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      opacity={0.2}
                    />
                    {/* Progress ring */}
                    <circle
                      cx={ringSize / 2}
                      cy={ringSize / 2}
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className="text-primary transition-all duration-300"
                    />
                  </svg>
                  <X className="h-3 w-3" />
                </div>
              )}

              {buttonState === "completed" && <Check className="h-4 w-4" />}

              {buttonState === "error" && <AlertCircle className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {buttonState === "idle" && "Download for offline"}
            {buttonState === "downloading" &&
              `Downloading... ${progress}% (tap to cancel)`}
            {buttonState === "completed" && "Downloaded - tap to manage"}
            {buttonState === "error" && "Download failed - tap to retry"}
          </TooltipContent>
        </Tooltip>

        {showDelete && buttonState === "completed" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
}
