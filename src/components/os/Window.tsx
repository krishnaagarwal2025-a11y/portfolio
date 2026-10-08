"use client";

import { ReactNode } from "react";
import { useDraggable } from "@/hooks/useDraggable";
import { playWindowClose, playActionClick } from "@/lib/sound";
import RetroIcon from "./RetroIcon";

interface Props {
  id: string;
  title: string;
  icon?: string;
  z: number;
  hidden: boolean;
  maximized?: boolean;
  isActive?: boolean;
  width?: number;
  x: number;
  y: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
  children: ReactNode;
}

export default function Window({
  id,
  title,
  icon,
  z,
  hidden,
  maximized = false,
  isActive = true,
  width = 540,
  x,
  y,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  children,
}: Props) {
  const { pos, onPointerDown } = useDraggable({ x, y }, !maximized);

  const handleClose = () => {
    playWindowClose();
    onClose();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    playActionClick();
    onMinimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    playActionClick();
    if (onMaximize) onMaximize();
  };

  const handleTitleDoubleClick = () => {
    if (onMaximize) {
      playActionClick();
      onMaximize();
    }
  };

  const style = maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        maxWidth: "100%",
        height: "calc(100dvh - 42px)",
        maxHeight: "calc(100dvh - 42px)",
        zIndex: z,
      }
    : {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${width}px`,
        maxWidth: "96vw",
        zIndex: z,
      };

  return (
    <section
      className={`win win-${id} ${hidden ? "hid" : ""} ${maximized ? "maximized" : ""} ${isActive ? "active-win" : "inactive-win"}`}
      role="dialog"
      aria-label={title}
      style={style}
      onPointerDown={onFocus}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
    >
      {/* Title bar */}
      <div
        className={`bar ${isActive ? "bar-active" : "bar-inactive"}`}
        onPointerDown={onPointerDown}
        onDoubleClick={handleTitleDoubleClick}
      >
        <div className="bar-title-left">
          {icon && <RetroIcon name={icon} size={16} className="bar-icon" />}
          <b title={title}>{title}</b>
        </div>

        <div className="bar-buttons">
          <button
            aria-label={`Minimize ${title}`}
            title="Minimize"
            onClick={handleMinimize}
            className="win-btn win-btn-min"
          >
            _
          </button>
          <button
            aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`}
            title={maximized ? "Restore" : "Maximize"}
            onClick={handleMaximize}
            className="win-btn win-btn-max"
          >
            {maximized ? "❐" : "□"}
          </button>
          <button
            aria-label={`Close ${title}`}
            title="Close"
            onClick={handleClose}
            className="win-btn win-btn-close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Menu / Path helper strip (retro look) */}
      <div className="win-menu-strip">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>

      {/* Window Body */}
      <div className="body">{children}</div>
    </section>
  );
}
