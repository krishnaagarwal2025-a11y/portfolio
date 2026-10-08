"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { executeCommand, TerminalContext } from "./terminalCommands";
import { beep, playErrorBeep } from "@/lib/sound";
import { useKrishnaExe } from "../krishna-exe/KrishnaContext";

interface Props {
  onOpenApp: (id: string) => void;
}

interface HistoryItem {
  id: string;
  command: string;
  output: string[];
}

export default function Terminal({ onOpenApp }: Props) {
  const { requestEmote } = useKrishnaExe();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "init",
      command: "neofetch",
      output: [
        "        .=====================.",
        "       /     KRISHNA-OS       /|",
        "      +=====================+ |",
        "      |  _   _   ___   ____ | |   OS:          KrishnaOS 2026",
        "      | | | / / / _ \\ / ___|| |   Host:        Developer Workstation",
        "      | | |/ / | | | |\\___ \\| |   User:        Krishna Agarwal",
        "      | | |\\ \\ | |_| | ___) | |   University:  VIT Vellore",
        "      | |_| \\_\\ \\___/ |____/| |   Degree:      B.Tech (Sem 3)",
        "      |                     | |   CGPA:        9.4 / 10.0",
        "      +---------------------+ |   Mode:        BUILD",
        "      |   [CRT TERMINAL]    |/    Problems:    200+ LeetCode solved",
        "      '====================='     Status:      OPEN TO INTERNSHIPS",
        "",
        "Focus Areas:   Cybersecurity, Systems, Networking, AI/RAG, IoT",
        "Type 'help' to inspect available commands.",
      ],
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>(["neofetch"]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [matrixMode, setMatrixMode] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const ctx: TerminalContext = {
    openApp: onOpenApp,
    clear: () => setHistory([]),
    toggleMatrix: () => setMatrixMode((prev) => !prev),
    setKrishnaEmote: (emote, duration, text) => requestEmote(emote, duration, text),
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmed = input.trim();
      if (!trimmed) return;

      beep(600, 0.03);
      const output = executeCommand(trimmed, ctx);

      if (output.some((line) => line.includes("command not found") || line.includes("ALERT"))) {
        playErrorBeep();
      }

      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          command: trimmed,
          output,
        },
      ]);

      setCmdHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    }
  };

  return (
    <div
      className={`terminal-container ${matrixMode ? "matrix-active" : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-header-strip">
        <span>tty1: krishna@krishnaos: ~ (bash 5.2)</span>
        <span className="term-hint">Type &apos;help&apos; for commands</span>
      </div>

      <div className="terminal-output-area">
        {history.map((item) => (
          <div key={item.id} className="terminal-entry">
            <div className="terminal-prompt-line">
              <span className="user-prompt">krishna@krishnaos</span>
              <span className="prompt-sep">:</span>
              <span className="prompt-path">~</span>
              <span className="prompt-dollar">$</span>
              <span className="entered-cmd">{item.command}</span>
            </div>
            {item.output.length > 0 && (
              <pre className="cmd-output">{item.output.join("\n")}</pre>
            )}
          </div>
        ))}

        {/* Current Active Input Line */}
        <div className="terminal-input-line">
          <span className="user-prompt">krishna@krishnaos</span>
          <span className="prompt-sep">:</span>
          <span className="prompt-path">~</span>
          <span className="prompt-dollar">$</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
