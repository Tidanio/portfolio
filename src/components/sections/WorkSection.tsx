"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects";
import { drawPlaceholderFrame } from "@/lib/sequencePlaceholder";

/**
 * Una "escena" por proyecto:
 *  - La visual (canvas con la secuencia) queda PINEADA con `position: sticky`
 *    en escritorio mientras el texto scrollea a su lado.
 *  - ScrollTrigger hace el SCRUBBING del frame: el progreso del scroll dentro
 *    de la escena mapea al frame 0 → último, así la secuencia avanza/retrocede.
 */
function ProjectScene({ project, index }: { project: Project; index: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualOnRight = index % 2 === 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas || !scene) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const TOTAL = project.frames;
    const state = { frame: 0 };
    let cssW = 0;
    let cssH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      if (cssW === 0 || cssH === 0) return;
      const frame = Math.round(state.frame);
      drawPlaceholderFrame(ctx, cssW, cssH, {
        title: project.title,
        from: project.accent.from,
        to: project.accent.to,
        frame,
        total: TOTAL,
      });
      // Hook de testabilidad: el frame actual queda legible desde el DOM.
      canvas.dataset.frame = String(frame + 1);
    };

    resize();
    render();

    // Scrub: mapea el progreso del scroll en la escena al frame actual.
    const tween = gsap.to(state, {
      frame: TOTAL - 1,
      ease: "none",
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
      onUpdate: render,
    });

    const onResize = () => {
      resize();
      render();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [project]);

  return (
    <div ref={sceneRef} className="relative">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 px-6 md:grid-cols-2">
        {/* Columna visual — pineada (sticky) en escritorio. */}
        <div className={`relative z-10 ${visualOnRight ? "md:order-2" : ""}`}>
          <div className="h-[48vh] w-full md:sticky md:top-0 md:flex md:h-screen md:items-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            </div>
          </div>
        </div>

        {/* Columna de texto — scrollea al lado. */}
        <div
          className={`flex flex-col justify-center gap-6 py-12 md:min-h-[200vh] md:py-[30vh] ${
            visualOnRight ? "md:order-1" : ""
          }`}
        >
          <span className="font-mono text-sm text-accent">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {project.title}
            </h3>
          </div>

          <p className="max-w-md text-lg leading-relaxed text-muted">
            {project.description}
          </p>

          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="glass rounded-full px-3 py-1 text-xs text-foreground/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function WorkSection() {
  return (
    <section id="work" className="relative py-24 md:py-32">
      <header className="mx-auto mb-16 max-w-7xl px-6 md:mb-24">
        <p className="font-mono text-sm text-accent">Selected Work</p>
        <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Proyectos donde la interacción es el producto
        </h2>
      </header>

      <div className="flex flex-col gap-24 md:gap-0">
        {projects.map((project, index) => (
          <ProjectScene key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
