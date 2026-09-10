import { createClient } from "@supabase/supabase-js";

const SURVEY_TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const MAX_FEEDBACK_LENGTH = 1000;
const HACKATHON_FORMATS = new Set([
  "online",
  "presencial",
  "hibrido",
]);
const CHALLENGE_TYPES = new Set([
  "producto",
  "open_source",
  "impacto_social",
  "ai_datos",
  "diseno",
  "abierto",
]);
const LEARNING_FORMATS = new Set([
  "workshops",
  "charlas",
  "mentorias",
  "live_coding",
  "office_hours",
]);
const COMPETITIONS = new Set([
  "hackathon",
  "mini_challenges",
  "design_challenge",
  "demo_day",
  "sin_competencia",
]);
const MOTIVATIONS = new Set([
  "aprender",
  "construir",
  "conocer_gente",
  "encontrar_equipo",
  "premios",
  "comunidad",
]);
const YEAR_ROUND_EVENTS = new Set([
  "meetups",
  "workshops",
  "hackathons_cortos",
  "mentorias",
  "comunidad_online",
  "solo_evento",
]);

interface SurveyAnswers {
  hackathonFormat: string;
  country: string;
  challengeType: string;
  learningFormats: string[];
  buildLearnBalance: number;
  competitions: string[];
  motivations: string[];
  yearRoundEvents: string[];
  feedback: string;
}

/**
 * Normaliza un token opaco de 64 caracteres hexadecimales.
 *
 * @param value - Valor recibido desde query o body.
 * @returns Token válido o cadena vacía.
 */
function normalizeSurveyToken(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const token = value.trim().toLowerCase();
  return SURVEY_TOKEN_PATTERN.test(token) ? token : "";
}

/**
 * Valida una selección simple contra las opciones permitidas.
 *
 * @param value - Valor sin confiar.
 * @param options - Conjunto de valores aceptados.
 * @returns Valor válido o null.
 */
function readAllowedValue(value: unknown, options: ReadonlySet<string>): string | null {
  return typeof value === "string" && options.has(value) ? value : null;
}

/**
 * Valida una selección múltiple y elimina duplicados.
 *
 * @param value - Array sin confiar.
 * @param options - Conjunto de valores aceptados.
 * @returns Array válido o null.
 */
function readAllowedValues(value: unknown, options: ReadonlySet<string>): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const values = value.filter((item): item is string => typeof item === "string");
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length === 0 || uniqueValues.length !== values.length) {
    return null;
  }

  return uniqueValues.every((item) => options.has(item)) ? uniqueValues : null;
}

/**
 * Valida las respuestas de discovery en el servidor.
 *
 * @param input - Cuerpo de la petición.
 * @returns Respuestas normalizadas o mensaje de error.
 */
function parseSurveyAnswers(input: unknown): SurveyAnswers | string {
  if (typeof input !== "object" || input === null) {
    return "Completa la encuesta para continuar.";
  }

  const body = input as Record<string, unknown>;
  const hackathonFormat = readAllowedValue(body.hackathonFormat, HACKATHON_FORMATS);
  const country =
    typeof body.country === "string" ? body.country.trim().slice(0, 100) : "";
  const challengeType = readAllowedValue(body.challengeType, CHALLENGE_TYPES);
  const learningFormats = readAllowedValues(body.learningFormats, LEARNING_FORMATS);
  const competitions = readAllowedValues(body.competitions, COMPETITIONS);
  const motivations = readAllowedValues(body.motivations, MOTIVATIONS);
  const yearRoundEvents = readAllowedValues(body.yearRoundEvents, YEAR_ROUND_EVENTS);
  const buildLearnBalance =
    typeof body.buildLearnBalance === "number"
      ? body.buildLearnBalance
      : Number(body.buildLearnBalance);
  const feedback =
    typeof body.feedback === "string"
      ? body.feedback.trim().slice(0, MAX_FEEDBACK_LENGTH)
      : "";

  if (!hackathonFormat) return "Elige un formato de hackathon.";
  if (!country) return "Selecciona tu país.";
  if (!challengeType) return "Elige un tipo de challenge.";
  if (!learningFormats) return "Elige al menos una forma de aprender.";
  if (!Number.isInteger(buildLearnBalance) || buildLearnBalance < 1 || buildLearnBalance > 5) {
    return "Indica el equilibrio entre aprender y construir.";
  }
  if (!competitions) return "Elige al menos un tipo de competencia.";
  if (!motivations) return "Elige al menos una motivación.";
  if (!yearRoundEvents) return "Cuéntanos qué te gustaría durante el año.";

  return {
    hackathonFormat,
    country,
    challengeType,
    learningFormats,
    buildLearnBalance,
    competitions,
    motivations,
    yearRoundEvents,
    feedback,
  };
}

interface ApiRequest {
  method?: string;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

interface WaitlistSurveyRow {
  id: string;
  survey_completed_at: string | null;
}

/**
 * Lee un parámetro de query que Vercel puede entregar como string o array.
 *
 * @param value - Valor crudo de `request.query`.
 * @returns Primera cadena disponible o vacío.
 */
function readQueryParam(value: string | string[] | undefined): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return "";
}

/**
 * Crea el cliente de Supabase con la service role, nunca expuesta al navegador.
 *
 * @returns Cliente autenticado o null si faltan variables.
 */
function createServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Busca la fila de waitlist asociada a un token de encuesta.
 *
 * @param token - Token ya normalizado.
 * @returns Fila encontrada o null.
 */
async function findWaitlistByToken(token: string): Promise<WaitlistSurveyRow | null> {
  const supabase = createServiceClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("waitlist")
    .select("id, survey_completed_at")
    .eq("survey_token", token)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as WaitlistSurveyRow;
}

/**
 * Valida el token de discovery y guarda una sola respuesta por persona.
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

  if (!createServiceClient()) {
    response.status(503).json({ message: "La encuesta todavía no está configurada." });
    return;
  }

  if (request.method === "GET") {
    const token = normalizeSurveyToken(readQueryParam(request.query?.token));
    if (!token) {
      response.status(404).json({
        status: "invalid",
        message: "Este enlace no es válido.",
      });
      return;
    }

    const waitlist = await findWaitlistByToken(token);
    if (!waitlist) {
      response.status(404).json({
        status: "invalid",
        message: "Este enlace no es válido.",
      });
      return;
    }

    if (waitlist.survey_completed_at) {
      response.status(409).json({ status: "completed" });
      return;
    }

    response.status(200).json({ status: "ready" });
    return;
  }

  const body = request.body as Record<string, unknown> | undefined;
  if (typeof body?.website === "string" && body.website.trim()) {
    response.status(200).json({ ok: true });
    return;
  }

  const token = normalizeSurveyToken(body?.token);
  if (!token) {
    response.status(400).json({ message: "Este enlace no es válido." });
    return;
  }

  const answers = parseSurveyAnswers(body);
  if (typeof answers === "string") {
    response.status(400).json({ message: answers });
    return;
  }

  const waitlist = await findWaitlistByToken(token);
  if (!waitlist) {
    response.status(404).json({ message: "Este enlace no es válido." });
    return;
  }

  if (waitlist.survey_completed_at) {
    response.status(409).json({ message: "Ya respondiste esta encuesta." });
    return;
  }

  const supabase = createServiceClient();
  if (!supabase) {
    response.status(503).json({ message: "La encuesta todavía no está configurada." });
    return;
  }

  const completedAt = new Date().toISOString();
  const { error: insertError } = await supabase.from("survey_responses").insert({
    waitlist_id: waitlist.id,
    hackathon_format: answers.hackathonFormat,
    country: answers.country,
    challenge_type: answers.challengeType,
    learning_formats: answers.learningFormats,
    build_learn_balance: answers.buildLearnBalance,
    competitions: answers.competitions,
    motivations: answers.motivations,
    year_round_events: answers.yearRoundEvents,
    feedback: answers.feedback || null,
  });

  if (insertError?.code === "23505") {
    await supabase
      .from("waitlist")
      .update({ survey_completed_at: completedAt })
      .eq("id", waitlist.id)
      .is("survey_completed_at", null);
    response.status(409).json({ message: "Ya respondiste esta encuesta." });
    return;
  }

  if (insertError) {
    response.status(500).json({ message: "No pudimos guardar tus respuestas." });
    return;
  }

  const { error: updateError } = await supabase
    .from("waitlist")
    .update({ survey_completed_at: completedAt })
    .eq("id", waitlist.id);

  if (updateError) {
    response.status(500).json({ message: "No pudimos confirmar tu respuesta." });
    return;
  }

  response.status(201).json({ ok: true });
}
