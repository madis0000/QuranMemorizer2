"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface WaveformDisplayProps {
  audioBlob?: Blob;
  audioUrl?: string;
  /** Color segments: [{start: 0, end: 0.5, color: 'correct'}, ...] */
  segments?: Array<{
    start: number;
    end: number;
    color: "correct" | "wrong" | "partial";
  }>;
  className?: string;
  isPlaying?: boolean;
  progress?: number; // 0-1
  onSeek?: (position: number) => void;
}

const SEGMENT_COLORS = {
  correct: "#059669",
  wrong: "#ef4444",
  partial: "#f59e0b",
};

export function WaveformDisplay({
  audioBlob,
  segments,
  className,
  isPlaying,
  progress = 0,
  onSeek,
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Decode audio to waveform data
  useEffect(() => {
    if (!audioBlob) return;

    let cancelled = false;
    const decodeAudio = async () => {
      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);

        // Downsample to ~100 bars
        const bars = 100;
        const blockSize = Math.floor(channelData.length / bars);
        const samples: number[] = [];

        for (let i = 0; i < bars; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[i * blockSize + j]);
          }
          samples.push(sum / blockSize);
        }

        // Normalize
        const max = Math.max(...samples, 0.01);
        if (!cancelled) {
          setWaveformData(samples.map((d) => d / max));
        }

        await audioContext.close();
      } catch {
        // Generate placeholder waveform using index-based seed
        if (!cancelled) {
          setWaveformData(
            Array.from(
              { length: 100 },
              (_, i) => 0.2 + ((i * 7 + 13) % 17) / 28
            )
          );
        }
      }
    };

    decodeAudio();
    return () => {
      cancelled = true;
    };
  }, [audioBlob]);

  // Draw waveform on canvas via effect (syncs React state to external DOM)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const barWidth = width / waveformData.length;
    const barGap = 1;

    waveformData.forEach((value, i) => {
      const x = i * barWidth;
      const barH = value * height * 0.8;
      const y = (height - barH) / 2;
      const position = i / waveformData.length;

      // Determine color from segments
      let color = "#D1E0D8";
      if (segments) {
        for (const seg of segments) {
          if (position >= seg.start && position <= seg.end) {
            color = SEGMENT_COLORS[seg.color];
            break;
          }
        }
      } else if (position <= progress) {
        color = "#059669";
      }

      ctx.fillStyle = color;
      ctx.fillRect(x + barGap / 2, y, barWidth - barGap, barH);
    });

    // Playback cursor
    if (isPlaying && progress > 0) {
      const cursorX = progress * width;
      ctx.strokeStyle = "#00E5A0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, height);
      ctx.stroke();
    }
  }, [waveformData, segments, isPlaying, progress]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onSeek || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      onSeek(Math.max(0, Math.min(1, position)));
    },
    [onSeek]
  );

  // Show loading when no blob or data not yet decoded
  if (!audioBlob || waveformData.length === 0) {
    return (
      <div
        className={cn(
          "h-16 rounded-lg bg-[#D1E0D8]/30 dark:bg-[#00E5A0]/5 animate-pulse",
          className
        )}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={64}
      onClick={handleClick}
      className={cn("w-full h-16 rounded-lg cursor-pointer", className)}
    />
  );
}
