/**
 * Dibujado del PLACEHOLDER de una secuencia de imágenes en un <canvas> 2D.
 *
 * Simula el "Image Sequence Scrubbing": dado un frame, pinta un fotograma
 * (degradado teñido con el acento + un elemento giratorio + número de frame +
 * barra de progreso) de forma que al hacer scrub se vea avanzar/retroceder.
 *
 * Cuando existan los frames renderizados reales, basta con sustituir este módulo
 * por un loader que haga `ctx.drawImage(images[frame], ...)`. La interfaz de
 * `drawPlaceholderFrame` (frame actual) se mantiene igual.
 */

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function lerpColor(c1: string, c2: string, t: number): Rgb {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  };
}

function mix(c: Rgb, hex: string, t: number): Rgb {
  const d = hexToRgb(hex);
  return {
    r: Math.round(lerp(c.r, d.r, t)),
    g: Math.round(lerp(c.g, d.g, t)),
    b: Math.round(lerp(c.b, d.b, t)),
  };
}

const css = ({ r, g, b }: Rgb, a = 1) =>
  a >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;

export interface PlaceholderFrameOptions {
  title: string;
  from: string;
  to: string;
  frame: number;
  total: number;
}

export function drawPlaceholderFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  { title, from, to, frame, total }: PlaceholderFrameOptions,
) {
  const t = total > 1 ? frame / (total - 1) : 0;
  const c1 = lerpColor(from, to, t);
  const c2 = lerpColor(to, from, t);

  ctx.clearRect(0, 0, w, h);

  // Fondo: degradado oscuro teñido con el acento, desplazado según el frame.
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, css(mix(c1, "#0a0a0b", 0.5)));
  g.addColorStop(1, css(mix(c2, "#0a0a0b", 0.8)));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Rejilla sutil de fondo.
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  const step = Math.max(28, Math.round(w / 14));
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Elemento giratorio central: hace evidente el scrubbing (gira 360° a lo largo
  // de la secuencia, como un render "turntable" de producto).
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.26;
  const angle = t * Math.PI * 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.beginPath();
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.cos(a) * R;
    const y = Math.sin(a) * R;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  ctx.rotate(-angle * 2);
  ctx.strokeStyle = css(c1);
  ctx.beginPath();
  for (let i = 0; i <= 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const x = Math.cos(a) * R * 0.55;
    const y = Math.sin(a) * R * 0.55;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Número de frame grande en el centro.
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(Math.min(w, h) * 0.2)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(String(frame + 1).padStart(2, "0"), cx, cy);

  // Título (arriba-izquierda) y etiqueta de placeholder (arriba-derecha).
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.textAlign = "left";
  ctx.font = `600 ${Math.round(Math.max(13, w * 0.022))}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(title, 20, 34);

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.textAlign = "right";
  ctx.font = `500 ${Math.round(Math.max(10, w * 0.016))}px ui-monospace, monospace`;
  ctx.fillText("SECUENCIA · PLACEHOLDER", w - 20, 34);

  // Barra de progreso inferior + contador de frame.
  const pad = 20;
  const barY = h - 26;
  const barW = w - pad * 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(pad, barY, barW, 3);
  ctx.fillStyle = css(c1);
  ctx.fillRect(pad, barY, barW * t, 3);

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.textAlign = "left";
  ctx.font = `500 ${Math.round(Math.max(10, w * 0.015))}px ui-monospace, monospace`;
  ctx.fillText(
    `FRAME ${String(frame + 1).padStart(2, "0")} / ${total}`,
    pad,
    barY - 8,
  );
}
