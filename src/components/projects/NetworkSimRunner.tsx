"use client";

import { useState } from "react";
import { beep, playActionClick } from "@/lib/sound";

const TESTS = [
  { name: "test_deterministic_host_addressing", duration: "0.042s", desc: "Validates static IP and MAC assignment across virtual subnets" },
  { name: "test_mininet_switch_topology_link", duration: "0.061s", desc: "Ensures simulated virtual Ethernet links achieve line-rate forwarding" },
  { name: "test_subnet_mask_integrity", duration: "0.028s", desc: "Verifies CIDR boundaries and broadcast address isolation" },
  { name: "test_arp_table_resolution", duration: "0.053s", desc: "Validates ARP request/reply generation and cache population" },
  { name: "test_distance_vector_convergence", duration: "0.114s", desc: "Checks routing table convergence after topology state change" },
  { name: "test_packet_forwarding_latency", duration: "0.038s", desc: "Evaluates end-to-end packet delivery times across nodes" },
  { name: "test_cloud_monitor_telemetry_agent", duration: "0.049s", desc: "Assesses passive metric aggregation daemon and buffer queues" },
  { name: "test_deterministic_failover_path", duration: "0.077s", desc: "Ensures backup link traversal when primary link drops" },
];

export default function NetworkSimRunner() {
  const [running, setRunning] = useState(false);
  const [completedTests, setCompletedTests] = useState<number>(8); // Initially shown as all passed

  const rerunTests = () => {
    if (running) return;
    setRunning(true);
    setCompletedTests(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setCompletedTests(count);
      beep(600 + count * 50, 0.03);
      if (count >= 8) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 160);
  };

  return (
    <div className="network-sim-runner">
      <div className="runner-header">
        <div className="runner-title">
          <b>Cloud Network Simulation Test Suite (Python / Ubuntu / Mininet)</b>
          <span>Automated Test Matrix: 8 Tests Configured • 8 Passed</span>
        </div>
        <button
          className="retro-action-btn"
          disabled={running}
          onClick={() => {
            playActionClick();
            rerunTests();
          }}
        >
          {running ? "Running Tests..." : "▶ Re-run Automated Test Suite"}
        </button>
      </div>

      <div className="terminal-test-output">
        <div className="output-top-bar">
          <span>bash: python3 -m unittest test_network_sim.py</span>
          <span>[Ubuntu Linux / Mininet Environment]</span>
        </div>

        <div className="test-rows-container">
          {TESTS.map((test, index) => {
            const isFinished = index < completedTests;
            return (
              <div key={test.name} className={`test-row ${isFinished ? "test-passed" : "test-pending"}`}>
                <span className="test-status-pill">{isFinished ? "ok" : "..."}</span>
                <span className="test-name">{test.name}</span>
                <span className="test-desc">{test.desc}</span>
                <span className="test-time">{isFinished ? `(${test.duration})` : ""}</span>
              </div>
            );
          })}
        </div>

        <div className="output-summary-bar">
          <span className="summary-text">
            ----------------------------------------------------------------------
            <br />
            Ran {completedTests} of 8 tests in 0.462s
            <br />
            <b className="text-ok">
              {completedTests === 8 ? "OK (8 tests passed, 0 failures, 0 errors)" : "Running..."}
            </b>
          </span>
        </div>
      </div>
    </div>
  );
}
