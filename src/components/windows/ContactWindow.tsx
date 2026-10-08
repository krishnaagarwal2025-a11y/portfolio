"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { playActionClick } from "@/lib/sound";

export default function ContactWindow() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const recipientEmail = profile.contact.email;

  const handleCopyEmail = async () => {
    playActionClick();
    try {
      await navigator.clipboard.writeText(recipientEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
    }
  };

  const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipientEmail
  )}&su=${encodeURIComponent("[KrishnaOS] Internship Proposal / Project Inquiry")}`;

  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
    "[KrishnaOS] Internship Proposal / Project Inquiry"
  )}`;

  return (
    <div className="contact-window">
      <div className="contact-head">
        <h3>Contact Krishna Agarwal</h3>
        <p>
          Computer Science student at VIT Vellore • Open to Internship Opportunities (2026).
        </p>
      </div>

      {/* Official Communication Coordinates */}
      <div className="retro-fieldset">
        <legend>Official Communication Channels</legend>
        <div className="contact-rows-list">
          <div className="contact-row">
            <span className="channel-name">EMAIL:</span>
            <div className="channel-val-group">
              <a href={mailtoLink} className="link-highlight">
                {recipientEmail}
              </a>
              <button
                type="button"
                className="retro-action-btn btn-sm"
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
              >
                {copiedEmail ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>

          <div className="contact-row">
            <span className="channel-name">LINKEDIN:</span>
            <span className="channel-val">
              <a
                href={profile.contact.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="link-highlight"
              >
                {profile.contact.linkedin} ↗
              </a>
            </span>
          </div>

          <div className="contact-row">
            <span className="channel-name">GITHUB:</span>
            <span className="channel-val">
              <a
                href={profile.contact.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="link-highlight"
              >
                {profile.contact.github} ↗
              </a>
            </span>
          </div>

          <div className="contact-row">
            <span className="channel-name">LEETCODE:</span>
            <span className="channel-val">
              <a
                href={profile.contact.leetcodeUrl}
                target="_blank"
                rel="noreferrer"
                className="link-highlight"
              >
                {profile.contact.leetcode} ↗
              </a>
            </span>
          </div>

          <div className="contact-row">
            <span className="channel-name">RESUME PDF:</span>
            <span className="channel-val">
              <a
                href={profile.contact.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="link-highlight text-ok"
              >
                {profile.contact.resumeFileName} (View / Download) ↗
              </a>
            </span>
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
                {profile.contact.repo} ↗
              </a>
            </span>
          </div>

          <div className="contact-row">
            <span className="channel-name">LOCATION:</span>
            <span className="channel-val">{profile.location} (VIT Vellore)</span>
          </div>
        </div>
      </div>

      {/* Direct Contact Actions */}
      <div className="retro-fieldset">
        <legend>Direct Reachout Options</legend>
        <p className="contact-direct-desc">
          Feel free to reach out directly via your preferred email client or on LinkedIn for internship opportunities, technical discussions, or project collaborations.
        </p>
        <div className="contact-direct-actions">
          <a
            href={mailtoLink}
            className="retro-action-btn btn-primary"
            onClick={playActionClick}
            title="Open in your default mail app"
          >
            ✉ Send Email via Mail Client
          </a>
          <a
            href={gmailWebLink}
            target="_blank"
            rel="noreferrer"
            className="retro-action-btn"
            onClick={playActionClick}
            title="Open compose window in Gmail Web"
          >
            📧 Compose in Gmail Web
          </a>
          <a
            href={profile.contact.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="retro-action-btn"
            onClick={playActionClick}
            title="Connect on LinkedIn"
          >
            💼 Connect on LinkedIn
          </a>
          <button
            type="button"
            className="retro-action-btn"
            onClick={handleCopyEmail}
          >
            {copiedEmail ? "✓ Email Copied!" : "📋 Copy Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
