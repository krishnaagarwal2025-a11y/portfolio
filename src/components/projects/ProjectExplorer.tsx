"use client";

import { useState } from "react";
import { projects, ProjectData } from "@/data/projects";
import ProjectDetail from "./ProjectDetail";
import { playActionClick } from "@/lib/sound";

interface Props {
  onOpenProjectWindow?: (id: string) => void;
}

export default function ProjectExplorer({ onOpenProjectWindow }: Props) {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  if (activeProject) {
    return <ProjectDetail project={activeProject} onBack={() => setActiveProject(null)} />;
  }

  return (
    <div className="project-explorer">
      <div className="explorer-header">
        <div className="explorer-title-box">
          <h3>Verified Projects Repository</h3>
          <p>
            Hardware prototypes, RAG document ingestion systems, IoT sensors, and network simulations built by Krishna Agarwal.
          </p>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((p) => (
          <div key={p.id} className="project-card">
            <div className="card-top">
              <div className="card-badge-row">
                <span className="card-cat">{p.category}</span>
                <span className="card-status">{p.status}</span>
              </div>
              <h4 className="card-title">{p.name}</h4>
              <p className="card-tagline">{p.tagline}</p>
            </div>

            <div className="card-techs">
              {p.technologies.slice(0, 5).map((t) => (
                <span key={t} className="tag tag-sm">
                  {t}
                </span>
              ))}
              {p.technologies.length > 5 && <span className="tag-more">+{p.technologies.length - 5} more</span>}
            </div>

            <div className="card-actions">
              <button
                className="retro-action-btn btn-primary"
                onClick={() => {
                  playActionClick();
                  setActiveProject(p);
                }}
              >
                Inspect Project & Architecture →
              </button>
              {onOpenProjectWindow && (
                <button
                  className="retro-action-btn"
                  title="Open in dedicated desktop window"
                  onClick={() => {
                    playActionClick();
                    onOpenProjectWindow(`p-${p.id}`);
                  }}
                >
                  Pop-out Window ↗
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="explorer-footer">
        <span>Total Projects: 4 Verified System Implementations</span>
        <span>Directory: C:\projects\krishna</span>
      </div>
    </div>
  );
}
