// Git history and development timeline for Krishna Agarwal
// Highlights real workflows: branch management, milestone merges, chunking experiments, conflict resolution.

export interface GitCommit {
  hash: string;
  branch: string;
  project: string;
  message: string;
  tag?: string;
  details?: string;
}

export const gitCommits: GitCommit[] = [
  {
    hash: "9e4b102",
    branch: "main",
    project: "Morrow",
    message: "Merge milestone-2 into main: RAG chunking and overlap integration",
    tag: "v0.2-milestone",
    details: "Merged branch 'feature/chunking-pipeline' after resolving merge conflicts in extractor interfaces.",
  },
  {
    hash: "8f7c31d",
    branch: "feature/chunking-pipeline",
    project: "Morrow",
    message: "Add chunker.py and test_chunking.py with configurable sliding window",
    details: "Tested chunk size 100 with overlap 20 (produced 10 chunks). Validated size 250 with overlap 50.",
  },
  {
    hash: "7d2a55c",
    branch: "feature/extractors",
    project: "Morrow",
    message: "Implement pdf_extractor (PyMuPDF) and docx_extractor modules",
    details: "Added fallback text_extractor.py for plain ASCII and markdown files.",
  },
  {
    hash: "6c1b84e",
    branch: "main",
    project: "Network-Sim",
    message: "Pass 8/8 automated tests in network simulation test suite",
    tag: "tests-passing",
    details: "All automated tests passed: test_deterministic_host_addressing and topology route validation.",
  },
  {
    hash: "5b9a73f",
    branch: "main",
    project: "AuraGuard",
    message: "Set industrial safety thresholds for CO, CH4, O2, H2S, and PM2.5 in ESP32 firmware",
    details: "Configured ThingSpeak telemetry and edge threshold check (CO: 35ppm, CH4: 10%, O2: 19.5%, H2S: 1ppm, PM2.5: 50µg/m³).",
  },
  {
    hash: "4a8f62e",
    branch: "main",
    project: "Safety-Wearable",
    message: "Implement dual-stage fall detection (weightlessness < 4m/s² + impact > 25m/s² in 500ms)",
    details: "Integrated MPU6050 vector magnitude sqrt(ax² + ay² + az²) and Wi-Fi RSSI indoor geofence threshold (-75 dBm).",
  },
  {
    hash: "3e7d51d",
    branch: "feature/pgvector-setup",
    project: "Morrow",
    message: "Initialize PostgreSQL database with pgvector extension for embedding storage",
    details: "Schema ready for Level-1 RAG criteria document ingestion.",
  },
  {
    hash: "2d6c40c",
    branch: "main",
    project: "Morrow",
    message: "Project rename and structure initialization: Memora -> Morrow",
    tag: "init-morrow",
    details: "Main branch initialized. Historical repository associated with Krishna's GitHub.",
  },
];
