"use client";

import { useEffect, useState } from "react";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { cn } from "@/lib/utils";

const links = [
  { label: "Inicio", target: "#hero" },
  { label: "Proyectos", target: "#work" },
  { label: "Proceso", target: "#process" },
  { label: "Contacto", target: "#contact" },
];

// Glassmorphism inline (el compilador elimina backdrop-filter del CSS de autor).
const glassStyle = {
  backdropFilter: "blur(12px) saturate(140%)",
  WebkitBackdropFilter: "blur(12px) saturate(140%)",
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lenis hace scroll nativo, así que el evento "scroll" del window dispara.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navega con Lenis (scroll suave) y deja hueco para la barra fija (offset).
  const go = (target: string) => {
    setOpen(false);
    smoothScrollTo(target, { offset: -80, duration: 1.2 });
  };

  // Glass activo si se ha scrolleado o si el menú móvil está abierto.
  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4">
      <nav
        className={cn(
          "mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-6",
          solid
            ? "border-white/10 bg-white/[0.04] shadow-lg shadow-black/20"
            : "border-transparent bg-transparent",
        )}
        style={solid ? glassStyle : undefined}
      >
        <button
          onClick={() => go("#hero")}
          data-cursor="hover"
          className="px-2 text-sm font-semibold tracking-tight text-foreground"
        >
          Jhonzhu<span className="text-accent">.</span>
        </button>

        {/* Enlaces (escritorio) */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.target}>
              <button
                onClick={() => go(l.target)}
                className="rounded-full px-4 py-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA (escritorio) */}
        <button
          onClick={() => go("#contact")}
          className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition duration-200 hover:brightness-110 md:inline-flex"
        >
          Hablemos
        </button>

        {/* Botón de menú (móvil) */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex size-9 items-center justify-center rounded-full text-foreground transition hover:bg-white/5 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 12h16" />
                <path d="M4 6h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Menú desplegable (móvil) */}
      {open && (
        <div
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-white/[0.04] p-2 md:hidden"
          style={glassStyle}
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.target}>
                <button
                  onClick={() => go(l.target)}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm text-muted transition-colors duration-200 hover:bg-white/5 hover:text-foreground"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
