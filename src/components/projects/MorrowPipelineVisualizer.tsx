"use client";

import { useState } from "react";
import { playActionClick } from "@/lib/sound";
import { useKrishnaExe } from "../krishna-exe/KrishnaContext";

const PIPELINE_STAGES = [
  {
    id: "ingestion",
    name: "1. Document Ingestion",
    sub: "PDF / DOCX / TXT",
    summary: "Accepts manual document uploads from the user via web interface or API.",
    code: `# Document Upload Handler
uploaded_file = request.files.get('file')
file_type = uploaded_file.filename.split('.')[-1]
# Route to specialized extractor module based on mime/extension`,
  },
  {
    id: "extraction",
    name: "2. Text Extraction",
    sub: "PyMuPDF & python-docx",
    summary: "Extracts raw text and structural metadata using PyMuPDF (pdf_extractor.py) and python-docx (docx_extractor.py).",
    code: `# pdf_extractor.py & docx_extractor.py
import fitz  # PyMuPDF
def extract_pdf_text(stream):
    doc = fitz.open(stream=stream, filetype="pdf")
    return "\\n".join([page.get_text() for page in doc])`,
  },
  {
    id: "chunking",
    name: "3. Chunking Engine",
    sub: "chunker.py (Sliding Window)",
    summary: "Splits extracted text into overlapping chunks. Evaluated configurations: (chunk=100, overlap=20 -> 10 chunks) & (chunk=250, overlap=50).",
    code: `# chunker.py test_chunking.py
def chunk_text(text: str, chunk_size=100, overlap=20):
    words = text.split()
    step = chunk_size - overlap
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), step)]
# Test Result: 10 chunks generated under test suite`,
  },
  {
    id: "embeddings",
    name: "4. Embeddings Generation",
    sub: "Dense Vector Representations",
    summary: "Transforms each text chunk into a high-dimensional dense vector capturing semantic context.",
    code: `# Embeddings generation step
chunk_embeddings = [embed_model.encode(chunk) for chunk in chunks]
# Dense vector array ready for pgvector insertion`,
  },
  {
    id: "vectordb",
    name: "5. Vector Database",
    sub: "PostgreSQL + pgvector",
    summary: "Stores chunk vectors and source document metadata inside PostgreSQL with the pgvector extension.",
    code: `-- PostgreSQL + pgvector setup
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE doc_embeddings (
    id SERIAL PRIMARY KEY,
    doc_id VARCHAR(64),
    chunk_index INT,
    chunk_text TEXT,
    embedding vector(1536)
);`,
  },
  {
    id: "retrieval",
    name: "6. Semantic Retrieval",
    sub: "Cosine / L2 Vector Distance",
    summary: "Matches user query embedding against stored chunks using cosine similarity in pgvector.",
    code: `-- Semantic similarity search query
SELECT chunk_text, (embedding <=> query_vec) AS distance
FROM doc_embeddings
ORDER BY distance ASC
LIMIT 5;`,
  },
  {
    id: "llm",
    name: "7. LLM Augmentation",
    sub: "Context Window Injection",
    summary: "Injects retrieved semantically relevant chunks into the LLM context prompt.",
    code: `# Prompt composition
prompt = f"""Use the following source contexts to answer:
{retrieved_contexts}
Question: {user_query}
Provide citations and references."""`,
  },
  {
    id: "answer",
    name: "8. Answer + Source References",
    sub: "Synthesized Output",
    summary: "Returns the generated answer together with exact document source references and page citations.",
    code: `{
  "answer": "Generated synthesis based on retrieved document chunks...",
  "sources": [
    {"doc": "quarterly_report.pdf", "chunk_id": 4, "similarity": 0.88}
  ]
}`,
  },
];

export default function MorrowPipelineVisualizer() {
  const { requestEmote } = useKrishnaExe();
  const [selectedStage, setSelectedStage] = useState(PIPELINE_STAGES[2]); // Default to chunking

  return (
    <div className="morrow-visualizer">
      <div className="pipeline-header">
        <b>Morrow RAG Ingestion & Semantic Retrieval Pipeline</b>
        <span>Click any stage below to inspect the component implementation</span>
      </div>

      {/* Horizontal Flow Steps */}
      <div className="pipeline-flow" role="list">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isSelected = selectedStage.id === stage.id;
          return (
            <div key={stage.id} className="pipeline-node-wrapper">
              <button
                className={`pipeline-node ${isSelected ? "pipeline-node-active" : ""}`}
                onClick={() => {
                  playActionClick();
                  setSelectedStage(stage);
                  requestEmote("typing", 2500, `krishna.exe: inspecting ${stage.name.split(". ")[1]}`);
                }}
                role="listitem"
                title={stage.name}
              >
                <span className="node-num">{idx + 1}</span>
                <span className="node-name">{stage.name.split(". ")[1]}</span>
                <span className="node-sub">{stage.sub}</span>
              </button>
              {idx < PIPELINE_STAGES.length - 1 && <span className="pipeline-arrow">→</span>}
            </div>
          );
        })}
      </div>

      {/* Stage Inspection Card */}
      <div className="stage-inspector">
        <div className="inspector-head">
          <span className="inspector-title">{selectedStage.name}</span>
          <span className="inspector-badge">Module: {selectedStage.sub}</span>
        </div>
        <p className="inspector-desc">{selectedStage.summary}</p>
        <div className="inspector-code-block">
          <pre>{selectedStage.code}</pre>
        </div>
      </div>
    </div>
  );
}
