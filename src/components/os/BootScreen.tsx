"use client";

import { useEffect, useState, useRef } from "react";
import { playStartupChime } from "@/lib/sound";
import { profile } from "@/data/profile";

const BOOT_LOGS = [
  "KRISHNA-OS BIOS Revision 4.2.0 (c) 2026",
  "CPU: Neural Core x86_64 @ 3.80GHz",
  "Checking Memory ................... 65536 KB OK",
  "Hardware Bus Scan ................. OK",
  "Primary Storage: VIRTUAL_SSD ...... MOUNTED /",
  "Network Interface eth0 ............ UP [DHCP 192.168.1.100]",
  "Kernel: KrishnaOS 2.4.18-sys",
  "--------------------------------------------------",
  "BIOS CHECK ........................ OK",
  "MEMORY TEST ....................... OK",
  "NETWORK ........................... OK",
  "STORAGE ........................... OK",
  "DEVELOPER MODE .................... ENABLED",
  "--------------------------------------------------",
  "Loading KRISHNAOS workspace...",
  "  > Loading projects: Morrow, Wearable, AuraGuard, NetSim",
  "  > Mounting technical skills (skills.sys)...",
  "  > Fetching verified Git history...",
  "  > Initializing KRISHNA.EXE animated subsystem [PID 1337] ... OK",
  "  > Connecting virtual terminal (tty1)...",
  "",
  "System Initialized.",
  "Welcome, visitor.",
];

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"terminal" | "profile">("terminal");
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  const transitionToProfile = () => {
    if (phase === "profile") {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
      return;
    }
    setPhase("profile");
    playStartupChime();

    // 1.25 seconds splash before desktop transition
    setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, 1250);
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index <= BOOT_LOGS.length) {
        setLines(BOOT_LOGS.slice(0, index));
        setProgress(Math.round((index / BOOT_LOGS.length) * 100));
      } else {
        clearInterval(interval);
        transitionToProfile();
      }
    }, 70);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        clearInterval(interval);
        transitionToProfile();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="boot" aria-live="polite" role="status">
      {phase === "terminal" ? (
        <div className="boot-terminal">
          <div className="boot-header">
            <span className="boot-title">KRISHNA-OS BOOTLOADER v2.4</span>
            <span className="boot-status">[STAGE: INITIALIZING {progress}%]</span>
          </div>

          <pre className="boot-content">
            {lines.join("\n")}
            <span className="cur" />
          </pre>

          <div className="boot-footer">
            <div className="boot-progress-bar">
              <div className="boot-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <button
              className="skip-btn"
              onClick={transitionToProfile}
            >
              [ Skip Boot & Proceed (Enter) ]
            </button>
          </div>
        </div>
      ) : (
        /* Brief Windows Logon Profile Splash (1.2s) */
        <div className="boot-logon-screen" onClick={transitionToProfile}>
          <div className="boot-logon-box">
            <div className="logon-title-bar">
              <span>KrishnaOS v2.4 — User Authentication</span>
              <span className="logon-dots">•••</span>
            </div>

            <div className="logon-body">
              <div className="logon-portrait-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.portraitUrl}
                  alt="Krishna Agarwal portrait"
                  className="logon-portrait-img"
                  draggable={false}
                />
              </div>

              <div className="logon-details">
                <h2 className="logon-name">KRISHNA AGARWAL</h2>
                <p className="logon-subtitle">User profile loaded.</p>
                <div className="logon-meta">
                  <span>VIT Vellore • B.Tech CSE (Sem 3)</span>
                  <span className="logon-loading-text">Starting desktop environment...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
