import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

interface WaitlistSummary {
  waitlist: number;
  today: number;
  last_7_days: number;
  survey_sent: number;
  survey_completed: number;
  response_rate: number;
}

interface SurveySummary {
  responses: number;
  avg_build_learn_balance: number;
  hackathon_formats: Record<string, number> | null;
  countries: Record<string, number> | null;
  challenge_types: Record<string, number> | null;
  learning_formats: Record<string, number> | null;
  competitions: Record<string, number> | null;
  motivations: Record<string, number> | null;
  year_round_events: Record<string, number> | null;
  recent_feedback: Array<{ feedback: string; created_at: string }> | null;
}

export interface RegistrationItem {
  id: string;
  email: string;
  created_at: string;
  survey_sent_at: string | null;
  survey_completed_at: string | null;
  response: Record<string, unknown> | null;
}

const SESSION_COOKIE = "pulse_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Construye el token de sesión de Pulse a partir de la contraseña del entorno.
 *
 * @param password - Contraseña configurada en el servidor.
 * @returns Hash HMAC que se guarda en cookie httpOnly.
 */
function createSessionToken(password: string): string {
  return createHmac("sha256", password).update("comfeco-pulse-v1").digest("hex");
}

/**
 * Lee una cookie concreta del encabezado Cookie.
 *
 * @param header - Encabezado Cookie crudo.
 * @param name - Nombre de la cookie.
 * @returns Valor encontrado o cadena vacía.
 */
function readCookie(header: string, name: string): string {
  const parts = header.split(";");
  for (const part of parts) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) {
      return rawValue.join("=");
    }
  }

  return "";
}

/**
 * Normaliza un encabezado que Vercel puede entregar como string o array.
 *
 * @param value - Valor crudo del header.
 * @returns Primera cadena disponible.
 */
function readHeader(value: string | string[] | undefined): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return "";
}

/**
 * Expone el resumen agregado de waitlist y discovery sin datos personales.
 *
 * @param request - Solicitud HTTP recibida por Vercel.
 * @param response - Respuesta HTTP de la función.
 * @returns Promesa que finaliza cuando se envía la respuesta.
 */
export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ message: "Método no permitido." });
    return;
  }

  const pulsePassword = process.env.PULSE_PASSWORD;
  if (!pulsePassword) {
    response.status(503).json({ message: "Pulse todavía no está configurado." });
    return;
  }

  const expectedToken = createSessionToken(pulsePassword);
  const cookieHeader =
    readHeader(request.headers?.cookie) || readHeader(request.headers?.Cookie);
  const sessionToken = readCookie(cookieHeader, SESSION_COOKIE);
  const body = request.body as Record<string, unknown> | undefined;
  const submittedPassword =
    typeof body?.password === "string" ? body.password : "";
  const isAuthorized =
    sessionToken === expectedToken || submittedPassword === pulsePassword;

  if (!isAuthorized) {
    response.status(401).json({ message: "Contraseña incorrecta." });
    return;
  }

  if (submittedPassword === pulsePassword) {
    const isProduction = process.env.VERCEL_ENV === "production";
    const cookieParts = [
      `${SESSION_COOKIE}=${expectedToken}`,
      "HttpOnly",
      "Path=/",
      "SameSite=Lax",
      `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    ];

    if (isProduction) {
      cookieParts.push("Secure");
    }

    response.setHeader("Set-Cookie", cookieParts.join("; "));
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    response.status(503).json({ message: "Pulse todavía no está configurado." });
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .from("waitlist_summary")
    .select(
      "waitlist, today, last_7_days, survey_sent, survey_completed, response_rate",
    )
    .maybeSingle();

  if (error || !data) {
    response.status(500).json({ message: "No pudimos cargar Pulse." });
    return;
  }

  const row = data as Record<string, unknown>;
  const summary: WaitlistSummary = {
    waitlist: Number(row.waitlist),
    today: Number(row.today),
    last_7_days: Number(row.last_7_days),
    survey_sent: Number(row.survey_sent),
    survey_completed: Number(row.survey_completed),
    response_rate: Number(row.response_rate),
  };

  const { data: surveyData } = await supabase
    .from("survey_summary")
    .select("*")
    .maybeSingle();

  const { data: waitlistRows } = await supabase
    .from("waitlist")
    .select("id, email, created_at, survey_sent_at, survey_completed_at")
    .order("created_at", { ascending: false });

  const { data: surveyResponses } = await supabase
    .from("survey_responses")
    .select("*")
    .order("created_at", { ascending: false });

  const learningFormats: Record<string, number> = {};
  for (const resp of surveyResponses ?? []) {
    const formats = (resp as Record<string, unknown>).learning_formats;
    if (Array.isArray(formats)) {
      for (const fmt of formats) {
        if (typeof fmt === "string") {
          learningFormats[fmt] = (learningFormats[fmt] ?? 0) + 1;
        }
      }
    }
  }

  const responseByWaitlistId = new Map(
    (surveyResponses ?? []).map((r) => [
      (r as Record<string, unknown>).waitlist_id as string,
      r as Record<string, unknown>,
    ]),
  );

  const registrations: RegistrationItem[] = ((waitlistRows ?? []) as Record<string, unknown>[]).map(
    (row) => ({
      id: String(row.id),
      email: String(row.email),
      created_at: String(row.created_at),
      survey_sent_at: row.survey_sent_at ? String(row.survey_sent_at) : null,
      survey_completed_at: row.survey_completed_at ? String(row.survey_completed_at) : null,
      response: responseByWaitlistId.get(String(row.id)) ?? null,
    }),
  );

  const surveySummaryCombined = surveyData
    ? {
        ...(surveyData as SurveySummary),
        learning_formats:
          (surveyData as SurveySummary).learning_formats ??
          (Object.keys(learningFormats).length > 0 ? learningFormats : null),
      }
    : Object.keys(learningFormats).length > 0
      ? { learning_formats: learningFormats }
      : null;

  response.status(200).json({
    summary,
    survey: surveySummaryCombined,
    registrations,
    responses: surveyResponses ?? [],
  });
}
