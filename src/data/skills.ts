// Technical skills data for Krishna Agarwal
// Strictly contains verified technologies and areas from the portfolio specification.

export interface SkillCategory {
  category: string;
  icon: string;
  description: string;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    icon: "code",
    description: "Core languages used for systems, software, scripts, and embedded development.",
    items: ["C", "C++", "Python", "Java", "Dart", "JavaScript", "TypeScript", "Embedded C++"],
  },
  {
    category: "Computer Science Fundamentals",
    icon: "cpu",
    description: "Core CS theoretical and practical foundations studied at VIT Vellore.",
    items: [
      "Data Structures",
      "Algorithms",
      "Object-Oriented Programming (OOP)",
      "Operating Systems",
      "Computer Networks",
      "Database Systems",
      "Computer Organization & Architecture (COA)",
    ],
  },
  {
    category: "Development & Frameworks",
    icon: "layers",
    description: "Full-stack web and mobile application engineering tools.",
    items: ["React", "Next.js", "Flutter", "Firebase", "PostgreSQL", "pgvector", "Git", "GitHub"],
  },
  {
    category: "AI, RAG & Vector Systems",
    icon: "database",
    description: "Document ingestion, embeddings, semantic similarity search, and RAG architectures.",
    items: [
      "Retrieval-Augmented Generation (RAG)",
      "Document Ingestion Pipeline",
      "Embeddings Generation",
      "Semantic Similarity Search",
      "LLM Integration",
      "Vector Databases (pgvector)",
    ],
  },
  {
    category: "Embedded Systems & IoT",
    icon: "radio",
    description: "Hardware microcontrollers, sensor integration, telemetry, and embedded logic.",
    items: ["Arduino", "ESP32", "ESP8266", "MPU6050 Accelerometer/Gyro", "ThingSpeak IoT Cloud", "Embedded C++"],
  },
  {
    category: "Cybersecurity & Security Tools",
    icon: "shield",
    description: "Exploration in virtual labs, network scanning, web security, and ongoing EC-Council coursework.",
    items: [
      "Kali Linux",
      "Nmap",
      "Burp Suite",
      "Network Scanning (arp-scan, httprobe)",
      "Web Security Testing",
      "Ethical Hacking Concepts (Course Ongoing)",
      "CTF Environments",
      "VirtualBox & NAT Isolation",
      "Kioptrix Lab Auditing",
    ],
  },
  {
    category: "Tooling & Platforms",
    icon: "terminal",
    description: "Operating systems, version control, virtual machines, and developer tooling.",
    items: ["Linux (Ubuntu / Kali)", "Git", "GitHub", "VS Code", "VirtualBox", "Docker / Dev Tooling"],
  },
];

export const skillsMap: Record<string, string[]> = skillCategories.reduce((acc, cat) => {
  acc[cat.category] = cat.items;
  return acc;
}, {} as Record<string, string[]>);
