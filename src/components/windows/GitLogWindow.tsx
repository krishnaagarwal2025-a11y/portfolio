"use client";

import { useState } from "react";
import { gitCommits, GitCommit } from "@/data/gitHistory";
import { playActionClick } from "@/lib/sound";

export default function GitLogWindow() {
  const [selectedCommit, setSelectedCommit] = useState<GitCommit | null>(gitCommits[0]);
  const [filterProject, setFilterProject] = useState<string>("ALL");

  const projectsList = ["ALL", ...Array.from(new Set(gitCommits.map((c) => c.project)))];

  const filtered = filterProject === "ALL"
    ? gitCommits
    : gitCommits.filter((c) => c.project === filterProject);

  return (
    <div className="git-window">
      {/* Top Filter Bar */}
      <div className="git-filter-bar">
        <div className="filter-group">
          <span>Project Filter:</span>
          {projectsList.map((p) => (
            <button
              key={p}
              className={`git-filter-btn ${filterProject === p ? "active" : ""}`}
              onClick={() => {
                playActionClick();
                setFilterProject(p);
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <span className="git-stats-label">git log --graph --decorate --all</span>
      </div>

      <div className="git-body-split">
        {/* Commit Log Stream */}
        <div className="commit-list-pane">
          {filtered.map((c) => {
            const isSelected = selectedCommit?.hash === c.hash;
            return (
              <div
                key={c.hash}
                className={`commit-row ${isSelected ? "commit-row-selected" : ""}`}
                onClick={() => {
                  playActionClick();
                  setSelectedCommit(c);
                }}
              >
                <div className="commit-left">
                  <span className="graph-dot">*</span>
                  <span className="commit-hash">{c.hash}</span>
                  <span className="commit-branch">[{c.branch}]</span>
                  {c.tag && <span className="commit-tag">tag: {c.tag}</span>}
                </div>
                <div className="commit-msg">{c.message}</div>
                <div className="commit-right">
                  <span className="commit-proj-badge">{c.project}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commit Inspector Detail Pane */}
        {selectedCommit && (
          <div className="commit-detail-pane">
            <div className="detail-head">
              <b>Commit Details: {selectedCommit.hash}</b>
              <span className="commit-branch-tag">Branch: {selectedCommit.branch}</span>
            </div>

            <div className="detail-meta">
              <div><b>Project:</b> {selectedCommit.project}</div>
              <div><b>Author:</b> Krishna Agarwal &lt;developer@krishnaos&gt;</div>
              {selectedCommit.tag && <div><b>Git Tag:</b> {selectedCommit.tag}</div>}
            </div>

            <div className="detail-message-box">
              <pre>{selectedCommit.message}</pre>
            </div>

            {selectedCommit.details && (
              <div className="detail-extended-box">
                <b>Commit Notes & Work:</b>
                <p>{selectedCommit.details}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="git-footer">
        <span>Git Experience: Branching, Rebasing, Conflict Resolution, Milestones</span>
        <span>Repository: krishnaagarwal2025-a11y/Memora.git</span>
      </div>
    </div>
  );
}
