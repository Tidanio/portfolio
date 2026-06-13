"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const steps: Step[] = [
  {
    id: "discovery",
    title: "Discovery",
    description:
      "Investigamos tu negocio, tus usuarios y tus objetivos para definir una estrategia sólida antes de diseñar nada.",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    id: "design",
    title: "Design",
    description:
      "Interfaces limpias y modernas, prototipadas y validadas, centradas siempre en la experiencia de usuario.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
  },
  {
    id: "development",
    title: "Development",
    description:
      "Código a medida, mantenible y rápido, con la capa de interactividad de alto nivel que distingue a tu producto.",
    icon: (
      <svg {...iconProps}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "Delivery",
    description:
      "Lanzamiento, medición y mejora continua para que tu web o tienda crezca sin fricciones.",
    icon: (
      <svg {...iconProps}>
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = gsap.utils.toArray<HTMLElement>(".process-card");
    const mm = gsap.matchMedia();

    // Escritorio: sección PINEADA + reveal escalonado controlado por el scroll.
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerHeight * 3,
          pin: true,
          scrub: 1,
        },
      });

      // Barra de progreso que se llena durante toda la sección pineada.
      tl.fromTo(
        ".process-progress",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", duration: cards.length },
        0,
      );

      // Cada tarjeta entra de forma secuencial (posición i en la timeline).
      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { autoAlpha: 0, y: 60, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          i,
        );
      });
    });

    // Móvil (mobile-first): sin pin. Cada tarjeta aparece al entrar en pantalla.
    mm.add("(max-width: 767px)", () => {
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* Glow decorativo: da color para que el glassmorphism tenga algo que refractar. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)",
        }}
      />

      <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <p className="font-mono text-sm text-accent">Proceso</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Cómo damos vida a tus ideas
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted">
          Un método claro en cuatro fases, de la primera idea al lanzamiento.
        </p>
        <div className="mx-auto mt-8 hidden h-px w-40 overflow-hidden bg-white/10 md:block">
          <div
            className="process-progress h-full w-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </header>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
        {steps.map((step, i) => (
          <GlassPanel
            key={step.id}
            className="process-card flex flex-col gap-4 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-accent/80">{step.icon}</span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted">
              {step.description}
            </p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
