import { profile, calculateRealtimeAge } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillsMap } from "@/data/skills";
import { gitCommits } from "@/data/gitHistory";

export interface TerminalContext {
  openApp: (id: string) => void;
  clear: () => void;
  toggleMatrix: () => void;
}

export type CommandFn = (ctx: TerminalContext, args: string[]) => string[];

export const commands: Record<string, CommandFn> = {
  help: () => [
    "KrishnaOS Shell (bash) - Available Commands:",
    "  neofetch       Display system summary card & ASCII badge",
    "  whoami, about  Basic profile, background & bio",
    "  age            Calculate real-time age & days lived",
    "  projects       List all verified system projects",
    "  morrow         Deep dive into Morrow RAG document system",
    "  wearable       Specs for Smart Safety Wearable (Fall Detection)",
    "  auraguard      Specs for AuraGuard Smart Helmet hazard monitor",
    "  network        Cloud network simulation & 8/8 test suite",
    "  security       Cybersecurity background & EC-Council status",
    "  skills         View technical skills & toolchain",
    "  education      University, degree, CGPA, and coursework",
    "  hackathons     Hackathons & academic competitions",
    "  git            View recent Git commit log",
    "  resume         View curriculum vitae & [TODO: Add Resume PDF]",
    "  contact        Communication coordinates & repository link",
    "  uptime         Display active session uptime",
    "  date           Display current system time and date",
    "  matrix         Toggle Matrix digital rain visualizer",
    "  sudo <cmd>     Execute command as superuser",
    "  open <app>     Open graphical window (e.g. open morrow, open security)",
    "  clear          Clear the terminal screen",
  ],

  neofetch: () => {
    return [
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
      "Core Projects: Morrow (RAG), AuraGuard, Smart Safety Wearable",
    ];
  },

  whoami: () => [
    `${profile.name} — ${profile.degree} (${profile.semester}), ${profile.university}`,
    `Location: ${profile.location} | CGPA: ${profile.cgpa} / 10.0`,
    `Status: ${profile.status} (Goal: ${profile.careerGoal})`,
    `Bio: ${profile.tagline}`,
  ],

  about: (ctx, args) => commands.whoami(ctx, args),

  age: () => {
    const age = calculateRealtimeAge();
    return [
      `Date of Birth: 12 April 2007`,
      `Real-time Age: ${age.years} years, ${age.months} months, ${age.days} days`,
      `Total Days Lived: ${age.totalDays.toLocaleString()} days`,
    ];
  },

  projects: (ctx) => [
    "Verified Projects in C:\\projects\\krishna:",
    ...projects.map((p) => `  - [${p.id}] ${p.name} (${p.category})`),
    "",
    "Type 'morrow', 'wearable', 'auraguard', or 'network' for individual details.",
    "Or type 'open projects' to inspect in GUI.",
  ],

  morrow: (ctx) => {
    const p = projects.find((x) => x.id === "morrow");
    if (!p) return ["Project not found"];
    return [
      `PROJECT: ${p.name}`,
      `Category: ${p.category}`,
      `Status: ${p.status}`,
      `Overview: ${p.overview}`,
      `Pipeline: ${p.architectureFlow?.join(" -> ")}`,
      `Extraction Components: ${p.keyComponents?.join(", ")}`,
      `Chunking Experiments: Size 100/Overlap 20 (10 chunks), Size 250/Overlap 50`,
      `Repo: ${p.repository} (Historical name: Memora)`,
    ];
  },

  wearable: () => {
    const p = projects.find((x) => x.id === "wearable");
    if (!p) return ["Project not found"];
    return [
      `PROJECT: ${p.name}`,
      `Hardware: ESP32 / ESP8266 + MPU6050 + ThingSpeak`,
      `Dual-Stage Fall Detection Algorithm:`,
      `  Stage 1: Weightlessness magnitude sqrt(ax² + ay² + az²) < 4.0 m/s²`,
      `  Stage 2: Impact detection > 25.0 m/s² within ~500 ms`,
      `Indoor Geofencing:`,
      `  Wi-Fi RSSI boundary check threshold <= -75 dBm (eliminates GPS need)`,
      `Disclaimer: Academic/lab prototype. No medical certification claimed.`,
    ];
  },

  auraguard: () => {
    const p = projects.find((x) => x.id === "auraguard");
    if (!p) return ["Project not found"];
    return [
      `PROJECT: ${p.name}`,
      `Hardware: ESP32 + Multi-gas sensors + ThingSpeak`,
      `Configured Hazard Thresholds:`,
      `  - Carbon Monoxide (CO): Observed 0-42 ppm | Threshold: 35 ppm`,
      `  - Methane (CH4): Observed 0-12% LEL | Threshold: 10% LEL`,
      `  - Oxygen (O2): Observed 20.9%-18% | Hazard below 19.5%`,
      `  - Hydrogen Sulfide (H2S): Observed 0-1.8 ppm | Threshold: 1.0 ppm`,
      `  - Particulate Matter (PM2.5): Observed 8-63 µg/m³ | Threshold: 50 µg/m³`,
    ];
  },

  network: () => {
    return [
      `PROJECT: Cloud Network Simulation & Monitoring`,
      `Environment: Ubuntu / Linux, Python, Mininet simulation`,
      `Features: Deterministic host addressing, custom topologies, link latency`,
      `Test Suite Results: 8 tests, 8 passed (100% pass rate)`,
      `  - test_deterministic_host_addressing: OK`,
      `  - test_mininet_switch_topology_link: OK`,
      `  - test_subnet_mask_integrity: OK`,
      `  - test_arp_table_resolution: OK`,
      `  - test_distance_vector_convergence: OK`,
      `  - test_packet_forwarding_latency: OK`,
      `  - test_cloud_monitor_telemetry_agent: OK`,
      `  - test_deterministic_failover_path: OK`,
    ];
  },

  security: (ctx) => [
    "Cybersecurity Exploration & Security Lab:",
    "  Primary Focus: Ethical hacking, network security, web app auditing, Linux internals",
    "  Toolbox: Kali Linux, VirtualBox, Burp Suite, Nmap, arp-scan, httprobe",
    "  Lab Work: Isolated NAT network, Kali Linux attacking Kioptrix VM challenge",
    "  Coursework: EC-Council Ethical Hacking Course",
    "  STATUS: IN PROGRESS (Coursework ongoing — no fake cert claimed)",
    "Type 'open security' to launch GUI workbench.",
  ],

  skills: () => {
    const lines = ["Verified Technical Skills:"];
    Object.entries(skillsMap).forEach(([cat, list]) => {
      lines.push(`  ${cat}:`);
      lines.push(`    ${list.join(", ")}`);
    });
    return lines;
  },

  education: () => [
    `University: ${profile.university}`,
    `Degree:     ${profile.degree}, Third semester (Sem 3)`,
    `CGPA:       ${profile.cgpa} / 10.0`,
    `Coursework: Data Structures (Stack, Queue, List, Tree, Graph, Skip List), Algorithms,`,
    `            Operating Systems (Banker's, Dining Philosophers, Bakery, Page Repl, Disk Sched),`,
    `            Computer Networks (IPv4, RIP, Bellman-Ford, Mininet), Database Systems, COA, OOP.`,
    `Math/Stats: Normal/F Distributions, t-test, Chi-square, Yates correction.`,
    `Language:   German (Vocabulary, Articles, Modal verbs, Akkusativ prepositions).`,
  ],

  hackathons: () => [
    "Hackathons & Competitions:",
    ...profile.hackathons.map((h) => `  - ${h.name}: ${h.note}`),
    `  - Merit Certificate: Awarded by VIT Vellore (Academic & Technical)`,
  ],

  git: () => [
    "Commit History (git log --oneline -n 6):",
    ...gitCommits.map((c) => `  ${c.hash} [${c.branch}] ${c.message}`),
  ],

  resume: (ctx) => {
    ctx.openApp("resume");
    return ["Opening resume viewer...", "Notice: [TODO: Add Resume PDF]"];
  },

  contact: (ctx) => [
    "Krishna Agarwal Contact Coordinates:",
    `  Email:       ${profile.contact.email}`,
    `  GitHub:      ${profile.contact.github}`,
    `  LinkedIn:    ${profile.contact.linkedin}`,
    `  Morrow Repo: ${profile.contact.repo}`,
    `  Location:    ${profile.location}`,
    "Type 'open contact' to dispatch a direct message.",
  ],

  open: (ctx, args) => {
    const target = (args[0] || "").toLowerCase();
    const map: Record<string, string> = {
      computer: "mycomputer",
      mycomputer: "mycomputer",
      about: "mycomputer",
      projects: "projects",
      project: "projects",
      morrow: "p-morrow",
      wearable: "p-wearable",
      auraguard: "p-auraguard",
      network: "p-network-sim",
      security: "security",
      skills: "skills",
      terminal: "terminal",
      git: "git",
      log: "git",
      resume: "resume",
      contact: "contact",
      sysinfo: "sysinfo",
      system: "sysinfo",
    };

    const appId = map[target];
    if (appId) {
      ctx.openApp(appId);
      return [`Opening window: ${appId}...`];
    }
    return [
      `Unknown application: '${target}'`,
      `Valid targets: mycomputer, projects, morrow, wearable, auraguard, network, security, skills, git, resume, contact, sysinfo`,
    ];
  },

  sudo: (ctx, args) => [
    `[SECURITY ALERT] Nice try!`,
    `User 'visitor' is not in the sudoers file.`,
    `This incident will be reported to Krishna Agarwal.`,
  ],

  matrix: (ctx) => {
    ctx.toggleMatrix();
    return ["Matrix mode toggled. Follow the white rabbit..."];
  },

  uptime: () => {
    return [`System Uptime: up 42 minutes, 1 user, load average: 0.12, 0.08, 0.04`];
  },

  date: () => [new Date().toString()],

  ls: () => [
    "about.txt      projects/      security_lab/   skills.sys",
    "git_log.txt    resume.pdf     contact.exe     bios_diag.log",
  ],

  cat: (ctx, args) => {
    const file = (args[0] || "").toLowerCase();
    if (file === "about.txt") return commands.whoami(ctx, args);
    if (file === "resume.pdf") return ["[TODO: Add Resume PDF] (File pending upload)"];
    if (file === "contact.exe") return commands.contact(ctx, args);
    if (file === "skills.sys") return commands.skills(ctx, args);
    if (file === "bios_diag.log") return ["BIOS CHECK OK. MEMORY TEST OK. DEVELOPER MODE ENABLED."];
    return [`cat: ${file || "undefined"}: No such file or directory`];
  },

  clear: (ctx) => {
    ctx.clear();
    return [];
  },
};

export function executeCommand(input: string, ctx: TerminalContext): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const [cmdName, ...args] = trimmed.split(/\s+/);
  const handler = commands[cmdName.toLowerCase()];

  if (handler) {
    return handler(ctx, args);
  }

  return [
    `bash: ${cmdName}: command not found.`,
    `Type 'help' to see all available commands.`,
  ];
}
