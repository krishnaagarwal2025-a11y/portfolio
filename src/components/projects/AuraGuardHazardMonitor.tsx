"use client";

import { useState } from "react";
import { playActionClick, playErrorBeep } from "@/lib/sound";

interface SensorSpec {
  id: string;
  name: string;
  gas: string;
  observedRange: string;
  unit: string;
  minVal: number;
  maxVal: number;
  threshold: number;
  isLowerHazard?: boolean; // For O2: drops below 19.5% is hazardous!
  nominal: number;
}

const SENSORS: SensorSpec[] = [
  {
    id: "co",
    name: "Carbon Monoxide",
    gas: "CO",
    observedRange: "0 → 42 ppm",
    unit: "ppm",
    minVal: 0,
    maxVal: 50,
    threshold: 35,
    nominal: 12,
  },
  {
    id: "ch4",
    name: "Methane Gas",
    gas: "CH4",
    observedRange: "0 → 12% LEL",
    unit: "% LEL",
    minVal: 0,
    maxVal: 15,
    threshold: 10,
    nominal: 2,
  },
  {
    id: "o2",
    name: "Oxygen Level",
    gas: "O2",
    observedRange: "20.9% → 18.0%",
    unit: "%",
    minVal: 15.0,
    maxVal: 22.0,
    threshold: 19.5,
    isLowerHazard: true, // Drops below 19.5% means asphyxiation hazard
    nominal: 20.8,
  },
  {
    id: "h2s",
    name: "Hydrogen Sulfide",
    gas: "H2S",
    observedRange: "0 → 1.8 ppm",
    unit: "ppm",
    minVal: 0,
    maxVal: 2.5,
    threshold: 1.0,
    nominal: 0.2,
  },
  {
    id: "pm25",
    name: "Particulate Matter",
    gas: "PM2.5",
    observedRange: "8 → 63 µg/m³",
    unit: "µg/m³",
    minVal: 0,
    maxVal: 75,
    threshold: 50,
    nominal: 24,
  },
];

export default function AuraGuardHazardMonitor() {
  const [currentValues, setCurrentValues] = useState<Record<string, number>>({
    co: 12,
    ch4: 2.1,
    o2: 20.8,
    h2s: 0.2,
    pm25: 24,
  });

  const [dangerSimulated, setDangerSimulated] = useState(false);

  const simulateSafeEnvironment = () => {
    playActionClick();
    setCurrentValues({
      co: 8,
      ch4: 1.5,
      o2: 20.9,
      h2s: 0.1,
      pm25: 18,
    });
    setDangerSimulated(false);
  };

  const simulateHazardBreach = () => {
    playErrorBeep();
    setCurrentValues({
      co: 38, // > 35 threshold
      ch4: 11.2, // > 10% LEL threshold
      o2: 18.2, // < 19.5% threshold
      h2s: 1.4, // > 1.0 threshold
      pm25: 58, // > 50 threshold
    });
    setDangerSimulated(true);
  };

  const getStatus = (sensor: SensorSpec, val: number) => {
    if (sensor.isLowerHazard) {
      if (val < sensor.threshold) return "DANGER";
      if (val <= 20.0) return "WARNING";
      return "SAFE";
    }
    if (val >= sensor.threshold) return "DANGER";
    if (val >= sensor.threshold * 0.75) return "WARNING";
    return "SAFE";
  };

  const overallDanger = Object.entries(currentValues).some(([id, val]) => {
    const s = SENSORS.find((x) => x.id === id);
    return s ? getStatus(s, val) === "DANGER" : false;
  });

  return (
    <div className="auraguard-monitor">
      <div className="monitor-header">
        <div className="monitor-title">
          <b>AuraGuard Hazard Monitor Dashboard</b>
          <span>ESP32 Industrial Telemetry • ThingSpeak IoT Channel</span>
        </div>
        <div className={`hazard-status-pill ${overallDanger ? "pill-danger" : "pill-safe"}`}>
          {overallDanger ? "⚠ CRITICAL HAZARD DETECTED" : "✓ ATMOSPHERE NOMINAL"}
        </div>
      </div>

      <div className="sensors-table-wrapper">
        <table className="retro-table">
          <thead>
            <tr>
              <th>Gas / Sensor</th>
              <th>Observed Range</th>
              <th>Configured Threshold</th>
              <th>Live Reading</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {SENSORS.map((s) => {
              const val = currentValues[s.id];
              const status = getStatus(s, val);
              return (
                <tr key={s.id} className={`row-${status.toLowerCase()}`}>
                  <td>
                    <b>{s.gas}</b> <span className="text-muted">({s.name})</span>
                  </td>
                  <td>{s.observedRange}</td>
                  <td>
                    <span className="thresh-badge">
                      {s.isLowerHazard ? `< ${s.threshold}` : `> ${s.threshold}`} {s.unit}
                    </span>
                  </td>
                  <td className="reading-cell">
                    <b>
                      {val.toFixed(1)} {s.unit}
                    </b>
                  </td>
                  <td>
                    <span className={`status-badge status-${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="monitor-footer-controls">
        <div className="control-group">
          <span>Simulate Industrial Conditions:</span>
          <button
            className={`retro-action-btn ${dangerSimulated ? "btn-danger active" : "btn-danger"}`}
            onClick={simulateHazardBreach}
          >
            Trigger Toxic / Low-O2 Hazard Spike
          </button>
          <button className="retro-action-btn" onClick={simulateSafeEnvironment}>
            Restore Safe Atmosphere
          </button>
        </div>
        <div className="flow-badge">
          Sensors → ESP32 → Threshold Check → Safe/Warn/Danger → ThingSpeak
        </div>
      </div>
    </div>
  );
}
