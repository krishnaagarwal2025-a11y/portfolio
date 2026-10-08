"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { apps } from "@/data/apps";
import { projects } from "@/data/projects";
import { useWindowManager } from "@/hooks/useWindowManager";
import { playWindowOpen, setSoundEnabled } from "@/lib/sound";

import BootScreen from "./BootScreen";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import CRTOverlay from "../effects/CRTOverlay";

import MyComputerWindow from "../windows/MyComputerWindow";
import ProjectExplorer from "../projects/ProjectExplorer";
import ProjectDetail from "../projects/ProjectDetail";
import SkillsWindow from "../windows/SkillsWindow";
import GitLogWindow from "../windows/GitLogWindow";
import ResumeWindow from "../windows/ResumeWindow";
import ContactWindow from "../windows/ContactWindow";
import Terminal from "../terminal/Terminal";

import { KrishnaProvider, useKrishnaExe, KrishnaExe } from "../krishna-exe";

export default function Desktop() {
  return (
    <KrishnaProvider>
      <DesktopInner />
    </KrishnaProvider>
  );
}

function DesktopInner() {
  const [phase, setPhase] = useState<"init" | "boot" | "desk">("init");
  const [sound, setSound] = useState(true);
  const [crt, setCrt] = useState(true);
  const wm = useWindowManager();
  const { requestEmote, setAmbientState } = useKrishnaExe();

  // Boot sequence check
  useEffect(() => {
    const seen = sessionStorage.getItem("kos-booted") === "1";
    setPhase(seen ? "desk" : "boot");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCrt(false);
    }
  }, []);

  const openWin = wm.open;
  // Automatically open My Computer on first desktop arrival
  useEffect(() => {
    if (phase === "desk") {
      openWin("mycomputer");
    }
  }, [phase, openWin]);

  const finishBoot = useCallback(() => {
    sessionStorage.setItem("kos-booted", "1");
    setPhase("desk");
    // Greet user on desktop initialization
    requestEmote("happy", 3200, "krishna.exe [PID 1337] online!");
  }, [requestEmote]);

  const handleRestart = useCallback(() => {
    sessionStorage.removeItem("kos-booted");
    setPhase("boot");
  }, []);

  // Determine currently focused / top window
  const activeWindowId = useMemo(() => {
    let topId: string | null = null;
    let maxZ = -1;
    for (const [id, win] of Object.entries(wm.wins)) {
      if (win.open && !win.min && win.z > maxZ) {
        maxZ = win.z;
        topId = id;
      }
    }
    return topId;
  }, [wm.wins]);

  // Sync character ambient state with active window
  useEffect(() => {
    if (!activeWindowId) {
      setAmbientState("idle");
      return;
    }

    if (activeWindowId === "terminal") {
      setAmbientState("terminal");
    } else if (activeWindowId === "p-morrow") {
      setAmbientState("typing");
    } else if (activeWindowId === "resume") {
      setAmbientState("reading");
    } else if (activeWindowId === "contact") {
      setAmbientState("chai");
    } else if (activeWindowId === "projects" || activeWindowId.startsWith("p-")) {
      setAmbientState("thinking");
    } else if (activeWindowId === "skills" || activeWindowId === "git") {
      setAmbientState("thinking");
    } else if (activeWindowId === "mycomputer") {
      setAmbientState("idle");
    } else {
      setAmbientState("idle");
    }
  }, [activeWindowId, setAmbientState]);

  const openApp = useCallback(
    (id: string) => {
      playWindowOpen();
      wm.open(id);

      // Trigger contextual reactions when user opens specific applications
      if (id === "p-morrow") {
        requestEmote("typing", 3500, "Building Morrow RAG pipeline...");
      } else if (id === "terminal") {
        requestEmote("terminal", 3000, "tty1 terminal initialized");
      } else if (id === "resume") {
        requestEmote("reading", 3000, "Inspecting curriculum vitae");
      } else if (id === "projects") {
        requestEmote("thinking", 2800, "Exploring systems & projects");
      } else if (id === "contact") {
        requestEmote("chai", 3000, "Let's connect over chai!");
      } else if (id === "skills" || id === "git") {
        requestEmote("thinking", 2500);
      }
    },
    [wm, requestEmote]
  );

  const toggleSound = (val: boolean) => {
    setSound(val);
    setSoundEnabled(val);
  };

  // Build windows definition list
  const windowRegistry = useMemo(() => {
    const baseApps: { id: string; title: string; icon: string; width: number; node: React.ReactNode }[] = [
      {
        id: "mycomputer",
        title: "My Computer - Krishna Agarwal",
        icon: "computer",
        width: 650,
        node: <MyComputerWindow onOpenApp={openApp} />,
      },
      {
        id: "projects",
        title: "Projects Explorer",
        icon: "folder-projects",
        width: 720,
        node: <ProjectExplorer onOpenProjectWindow={openApp} />,
      },
      {
        id: "skills",
        title: "System Hardware & Skills Inventory (skills.sys)",
        icon: "skills-chip",
        width: 640,
        node: <SkillsWindow />,
      },
      {
        id: "terminal",
        title: "KrishnaOS Terminal (tty1 - bash 5.2)",
        icon: "terminal-icon",
        width: 660,
        node: <Terminal onOpenApp={openApp} />,
      },
      {
        id: "git",
        title: "Git Commit Log (git log --graph)",
        icon: "git-branch",
        width: 660,
        node: <GitLogWindow />,
      },
      {
        id: "resume",
        title: "resume.pdf - Curriculum Vitae Document Viewer",
        icon: "document-pdf",
        width: 660,
        node: <ResumeWindow />,
      },
      {
        id: "contact",
        title: "Contact Krishna Agarwal (contact.exe)",
        icon: "mail-envelope",
        width: 540,
        node: <ContactWindow />,
      },
    ];

    // Project pop-out windows
    const projectPopouts = projects.map((p) => ({
      id: `p-${p.id}`,
      title: `${p.shortName} - System Specification`,
      icon: "folder-projects",
      width: 720,
      node: <ProjectDetail project={p} />,
    }));

    return [...baseApps, ...projectPopouts];
  }, [openApp]);

  // Tasks for the taskbar
  const openTasks = windowRegistry
    .filter((w) => wm.wins[w.id]?.open)
    .map((w) => ({
      id: w.id,
      title: w.title.split(" - ")[0],
      active: !wm.wins[w.id].min && wm.wins[w.id].z === wm.top,
      icon: w.icon,
    }));

  if (phase === "init") {
    return <div className="screen-black" />;
  }

  return (
    <main className="screen" id="krishnaos-desktop">
      {phase === "boot" && <BootScreen onDone={finishBoot} />}



      {/* Desktop Icons Grid */}
      <div className="icons" role="region" aria-label="Desktop Icons">
        {apps.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            label={app.label}
            iconName={app.icon}
            onOpen={() => openApp(app.id)}
          />
        ))}
      </div>

      {/* KRISHNA.EXE Animated Character Layer */}
      <KrishnaExe />

      {/* Windows Layer */}
      {windowRegistry.map((win, idx) => {
        const winState = wm.wins[win.id];
        if (!winState?.open) return null;

        const isTop = winState.z === wm.top;

        // Position staggered default coordinates
        const defaultX = 140 + (idx % 5) * 24;
        const defaultY = 24 + (idx % 5) * 24;

        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            z={winState.z}
            hidden={winState.min}
            maximized={winState.max}
            isActive={isTop}
            x={defaultX}
            y={defaultY}
            width={win.width}
            onFocus={() => wm.focus(win.id)}
            onClose={() => wm.close(win.id)}
            onMinimize={() => wm.minimize(win.id)}
            onMaximize={() => wm.maximize(win.id)}
          >
            {win.node}
          </Window>
        );
      })}

      {/* Taskbar */}
      <Taskbar
        tasks={openTasks}
        onToggle={wm.toggle}
        onOpen={openApp}
        onRestart={handleRestart}
        sound={sound}
        crt={crt}
        setSound={toggleSound}
        setCrt={setCrt}
      />

      {/* CRT Scanline & Subtle Monitor Overlay */}
      <CRTOverlay enabled={crt} />
    </main>
  );
}
