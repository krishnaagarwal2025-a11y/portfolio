// Real projects data for Krishna Agarwal
// Strictly verified projects: Morrow, Smart Safety Wearable, AuraGuard, Cloud Network Simulation.
// No fabricated metrics, awards, or fake projects.

export interface ProjectPipelineStep {
  name: string;
  detail: string;
}

export interface ProjectData {
  id: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  overview: string;
  technologies: string[];
  status: string;
  repository?: string;
  architectureFlow?: string[];
  level1Criteria?: string[];
  specs?: Record<string, string | number>;
  keyComponents?: string[];
  technicalWork?: string[];
  notes?: string;
}

export const projects: ProjectData[] = [
  {
    id: "morrow",
    name: "Morrow (Formerly Memora)",
    shortName: "Morrow",
    category: "AI / Systems / RAG",
    tagline: "Document ingestion + Retrieval-Augmented Generation (RAG) system with semantic similarity & source citations.",
    overview:
      "A document ingestion and RAG system engineered to allow users to upload arbitrary documents, process them into semantically rich vector representations, store embeddings in PostgreSQL with pgvector, perform semantic similarity retrieval, and connect an LLM to generate precise answers complete with source citations.",
    technologies: [
      "Python",
      "PostgreSQL",
      "pgvector",
      "PyMuPDF",
      "python-docx",
      "Embeddings",
      "Semantic Search",
      "RAG",
      "LLM Integration",
      "Git / GitHub",
    ],
    status: "Active Development",
    repository: "https://github.com/krishnaagarwal2025-a11y/Memora.git",
    architectureFlow: [
      "Document Ingestion (PDF / DOCX / TXT)",
      "Text Extraction (PyMuPDF & python-docx)",
      "Chunking Engine (Sliding window with overlap)",
      "Vector Embedding Generation",
      "Vector Storage (PostgreSQL + pgvector)",
      "Semantic Similarity Retrieval",
      "LLM Context Augmentation",
      "Synthesized Answer + Source References",
      "Web User Interface",
    ],
    level1Criteria: [
      "Manual document upload",
      "Extract text from PDF/documents",
      "Split extracted text into chunks",
      "Generate embeddings",
      "Store embeddings in PostgreSQL + pgvector",
      "Perform semantic similarity retrieval",
      "Connect an LLM",
      "Return answers with source references",
      "Provide a basic web UI",
    ],
    keyComponents: [
      "pdf_extractor.py (PyMuPDF text extraction)",
      "docx_extractor.py (python-docx parser)",
      "text_extractor.py (plain-text standardizer)",
      "chunker.py (sliding window text segmenter)",
      "test_chunking.py (test suite for split & overlap)",
    ],
    technicalWork: [
      "Configured local PostgreSQL database with pgvector extension",
      "Built custom PDF extraction pipelines utilizing PyMuPDF for reliable text retrieval",
      "Integrated python-docx parser for Word documents and text_extractor for raw buffers",
      "Conducted chunking experiments: chunk size 100 with overlap 20 (resulting in 10 test chunks), and chunk size 250 with overlap 50",
      "Managed Git repository branches, milestones, and handled merge conflict resolutions cleanly",
    ],
    specs: {
      "Primary DB": "PostgreSQL with pgvector",
      "PDF Extractor": "PyMuPDF",
      "DOCX Extractor": "python-docx",
      "Chunking Config A": "Chunk size 100, Overlap 20 (yields 10 chunks)",
      "Chunking Config B": "Chunk size 250, Overlap 50",
      "Repo State": "Historical repo named Memora, officially renamed to Morrow",
    },
    notes: "Historical repository retains the old name 'Memora', but the project is officially named Morrow.",
  },
  {
    id: "wearable",
    name: "Smart Safety Wearable: Real-Time Fall Detection & Indoor Geofencing System",
    shortName: "Safety Wearable",
    category: "IoT / Embedded Systems / Safety Technology",
    tagline: "Dual-stage acceleration fall detection and Wi-Fi RSSI indoor geofencing system on ESP32/ESP8266.",
    overview:
      "An embedded IoT safety device built to safeguard vulnerable individuals indoors. Incorporates a high-precision dual-stage fall detection algorithm leveraging vector magnitude acceleration, paired with a lightweight Wi-Fi RSSI-based indoor boundary geofence to eliminate GPS dependency inside structures.",
    technologies: [
      "Embedded C++",
      "ESP32",
      "ESP8266",
      "MPU6050 Accelerometer/Gyro",
      "ThingSpeak IoT Cloud",
      "Arduino Framework",
      "Wi-Fi RSSI",
    ],
    status: "Prototype / Academic Lab",
    architectureFlow: [
      "MPU6050 6-Axis Motion Sensor",
      "Continuous Vector Magnitude Acceleration Calculation: sqrt(ax² + ay² + az²)",
      "Stage 1 Trigger: Weightlessness Detection (< 4.0 m/s²)",
      "Stage 2 Trigger: High-G Impact Detection (> 25.0 m/s²) within ~500 ms",
      "Fall Event Confirmation & Alert Dispatch",
      "Wi-Fi Signal Strength (RSSI) Measurement",
      "Indoor Geofence Boundary Check (Trigger if RSSI <= -75 dBm)",
      "ESP32/ESP8266 Telemetry Transmission to ThingSpeak Cloud",
    ],
    technicalWork: [
      "Implemented vector magnitude calculation: sqrt(ax² + ay² + az²) on ESP microcontroller",
      "Designed Stage 1 weightlessness threshold (< 4.0 m/s²) to identify free-fall beginnings",
      "Engineered Stage 2 impact threshold (> 25.0 m/s²) with a 500 ms temporal window to prevent false positives from everyday motion",
      "Implemented Wi-Fi RSSI indoor perimeter monitoring with boundary alert at <= -75 dBm",
      "Integrated telemetry publishing to ThingSpeak cloud channels for live tracking",
    ],
    specs: {
      "Microcontrollers": "ESP32 / ESP8266",
      "IMU Sensor": "MPU6050 (6-axis)",
      "Weightlessness Threshold": "< 4.0 m/s²",
      "Impact Threshold": "> 25.0 m/s²",
      "Time Window": "Impact within ~500 ms of weightlessness",
      "Geofence Mechanism": "Wi-Fi RSSI (no indoor GPS needed)",
      "RSSI Boundary Threshold": "<= -75 dBm",
      "Cloud Platform": "ThingSpeak",
    },
    notes: "Academic and lab prototype. No medical certification or real-world deployment is claimed.",
  },
  {
    id: "auraguard",
    name: "AuraGuard: Integrated Smart Helmet for Environmental Monitoring",
    shortName: "AuraGuard",
    category: "IoT / Embedded Systems / Industrial Safety",
    tagline: "Industrial worker safety helmet monitoring atmospheric gases and hazardous particulate matter via ESP32 & ThingSpeak.",
    overview:
      "An integrated smart helmet platform engineered for comprehensive environmental monitoring in hazardous industrial plants, mining facilities, and confined chemical zones. Continually samples multi-gas concentrations and PM2.5 particulate levels against safety threshold limits, transmitting live telemetry to ThingSpeak.",
    technologies: [
      "ESP32",
      "Embedded C++",
      "ThingSpeak Cloud",
      "Multi-Gas Sensor Array (CO, CH4, O2, H2S)",
      "Particulate Matter Sensor (PM2.5)",
      "Threshold Checking Logic",
    ],
    status: "Research & Prototype",
    architectureFlow: [
      "Industrial Helmet Gas & Particulate Sensors (O2, CH4, CO, H2S, PM2.5)",
      "ESP32 ADC & Digital Bus Ingestion",
      "Real-Time Environmental Data Normalization",
      "Configured Threshold Check (Safe / Warning / Danger)",
      "Telemetry Packaging & Transmission over Wi-Fi",
      "ThingSpeak Dashboard Visualizations & Alert Triggers",
    ],
    technicalWork: [
      "Interfaced multi-sensor array to ESP32 for hazardous environment monitoring",
      "Established empirical threshold criteria for 5 critical atmospheric factors",
      "Programmed edge detection logic for instant hazardous threshold breaches",
      "Streamed live sensor telemetry into ThingSpeak cloud channels",
    ],
    specs: {
      "Core Hardware": "ESP32 Microcontroller",
      "Cloud Platform": "ThingSpeak",
      "Carbon Monoxide (CO)": "Range: 0 - 42 ppm | Threshold: 35 ppm",
      "Methane (CH4)": "Range: 0 - 12% LEL | Threshold: 10% LEL",
      "Oxygen (O2)": "Range: 20.9% - 18% | Threshold: 19.5% (Low O2 hazard)",
      "Hydrogen Sulfide (H2S)": "Range: 0 - 1.8 ppm | Threshold: 1 ppm",
      "Particulate Matter (PM2.5)": "Range: 8 - 63 µg/m³ | Threshold: 50 µg/m³",
    },
    notes: "Environmental safety monitoring designed for hazardous industries and confined work zones.",
  },
  {
    id: "network-sim",
    name: "Cloud Network Monitoring & Network Simulation",
    shortName: "Network Simulation",
    category: "Networking / Simulation / Linux",
    tagline: "Mininet-style virtualized topology simulation with deterministic host addressing & automated test suite.",
    overview:
      "A cloud network simulation and monitoring testbed developed on Ubuntu/Linux in Python. Enables deterministic IP configuration across modeled switch and host topologies, paired with an automated test suite verifying network behavior under various cloud routing conditions.",
    technologies: [
      "Python",
      "Ubuntu / Linux",
      "Mininet-style Network Simulation",
      "Network Topology Modeling",
      "Deterministic Host Addressing",
      "Automated Testing Suites",
    ],
    status: "Completed Lab Project",
    architectureFlow: [
      "Topology Definition (Hosts, Switches, Links)",
      "Deterministic IP & Subnet Address Assignment",
      "Simulation Environment Bootstrap (Linux/Mininet)",
      "Automated Test Execution (8/8 Tests)",
      "Routing & Connectivity Validation (e.g. test_deterministic_host_addressing: OK)",
      "Cloud Application Network Behavior Monitoring",
    ],
    technicalWork: [
      "Configured Linux network namespaces and virtualized topologies",
      "Implemented deterministic host addressing algorithm across simulated subnets",
      "Authored automated test suite comprising 8 rigorous network test cases",
      "Executed test suite with 100% pass rate (8 passed, 0 failed)",
    ],
    specs: {
      "Environment": "Ubuntu / Linux",
      "Language": "Python",
      "Simulation Framework": "Mininet-style network simulation",
      "Deterministic Addressing": "Fully validated",
      "Automated Tests": "8 tests, 8 passed (100% pass rate)",
      "Sample Test": "test_deterministic_host_addressing ... OK",
    },
    notes: "Strictly reflects verified testing results and network simulation architecture.",
  },
];
