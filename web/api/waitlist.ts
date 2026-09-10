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

interface WaitlistInsertRow {
  id: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Envía la invitación a la encuesta después de registrar el correo.
 * Si falla, la persona queda guardada para reintentarlo desde el batch manual.
 *
 * @param supabaseUrl - URL del proyecto Supabase.
 * @param waitlistId - UUID recién insertado.
 * @returns true si la Edge Function confirmó el envío.
 */
async function sendAutomaticSurveyEmail(
  supabaseUrl: string,
  waitlistId: string,
): Promise<boolean> {
  const sendSecret = process.env.DISCOVERY_SEND_SECRET;
  if (!sendSecret) {
    console.error(JSON.stringify({ waitlistId, error: "Falta DISCOVERY_SEND_SECRET." }));
    return false;
  }

  try {
    const sendResponse = await fetch(
      `${supabaseUrl}/functions/v1/send-survey-email`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ waitlist_id: waitlistId }),
      },
    );

    if (!sendResponse.ok) {
      console.error(
        JSON.stringify({
          waitlistId,
          status: sendResponse.status,
          error: "La Edge Function no pudo enviar la encuesta.",
        }),
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      JSON.stringify({
        waitlistId,
        error: error instanceof Error ? error.message : "Error desconocido.",
      }),
    );
    return false;
  }
}

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
  const { data, error } = await supabase
    .from("waitlist")
    .insert({
      email,
      wants_updates: true,
    })
    .select("id")
    .single();

  if (error?.code === "23505") {
    response.status(409).json({ message: "Ese email ya está en la waitlist." });
    return;
  }

  if (error || !data) {
    response.status(500).json({ message: "No pudimos guardar tu correo." });
    return;
  }

  const surveyEmailSent = await sendAutomaticSurveyEmail(
    supabaseUrl,
    (data as WaitlistInsertRow).id,
  );

  response.status(201).json({
    ok: true,
    survey_email_sent: surveyEmailSent,
    message: surveyEmailSent
      ? "Registro confirmado. Revisa tu correo para responder la encuesta."
      : "Registro confirmado. Te enviaremos la encuesta cuando esté disponible.",
  });
}
