"use client";

import { ProjectData } from "@/data/projects";
import MorrowPipelineVisualizer from "./MorrowPipelineVisualizer";
import WearableSimulator from "./WearableSimulator";
import AuraGuardHazardMonitor from "./AuraGuardHazardMonitor";
import NetworkSimRunner from "./NetworkSimRunner";

interface Props {
  project: ProjectData;
  onBack?: () => void;
}

export default function ProjectDetail({ project, onBack }: Props) {
  return (
    <div className="project-detail-view">
      {/* Detail Top Bar */}
      <div className="detail-top-nav">
        {onBack && (
          <button className="retro-back-btn" onClick={onBack}>
            ← Back to All Projects
          </button>
        )}
        <div className="detail-status-tags">
          <span className="retro-badge badge-primary">{project.category}</span>
          <span className="retro-badge badge-info">{project.status}</span>
        </div>
      </div>

      {/* Main Title & Tagline */}
      <div className="project-header-block">
        <h2>{project.name}</h2>
        <p className="project-tagline">{project.tagline}</p>
      </div>

      {/* Tech Tags */}
      <div className="tech-tags-list">
        {project.technologies.map((t) => (
          <span key={t} className="tag tag-tech">
            {t}
          </span>
        ))}
      </div>

      {/* Overview */}
      <div className="retro-fieldset">
        <legend>Project Architecture & Purpose</legend>
        <p className="project-overview-text">{project.overview}</p>
      </div>

      {/* Custom Interactive Module based on project */}
      <div className="project-simulator-container">
        {project.id === "morrow" && <MorrowPipelineVisualizer />}
        {project.id === "wearable" && <WearableSimulator />}
        {project.id === "auraguard" && <AuraGuardHazardMonitor />}
        {project.id === "network-sim" && <NetworkSimRunner />}
      </div>

      {/* Level-1 Criteria (specifically for Morrow) */}
      {project.level1Criteria && (
        <div className="retro-fieldset">
          <legend>Core Level-1 Success Criteria</legend>
          <ul className="criteria-grid">
            {project.level1Criteria.map((c, i) => (
              <li key={c} className="criteria-item">
                <span className="criteria-check">✓</span>
                <span className="criteria-text">
                  <b>Step {i + 1}:</b> {c}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Components */}
      {project.keyComponents && (
        <div className="retro-fieldset">
          <legend>Core Codebase Components</legend>
          <ul className="components-list">
            {project.keyComponents.map((comp) => (
              <li key={comp}>
                <code>{comp}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technical Work Completed */}
      {project.technicalWork && (
        <div className="retro-fieldset">
          <legend>Technical Work Completed</legend>
          <ul className="work-list">
            {project.technicalWork.map((work) => (
              <li key={work}>{work}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Specs Table */}
      {project.specs && (
        <div className="retro-fieldset">
          <legend>Technical Specifications & Thresholds</legend>
          <div className="specs-table-grid">
            {Object.entries(project.specs).map(([k, v]) => (
              <div key={k} className="spec-row">
                <span className="spec-key">{k}:</span>
                <span className="spec-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repository & Notes */}
      <div className="project-footer-notes">
        {project.repository && (
          <div className="repo-box">
            <b>Git Repository:</b>{" "}
            <a href={project.repository} target="_blank" rel="noreferrer" className="repo-link">
              {project.repository}
            </a>
            {project.notes && <p className="repo-clarification">Note: {project.notes}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
