"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDateStr(now.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock-widget" title={`System Date: ${dateStr}`} suppressHydrationWarning>
      <span className="clock-time">{time || "12:00:00"}</span>
    </div>
  );
}
