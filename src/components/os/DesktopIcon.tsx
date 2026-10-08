"use client";

import { useState } from "react";
import RetroIcon from "./RetroIcon";

interface DesktopIconProps {
  id: string;
  label: string;
  iconName: string;
  onOpen: () => void;
}

export default function DesktopIcon({ id: _id, label, iconName, onOpen }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);

  return (
    <button
      className={`desktop-icon ${selected ? "selected" : ""}`}
      onClick={() => {
        setSelected(true);
        onOpen();
      }}
      onBlur={() => setSelected(false)}
      aria-label={`Open ${label}`}
    >
      <div className="icon-graphic">
        <RetroIcon name={iconName} size={46} />
      </div>
      <span className="icon-label">{label}</span>
    </button>
  );
}
