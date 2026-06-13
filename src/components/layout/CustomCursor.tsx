"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const INTERACTIVE = "a, button, [data-cursor='hover']";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Solo en dispositivos con puntero fino (ratón); en táctil no se monta.
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Ocultamos el cursor nativo solo mientras este componente está activo.
    document.body.classList.add("custom-cursor");

    // quickTo evita re-renders de React: animamos transform directamente.
    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const setHover = (hover: boolean) => {
      gsap.to(ring, { scale: hover ? 1.8 : 1, duration: 0.3, ease: "power3" });
      gsap.to(dot, { scale: hover ? 0 : 1, duration: 0.3, ease: "power3" });
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE)) setHover(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE)) setHover(false);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className="fixed -ml-4 -mt-4 size-8 rounded-full border border-white/50 mix-blend-difference"
        style={{ left: 0, top: 0 }}
      />
      <div
        ref={dotRef}
        className="fixed -ml-1 -mt-1 size-2 rounded-full bg-white mix-blend-difference"
        style={{ left: 0, top: 0 }}
      />
    </div>
  );
}
