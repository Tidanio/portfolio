import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Necesitamos el runtime de Node (Supabase + Resend no van en edge aquí).
export const runtime = "nodejs";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

const NOTIFY_TO = "jhonzhu.dev@gmail.com";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function notificationEmail(name: string, email: string, message: string) {
  const row = (label: string, value: string) => `
    <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#9b9ba3;">${label}</p>
    <p style="margin:0 0 18px;font-size:15px;color:#ededed;">${value}</p>`;

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0a0a0b;padding:24px;">
    <div style="max-width:520px;margin:0 auto;background:#111114;border:1px solid #1f1f24;border-radius:16px;overflow:hidden;">
      <div style="padding:18px 24px;border-bottom:1px solid #1f1f24;">
        <h1 style="margin:0;font-size:15px;color:#ffffff;font-weight:600;">📬 Nuevo mensaje desde el portfolio</h1>
      </div>
      <div style="padding:24px;">
        ${row("Nombre", escapeHtml(name))}
        ${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:#6366f1;text-decoration:none;">${escapeHtml(email)}</a>`)}
        <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#9b9ba3;">Mensaje</p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#ededed;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    </div>
  </div>`;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  // Validación.
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios." },
      { status: 400 },
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "El email no es válido." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { error: "El mensaje es demasiado largo." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Faltan variables de entorno de Supabase.");
    return NextResponse.json(
      { error: "Configuración del servidor incompleta." },
      { status: 500 },
    );
  }

  // --- A) Guardar el mensaje en Supabase (tabla `contacts`). ---
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const { error: dbError } = await supabase
    .from("contacts")
    .insert({ name, email, message });

  if (dbError) {
    console.error("Supabase insert error:", dbError);
    return NextResponse.json(
      { error: "No se pudo guardar el mensaje." },
      { status: 500 },
    );
  }

  // --- B) Notificación por email con Resend (fallo "blando": el mensaje ya
  //         está guardado, así que no rompemos la petición si el email falla). ---
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const { error: emailError } = await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: [NOTIFY_TO],
        replyTo: email,
        subject: `Nuevo mensaje de ${name}`,
        html: notificationEmail(name, email, message),
        text: `Nuevo mensaje del portfolio\n\nNombre: ${name}\nEmail: ${email}\n\n${message}`,
      });
      if (emailError) console.error("Resend error:", emailError);
    } catch (err) {
      console.error("Resend threw:", err);
    }
  } else {
    console.warn("RESEND_API_KEY no definida: se omite la notificación.");
  }

  return NextResponse.json({ ok: true });
}
