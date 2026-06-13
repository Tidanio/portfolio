import { ImageResponse } from "next/og";

// Metadatos de la imagen.
export const alt = "Jhonzhu — Desarrollo Web Interactivo y Tiendas Online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen OG generada en código (sin assets ni fuentes externas → robusto en build).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 75% 15%, rgba(99,102,241,0.30), transparent 45%), radial-gradient(circle at 10% 90%, rgba(168,85,247,0.18), transparent 40%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#9b9ba3" }}>
          jhonzhu.dev
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 700,
              color: "#ededed",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Desarrollo Web Interactivo
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 700,
              color: "#6366f1",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            &amp; Tiendas Online
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#9b9ba3",
              marginTop: 28,
              maxWidth: 760,
            }}
          >
            Páginas web y e-commerce a medida, con la interactividad como sello.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            color: "#ededed",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#6366f1",
            }}
          />
          Jhonzhu
        </div>
      </div>
    ),
    { ...size },
  );
}
