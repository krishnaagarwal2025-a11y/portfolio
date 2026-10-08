"use client";

import { useState, useEffect, useRef } from "react";
import { apps } from "@/data/apps";
import Clock from "./Clock";
import RetroIcon from "./RetroIcon";
import { playActionClick } from "@/lib/sound";

interface Props {
  tasks: { id: string; title: string; active: boolean; icon?: string }[];
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
  onRestart: () => void;
  sound: boolean;
  crt: boolean;
  setSound: (v: boolean) => void;
  setCrt: (v: boolean) => void;
}

export default function Taskbar({
  tasks,
  onToggle,
  onOpen,
  onRestart,
  sound,
  crt,
  setSound,
  setCrt,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const startBtn = document.querySelector(".start-btn");
        if (startBtn && startBtn.contains(e.target as Node)) return;
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleStartClick = () => {
    playActionClick();
    setMenuOpen(!menuOpen);
  };

  const handleAppClick = (id: string) => {
    playActionClick();
    onOpen(id);
    setMenuOpen(false);
  };

  return (
    <footer className="tray" role="toolbar" aria-label="KrishnaOS Taskbar">
      {/* Start Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="start-menu"
          role="menu"
          onKeyDown={(e) => {
            if (e.key === "Escape") setMenuOpen(false);
          }}
        >
          {/* Vertical brand sidebar */}
          <div className="menu-sidebar">
            <span className="sidebar-brand">Krishna<b>OS</b></span>
          </div>

          <div className="menu-content">
            <div className="menu-header">
              <b>Krishna Agarwal</b>
              <span>VIT Vellore • Sem 3 • CGPA 9.4</span>
            </div>

            <div className="menu-items">
              {apps.map((app) => (
                <button
                  key={app.id}
                  role="menuitem"
                  className="menu-item"
                  onClick={() => handleAppClick(app.id)}
                >
                  <RetroIcon name={app.icon} size={20} />
                  <span>{app.title}</span>
                </button>
              ))}
            </div>

            <hr className="menu-divider" />

            <div className="menu-settings">
              <button
                role="menuitemcheckbox"
                aria-checked={crt}
                className="menu-item menu-setting-item"
                onClick={() => {
                  playActionClick();
                  setCrt(!crt);
                }}
              >
                <span className="setting-indicator">{crt ? "[✓]" : "[ ]"}</span>
                <span>CRT Scanlines Mode</span>
              </button>

              <button
                role="menuitemcheckbox"
                aria-checked={sound}
                className="menu-item menu-setting-item"
                onClick={() => {
                  playActionClick();
                  setSound(!sound);
                }}
              >
                <span className="setting-indicator">{sound ? "[✓]" : "[ ]"}</span>
                <span>System Audio ({sound ? "Enabled" : "Muted"})</span>
              </button>

              <button
                role="menuitem"
                className="menu-item menu-setting-item"
                onClick={() => {
                  playActionClick();
                  setMenuOpen(false);
                  onRestart();
                }}
              >
                <span className="setting-indicator">[*]</span>
                <span>Restart KrishnaOS...</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start button */}
      <button
        className={`start-btn ${menuOpen ? "start-btn-pressed" : ""}`}
        aria-expanded={menuOpen}
        onClick={handleStartClick}
      >
        <span className="start-logo">🪟</span>
        <b>Start</b>
      </button>

      {/* Task buttons */}
      <div className="tasks">
        {tasks.map((t) => (
          <button
            key={t.id}
            className={`task-btn ${t.active ? "task-btn-active" : ""}`}
            onClick={() => {
              playActionClick();
              onToggle(t.id);
            }}
            title={t.title}
          >
            {t.icon && <RetroIcon name={t.icon} size={15} className="task-icon" />}
            <span className="task-text">{t.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="systray">
        <button
          className="tray-tool-btn"
          title={`CRT mode is ${crt ? "ON" : "OFF"} (Click to toggle)`}
          onClick={() => {
            playActionClick();
            setCrt(!crt);
          }}
          aria-label="Toggle CRT overlay"
        >
          {crt ? "📺" : "🖥️"}
        </button>

        <button
          className="tray-tool-btn"
          title={`Audio is ${sound ? "ON" : "MUTED"} (Click to toggle)`}
          onClick={() => {
            playActionClick();
            setSound(!sound);
          }}
          aria-label="Toggle retro audio"
        >
          {sound ? "🔊" : "🔇"}
        </button>

        <div className="tray-divider" />
        <Clock />
      </div>
    </footer>
  );
}
