"use client";

import { useState } from "react";
import { profile, calculateRealtimeAge } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { playActionClick } from "@/lib/sound";

export default function ResumeWindow() {
  const [viewMode, setViewMode] = useState<"pdf" | "summary">("pdf");
  const age = calculateRealtimeAge();

  return (
    <div className="resume-window">
      {/* Top Retro Toolbar */}
      <div className="resume-toolbar">
        <div className="toolbar-left">
          <span className="doc-icon">📄</span>
          <b>{profile.contact.resumeFileName}</b>
          <span className="doc-pages">[Resume / CV • Ready for Review]</span>
        </div>

        <div className="toolbar-actions">
          <button
            className={`retro-action-btn ${viewMode === "pdf" ? "btn-primary" : ""}`}
            onClick={() => {
              playActionClick();
              setViewMode("pdf");
            }}
          >
            PDF Viewer
          </button>
          <button
            className={`retro-action-btn ${viewMode === "summary" ? "btn-primary" : ""}`}
            onClick={() => {
              playActionClick();
              setViewMode("summary");
            }}
          >
            Text Summary
          </button>
          <a
            href={profile.contact.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="retro-action-btn"
          >
            ↗ Open in New Tab
          </a>
          <a
            href={profile.contact.resumeUrl}
            download={profile.contact.resumeFileName}
            className="retro-action-btn btn-primary"
          >
            ⬇ Download PDF
          </a>
        </div>
      </div>

      {/* Embedded PDF View */}
      {viewMode === "pdf" && (
        <div className="resume-pdf-frame-wrapper">
          <iframe
            src={profile.contact.resumeUrl}
            title="Krishna Agarwal Resume PDF"
            className="resume-pdf-iframe"
          />
          <div className="pdf-fallback-note">
            If the PDF preview does not display in your browser,{" "}
            <a href={profile.contact.resumeUrl} target="_blank" rel="noreferrer" className="link-highlight">
              click here to open krishna_cyber.pdf directly
            </a>
            .
          </div>
        </div>
      )}

      {/* Rendered Summary Sheet */}
      {viewMode === "summary" && (
        <div className="resume-sheet">
          {/* Header */}
          <div className="resume-head-block">
            <h1 className="resume-name">{profile.name}</h1>
            <div className="resume-contact-line">
              <span>{profile.degree} (Third Semester)</span> •{" "}
              <span>{profile.university}</span> •{" "}
              <span>{profile.location}</span> •{" "}
              <span>Age: {age.years}</span>
            </div>
            <div className="resume-links-line">
              <span>
                Email: <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
              </span>{" "}
              |{" "}
              <span>
                LinkedIn:{" "}
                <a href={profile.contact.linkedinUrl} target="_blank" rel="noreferrer">
                  {profile.contact.linkedin}
                </a>
              </span>{" "}
              |{" "}
              <span>
                GitHub:{" "}
                <a href={profile.contact.githubUrl} target="_blank" rel="noreferrer">
                  {profile.contact.github}
                </a>
              </span>{" "}
              |{" "}
              <span>
                LeetCode:{" "}
                <a href={profile.contact.leetcodeUrl} target="_blank" rel="noreferrer">
                  {profile.contact.leetcode}
                </a>
              </span>
            </div>
            <div className="resume-status-callout">
              <b>Status:</b> {profile.status} | <b>Goal:</b> {profile.careerGoal}
            </div>
          </div>

          <hr className="resume-rule" />

          {/* Education */}
          <section className="resume-section">
            <h3 className="section-title">EDUCATION</h3>
            <div className="resume-entry">
              <div className="entry-header">
                <b>{profile.university}</b>
                <span className="entry-sub">2024 – Present</span>
              </div>
              <div className="entry-role">
                {profile.degree}, Computer Science & Engineering (Third Semester)
              </div>
              <div className="entry-bullets">
                <div>• <b>Cumulative GPA:</b> {profile.cgpa} / 10.0</div>
                <div>• <b>Core Coursework:</b> Data Structures, Algorithms, Operating Systems, Computer Networks, Database Systems, Computer Organization & Architecture, OOP, C/C++, Python, Java.</div>
                <div>• <b>Mathematics & Statistics:</b> Probability and Statistics, Normal/F Distributions, t-test, Chi-square test, Yates correction.</div>
                <div>• <b>Foreign Language:</b> German language coursework (Akkusativ prepositions, modal verbs, vocabulary).</div>
              </div>
            </div>
          </section>

          {/* Technical Projects */}
          <section className="resume-section">
            <h3 className="section-title">TECHNICAL PROJECTS</h3>
            {projects.map((p) => (
              <div key={p.id} className="resume-entry">
                <div className="entry-header">
                  <b>{p.name}</b>
                  <span className="entry-sub">{p.category}</span>
                </div>
                <p className="entry-summary">{p.overview}</p>
                <div className="entry-tech-line">
                  <b>Technologies:</b> {p.technologies.join(", ")}
                </div>
              </div>
            ))}
          </section>

          {/* Technical Skills */}
          <section className="resume-section">
            <h3 className="section-title">TECHNICAL SKILLS</h3>
            <div className="skills-summary-grid">
              {skillCategories.map((cat) => (
                <div key={cat.category} className="resume-skill-row">
                  <b>{cat.category}:</b> {cat.items.join(", ")}
                </div>
              ))}
            </div>
          </section>

          {/* Problem Solving & Honors */}
          <section className="resume-section">
            <h3 className="section-title">PROBLEM SOLVING & HONORS</h3>
            <div className="entry-bullets">
              <div>
                • <b>Competitive Problem Solving:</b> {profile.problemSolving.leetcode} (
                <a href={profile.contact.leetcodeUrl} target="_blank" rel="noreferrer" className="link-highlight">
                  {profile.contact.leetcode}
                </a>
                ).
              </div>
              <div>• <b>Honors:</b> Merit certificate from VIT.</div>
              <div>• <b>Hackathons & Competitions:</b> KLA Hackathon, IQOO Chennai Hackathon, VIT Vellore hackathon work, Ideathon (Topic: &ldquo;Carbon vs Convenience&rdquo;).</div>
              <div>• <b>Certifications / Ongoing Study:</b> EC-Council Ethical Hacking Course (<b>STATUS: IN PROGRESS</b>).</div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
