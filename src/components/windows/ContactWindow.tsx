"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { playActionClick, playStartupChime } from "@/lib/sound";

export default function ContactWindow() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playStartupChime();
    setSubmitted(true);
  };

  return (
    <div className="contact-window">
      <div className="contact-head">
        <h3>Contact Krishna Agarwal</h3>
        <p>
          Computer Science student at VIT Vellore • Open to Internship Opportunities (2026).
        </p>
      </div>

      {/* Official Contact Coordinates */}
      <div className="retro-fieldset">
        <legend>Official Communication Channels</legend>
        <div className="contact-rows-list">
          <div className="contact-row">
            <span className="channel-name">EMAIL:</span>
            <span className="channel-val todo-val">{profile.contact.email}</span>
          </div>

          <div className="contact-row">
            <span className="channel-name">GITHUB:</span>
            <span className="channel-val todo-val">{profile.contact.github}</span>
          </div>

          <div className="contact-row">
            <span className="channel-name">LINKEDIN:</span>
            <span className="channel-val todo-val">{profile.contact.linkedin}</span>
          </div>

          <div className="contact-row">
            <span className="channel-name">MORROW REPO:</span>
            <span className="channel-val">
              <a
                href={profile.contact.repo}
                target="_blank"
                rel="noreferrer"
                className="link-highlight"
              >
                {profile.contact.repo}
              </a>
            </span>
          </div>

          <div className="contact-row">
            <span className="channel-name">LOCATION:</span>
            <span className="channel-val">{profile.location} (VIT Vellore)</span>
          </div>
        </div>
      </div>

      {/* Send a Dispatch Message Form */}
      <div className="retro-fieldset">
        <legend>Dispatch a Message (KrishnaOS Mailer)</legend>
        {submitted ? (
          <div className="dispatch-success-box">
            <h4>✓ Message Queued in Virtual Spooler</h4>
            <p>
              Thank you, <b>{formName || "Visitor"}</b>. Your message was processed by the KrishnaOS spool daemon.
              (Note: For immediate direct contact, please reach out via verified social / email channels when available).
            </p>
            <button
              className="retro-action-btn"
              onClick={() => {
                playActionClick();
                setSubmitted(false);
                setFormMsg("");
              }}
            >
              Compose Another Dispatch
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="name-input">Your Name / Organization:</label>
              <input
                id="name-input"
                type="text"
                required
                placeholder="e.g. Technical Recruiter / Engineering Lead"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="retro-input"
              />
            </div>

            <div className="form-row">
              <label htmlFor="email-input">Your Contact Email:</label>
              <input
                id="email-input"
                type="email"
                required
                placeholder="e.g. recruiter@company.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="retro-input"
              />
            </div>

            <div className="form-row">
              <label htmlFor="msg-input">Message / Internship Proposal:</label>
              <textarea
                id="msg-input"
                rows={4}
                required
                placeholder="Enter details regarding internship roles (Cybersecurity, Software Engineering, AI/RAG, Networking, IoT)..."
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
                className="retro-textarea"
              />
            </div>

            <div className="form-submit-row">
              <button type="submit" className="retro-action-btn btn-primary">
                ✉ Transmit Message to Krishna
              </button>
              <span className="form-note">Encrypted transmission via KrishnaOS tty</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
