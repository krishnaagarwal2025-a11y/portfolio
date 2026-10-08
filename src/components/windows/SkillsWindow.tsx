"use client";

import { useState } from "react";
import { skillCategories, SkillCategory } from "@/data/skills";
import { playActionClick } from "@/lib/sound";

export default function SkillsWindow() {
  const [selectedCat, setSelectedCat] = useState<SkillCategory>(skillCategories[0]);
  const [search, setSearch] = useState("");

  const filteredCategories = skillCategories.map((cat) => {
    if (!search) return cat;
    const matches = cat.items.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
    return { ...cat, items: matches };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div className="skills-window">
      {/* Top Search & Filter Bar */}
      <div className="skills-filter-strip">
        <div className="search-box">
          <label htmlFor="skill-search">Filter Skills:</label>
          <input
            id="skill-search"
            type="text"
            placeholder="Search technologies, tools, algorithms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="retro-input"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        <span className="skills-count-pill">
          Device Manager v4.2 • Verified Competencies
        </span>
      </div>

      <div className="skills-layout-split">
        {/* Left Tree / Category Sidebar */}
        <div className="skills-tree-sidebar" role="tablist">
          <div className="sidebar-legend">System Subsystems</div>
          {skillCategories.map((cat) => {
            const isSelected = selectedCat.category === cat.category;
            return (
              <button
                key={cat.category}
                role="tab"
                aria-selected={isSelected}
                className={`tree-node-btn ${isSelected ? "tree-node-selected" : ""}`}
                onClick={() => {
                  playActionClick();
                  setSelectedCat(cat);
                }}
              >
                <span className="tree-bullet">📁</span>
                <span className="tree-label">{cat.category}</span>
                <span className="tree-count">({cat.items.length})</span>
              </button>
            );
          })}
        </div>

        {/* Right Details Panel */}
        <div className="skills-detail-panel">
          {search ? (
            <div className="search-results-wrapper">
              <h4>Matching Technologies for &ldquo;{search}&rdquo;:</h4>
              {filteredCategories.map((cat) => (
                <div key={cat.category} className="filtered-group">
                  <b>{cat.category}:</b>
                  <div className="tags-flex">
                    {cat.items.map((item) => (
                      <span key={item} className="tag tag-skill">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="category-view">
              <div className="cat-header">
                <h3>{selectedCat.category}</h3>
                <p>{selectedCat.description}</p>
              </div>

              <div className="skills-badges-grid">
                {selectedCat.items.map((skill) => (
                  <div key={skill} className="skill-card">
                    <span className="skill-chip-icon">⚡</span>
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>

              <div className="cat-footer-info">
                <span className="info-icon">ℹ</span>
                <span>
                  All items are directly supported by coursework at VIT Vellore or completed repository implementations.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
