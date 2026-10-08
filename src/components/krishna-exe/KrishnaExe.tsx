"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useKrishnaExe } from "./KrishnaContext";
import { ANIMATION_MAP } from "./animation-map";
import { playActionClick } from "@/lib/sound";
import "./krishna-exe.css";

const CLICK_PHRASES = [
  "krishna.exe [PID 1337]: running smooth",
  "Compiling Morrow RAG engine...",
  "Drinking chai & solving LeetCode!",
  "Operating Systems: Sem 3 @ VIT Vellore",
  "Ready for 2026 internships!",
  "Vector embeddings loaded in pgvector",
];

export default function KrishnaExe() {
  const { currentState, bubbleText, position, requestEmote, wakeUp, isSleeping } = useKrishnaExe();
  const [frameIndex, setFrameIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Preload initial idle frames on mount
  useEffect(() => {
    ANIMATION_MAP.idle.frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Current animation configuration
  const currentConfig = useMemo(() => {
    return ANIMATION_MAP[currentState] || ANIMATION_MAP.idle;
  }, [currentState]);

  // Frame animation timer
  useEffect(() => {
    setFrameIndex(0);

    if (prefersReducedMotion || currentConfig.frames.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % currentConfig.frames.length);
    }, currentConfig.frameInterval);

    return () => clearInterval(interval);
  }, [currentConfig, prefersReducedMotion]);

  // Click on avatar
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playActionClick();
    wakeUp();

    const phrase = CLICK_PHRASES[clickCount % CLICK_PHRASES.length];
    setClickCount((c) => c + 1);

    // Alternate between happy and chai emotes on click
    const nextEmote = clickCount % 2 === 0 ? "happy" : "chai";
    requestEmote(nextEmote, 3000, phrase);
  };

  const currentFrameSrc = currentConfig.frames[frameIndex] || currentConfig.frames[0];
  const ratioClass = currentConfig.aspectRatio === "1:1" ? "ratio-1-1" : "ratio-2-3";

  // Dynamic style for positioning
  const containerStyle: React.CSSProperties = {
    bottom: `${position.y}px`,
    ...(position.x > 0 ? { left: `${position.x}px` } : { right: "32px" }),
  };

  return (
    <div
      className="krishna-exe-container"
      style={containerStyle}
      aria-hidden="true"
      role="presentation"
    >
      <div
        className={`krishna-avatar-box ${ratioClass}`}
        onClick={handleClick}
        title="krishna.exe [Interactive System Companion] - Click to interact"
      >
        {/* Retro Tooltip / Speech Bubble */}
        {bubbleText && (
          <div className="krishna-speech-bubble" role="status">
            {bubbleText}
          </div>
        )}

        {/* Character Sprite Frame */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentFrameSrc}
          alt="Krishna.exe character sprite"
          className="krishna-sprite"
          draggable={false}
        />

        {/* Small PID indicator on hover */}
        <span className="krishna-pid-pill">
          krishna.exe : {isSleeping ? "sleeping" : currentState}
        </span>
      </div>
    </div>
  );
}
