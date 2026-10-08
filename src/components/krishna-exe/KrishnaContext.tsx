"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { KrishnaState, KrishnaContextValue, KrishnaPosition } from "./types";
import { STATE_PRIORITIES } from "./animation-map";

const KrishnaContext = createContext<KrishnaContextValue | null>(null);

const INACTIVITY_TIMEOUT_MS = 40000; // 40 seconds of no interaction -> sleep

export function KrishnaProvider({ children }: { children: ReactNode }) {
  const [ambientState, setAmbientStateInternal] = useState<KrishnaState>("idle");
  const [temporaryEmote, setTemporaryEmote] = useState<KrishnaState | null>(null);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [walkingDir, setWalkingDir] = useState<"walk_left" | "walk_right">("walk_right");

  // Position state: default near bottom right of desktop floor (above taskbar)
  const [position, setPosition] = useState<KrishnaPosition>({
    x: 0, // 0 means default CSS position (right-aligned)
    y: 56, // px above bottom of screen (above 42px taskbar)
    facing: "left",
  });

  const emoteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const walkAnimRef = useRef<number | null>(null);

  // Active state calculated via priority
  const currentState: KrishnaState = (() => {
    if (temporaryEmote) return temporaryEmote;
    if (isWalking) return walkingDir;
    if (isSleeping) return "sleeping";
    return ambientState;
  })();

  // Wake up handler
  const wakeUp = useCallback(() => {
    if (isSleeping) {
      setIsSleeping(false);
      setBubbleText(null);
    }
  }, [isSleeping]);

  // Reset inactivity timer on any user interaction
  const resetInactivityTimer = useCallback(() => {
    wakeUp();
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setIsSleeping(true);
      setBubbleText("Zzz...");
    }, INACTIVITY_TIMEOUT_MS);
  }, [wakeUp]);

  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();
    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity, { passive: true });
    window.addEventListener("click", handleActivity, { passive: true });
    window.addEventListener("touchstart", handleActivity, { passive: true });

    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer]);

  // Request temporary emote with priority checking
  const requestEmote = useCallback(
    (emote: KrishnaState, durationMs = 2800, speechText?: string) => {
      wakeUp();

      const newPriority = STATE_PRIORITIES[emote] ?? 2;
      const currentPriority = temporaryEmote ? (STATE_PRIORITIES[temporaryEmote] ?? 0) : 0;

      // Higher or equal priority overrides currently playing emote
      if (newPriority >= currentPriority) {
        if (emoteTimerRef.current) clearTimeout(emoteTimerRef.current);

        setTemporaryEmote(emote);

        if (speechText) {
          if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
          setBubbleText(speechText);
          bubbleTimerRef.current = setTimeout(() => setBubbleText(null), durationMs + 500);
        }

        emoteTimerRef.current = setTimeout(() => {
          setTemporaryEmote(null);
          emoteTimerRef.current = null;
        }, durationMs);
      }
    },
    [temporaryEmote, wakeUp]
  );

  // Set ambient state
  const setAmbientState = useCallback(
    (state: KrishnaState) => {
      wakeUp();
      setAmbientStateInternal(state);
    },
    [wakeUp]
  );

  // Smooth bounded walking
  const walkTo = useCallback(
    (targetX: number) => {
      wakeUp();

      // Check if prefers reduced motion
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPosition((prev) => ({ ...prev, x: targetX }));
        return;
      }

      const startX = position.x || (window.innerWidth - 180);
      const minX = 60;
      const maxX = Math.max(minX + 100, window.innerWidth - 180);
      const clampedTargetX = Math.max(minX, Math.min(maxX, targetX));

      const delta = clampedTargetX - startX;
      if (Math.abs(delta) < 15) return; // already close enough

      const dir = delta > 0 ? "walk_right" : "walk_left";
      setWalkingDir(dir);
      setIsWalking(true);
      setPosition((prev) => ({ ...prev, facing: delta > 0 ? "right" : "left" }));

      const duration = Math.min(1600, Math.max(700, Math.abs(delta) * 3));
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Linear or subtle ease-in-out
        const currentX = startX + delta * progress;

        setPosition((prev) => ({ ...prev, x: Math.round(currentX) }));

        if (progress < 1) {
          walkAnimRef.current = requestAnimationFrame(step);
        } else {
          setIsWalking(false);
          walkAnimRef.current = null;
        }
      };

      if (walkAnimRef.current) cancelAnimationFrame(walkAnimRef.current);
      walkAnimRef.current = requestAnimationFrame(step);
    },
    [position.x, wakeUp]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (emoteTimerRef.current) clearTimeout(emoteTimerRef.current);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (walkAnimRef.current) cancelAnimationFrame(walkAnimRef.current);
    };
  }, []);

  const value: KrishnaContextValue = {
    currentState,
    ambientState,
    temporaryEmote,
    bubbleText,
    position,
    isSleeping,
    requestEmote,
    setAmbientState,
    walkTo,
    wakeUp,
  };

  return <KrishnaContext.Provider value={value}>{children}</KrishnaContext.Provider>;
}

export function useKrishnaExe(): KrishnaContextValue {
  const ctx = useContext(KrishnaContext);
  if (!ctx) {
    throw new Error("useKrishnaExe must be used within a KrishnaProvider");
  }
  return ctx;
}
