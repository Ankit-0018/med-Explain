"use client";

import { useRef, useState, useCallback } from "react";

export type RecordingState = "idle" | "recording" | "processing" | "error";

export interface UseAudioRecorderReturn {
  recordingState: RecordingState;
  setRecordingState: (state: RecordingState) => void;
  elapsedSeconds: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  permissionError: string | null;
}

export function useAudioRecorder(
  onAudioReady: (blob: Blob) => void
): UseAudioRecorderReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    setPermissionError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Pick a supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        // Stop all tracks to release microphone
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onAudioReady(audioBlob);
      };

      mediaRecorder.start(250); // collect chunks every 250ms
      setRecordingState("recording");
      setElapsedSeconds(0);

      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      const message =
        err?.name === "NotAllowedError"
          ? "Microphone access was denied. Please allow it in your browser settings."
          : "Could not access microphone. Please check your device.";
      setPermissionError(message);
      setRecordingState("error");
    }
  }, [onAudioReady]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      setRecordingState("processing");
      mediaRecorderRef.current.stop();
    }
  }, []);

  return { recordingState, setRecordingState, elapsedSeconds, startRecording, stopRecording, permissionError };
}
