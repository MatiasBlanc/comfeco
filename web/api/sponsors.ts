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
const MAX_ORGANIZATION_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 1000;

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
 * Valida y registra un contacto de partnership en Supabase sin exponer
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
  const organization = readText(body, "organization", MAX_ORGANIZATION_LENGTH);
  const message = readText(body, "message", MAX_MESSAGE_LENGTH);

  if (!name || !organization || !message) {
    response
      .status(400)
      .json({ message: "Completa tu nombre, organización y mensaje." });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    response
      .status(503)
      .json({ message: "El formulario de sponsors todavía no está configurado." });
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabase.from("sponsors").insert({
    email,
    name,
    organization,
    message,
  });

  if (error?.code === "23505") {
    response.status(409).json({ message: "Ese email ya está registrado." });
    return;
  }

  if (error) {
    response.status(500).json({ message: "No pudimos enviar tu mensaje." });
    return;
  }

  response.status(201).json({ ok: true });
}
