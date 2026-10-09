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
  const [walkingDir, setWalkingDir] = useState<"walk_left" | "walk_right">("walk_left");

  // Position state: x = distance in px from left edge, y = distance from bottom
  const [position, setPosition] = useState<KrishnaPosition>({
    x: 800, // initialized safely on client mount
    y: 52,
    facing: "left",
  });

  // Refs for access in timers without resetting intervals
  const posRef = useRef(position);
  posRef.current = position;

  const isWalkingRef = useRef(false);
  isWalkingRef.current = isWalking;

  const temporaryEmoteRef = useRef<KrishnaState | null>(null);
  temporaryEmoteRef.current = temporaryEmote;

  const isSleepingRef = useRef(false);
  isSleepingRef.current = isSleeping;

  const walkAnimRef = useRef<number | null>(null);
  const patrolTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emoteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active state calculated via priority
  const currentState: KrishnaState = (() => {
    if (temporaryEmote) return temporaryEmote;
    if (isWalking) return walkingDir;
    if (isSleeping) return "sleeping";
    return ambientState;
  })();

  // Wake up handler
  const wakeUp = useCallback(() => {
    if (isSleepingRef.current) {
      setIsSleeping(false);
      setBubbleText(null);
    }
  }, []);

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

  const runPatrolStepRef = useRef<(() => void) | null>(null);

  const scheduleNextPatrol = useCallback((delayMs = 4000) => {
    if (patrolTimerRef.current) clearTimeout(patrolTimerRef.current);
    patrolTimerRef.current = setTimeout(() => {
      runPatrolStepRef.current?.();
    }, delayMs);
  }, []);

  const startPatrol = useCallback((delayMs = 1500) => {
    scheduleNextPatrol(delayMs);
  }, [scheduleNextPatrol]);

  // Request temporary emote with priority checking
  const requestEmote = useCallback(
    (emote: KrishnaState, durationMs = 2800, speechText?: string) => {
      wakeUp();

      // Stop running immediately if an emote is triggered
      if (walkAnimRef.current) {
        cancelAnimationFrame(walkAnimRef.current);
        walkAnimRef.current = null;
      }
      setIsWalking(false);
      isWalkingRef.current = false;

      const newPriority = STATE_PRIORITIES[emote] ?? 2;
      const currentPriority = temporaryEmote ? (STATE_PRIORITIES[temporaryEmote] ?? 0) : 0;

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
          // Automatically resume periodic running after emote ends
          scheduleNextPatrol(3500);
        }, durationMs);
      }
    },
    [temporaryEmote, wakeUp, scheduleNextPatrol]
  );

  // Set ambient state
  const setAmbientState = useCallback(
    (state: KrishnaState) => {
      wakeUp();
      setAmbientStateInternal(state);
    },
    [wakeUp]
  );

  // Smooth bounded running across screen
  const walkTo = useCallback(
    (targetX: number, onArrival?: () => void) => {
      if (typeof window === "undefined") return;

      const startX = posRef.current.x;
      const delta = targetX - startX;
      if (Math.abs(delta) < 20) {
        if (onArrival) onArrival();
        return;
      }

      const dir: "walk_left" | "walk_right" = delta > 0 ? "walk_right" : "walk_left";
      setWalkingDir(dir);
      setIsWalking(true);
      isWalkingRef.current = true;
      setPosition((prev) => ({ ...prev, facing: delta > 0 ? "right" : "left" }));

      // Running speed: ~220px per second
      const speed = 220;
      const duration = Math.min(4500, Math.max(800, (Math.abs(delta) / speed) * 1000));
      const startTime = performance.now();

      const step = (now: number) => {
        // If an emote starts, abort running
        if (temporaryEmoteRef.current) {
          setIsWalking(false);
          isWalkingRef.current = false;
          walkAnimRef.current = null;
          return;
        }

        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const currentX = startX + delta * progress;

        setPosition((prev) => ({ ...prev, x: Math.round(currentX) }));

        if (progress < 1) {
          walkAnimRef.current = requestAnimationFrame(step);
        } else {
          setIsWalking(false);
          isWalkingRef.current = false;
          walkAnimRef.current = null;
          if (onArrival) onArrival();
        }
      };

      if (walkAnimRef.current) cancelAnimationFrame(walkAnimRef.current);
      walkAnimRef.current = requestAnimationFrame(step);
    },
    []
  );

  // PERIODIC RUNNING: Continuously runs back and forth between left and right sides
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Start on the right side of the screen
    const initialRightX = Math.max(200, window.innerWidth - 220);
    setPosition({ x: initialRightX, y: 52, facing: "left" });
    posRef.current = { x: initialRightX, y: 52, facing: "left" };

    let isRunningToLeft = true;

    const runPatrolStep = () => {
      // If sleeping or in temporary emote, retry shortly
      if (isSleepingRef.current || temporaryEmoteRef.current || isWalkingRef.current) {
        patrolTimerRef.current = setTimeout(runPatrolStep, 2000);
        return;
      }

      const minX = window.innerWidth < 768 ? 40 : 180;
      const maxX = Math.max(minX + 80, window.innerWidth - (window.innerWidth < 768 ? 100 : 220));

      let targetX: number;
      if (isRunningToLeft) {
        targetX = Math.round(minX + Math.random() * 50);
        isRunningToLeft = false;
      } else {
        targetX = Math.round(maxX - Math.random() * 50);
        isRunningToLeft = true;
      }

      walkTo(targetX, () => {
        // Once arrived, rest for ~4 to 6 seconds before next run
        const restDuration = 4000 + Math.random() * 2500;
        scheduleNextPatrol(restDuration);
      });
    };

    runPatrolStepRef.current = runPatrolStep;

    // Begin first running sequence shortly after mount
    scheduleNextPatrol(2000);

    const handleResize = () => {
      if (typeof window !== "undefined") {
        setPosition((prev) => {
          const maxX = Math.max(160, window.innerWidth - (window.innerWidth < 768 ? 90 : 220));
          if (prev.x > maxX) {
            return { ...prev, x: maxX };
          }
          return prev;
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      runPatrolStepRef.current = null;
      if (patrolTimerRef.current) clearTimeout(patrolTimerRef.current);
      if (walkAnimRef.current) cancelAnimationFrame(walkAnimRef.current);
    };
  }, [walkTo, scheduleNextPatrol]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (emoteTimerRef.current) clearTimeout(emoteTimerRef.current);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (patrolTimerRef.current) clearTimeout(patrolTimerRef.current);
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
    startPatrol,
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
