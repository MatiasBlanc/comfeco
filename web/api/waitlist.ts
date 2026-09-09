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
const MAX_NAME_LENGTH = 120;
const MAX_COUNTRY_LENGTH = 80;
const MAX_PROFILE_LENGTH = 60;
const MAX_INTERESTS = 12;
const MAX_FEEDBACK_LENGTH = 1000;

/**
 * Lee un campo de texto limitado en largo.
 *
 * @param body - Cuerpo de la solicitud.
 * @param field - Nombre del campo.
 * @param maxLength - Longitud máxima permitida.
 * @returns Texto normalizado o cadena vacía.
 */
function readText(
  body: Record<string, unknown> | undefined,
  field: string,
  maxLength: number,
): string {
  const value = body?.[field];
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

/**
 * Valida y registra un correo y sus datos de interés en Supabase sin exponer
 * credenciales privadas.
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

  if (typeof body?.website === "string" && body.website.trim()) {
    response.status(200).json({ ok: true });
    return;
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    response.status(400).json({ message: "Escribe un email válido." });
    return;
  }

  const name = readText(body, "name", MAX_NAME_LENGTH);
  const country = readText(body, "country", MAX_COUNTRY_LENGTH);
  const profile = readText(body, "profile", MAX_PROFILE_LENGTH);
  const feedback = readText(body, "feedback", MAX_FEEDBACK_LENGTH);

  if (!name || !country || !profile) {
    response
      .status(400)
      .json({ message: "Completa tu nombre, país y perfil." });
    return;
  }

  const interests = Array.isArray(body?.interests)
    ? body.interests
        .filter((interest): interest is string => typeof interest === "string")
        .map((interest) => interest.trim().slice(0, 40))
        .filter(Boolean)
        .slice(0, MAX_INTERESTS)
    : [];

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
    name,
    country,
    profile,
    interests,
    feedback: feedback || null,
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
