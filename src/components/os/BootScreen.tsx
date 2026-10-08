"use client";

import { useEffect, useState } from "react";
import { playStartupChime } from "@/lib/sound";

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
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index <= BOOT_LOGS.length) {
        setLines(BOOT_LOGS.slice(0, index));
        setProgress(Math.round((index / BOOT_LOGS.length) * 100));
      } else {
        clearInterval(interval);
        playStartupChime();
        setTimeout(onDone, 350);
      }
    }, 75);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        clearInterval(interval);
        playStartupChime();
        onDone();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDone]);

  return (
    <div className="boot" aria-live="polite" role="status">
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
            onClick={() => {
              playStartupChime();
              onDone();
            }}
          >
            [ Skip Boot & Boot Desktop (Enter) ]
          </button>
        </div>
      </div>
    </div>
  );
}
