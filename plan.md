# Plan: Self-Hosted Whisper Quran Service

## Overview

Replace the cloud-dependent Web Speech API with a self-hosted `faster-whisper` service running the `tarteel-ai/whisper-base-ar-quran` model. This service runs as a Docker container alongside the existing app, communicating via WebSocket for real-time streaming transcription.

## Architecture

```
Browser (Next.js app)
  │
  ├─ WebSocket ──► whisper-quran:8765  (NEW - local faster-whisper)
  │                  Primary engine
  │
  ├─ Web Speech API  (Chrome cloud - fallback)
  │
  └─ HTTP POST ──► /api/recitation/transcribe ──► HuggingFace API
                   (existing - last resort)
```

## New Files

### 1. `whisper-service/server.py` — FastAPI WebSocket server

- `/ws/transcribe` — WebSocket endpoint for real-time streaming
- `/health` — Health check
- Accumulates audio chunks from browser, transcribes every ~2s
- Uses `faster-whisper` with `tarteel-ai/whisper-base-ar-quran`
- Returns partial (interim) and final transcriptions as JSON

### 2. `whisper-service/Dockerfile`

- Python 3.11 slim + ffmpeg
- Installs faster-whisper, fastapi, uvicorn, websockets
- Downloads model at build time (~300MB, cached in Docker layer)
- Runs on port 8765

### 3. `whisper-service/requirements.txt`

- faster-whisper, fastapi, uvicorn, websockets, numpy

### 4. Update `docker-compose.yml`

- Add `whisper` service on port 8765
- Same shared-infra-network
- CPU-only (no GPU requirement)

## Frontend Changes

### 5. `src/lib/speech/whisper-local.ts` — WebSocket client

- Connects to `ws://localhost:8765/ws/transcribe`
- Streams raw PCM audio chunks via WebSocket binary frames
- Receives JSON text frames with partial/final transcriptions
- Handles reconnection and error states

### 6. Update `src/components/voice/VoiceRecorder.tsx`

- Add `"whisper-local"` engine type (alongside "web-speech" and "whisper")
- New engine priority: whisper-local → web-speech → whisper-cloud
- On start: try WebSocket connection to whisper service
  - If connected → use whisper-local
  - If fails → fall back to web-speech (Chrome) or whisper-cloud
- Stream audio via MediaRecorder → WebSocket (250ms chunks)
- Map partial results → `onTranscript(text, false)`
- Map final results → `onTranscript(text, true)`

### 7. Update `src/lib/speech/whisper.ts`

- Add `shouldUseWhisperLocal()` to check if local service is available
- Environment variable `NEXT_PUBLIC_WHISPER_URL` for configurable URL

## WebSocket Protocol

```
Client → Server:
  TEXT:   {"command": "start"}          — begin session
  BINARY: <audio chunk bytes>           — raw audio data (WebM/Opus)
  TEXT:   {"command": "stop"}           — end session, get final result

Server → Client:
  TEXT:   {"type": "partial", "text": "بسم الله"}      — interim
  TEXT:   {"type": "final", "text": "بسم الله الرحمن الرحيم"}  — final
  TEXT:   {"type": "ready"}             — model loaded, ready
  TEXT:   {"type": "error", "message": "..."}           — error
```

## Key Design Decisions

1. **Streaming via re-transcription**: Whisper is not a streaming model. We accumulate all audio and re-transcribe every ~2s. For Quran ayahs (5-15s), this works well.

2. **CPU-only**: The base model (~150MB) runs fine on CPU at ~2-4x real-time. No GPU needed.

3. **Model download at build**: Baked into Docker image so startup is instant. Image will be ~1.5GB.

4. **Audio format**: Browser sends WebM/Opus chunks. Server uses ffmpeg to convert to WAV for Whisper.

5. **Graceful fallback**: If whisper service is down, automatically falls back to Web Speech API or cloud Whisper.

## Execution Order

1. Create `whisper-service/` directory with server, Dockerfile, requirements
2. Update `docker-compose.yml` to add the service
3. Create `src/lib/speech/whisper-local.ts` WebSocket client
4. Update `VoiceRecorder.tsx` to add whisper-local engine
5. Build and test
