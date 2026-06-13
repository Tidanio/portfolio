export interface Project {
  /** Identificador único / slug. */
  id: string;
  /** Título visible del proyecto. */
  title: string;
  /** Categoría corta (p.ej. "Tienda Online"). */
  category: string;
  /** Año de entrega. */
  year: number;
  /** Descripción breve para la columna de texto. */
  description: string;
  /** Tecnologías usadas (chips). */
  tags: string[];
  /** Colores de acento del proyecto (se usan en el placeholder de la secuencia). */
  accent: { from: string; to: string };
  /** Nº de fotogramas de la secuencia de imágenes (placeholder por ahora). */
  frames: number;
}

export const projects: Project[] = [
  {
    id: "crm-omnicanal",
    title: "CRM Omnicanal",
    category: "Plataforma SaaS",
    year: 2025,
    description:
      "Plataforma de atención unificada que centraliza WhatsApp, email, redes sociales y chat web en una sola bandeja en tiempo real. Pensada para que los equipos de soporte respondan más rápido sin perder nunca el contexto del cliente.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets", "Tailwind CSS"],
    accent: { from: "#6366f1", to: "#a855f7" },
    frames: 72,
  },
  {
    id: "ecommerce-deportivo",
    title: "E-commerce Deportivo",
    category: "Tienda Online",
    year: 2024,
    description:
      "Tienda online de alto rendimiento para una marca deportiva: catálogo dinámico, configurador de producto en 3D y un checkout optimizado. Cada interacción está diseñada para reducir la fricción y mejorar la conversión.",
    tags: ["Next.js", "Shopify", "GSAP", "Three.js", "Stripe"],
    accent: { from: "#10b981", to: "#06b6d4" },
    frames: 72,
  },
];
