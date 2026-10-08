"use client";

import { useEffect, useState } from "react";
import { profile, calculateRealtimeAge } from "@/data/profile";
import RetroIcon from "../os/RetroIcon";
import { playActionClick } from "@/lib/sound";

export default function MyComputerWindow({ onOpenApp }: { onOpenApp: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "os_topics" | "networking" | "math_german">("overview");
  const [age, setAge] = useState(calculateRealtimeAge());

  // Update age in real-time every minute or second
  useEffect(() => {
    const timer = setInterval(() => {
      setAge(calculateRealtimeAge());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mycomputer-window">
      {/* System Banner */}
      <div className="system-banner">
        <div className="banner-icon">
          <RetroIcon name="computer" size={48} />
        </div>
        <div className="banner-text">
          <h3>{profile.name}</h3>
          <p className="banner-sub">
            <b>{profile.degree}</b> • {profile.semester} • <b>{profile.university}</b>
          </p>
          <div className="banner-badges">
            <span className="retro-badge badge-primary">CGPA: {profile.cgpa} / 10.0</span>
            <span className="retro-badge badge-success">{profile.status}</span>
            <span className="retro-badge badge-info">Location: {profile.location}</span>
          </div>
        </div>
      </div>

      {/* Real-time Age & Profile Strip */}
      <div className="retro-fieldset age-box">
        <legend>Real-Time Bio Chronometer</legend>
        <div className="age-grid">
          <div className="age-item">
            <span className="age-label">Date of Birth:</span>
            <span className="age-val">12 April 2007</span>
          </div>
          <div className="age-item">
            <span className="age-label">Calculated Real-Time Age:</span>
            <span className="age-val highlight-age">
              {age.years} yrs, {age.months} mos, {age.days} days
            </span>
          </div>
          <div className="age-item">
            <span className="age-label">Total Days Lived:</span>
            <span className="age-val">{age.totalDays.toLocaleString()} days</span>
          </div>
          <div className="age-item">
            <span className="age-label">Primary Objective:</span>
            <span className="age-val">{profile.careerGoal}</span>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="retro-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "overview"}
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("overview");
          }}
        >
          General Profile
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "academics"}
          className={`tab-btn ${activeTab === "academics" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("academics");
          }}
        >
          CS Fundamentals
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "os_topics"}
          className={`tab-btn ${activeTab === "os_topics" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("os_topics");
          }}
        >
          Operating Systems
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "networking"}
          className={`tab-btn ${activeTab === "networking" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("networking");
          }}
        >
          Computer Networks
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "math_german"}
          className={`tab-btn ${activeTab === "math_german" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("math_german");
          }}
        >
          Math & German
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-body" role="tabpanel">
        {activeTab === "overview" && (
          <div className="tab-pane">
            <p className="profile-summary">{profile.tagline}</p>

            <div className="retro-fieldset">
              <legend>Academic Interests & Core Disciplines</legend>
              <div className="tags-flex">
                {profile.academicInterests.map((interest) => (
                  <span key={interest} className="tag tag-blue">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="retro-fieldset">
              <legend>Problem Solving Track Record</legend>
              <div className="stat-row">
                <span className="stat-number">{profile.problemSolving.count}</span>
                <div className="stat-desc">
                  <b>LeetCode Problems Solved</b>
                  <p>Focused on Data Structures, Algorithms, and Core Problem Solving fundamentals.</p>
                </div>
              </div>
            </div>

            <div className="retro-fieldset">
              <legend>Hackathons, Competitions & Honors</legend>
              <ul className="retro-list">
                {profile.hackathons.map((h) => (
                  <li key={h.name}>
                    <b>{h.name}</b> — <span>{h.note}</span>
                  </li>
                ))}
                <li>
                  <b className="cert-confirmed">★ Merit Certificate from VIT</b> — <span>Confirmed Academic Honor</span>
                </li>
                <li>
                  <b className="cert-ongoing">◷ EC-Council Ethical Hacking Course</b> — <span className="text-warning">STATUS: IN PROGRESS (Coursework ongoing)</span>
                </li>
              </ul>
            </div>

            <div className="quick-nav-bar">
              <span>Quick Navigation:</span>
              <button className="retro-action-btn" onClick={() => onOpenApp("projects")}>
                View Projects
              </button>
              <button className="retro-action-btn" onClick={() => onOpenApp("security")}>
                Security Lab
              </button>
              <button className="retro-action-btn" onClick={() => onOpenApp("skills")}>
                Skills Inventory
              </button>
            </div>
          </div>
        )}

        {activeTab === "academics"}
        {activeTab === "academics" && (
          <div className="tab-pane">
            <p className="tab-intro">
              Curriculum and coursework studied in the B.Tech Computer Science program at VIT Vellore:
            </p>
            <div className="retro-fieldset">
              <legend>Core Computer Science Courses</legend>
              <ul className="bullet-grid">
                {profile.academicAreas.computerScience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="callout-box">
              <b>Data Structures Focus:</b> Stack, Queue, Linked List, Trees, Graphs, and Skip List implementations.
            </div>
          </div>
        )}

        {activeTab === "os_topics" && (
          <div className="tab-pane">
            <p className="tab-intro">
              Specific Operating Systems topics, synchronization problems, and scheduling algorithms studied:
            </p>
            <div className="retro-fieldset">
              <legend>Operating Systems Topics & Algorithms</legend>
              <ul className="bullet-grid">
                {profile.academicAreas.operatingSystemsTopics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
            <div className="os-concepts-grid">
              <div className="concept-card">
                <b>Classic Synchronization:</b>
                <p>Dining Philosophers, N-Process Bakery Algorithm, Readers-Writers Problem, Banker&apos;s Algorithm (Deadlock avoidance).</p>
              </div>
              <div className="concept-card">
                <b>Scheduling & Memory:</b>
                <p>Disk Scheduling (SCAN, C-SCAN, LOOK, C-LOOK), Page Replacement (LFU, Optimal), CPU Scheduling (SRTF, Priority Preemptive).</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "networking" && (
          <div className="tab-pane">
            <p className="tab-intro">
              Computer Networking principles, protocol architecture, and simulation coursework studied:
            </p>
            <div className="retro-fieldset">
              <legend>Networking Topics & Protocols</legend>
              <ul className="bullet-grid">
                {profile.academicAreas.networkingTopics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
            <div className="callout-box">
              <b>Practical Simulation:</b> Mininet topology modeling, deterministic host addressing, Bellman-Ford, Distance Vector Routing, Link State Routing, RIP.
            </div>
          </div>
        )}

        {activeTab === "math_german" && (
          <div className="tab-pane">
            <div className="retro-fieldset">
              <legend>Statistics & Mathematics Studied</legend>
              <ul className="bullet-grid">
                {profile.academicAreas.mathematicsStatistics.map((math) => (
                  <li key={math}>{math}</li>
                ))}
              </ul>
            </div>

            <div className="retro-fieldset">
              <legend>German Language Coursework</legend>
              <ul className="bullet-grid">
                {profile.academicAreas.germanCoursework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
