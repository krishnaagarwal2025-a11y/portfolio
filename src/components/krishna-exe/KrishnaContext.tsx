"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { KrishnaState, KrishnaContextValue, KrishnaPosition } from "./types";
import { STATE_PRIORITIES } from "./animation-map";

const KrishnaContext = createContext<KrishnaContextValue | null>(null);

const INACTIVITY_TIMEOUT_MS = 40000; // 40 seconds of no interaction -> sleep
const PERIODIC_RUN_INTERVAL_MS = 14000; // Periodically run left & right every 14 seconds

export function KrishnaProvider({ children }: { children: ReactNode }) {
  const [ambientState, setAmbientStateInternal] = useState<KrishnaState>("idle");
  const [temporaryEmote, setTemporaryEmote] = useState<KrishnaState | null>(null);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [walkingDir, setWalkingDir] = useState<"walk_left" | "walk_right">("walk_right");

  // Position state: default near bottom right of desktop floor (above 42px taskbar)
  const [position, setPosition] = useState<KrishnaPosition>({
    x: 0, // 0 until client calculates window width
    y: 54, // px above bottom of screen
    facing: "left",
  });

  const emoteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const walkAnimRef = useRef<number | null>(null);
  const posRef = useRef(position);
  posRef.current = position;

  // Initialize position on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialX = Math.max(160, window.innerWidth - 220);
      setPosition({ x: initialX, y: 54, facing: "left" });
    }

    const handleResize = () => {
      if (typeof window !== "undefined") {
        setPosition((prev) => {
          const maxX = Math.max(160, window.innerWidth - 220);
          if (prev.x > maxX || prev.x === 0) {
            return { ...prev, x: maxX };
          }
          return prev;
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Stop any active walking animation
  const stopWalking = useCallback(() => {
    if (walkAnimRef.current) {
      cancelAnimationFrame(walkAnimRef.current);
      walkAnimRef.current = null;
    }
    setIsWalking(false);
  }, []);

  // Request temporary emote with priority checking
  const requestEmote = useCallback(
    (emote: KrishnaState, durationMs = 2800, speechText?: string) => {
      wakeUp();
      stopWalking(); // If running when an emote is triggered, stop and play emote

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
    [temporaryEmote, wakeUp, stopWalking]
  );

  // Set ambient state
  const setAmbientState = useCallback(
    (state: KrishnaState) => {
      wakeUp();
      setAmbientStateInternal(state);
    },
    [wakeUp]
  );

  // Smooth bounded running / walking across screen
  const walkTo = useCallback(
    (targetX: number) => {
      wakeUp();

      // Check if prefers reduced motion
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPosition((prev) => ({ ...prev, x: targetX }));
        return;
      }

      if (typeof window === "undefined") return;

      const currentX = posRef.current.x || (window.innerWidth - 220);
      const minX = 160; // Keep clear of desktop icons column
      const maxX = Math.max(minX + 80, window.innerWidth - 200);
      const clampedTargetX = Math.max(minX, Math.min(maxX, targetX));

      const delta = clampedTargetX - currentX;
      if (Math.abs(delta) < 25) return; // already in target area

      const dir = delta > 0 ? "walk_right" : "walk_left";
      setWalkingDir(dir);
      setIsWalking(true);
      setPosition((prev) => ({ ...prev, facing: delta > 0 ? "right" : "left" }));

      // Running speed: ~220px per second for an active, spirited run
      const speed = 220;
      const duration = Math.min(3600, Math.max(800, (Math.abs(delta) / speed) * 1000));
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        const currentProgX = currentX + delta * progress;
        setPosition((prev) => ({ ...prev, x: Math.round(currentProgX) }));

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
    [wakeUp]
  );

  // PERIODIC RUNNING: Periodically run to left and right across desktop
  useEffect(() => {
    // If reduced motion is preferred, do not auto-run
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const periodicInterval = setInterval(() => {
      // Do not run if character is sleeping, currently running, or playing a temporary emote
      if (isSleeping || isWalking || temporaryEmote) {
        return;
      }

      if (typeof window === "undefined") return;

      const currentX = posRef.current.x || (window.innerWidth - 220);
      const midPoint = window.innerWidth / 2;
      const minX = 180;
      const maxX = Math.max(minX + 100, window.innerWidth - 240);

      // If currently on the right half, run over to the left side!
      // If currently on the left half, run over to the right side!
      let targetX: number;
      if (currentX > midPoint) {
        // Run to the left zone (between 180px and 260px)
        targetX = Math.round(minX + Math.random() * 80);
      } else {
        // Run to the right zone (near window.innerWidth - 240px)
        targetX = Math.round(maxX - Math.random() * 80);
      }

      walkTo(targetX);
    }, PERIODIC_RUN_INTERVAL_MS);

    return () => clearInterval(periodicInterval);
  }, [isSleeping, isWalking, temporaryEmote, walkTo]);

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
