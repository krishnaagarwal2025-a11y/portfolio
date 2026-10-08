"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ContactMessage } from "@/lib/messagesStore";

export default function InboxPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Auto-login from saved PIN if available
  useEffect(() => {
    const savedPin = localStorage.getItem("kos_admin_pin");
    if (savedPin) {
      setPin(savedPin);
      fetchMessages(savedPin);
    }
  }, []);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const fetchMessages = async (authPin: string) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`/api/inbox?pin=${encodeURIComponent(authPin)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setMessages(data.messages || []);
        localStorage.setItem("kos_admin_pin", authPin);
      } else {
        setIsAuthenticated(false);
        setAuthError(data.message || "Invalid Security PIN. Access denied.");
      }
    } catch {
      setAuthError("Failed to connect to messages repository.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    fetchMessages(pin.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("kos_admin_pin");
    setIsAuthenticated(false);
    setPin("");
    setMessages([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;

    try {
      const res = await fetch(`/api/inbox?id=${encodeURIComponent(id)}&pin=${encodeURIComponent(pin)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showNotice("Message permanently deleted.");
      } else {
        alert("Failed to delete message.");
      }
    } catch {
      alert("Network error while deleting.");
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/inbox?pin=${encodeURIComponent(pin)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentRead }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
      }
    } catch {
      // Ignore
    }
  };

  const handleClearAll = async () => {
    if (!confirm("WARNING: This will delete ALL messages from your database. Proceed?")) return;

    try {
      const res = await fetch(`/api/inbox?id=all&pin=${encodeURIComponent(pin)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages([]);
        showNotice("All messages cleared.");
      }
    } catch {
      alert("Error clearing messages.");
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `krishnaos_messages_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotice("Messages exported to JSON file.");
  };

  // Filtered view
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (onlyUnread && m.read) return false;
      if (!filterQuery.trim()) return true;
      const q = filterQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, filterQuery, onlyUnread]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="inbox-login-screen">
        <div className="inbox-login-box">
          <div className="login-window-header">
            <span>KrishnaOS Administrator Clearance Required</span>
            <span className="close-x">✕</span>
          </div>

          <div className="login-window-body">
            <div className="security-shield-icon">🛡️</div>
            <h2>KrishnaOS Dispatch Terminal</h2>
            <p className="login-subtitle">
              This private portal receives and stores all direct communications from your portfolio.
              Enter your Administrator PIN to view received messages.
            </p>

            {authError && <div className="login-error-alert">{authError}</div>}

            <form onSubmit={handleLoginSubmit} className="login-pin-form">
              <label htmlFor="pin-input">Administrator Security PIN:</label>
              <div className="pin-input-group">
                <input
                  id="pin-input"
                  type="password"
                  autoFocus
                  placeholder="Enter PIN..."
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="retro-input pin-input"
                />
                <button type="submit" disabled={isLoading} className="retro-action-btn btn-primary">
                  {isLoading ? "Verifying..." : "Unlock Terminal ↵"}
                </button>
              </div>
              <span className="pin-hint">
                Default PIN: <code>krishna1337</code>
              </span>
            </form>

            <div className="login-footer-nav">
              <Link href="/" className="retro-back-btn">
                ← Return to KrishnaOS Desktop
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // AUTHENTICATED INBOX DASHBOARD
  return (
    <main className="inbox-dashboard-screen">
      <div className="inbox-container">
        {/* Top retro navigation bar */}
        <header className="inbox-header-bar">
          <div className="inbox-brand">
            <span className="brand-logo">📬</span>
            <div className="brand-text">
              <h1>KrishnaOS Private Mailbox</h1>
              <span>Confidential Messages & Internship Proposals</span>
            </div>
          </div>

          <div className="inbox-header-actions">
            <button
              onClick={() => fetchMessages(pin)}
              disabled={isLoading}
              className="retro-action-btn"
              title="Refresh messages from database"
            >
              🔄 {isLoading ? "Syncing..." : "Refresh"}
            </button>
            <button
              onClick={handleExport}
              disabled={messages.length === 0}
              className="retro-action-btn"
              title="Export all messages as JSON file"
            >
              💾 Export JSON
            </button>
            <Link href="/" className="retro-action-btn" title="Back to desktop">
              🖥️ Desktop
            </Link>
            <button onClick={handleLogout} className="retro-action-btn" title="Lock inbox">
              🔒 Lock Terminal
            </button>
          </div>
        </header>

        {/* Action feedback flash */}
        {actionNotice && <div className="inbox-notice-banner">{actionNotice}</div>}

        {/* Stats & Filter Bar */}
        <section className="inbox-controls-bar">
          <div className="inbox-stats-strip">
            <span className="stat-pill">
              Total Messages: <b>{messages.length}</b>
            </span>
            <span className={`stat-pill ${unreadCount > 0 ? "pill-highlight" : ""}`}>
              Unread: <b>{unreadCount}</b>
            </span>
            <span className="stat-pill status-pill-online">
              🟢 Database: <b>Vercel Blob Active</b>
            </span>
          </div>

          <div className="inbox-search-row">
            <input
              type="text"
              placeholder="Search sender, email, or message keyword..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="retro-input search-input"
            />
            <label className="unread-checkbox-label">
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => setOnlyUnread(e.target.checked)}
              />
              Show Unread Only
            </label>
            {messages.length > 0 && (
              <button onClick={handleClearAll} className="retro-action-btn btn-danger btn-sm">
                🗑 Clear All
              </button>
            )}
          </div>
        </section>

        {/* Messages List Area */}
        <section className="inbox-messages-area">
          {filteredMessages.length === 0 ? (
            <div className="inbox-empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Messages in Dispatch Queue</h3>
              <p>
                {filterQuery
                  ? "No messages match your search filter."
                  : "When visitors or recruiters send a message through your portfolio contact form (contact.exe), it will arrive and persist here."}
              </p>
            </div>
          ) : (
            <div className="messages-grid">
              {filteredMessages.map((m) => {
                const dateStr = new Date(m.createdAt).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });

                const replyMailto = `mailto:${m.email}?subject=${encodeURIComponent(
                  `Re: Your message to Krishna Agarwal`
                )}&body=${encodeURIComponent(
                  `Hi ${m.name},\n\nThank you for reaching out via my KrishnaOS portfolio regarding:\n"${m.message.slice(
                    0,
                    100
                  )}..."\n\n`
                )}`;

                const replyGmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                  m.email
                )}&su=${encodeURIComponent(
                  `Re: Your message to Krishna Agarwal`
                )}&body=${encodeURIComponent(
                  `Hi ${m.name},\n\nThank you for reaching out via my KrishnaOS portfolio!\n\nBest regards,\nKrishna Agarwal\nVIT Vellore (B.Tech CSE)`
                )}`;

                return (
                  <article key={m.id} className={`message-card ${!m.read ? "card-unread" : ""}`}>
                    {/* Header */}
                    <div className="card-top-bar">
                      <div className="sender-profile">
                        <div className="sender-avatar">
                          {m.name.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="sender-info">
                          <div className="sender-name-row">
                            <h4 className="sender-name">{m.name}</h4>
                            {!m.read && <span className="new-badge">NEW</span>}
                          </div>
                          <a href={`mailto:${m.email}`} className="sender-email">
                            {m.email}
                          </a>
                        </div>
                      </div>

                      <div className="message-timestamp">
                        <span className="time-text">{dateStr}</span>
                        <span className="device-tag">{m.userAgent?.slice(0, 30) || "Web"}</span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="message-body-box">
                      <pre className="message-text">{m.message}</pre>
                    </div>

                    {/* Card Actions */}
                    <div className="card-footer-actions">
                      <div className="reply-group">
                        <a
                          href={replyMailto}
                          className="retro-action-btn btn-primary"
                          title="Reply using default email client"
                        >
                          ✉ Reply (mailto)
                        </a>
                        <a
                          href={replyGmailWeb}
                          target="_blank"
                          rel="noreferrer"
                          className="retro-action-btn"
                          title="Compose reply in Gmail Web"
                        >
                          📧 Open in Gmail
                        </a>
                      </div>

                      <div className="manage-group">
                        <button
                          onClick={() => handleToggleRead(m.id, m.read)}
                          className="retro-action-btn"
                          title={m.read ? "Mark as Unread" : "Mark as Read"}
                        >
                          {m.read ? "Mark Unread" : "✓ Mark Read"}
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="retro-action-btn btn-danger"
                          title="Delete message permanently"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
