import { NextResponse } from "next/server";

import { createSupabaseAdmin } from "@/lib/supabase/server";
import { validateWaitlistPayload } from "@/lib/validation";

const MAX_REQUEST_BYTES = 20_000;

/**
 * Valida y registra una persona en la waitlist sin exponer credenciales al cliente.
 *
 * @param request - Solicitud JSON enviada por el formulario público.
 * @returns Respuesta JSON con el estado del registro.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { message: "El formulario es demasiado grande." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "No pudimos leer el formulario." },
      { status: 400 },
    );
  }

  const result = validateWaitlistPayload(body);
  if (!result.isValid) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  if (result.data.website) {
    return NextResponse.json({ ok: true });
  }

  let supabase;
  try {
    supabase = createSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { message: "La waitlist todavía no está configurada. Inténtalo más tarde." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("waitlist").insert({
    email: result.data.email,
    wants_updates: true,
  });

  if (error?.code === "23505") {
    return NextResponse.json(
      { message: "Ese email ya está en la waitlist. Nos alegra verte de nuevo." },
      { status: 409 },
    );
  }

  if (error) {
    return NextResponse.json(
      { message: "No pudimos guardar tu lugar. Inténtalo de nuevo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
