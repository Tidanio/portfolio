import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends ComponentPropsWithoutRef<"div"> {
  /** Intensidad del desenfoque, en px. */
  blur?: number;
}

/**
 * Panel con efecto glassmorphism reutilizable.
 *
 * Combina la utilidad `.glass` (capa translúcida + borde, que sí compila) con el
 * `backdrop-filter` aplicado INLINE — necesario porque el pipeline de build
 * (Lightning CSS) elimina `backdrop-filter` de las reglas CSS de autor.
 */
export function GlassPanel({
  className,
  blur = 12,
  style,
  children,
  ...props
}: GlassPanelProps) {
  const filter = `blur(${blur}px) saturate(140%)`;
  return (
    <div
      className={cn("glass", className)}
      style={{ backdropFilter: filter, WebkitBackdropFilter: filter, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
