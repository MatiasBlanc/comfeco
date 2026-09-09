import { createClient } from "@supabase/supabase-js";

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida y registra un correo en Supabase sin exponer credenciales privadas.
 *
 * @param request - Solicitud HTTP recibida por Vercel.
 * @param response - Respuesta HTTP de la función.
 * @returns Promesa que finaliza cuando se envía la respuesta.
 */
export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ message: "Método no permitido." });
    return;
  }

  const body = request.body as Record<string, unknown> | undefined;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const website = typeof body?.website === "string" ? body.website.trim() : "";

  if (website) {
    response.status(200).json({ ok: true });
    return;
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    response.status(400).json({ message: "Escribe un email válido." });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    response.status(503).json({ message: "La waitlist todavía no está configurada." });
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabase.from("waitlist").insert({
    email,
    wants_updates: true,
  });

  if (error?.code === "23505") {
    response.status(409).json({ message: "Ese email ya está en la waitlist." });
    return;
  }

  if (error) {
    response.status(500).json({ message: "No pudimos guardar tu correo." });
    return;
  }

  response.status(201).json({ ok: true });
}
