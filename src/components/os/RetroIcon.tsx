import React from "react";

interface RetroIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function RetroIcon({ name, size = 36, className = "" }: RetroIconProps) {
  switch (name) {
    case "computer":
    case "mycomputer":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Retro Monitor Case */}
          <rect x="3" y="3" width="26" height="20" rx="1" fill="#c0c0c0" stroke="#000" strokeWidth="1.5" />
          <rect x="6" y="6" width="20" height="14" fill="#008080" stroke="#808080" strokeWidth="1" />
          {/* CRT Screen scanline / content */}
          <rect x="8" y="8" width="8" height="2" fill="#fff" />
          <rect x="8" y="12" width="12" height="2" fill="#80ffff" />
          <rect x="8" y="16" width="6" height="2" fill="#00ff00" />
          {/* Stand & Base */}
          <rect x="12" y="23" width="8" height="4" fill="#808080" stroke="#000" strokeWidth="1" />
          <path d="M7 27h18v2H7z" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
        </svg>
      );

    case "folder-projects":
    case "projects":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Folder tab */}
          <path d="M3 7h10l3 3h13v17H3V7z" fill="#e0a800" stroke="#000" strokeWidth="1.5" />
          {/* Front flap */}
          <path d="M3 12h26v15H3z" fill="#ffcc00" stroke="#000" strokeWidth="1.5" />
          {/* Paper sticking out */}
          <rect x="8" y="5" width="16" height="8" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <line x1="11" y1="8" x2="21" y2="8" stroke="#000080" strokeWidth="1" />
          <line x1="11" y1="10" x2="18" y2="10" stroke="#808080" strokeWidth="1" />
        </svg>
      );

    case "shield-radar":
    case "security":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Shield outline */}
          <path
            d="M16 2L4 7v9c0 8.5 5.5 13.5 12 15 6.5-1.5 12-6.5 12-15V7L16 2z"
            fill="#1a2035"
            stroke="#000"
            strokeWidth="1.5"
          />
          {/* Radar circle */}
          <circle cx="16" cy="15" r="7" stroke="#00ff66" strokeWidth="1.2" fill="none" opacity="0.8" />
          <circle cx="16" cy="15" r="3" fill="#00ff66" />
          <line x1="16" y1="8" x2="16" y2="22" stroke="#00ff66" strokeWidth="1" strokeDasharray="1 2" />
          <line x1="9" y1="15" x2="23" y2="15" stroke="#00ff66" strokeWidth="1" strokeDasharray="1 2" />
          {/* Radar sweep beam */}
          <path d="M16 15L22 10" stroke="#55ff99" strokeWidth="1.5" />
        </svg>
      );

    case "skills-chip":
    case "skills":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Chip body */}
          <rect x="7" y="7" width="18" height="18" rx="2" fill="#2d5e3b" stroke="#000" strokeWidth="1.5" />
          <rect x="10" y="10" width="12" height="12" fill="#1b3823" stroke="#ffd700" strokeWidth="1" />
          {/* Silicon core / text */}
          <circle cx="16" cy="16" r="3" fill="#ffd700" />
          {/* Pins top/bottom */}
          <path d="M10 3v4M16 3v4M22 3v4M10 25v4M16 25v4M22 25v4" stroke="#c0c0c0" strokeWidth="1.8" />
          {/* Pins left/right */}
          <path d="M3 10h4M3 16h4M3 22h4M25 10h4M25 16h4M25 22h4" stroke="#c0c0c0" strokeWidth="1.8" />
        </svg>
      );

    case "terminal-icon":
    case "terminal":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect x="3" y="4" width="26" height="24" rx="2" fill="#000" stroke="#808080" strokeWidth="1.5" />
          <rect x="3" y="4" width="26" height="5" fill="#000080" />
          <circle cx="6" cy="6.5" r="1" fill="#fff" />
          <path d="M7 14l4 4-4 4" stroke="#00ff00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="14" y1="22" x2="21" y2="22" stroke="#00ff00" strokeWidth="2" />
        </svg>
      );

    case "git-branch":
    case "git":
    case "timeline":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect x="3" y="3" width="26" height="26" rx="2" fill="#f05032" stroke="#000" strokeWidth="1.5" />
          <circle cx="11" cy="21" r="3" fill="#fff" stroke="#000" strokeWidth="1.2" />
          <circle cx="11" cy="11" r="3" fill="#fff" stroke="#000" strokeWidth="1.2" />
          <circle cx="21" cy="11" r="3" fill="#ffd700" stroke="#000" strokeWidth="1.2" />
          <path d="M11 14v4M11 18c0-3 3-4 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "document-pdf":
    case "resume":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M6 3h13l7 7v19H6V3z" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
          <path d="M19 3v7h7" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
          <rect x="9" y="14" width="14" height="2" fill="#ff0000" />
          <rect x="9" y="18" width="14" height="2" fill="#000080" />
          <rect x="9" y="22" width="10" height="2" fill="#808080" />
        </svg>
      );

    case "mail-envelope":
    case "contact":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect x="3" y="6" width="26" height="20" rx="1" fill="#fffef0" stroke="#000" strokeWidth="1.5" />
          <path d="M3 7l13 10L29 7" stroke="#000" strokeWidth="1.5" fill="none" />
          <path d="M3 25l9-9M29 25l-9-9" stroke="#808080" strokeWidth="1" />
          <circle cx="23" cy="11" r="3" fill="#ff0000" />
        </svg>
      );

    case "info-dialog":
    case "sysinfo":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="16" cy="16" r="13" fill="#000080" stroke="#000" strokeWidth="1.5" />
          <circle cx="16" cy="10" r="2.2" fill="#ffffff" />
          <rect x="14" y="14" width="4" height="9" rx="0.5" fill="#ffffff" />
          <rect x="12" y="14" width="3" height="2" fill="#ffffff" />
          <rect x="12" y="21" width="8" height="2" fill="#ffffff" />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="4" fill="#000080" />
        </svg>
      );
  }
}
