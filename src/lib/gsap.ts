import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Punto único de registro de plugins de GSAP para toda la app (lado cliente).
// Registrar varias veces es inocuo (GSAP deduplica), pero centralizarlo aquí
// evita olvidos y mantiene la configuración en un solo sitio.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
