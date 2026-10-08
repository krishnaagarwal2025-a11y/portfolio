import { useState, PointerEvent, useEffect } from "react";

export function useDraggable(init: { x: number; y: number }, enabled = true) {
  const [pos, setPos] = useState(init);

  // If window was resized and window is out of view, pull it back in
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => ({
        x: Math.max(10, Math.min(Math.max(10, window.innerWidth - 120), prev.x)),
        y: Math.max(10, Math.min(Math.max(10, window.innerHeight - 100), prev.y)),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest(".no-drag")) {
      return;
    }
    const el = e.currentTarget;
    const sx = e.clientX - pos.x;
    const sy = e.clientY - pos.y;

    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const onPointerMove = (ev: globalThis.PointerEvent) => {
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 60, ev.clientX - sx)),
        y: Math.max(0, Math.min(window.innerHeight - 80, ev.clientY - sy)),
      });
    };

    const onPointerUp = (ev: globalThis.PointerEvent) => {
      try {
        el.releasePointerCapture(ev.pointerId);
      } catch {
        // ignore
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return { pos, onPointerDown };
}
