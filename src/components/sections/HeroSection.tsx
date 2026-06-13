"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// El canvas 3D se carga de forma diferida y solo en cliente (ssr:false),
// así three.js no entra en el bundle inicial ni bloquea el primer pintado.
const HeroCanvas = dynamic(() => import("@/components/canvas/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export function HeroSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Estado inicial explícito. Se aplica dentro del layout effect de useGSAP,
      // antes del primer pintado, así que no hay parpadeo (FOUC).
      gsap.set(".hero-line", { yPercent: 120 });
      gsap.set("[data-hero='subtitle'], [data-hero='cta']", {
        autoAlpha: 0,
        y: 24,
      });

      // Reveal hacia el estado final visible. Usamos .to() (no .from()) para que
      // la animación sea determinista bajo el doble montaje de React Strict Mode
      // en desarrollo: el timeline siempre acaba en el estado visible.
      const tl = gsap.timeline({
        delay: 0.35,
        defaults: { ease: "power3.out" },
      });

      tl.to(".hero-line", { yPercent: 0, duration: 1, stagger: 0.12 })
        .to(
          "[data-hero='subtitle']",
          { autoAlpha: 1, y: 0, duration: 0.8 },
          "-=0.55",
        )
        .to("[data-hero='cta']", { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4");
    },
    { scope: container },
  );

  return (
    <section
      id="hero"
      ref={container}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6"
    >
      {/* Capa 3D de fondo (recibe el ratón). */}
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      {/* Scrim radial para legibilidad del texto sobre el 3D. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(10,10,11,0.55),transparent_60%)]" />

      {/* Contenido. pointer-events-none deja pasar el ratón al canvas;
          el CTA reactiva sus eventos con pointer-events-auto. */}
      <div className="pointer-events-none relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="hero-line block">Creando Experiencias</span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="hero-line block bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
              Digitales Que Destacan
            </span>
          </span>
        </h1>

        <p
          data-hero="subtitle"
          className="mt-6 max-w-xl text-balance text-base text-muted sm:text-lg"
        >
          Diseño y desarrollo a medida de páginas web y tiendas online, donde la
          interactividad convierte cada visita en una experiencia memorable.
        </p>

        <a
          href="#work"
          data-hero="cta"
          // El blur se aplica inline: Lightning CSS elimina backdrop-filter de
          // las reglas CSS de autor, pero los estilos inline no pasan por él.
          style={{
            backdropFilter: "blur(12px) saturate(140%)",
            WebkitBackdropFilter: "blur(12px) saturate(140%)",
          }}
          className="glass group pointer-events-auto mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_45px_-12px_var(--accent)]"
        >
          Ver Proyectos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Indicador de scroll sutil. */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}
