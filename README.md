# Jhonzhu — Portfolio Interactivo

Portfolio personal de desarrollo web, centrado en **páginas web y tiendas online a medida** con un alto nivel de interactividad. Diseño oscuro, minimalista y moderno, con scroll suave, animaciones ligadas al scroll, 3D en tiempo real y glassmorphism.

🔗 **Demo:** _añade aquí tu URL de Vercel_

---

## ✨ Características

- **Hero 3D** — geometría procedimental (icosaedro deformable + wireframe) con [React Three Fiber](https://r3f.docs.pmnd.rs/), iluminación de color y parallax que sigue al ratón. Cargado con `next/dynamic` (`ssr: false`) para no penalizar el arranque.
- **Image Sequence Scrubbing** — secuencia de fotogramas ligada al scroll con `ScrollTrigger`, con la visual **pineada** (`sticky`) mientras el texto scrollea al lado.
- **Sección de proceso pineada** — `ScrollTrigger` con `pin` y reveal escalonado de las tarjetas (`gsap.matchMedia` separa el comportamiento escritorio/móvil).
- **Formulario de contacto funcional** — guarda en **Supabase** y notifica por email con **Resend**, con estados de carga/éxito/error.
- **Navbar dinámico** — transparente sobre el Hero, glassmorphism al hacer scroll. Navegación con scroll suave de **Lenis**.
- **Cursor personalizado** — punto + anillo animados con GSAP (solo en puntero fino).
- **SEO listo** — metadata + Open Graph, imagen OG generada en código, `sitemap.xml` y `robots.txt`.
- **100% responsive** (mobile-first) y **dark theme** por defecto.

## 🛠 Stack

| Categoría | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) · React 19 · TypeScript |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animación | [GSAP](https://gsap.com/) + ScrollTrigger · [Lenis](https://lenis.darkroom.engineering/) (scroll suave) |
| 3D | [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://drei.docs.pmnd.rs/) · three.js |
| Backend | [Supabase](https://supabase.com/) (Postgres) · [Resend](https://resend.com/) (email) |
| Deploy | [Vercel](https://vercel.com/) |

## 📁 Estructura

```
src/
├── app/                 # App Router (layout, page, api/contact, opengraph-image, sitemap, robots)
├── components/
│   ├── ui/              # GlassPanel (glassmorphism reutilizable)
│   ├── layout/          # Navbar, Footer, CustomCursor
│   ├── sections/        # Hero, Work, Process, Contact
│   └── canvas/          # Escena 3D (R3F)
├── hooks/
├── lib/                 # gsap, smoothScroll (Lenis), utils, sequencePlaceholder
├── providers/           # SmoothScrollProvider (Lenis + GSAP)
└── data/                # projects.ts
```

## 🚀 Puesta en marcha

**Requisitos:** Node.js 20.9+ y una cuenta de [Supabase](https://supabase.com) y [Resend](https://resend.com).

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno
cp .env.local.example .env.local   # y rellena los valores

# 3. Arrancar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### 🔑 Variables de entorno

Copia `.env.local.example` a `.env.local` y completa:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (**secreta**, solo servidor) |
| `RESEND_API_KEY` | API key de Resend |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (para OG/sitemap absolutos) |

### 🗄 Tabla de Supabase

En el SQL Editor de Supabase:

```sql
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;
-- Sin políticas públicas: el endpoint usa la service_role key (las bypassa).
```

## 📜 Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run lint` | ESLint |

## ☁️ Deploy en Vercel

1. Sube el repo a GitHub.
2. **Import Project** en Vercel (Next.js se autodetecta).
3. Añade las 4 variables de entorno en *Settings → Environment Variables*.
4. Deploy. Cada push a `main` redespliega automáticamente.

> **Nota sobre Resend:** por defecto se usa `onboarding@resend.dev`, que solo envía al email de tu cuenta Resend. Para enviar desde tu propia marca, [verifica un dominio](https://resend.com/domains) y actualiza el `from` en `src/app/api/contact/route.ts`.

---

Hecho por **Jhonzhu** · [GitHub](https://github.com/Tidanio) · jhonzhu.dev@gmail.com
