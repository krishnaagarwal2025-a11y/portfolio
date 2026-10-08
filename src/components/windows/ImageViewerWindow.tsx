"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { playActionClick } from "@/lib/sound";

export default function ImageViewerWindow() {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    playActionClick();
    setZoom((z) => Math.min(2.5, z + 0.25));
  };

  const handleZoomOut = () => {
    playActionClick();
    setZoom((z) => Math.max(0.5, z - 0.25));
  };

  const handleResetZoom = () => {
    playActionClick();
    setZoom(1);
    setRotation(0);
  };

  const handleRotate = () => {
    playActionClick();
    setRotation((r) => (r + 90) % 360);
  };

  return (
    <div className="image-viewer-window">
      {/* Top Toolbar */}
      <div className="viewer-toolbar">
        <button className="retro-action-btn" onClick={handleZoomIn} title="Zoom In (+25%)">
          🔍 Zoom In
        </button>
        <button className="retro-action-btn" onClick={handleZoomOut} title="Zoom Out (-25%)">
          🔍 Zoom Out
        </button>
        <button className="retro-action-btn" onClick={handleResetZoom} title="Reset to Actual 1:1 Size">
          Actual Size (1:1)
        </button>
        <button className="retro-action-btn" onClick={handleRotate} title="Rotate 90° clockwise">
          ↺ Rotate
        </button>
        <a
          href={profile.portraitUrl}
          download="krishna_pixel_art.png"
          className="retro-action-btn btn-primary"
          title="Download original PNG file"
        >
          💾 Save Image
        </a>
      </div>

      {/* Main Canvas Viewport */}
      <div className="viewer-viewport">
        <div
          className="viewer-image-stage"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: "transform 0.15s ease",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.portraitUrl}
            alt="Krishna Agarwal full pixel-art portrait"
            className="viewer-pixel-img"
            draggable={false}
          />
        </div>
      </div>

      {/* Retro Status Bar */}
      <div className="viewer-status-bar">
        <div className="status-cell">portfolio.png</div>
        <div className="status-cell">1254 × 1254 px</div>
        <div className="status-cell">Zoom: {Math.round(zoom * 100)}%</div>
        <div className="status-cell">24bpp TrueColor RGBA</div>
      </div>
    </div>
  );
}
