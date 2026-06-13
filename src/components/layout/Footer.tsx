"use client";

import { smoothScrollTo } from "@/lib/smoothScroll";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted">
          © {year} Jhonzhu. Diseñado y desarrollado con Next.js, GSAP y Three.js.
        </p>

        <button
          type="button"
          onClick={() => smoothScrollTo(0, { duration: 1.2 })}
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          Volver arriba
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
