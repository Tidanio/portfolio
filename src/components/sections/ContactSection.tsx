"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { GlassPanel } from "@/components/ui/GlassPanel";

type Status = "idle" | "sending" | "sent" | "error";

interface Social {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
}

const socials: Social[] = [
  {
    label: "GitHub",
    value: "github.com/Tidanio",
    href: "https://github.com/Tidanio?tab=repositories",
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.59-4.04-1.59-.55-1.38-1.34-1.75-1.34-1.75-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.34 1.24-3.17-.13-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 6 0c2.29-1.53 3.3-1.21 3.3-1.21.66 1.64.25 2.86.12 3.16.77.83 1.23 1.88 1.23 3.17 0 4.54-2.8 5.54-5.48 5.83.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    value: "+34 641 200 506",
    href: "https://wa.me/34641200506",
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.737-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.15-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "jhonzhu.dev@gmail.com",
    href: "mailto:jhonzhu.dev@gmail.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground placeholder:text-muted/60 outline-none transition duration-200 focus:border-accent/60 focus:ring-2 focus:ring-accent/25 focus:bg-white/[0.05]";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // set() oculta ya (antes de entrar en vista) y to() revela al activarse el
      // trigger: así el reveal es limpio, sin el parpadeo de immediateRender.
      gsap.set(".contact-reveal", { autoAlpha: 0, y: 40 });
      gsap.to(".contact-reveal", {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    // Capturamos el form ANTES del await: tras él, e.currentTarget es null.
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "No se pudo enviar el mensaje.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Ha ocurrido un error inesperado.",
      );
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-24 md:py-32"
    >
      {/* Glow decorativo de fondo. */}
      <div
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[60vh] w-[60vh] translate-x-1/3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        {/* Columna izquierda: titular + datos de contacto. */}
        <div className="flex flex-col">
          <div className="contact-reveal">
            <p className="font-mono text-sm text-accent">Contacto</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              ¿Hablamos de tu próximo proyecto?
            </h2>
            <p className="mt-4 max-w-md text-balance text-muted">
              Cuéntame tu idea y te respondo en menos de 24&nbsp;horas. Webs y
              tiendas online a medida, con la interactividad como sello.
            </p>
          </div>

          <ul className="contact-reveal mt-10 flex flex-col gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent px-3 py-3 transition duration-200 hover:border-white/10 hover:bg-white/[0.03]"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground/80 transition duration-200 group-hover:border-accent/40 group-hover:text-accent">
                    {s.icon}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs uppercase tracking-[0.18em] text-muted">
                      {s.label}
                    </span>
                    <span className="text-sm text-foreground/90 transition group-hover:text-foreground">
                      {s.value}
                    </span>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-auto -translate-x-1 text-muted opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: formulario dentro de un GlassPanel. */}
        <GlassPanel className="contact-reveal rounded-3xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-muted">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Tu nombre"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-muted">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm text-muted">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="Cuéntame sobre tu proyecto…"
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_-10px_var(--accent)] hover:brightness-110 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" && (
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4z" />
                </svg>
              )}
              {(status === "idle" || status === "error") && "Enviar mensaje"}
              {status === "sending" && "Enviando…"}
              {status === "sent" && "¡Mensaje enviado!"}
              {(status === "idle" || status === "error") && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </button>

            <p
              className={`min-h-5 text-center text-sm transition ${
                status === "error" ? "text-red-400" : "text-accent"
              }`}
              role="status"
              aria-live="polite"
            >
              {status === "sent" && "¡Gracias! Te responderé muy pronto."}
              {status === "error" && errorMsg}
            </p>
          </form>
        </GlassPanel>
      </div>
    </section>
  );
}
