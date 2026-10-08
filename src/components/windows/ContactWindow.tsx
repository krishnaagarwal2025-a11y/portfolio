"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { playActionClick, playStartupChime, playErrorBeep } from "@/lib/sound";

export default function ContactWindow() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const recipientEmail = profile.contact.email; // agarwalkrishna1204@gmail.com

  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
    `[KrishnaOS] Proposal / Inquiry from ${formName || "Visitor"}`
  )}&body=${encodeURIComponent(
    `Sender Name: ${formName}\nSender Email: ${formEmail}\n\nMessage:\n${formMsg}\n\n---\nDispatched from KrishnaOS Desktop`
  )}`;

  const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipientEmail
  )}&su=${encodeURIComponent(
    `[KrishnaOS] Proposal / Inquiry from ${formName || "Visitor"}`
  )}&body=${encodeURIComponent(
    `Sender Name: ${formName}\nSender Email: ${formEmail}\n\nMessage:\n${formMsg}\n\n---\nDispatched from KrishnaOS Desktop`
  )}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMsg.trim()) return;

    setIsSending(true);
    setErrorMessage(null);

    try {
      // Send directly to our Next.js API route which relays to FormSubmit
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMsg,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        playStartupChime();
        setSubmitted(true);
      } else {
        // Fallback: Attempt client-side direct dispatch to FormSubmit
        const directRes = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            message: formMsg,
            _subject: `[KrishnaOS Portfolio] New Proposal from ${formName}`,
            _template: "table",
            _captcha: "false",
          }),
        }).catch(() => null);

        if (directRes && directRes.ok) {
          playStartupChime();
          setSubmitted(true);
        } else {
          // If network / third-party blocks it, allow user to use Gmail / mailto
          playErrorBeep();
          setErrorMessage(
            data?.message ||
              "Automated transmission relay encountered a network block. Use the direct email button below to transmit instantly!"
          );
        }
      }
    } catch (err: unknown) {
      playErrorBeep();
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Network transmission error. Please use the direct email link below."
      );
    } finally {
      setIsSending(false);
    }
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
            <div className="channel-val-group">
              <a href={`mailto:${recipientEmail}`} className="link-highlight">
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

      {/* Send a Dispatch Message Form */}
      <div className="retro-fieldset">
        <legend>Dispatch a Direct Message (KrishnaOS Mailer)</legend>

        {submitted ? (
          <div className="dispatch-success-box">
            <div className="dispatch-success-header">
              <span className="success-icon">✓</span>
              <h4>Message Transmitted to Krishna&apos;s Inbox!</h4>
            </div>
            <p className="success-note">
              Thank you, <b>{formName || "Visitor"}</b>. Your message was processed and forwarded directly to{" "}
              <b>{recipientEmail}</b>. Krishna will review your message and reply to <b>{formEmail}</b>.
            </p>

            <div className="dispatch-receipt">
              <div className="receipt-row">
                <span className="receipt-key">Recipient:</span>
                <span className="receipt-val">{recipientEmail}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-key">Sender:</span>
                <span className="receipt-val">{formEmail} ({formName})</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-key">Status:</span>
                <span className="receipt-val text-ok">DELIVERED TO INBOX (SMTP RELAY OK)</span>
              </div>
            </div>

            <div className="dispatch-actions">
              <a
                href={gmailWebLink}
                target="_blank"
                rel="noreferrer"
                className="retro-action-btn"
                title="Open copy in Gmail Web"
              >
                📧 Open Copy in Gmail Web
              </a>
              <button
                type="button"
                className="retro-action-btn btn-primary"
                onClick={() => {
                  playActionClick();
                  setSubmitted(false);
                  setFormMsg("");
                  setErrorMessage(null);
                }}
              >
                ✉ Compose Another Message
              </button>
            </div>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="form-error-banner">
                <p><b>Notice:</b> {errorMessage}</p>
                <div className="error-fallback-actions">
                  <a
                    href={gmailWebLink}
                    target="_blank"
                    rel="noreferrer"
                    className="retro-action-btn"
                  >
                    📧 Transmit via Gmail Web
                  </a>
                  <a
                    href={mailtoLink}
                    className="retro-action-btn"
                  >
                    📮 Open Default Mail Client
                  </a>
                </div>
              </div>
            )}

            <div className="form-row">
              <label htmlFor="name-input">Your Name / Organization:</label>
              <input
                id="name-input"
                type="text"
                required
                disabled={isSending}
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
                disabled={isSending}
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
                disabled={isSending}
                placeholder="Enter details regarding internship roles (Cybersecurity, Software Engineering, AI/RAG, Networking, IoT)..."
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
                className="retro-textarea"
              />
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                disabled={isSending}
                className="retro-action-btn btn-primary"
              >
                {isSending ? "⏳ Transmitting Packet..." : "✉ Transmit Message to Krishna"}
              </button>

              <a
                href={mailtoLink}
                className="retro-action-btn"
                title="Send using your system default mail client (mailto:)"
              >
                📮 Send via Email App
              </a>

              <span className="form-note">
                Direct delivery to <b>{recipientEmail}</b>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
