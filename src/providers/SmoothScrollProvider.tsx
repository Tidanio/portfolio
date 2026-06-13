"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerLenis } from "@/lib/smoothScroll";

// Registramos el plugin una sola vez a nivel de módulo (lado cliente).
gsap.registerPlugin(ScrollTrigger);

/**
 * Provider de scroll suave (Lenis) sincronizado con GSAP ScrollTrigger.
 *
 * La clave senior está en NO dejar que Lenis use su propio requestAnimationFrame:
 * lo conducimos desde el ticker de GSAP y desactivamos el lagSmoothing. Así el
 * scroll suave y todas las animaciones ligadas al scroll comparten exactamente
 * el mismo reloj y los efectos no "tiemblan".
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
    });

    // Exponemos la instancia para usos puntuales (p.ej. "volver arriba").
    registerLenis(lenis);

    // 1. Cada scroll de Lenis refresca las posiciones de ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Lenis avanza con el ticker de GSAP (un único reloj para todo).
    const raf = (time: number) => lenis.raf(time * 1000); // s -> ms
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 3. Limpieza al desmontar.
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      registerLenis(null);
    };
  }, []);

  return <>{children}</>;
}
