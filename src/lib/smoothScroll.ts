import type Lenis from "lenis";

/**
 * Pequeño singleton para acceder a la instancia de Lenis desde cualquier sitio
 * (p.ej. el botón "volver arriba" del Footer) sin pasar props ni context.
 * El SmoothScrollProvider la registra al montar y la limpia al desmontar.
 */
let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Scroll suave a una posición/elemento. Cae a scroll nativo si Lenis no está. */
export function smoothScrollTo(
  target: number | string | HTMLElement,
  options?: { duration?: number; offset?: number },
) {
  if (instance) {
    instance.scrollTo(target, options);
  } else if (typeof window !== "undefined") {
    window.scrollTo({
      top: typeof target === "number" ? target : 0,
      behavior: "smooth",
    });
  }
}
