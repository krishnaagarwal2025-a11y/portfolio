"use client";

import { useState } from "react";
import { playActionClick, beep } from "@/lib/sound";

export default function SecurityLabWindow() {
  const [activeTab, setActiveTab] = useState<"overview" | "lab_work" | "tools" | "coursework" | "ctf">("overview");
  const [scanOutput, setScanOutput] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const simulateNmapScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanOutput("Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-08 23:00 UTC\nInitiating ARP Ping Scan on Kioptrix VM (192.168.56.101)...");

    setTimeout(() => {
      beep(700, 0.04);
      setScanOutput((prev) => prev + "\nCompleted ARP Ping Scan at 0.02s.\nInitiating SYN Stealth Scan...");
    }, 600);

    setTimeout(() => {
      beep(880, 0.05);
      setScanOutput(
        `Starting Nmap 7.94 ( https://nmap.org )
Host 192.168.56.101 is up (0.00042s latency).
MAC Address: 08:00:27:12:34:56 (Oracle VirtualBox NIC)

PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 2.9p2 (protocol 1.99)
80/tcp   open  http        Apache httpd 1.3.20 ((Unix) mod_ssl/2.8.4 OpenSSL/0.9.6b)
111/tcp  open  rpcbind     2 (RPC #100000)
139/tcp  open  netbios-ssn Samba smbd (workgroup: MYGROUP)
443/tcp  open  ssl/http    Apache httpd 1.3.20

Recon complete. Virtual lab reconnaissance log stored.`
      );
      setScanning(false);
    }, 1400);
  };

  return (
    <div className="security-lab-window">
      {/* Header Banner */}
      <div className="security-banner">
        <div className="sec-banner-left">
          <span className="sec-badge-main">SECURITY LAB WORKBENCH</span>
          <h3>Cybersecurity & Applied Systems Security</h3>
          <p className="sec-sub">
            Practical exploration of ethical hacking, network reconnaissance, virtualization, and vulnerability analysis.
          </p>
        </div>
        <div className="sec-status-badge">
          <span className="badge-title">EC-Council Course:</span>
          <span className="badge-val">STATUS: IN PROGRESS</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="retro-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "overview"}
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("overview");
          }}
        >
          Overview & Focus
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "lab_work"}
          className={`tab-btn ${activeTab === "lab_work" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("lab_work");
          }}
        >
          Virtual Lab & Kioptrix
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "tools"}
          className={`tab-btn ${activeTab === "tools" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("tools");
          }}
        >
          Security Tooling
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "coursework"}
          className={`tab-btn ${activeTab === "coursework" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("coursework");
          }}
        >
          Coursework & Status
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "ctf"}
          className={`tab-btn ${activeTab === "ctf" ? "active" : ""}`}
          onClick={() => {
            playActionClick();
            setActiveTab("ctf");
          }}
        >
          CTF & Threat Concepts
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-body">
        {activeTab === "overview" && (
          <div className="tab-pane">
            <div className="callout-box">
              <b>Honest Developer Positioning:</b> Primary academic interest is in Cybersecurity and systems defense.
              I am actively learning ethical hacking and offensive/defensive methodologies through virtual labs, coursework, and problem solving, without claiming professional senior certification.
            </div>

            <div className="retro-fieldset">
              <legend>Security Domains Explored</legend>
              <div className="sec-domain-grid">
                <div className="sec-card">
                  <b>Network Security</b>
                  <p>ARP pinging, subnet mapping, port scanning, traffic analysis, and firewall isolation principles.</p>
                </div>
                <div className="sec-card">
                  <b>Web Application Security</b>
                  <p>HTTP traffic proxying with Burp Suite, input sanitization auditing, and authentication flows.</p>
                </div>
                <div className="sec-card">
                  <b>Linux Systems & Internals</b>
                  <p>Kali Linux toolchains, permissions, bash scripting, network socket diagnostics, and services.</p>
                </div>
                <div className="sec-card">
                  <b>Threat Modeling</b>
                  <p>Evaluating attack surfaces on embedded microcontrollers (ESP32) and cloud network topologies.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lab_work" && (
          <div className="tab-pane">
            <p className="tab-intro">
              Isolated virtual environments created in VirtualBox to test security tools against targets:
            </p>

            <div className="retro-fieldset">
              <legend>Virtual Lab Configuration</legend>
              <ul className="bullet-grid">
                <li><b>Hypervisor:</b> VirtualBox configured with Host-Only & NAT Network isolation</li>
                <li><b>Attacker Machine:</b> Kali Linux VM equipped with standard penetration testing tools</li>
                <li><b>Target Machine:</b> Kioptrix VM (vulnerable target for educational reconnaissance)</li>
                <li><b>Discovery:</b> Used arp-scan to identify live IPs on the virtual subnet</li>
                <li><b>Reconnaissance:</b> Port scanning and version identification using Nmap</li>
                <li><b>Web Assessment:</b> Burp Suite interception of HTTP requests to identify misconfigurations</li>
              </ul>
            </div>

            <div className="interactive-scan-box">
              <div className="scan-box-header">
                <b>Reconnaissance Console (Simulated Kioptrix Audit)</b>
                <button
                  className="retro-action-btn"
                  disabled={scanning}
                  onClick={simulateNmapScan}
                >
                  {scanning ? "Scanning..." : "▶ Run Nmap / ARP Scan Demo"}
                </button>
              </div>
              <div className="terminal-screen-mini">
                <pre>{scanOutput || "Click 'Run Nmap / ARP Scan Demo' to inspect sample reconnaissance output..."}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tools"}
        {activeTab === "tools" && (
          <div className="tab-pane">
            <div className="tools-cards-grid">
              <div className="tool-card">
                <span className="tool-badge">Kali Linux</span>
                <p>Primary operating environment for penetration testing utilities, packet crafting, and command-line forensics.</p>
              </div>
              <div className="tool-card">
                <span className="tool-badge">Nmap</span>
                <p>Host discovery, OS fingerprinting, and service version enumeration across local and virtual networks.</p>
              </div>
              <div className="tool-card">
                <span className="tool-badge">Burp Suite</span>
                <p>Interception proxy for auditing web application requests, analyzing cookies, and probing endpoints.</p>
              </div>
              <div className="tool-card">
                <span className="tool-badge">arp-scan</span>
                <p>Fast ARP-based discovery of active hosts within local Ethernet / virtual network segments.</p>
              </div>
              <div className="tool-card">
                <span className="tool-badge">httprobe</span>
                <p>Probing live HTTP and HTTPS servers across discovered domains and subdomains.</p>
              </div>
              <div className="tool-card">
                <span className="tool-badge">VirtualBox</span>
                <p>Isolated sandbox for safely hosting vulnerable challenge machines such as Kioptrix without network bleed.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "coursework" && (
          <div className="tab-pane">
            <div className="retro-fieldset">
              <legend>Formal Certification & Coursework Status</legend>
              <div className="coursework-card">
                <div className="cw-top">
                  <b>EC-Council Ethical Hacking Course</b>
                  <span className="cw-status in-progress">STATUS: IN PROGRESS</span>
                </div>
                <p>
                  Currently enrolled and undertaking coursework covering foundational ethical hacking methodologies, footprinting, network scanning, system exploitation concepts, and security policies.
                </p>
                <div className="cw-footer">
                  <span className="cw-note">
                    <b>Strict Policy Note:</b> This program is actively ongoing. It is explicitly labeled as coursework in progress and is not claimed as a completed certification.
                  </span>
                </div>
              </div>

              <div className="coursework-card">
                <div className="cw-top">
                  <b>Merit Certificate</b>
                  <span className="cw-status confirmed">STATUS: CONFIRMED</span>
                </div>
                <p>Merit certificate awarded from VIT Vellore for academic and technical performance.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ctf" && (
          <div className="tab-pane">
            <div className="retro-fieldset">
              <legend>CTF & Threat Modeling Exploration</legend>
              <p>
                Engagement with Capture The Flag (CTF) challenges focusing on:
              </p>
              <ul className="bullet-grid">
                <li>Web security vulnerabilities (form parameter manipulation, basic injection, cookie tampering)</li>
                <li>Linux privilege navigation and filesystem permissions</li>
                <li>Network packet analysis using Wireshark and tcpdump</li>
                <li>Basic cryptography and hashing recognition</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
