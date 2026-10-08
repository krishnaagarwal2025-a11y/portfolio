"use client";

import { useState } from "react";
import { beep, playErrorBeep, playActionClick } from "@/lib/sound";

export default function WearableSimulator() {
  const [simState, setSimState] = useState<"IDLE" | "WEIGHTLESSNESS" | "IMPACT" | "FALL_CONFIRMED">("IDLE");
  const [accelMagnitude, setAccelMagnitude] = useState(9.8); // 1G standard gravity ~9.8 m/s²
  const [rssi, setRssi] = useState(-62); // dBm
  const [geofenceAlert, setGeofenceAlert] = useState(false);
  const [simulating, setSimulating] = useState(false);

  // Trigger fall simulation sequence
  const runFallSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setSimState("IDLE");
    setAccelMagnitude(9.8);

    // Step 1: Weightlessness (< 4.0 m/s²)
    setTimeout(() => {
      beep(300, 0.08);
      setSimState("WEIGHTLESSNESS");
      setAccelMagnitude(1.8); // Drop to freefall
    }, 400);

    // Step 2: Impact (> 25.0 m/s²) within 500ms
    setTimeout(() => {
      beep(880, 0.12);
      setSimState("IMPACT");
      setAccelMagnitude(29.4); // Huge impact spike
    }, 850);

    // Step 3: Fall Confirmed
    setTimeout(() => {
      playErrorBeep();
      setSimState("FALL_CONFIRMED");
      setAccelMagnitude(9.81);
      setSimulating(false);
    }, 1400);
  };

  const resetNormal = () => {
    playActionClick();
    setSimState("IDLE");
    setAccelMagnitude(9.8);
    setSimulating(false);
  };

  const handleRssiChange = (val: number) => {
    setRssi(val);
    setGeofenceAlert(val <= -75);
  };

  return (
    <div className="wearable-simulator">
      <div className="sim-title-strip">
        <b>Real-Time Fall Detection & Indoor Geofencing Engine</b>
        <span className="sim-badge">ESP32 / MPU6050 Firmware Simulation</span>
      </div>

      <div className="sim-grid">
        {/* Fall Detection Algorithm Column */}
        <div className="sim-panel">
          <div className="panel-head">
            <b>1. Dual-Stage Fall Detection Algorithm</b>
            <span className="formula-tag">|a| = √(ax² + ay² + az²)</span>
          </div>

          <div className="meter-box">
            <div className="meter-val-row">
              <span>Vector Acceleration Magnitude:</span>
              <b className={`meter-num ${simState === "IMPACT" ? "spike" : ""}`}>
                {accelMagnitude.toFixed(2)} m/s²
              </b>
            </div>
            <div className="meter-bar-track">
              <div
                className={`meter-bar-fill ${simState === "WEIGHTLESSNESS" ? "fill-blue" : simState === "IMPACT" ? "fill-red" : "fill-green"}`}
                style={{ width: `${Math.min(100, (accelMagnitude / 35.0) * 100)}%` }}
              />
            </div>
            <div className="threshold-markers">
              <span className="mark-label">0 m/s²</span>
              <span className="mark-label mark-crit">&lt; 4.0 (Freefall)</span>
              <span className="mark-label mark-warn">&gt; 25.0 (Impact)</span>
              <span className="mark-label">35+ m/s²</span>
            </div>
          </div>

          {/* Fall state stages */}
          <div className="stage-sequence">
            <div className={`seq-step ${simState === "IDLE" ? "active" : ""}`}>NORMAL (1G)</div>
            <span className="seq-arr">→</span>
            <div className={`seq-step ${simState === "WEIGHTLESSNESS" ? "active-freefall" : ""}`}>
              STAGE 1: WEIGHTLESSNESS (&lt; 4 m/s²)
            </div>
            <span className="seq-arr">→</span>
            <div className={`seq-step ${simState === "IMPACT" ? "active-impact" : ""}`}>
              STAGE 2: IMPACT (&gt; 25 m/s² in ~500ms)
            </div>
            <span className="seq-arr">→</span>
            <div className={`seq-step ${simState === "FALL_CONFIRMED" ? "active-alert" : ""}`}>
              FALL DETECTED!
            </div>
          </div>

          <div className="sim-controls">
            <button
              className="retro-action-btn btn-danger"
              disabled={simulating}
              onClick={runFallSimulation}
            >
              ▶ Trigger Test Fall Sequence
            </button>
            <button className="retro-action-btn" onClick={resetNormal}>
              Reset Normal Walking
            </button>
          </div>
        </div>

        {/* Indoor Geofencing Column */}
        <div className="sim-panel">
          <div className="panel-head">
            <b>2. Indoor Wi-Fi RSSI Geofence</b>
            <span className="formula-tag">Threshold: ≤ -75 dBm</span>
          </div>

          <p className="panel-desc">
            Uses Wi-Fi signal strength attenuation (RSSI) instead of power-hungry indoor GPS to determine if
            the user has crossed outside the designated indoor boundary.
          </p>

          <div className="rssi-control-box">
            <label htmlFor="rssi-range">
              Adjust Simulated Wi-Fi RSSI: <b>{rssi} dBm</b>
            </label>
            <input
              id="rssi-range"
              type="range"
              min="-95"
              max="-40"
              value={rssi}
              onChange={(e) => handleRssiChange(Number(e.target.value))}
              className="retro-slider"
            />
          </div>

          <div className={`geofence-status-banner ${geofenceAlert ? "banner-alert" : "banner-ok"}`}>
            <b>{geofenceAlert ? "⚠ OUTSIDE GEOFENCE BOUNDARY" : "✓ INSIDE PERIMETER (SAFE)"}</b>
            <span>
              {geofenceAlert
                ? `RSSI (${rssi} dBm) crossed threshold (≤ -75 dBm). Dispatched alert to ThingSpeak.`
                : `Signal strong (${rssi} dBm > -75 dBm). Within indoor zone.`}
            </span>
          </div>
        </div>
      </div>

      <div className="disclaimer-strip">
        <b>Prototype Disclaimer:</b> Built with ESP32/ESP8266 + MPU6050 for academic safety exploration. No medical certification or commercial deployment is claimed.
      </div>
    </div>
  );
}
