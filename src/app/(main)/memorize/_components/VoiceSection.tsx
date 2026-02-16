"use client";

import { RotateCcw } from "lucide-react";

import type { useVoiceRecognition } from "@/hooks/use-voice-recognition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FluencyDisplay } from "@/components/voice/FluencyDisplay";
import { RecitationTracker } from "@/components/voice/RecitationTracker";
import {
  VoiceRecorder,
  type EngineType,
} from "@/components/voice/VoiceRecorder";

interface VoiceSectionProps {
  interimText: string;
  finalText: string;
  isRecording: boolean;
  trackerWords: string[];
  fluencyMetrics: ReturnType<typeof useVoiceRecognition>["fluencyMetrics"];
  isActive: boolean;
  /** Changing this key forces the VoiceRecorder to remount (fresh recognition session). */
  recorderKey?: string;
  /** Auto-start mic recording on mount */
  autoStart?: boolean;
  onTranscript: (text: string, isFinal: boolean) => void;
  onRecordingChange: (recording: boolean) => void;
  onEngineChange: (engine: EngineType) => void;
  onReset: () => void;
  onCheck: () => void;
}

export function VoiceSection({
  interimText,
  finalText,
  isRecording,
  trackerWords,
  fluencyMetrics,
  isActive,
  recorderKey,
  autoStart,
  onTranscript,
  onRecordingChange,
  onEngineChange,
  onReset,
  onCheck,
}: VoiceSectionProps) {
  return (
    <Card>
      <CardContent className="space-y-4 py-6">
        <RecitationTracker
          interimText={interimText}
          finalText={finalText}
          isListening={isRecording}
          originalWords={trackerWords}
        />

        <FluencyDisplay metrics={fluencyMetrics} isActive={isRecording} />

        <VoiceRecorder
          key={recorderKey}
          onTranscript={onTranscript}
          onRecordingChange={onRecordingChange}
          onEngineChange={onEngineChange}
          disabled={!isActive}
          autoStart={autoStart}
        />

        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={!finalText && !isRecording}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={onCheck} disabled={!finalText}>
            Check Recitation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
