// Desktop applications definitions for KrishnaOS

export type AppId =
  | "mycomputer"
  | "projects"
  | "skills"
  | "git"
  | "terminal"
  | "resume"
  | "contact";

export interface AppDefinition {
  id: AppId;
  title: string;
  label: string;
  icon: string;
  category: "system" | "code" | "info";
  description: string;
  defaultWidth?: number;
}

export const apps: AppDefinition[] = [
  {
    id: "mycomputer",
    title: "My Computer",
    label: "My Computer",
    icon: "computer",
    category: "system",
    description: "About Krishna Agarwal, education at VIT Vellore, CS topics, and real-time age.",
    defaultWidth: 640,
  },
  {
    id: "projects",
    title: "Projects Explorer",
    label: "Projects",
    icon: "folder-projects",
    category: "code",
    description: "Explore Morrow (RAG), Smart Safety Wearable, AuraGuard, and Network Simulation.",
    defaultWidth: 680,
  },
  {
    id: "skills",
    title: "Technical Skills (skills.sys)",
    label: "Skills",
    icon: "skills-chip",
    category: "system",
    description: "Programming languages, CS fundamentals, RAG, IoT, and tooling.",
    defaultWidth: 620,
  },
  {
    id: "terminal",
    title: "KrishnaOS Terminal (bash)",
    label: "Terminal",
    icon: "terminal-icon",
    category: "system",
    description: "Interactive command-line interface. Run neofetch, help, projects, morrow, and more.",
    defaultWidth: 640,
  },
  {
    id: "git",
    title: "Git Commit Log (git log --graph)",
    label: "Git Log",
    icon: "git-branch",
    category: "code",
    description: "Real branch management, milestone merges, and chunking development commits.",
    defaultWidth: 620,
  },
  {
    id: "resume",
    title: "resume.pdf - Document Viewer",
    label: "Resume",
    icon: "document-pdf",
    category: "info",
    description: "Curriculum Vitae document viewer and verified portfolio summary.",
    defaultWidth: 600,
  },
  {
    id: "contact",
    title: "Contact Krishna (contact.exe)",
    label: "Contact",
    icon: "mail-envelope",
    category: "info",
    description: "Get in touch with Krishna Agarwal, view links and status.",
    defaultWidth: 520,
  },
];
