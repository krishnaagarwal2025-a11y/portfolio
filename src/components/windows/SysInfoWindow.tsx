"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import RetroIcon from "../os/RetroIcon";
import { playActionClick } from "@/lib/sound";

export default function SysInfoWindow() {
  const [tab, setTab] = useState<"general" | "hardware" | "performance">("general");

  return (
    <div className="sysinfo-window">
      {/* Authentic Windows 95/98 Tabs */}
      <div className="retro-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "general"}
          className={`tab-btn ${tab === "general" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setTab("general");
          }}
        >
          General
        </button>
        <button
          role="tab"
          aria-selected={tab === "hardware"}
          className={`tab-btn ${tab === "hardware" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setTab("hardware");
          }}
        >
          Device Status
        </button>
        <button
          role="tab"
          aria-selected={tab === "performance"}
          className={`tab-btn ${tab === "performance" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setTab("performance");
          }}
        >
          Performance
        </button>
      </div>

      <div className="tab-body">
        {tab === "general" && (
          <div className="tab-pane">
            <div className="sysinfo-split">
              <div className="sysinfo-computer-art">
                <RetroIcon name="computer" size={72} />
                <span className="art-caption">KrishnaOS Workstation</span>
              </div>

              <div className="sysinfo-fields">
                <div className="sys-prop-group">
                  <span className="sys-head">System:</span>
                  <div className="sys-indent">
                    <div>KrishnaOS 2026 Edition</div>
                    <div>Release Kernel 4.2.1-custom</div>
                    <div>Developer Mode: ENABLED</div>
                  </div>
                </div>

                <div className="sys-prop-group">
                  <span className="sys-head">Registered To:</span>
                  <div className="sys-indent">
                    <b>{profile.name}</b>
                    <div>{profile.degree} (Sem {profile.semesterNumber})</div>
                    <div>{profile.university}</div>
                    <div>Location: {profile.location}</div>
                  </div>
                </div>

                <div className="sys-prop-group">
                  <span className="sys-head">Academic Metrics:</span>
                  <div className="sys-indent">
                    <div>CGPA: <b>{profile.cgpaDisplay} / 10.0</b></div>
                    <div>Status: <span className="text-ok"><b>{profile.status}</b></span></div>
                    <div>Goal: {profile.careerGoal}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "hardware" && (
          <div className="tab-pane">
            <div className="retro-fieldset">
              <legend>Installed Microcontrollers & Lab Hardware</legend>
              <ul className="bullet-grid">
                <li>ESP32 Dual-Core Wi-Fi/Bluetooth MCU (AuraGuard, Wearable)</li>
                <li>ESP8266 Wi-Fi Microcontroller</li>
                <li>MPU6050 6-Axis Motion Sensor (Accelerometer + Gyroscope)</li>
                <li>Industrial Gas Sensor Array (CO, CH4, O2, H2S, PM2.5)</li>
                <li>ThingSpeak IoT Cloud Telemetry Interface</li>
                <li>Oracle VirtualBox Hypervisor (Isolated NAT Lab)</li>
              </ul>
            </div>
          </div>
        )}

        {tab === "performance" && (
          <div className="tab-pane">
            <div className="retro-fieldset">
              <legend>Developer Metrics & Output</legend>
              <div className="sys-metrics-list">
                <div className="metric-row">
                  <span>Primary Operating Mode:</span>
                  <b>BUILD</b>
                </div>
                <div className="metric-row">
                  <span>Current Active Project:</span>
                  <b>Morrow (Document Ingestion & RAG)</b>
                </div>
                <div className="metric-row">
                  <span>Algorithm Practice:</span>
                  <b>{profile.problemSolving.leetcode}</b>
                </div>
                <div className="metric-row">
                  <span>Network Simulation:</span>
                  <b>8 of 8 Automated Tests Passed (100%)</b>
                </div>
                <div className="metric-row">
                  <span>Ethical Hacking:</span>
                  <b className="text-warning">EC-Council Coursework (IN PROGRESS)</b>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sysinfo-footer">
        <button
          className="retro-action-btn btn-primary"
          onClick={() => {
            playActionClick();
            const btn = document.querySelector(".win-btn-close") as HTMLButtonElement;
            if (btn) btn.click();
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
