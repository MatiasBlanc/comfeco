export const HACKATHON_FORMATS = [
  { value: "online", label: "Online" },
  { value: "presencial", label: "Presencial" },
  { value: "hibrido", label: "Híbrido" },
] as const;

export const CHALLENGE_TYPES = [
  { value: "producto", label: "Producto / app" },
  { value: "open_source", label: "Open source" },
  { value: "impacto_social", label: "Impacto social" },
  { value: "ai_datos", label: "AI / datos" },
  { value: "diseno", label: "Diseño / UX" },
  { value: "abierto", label: "Challenge abierto" },
] as const;

export const LEARNING_FORMATS = [
  { value: "workshops", label: "Workshops prácticos" },
  { value: "charlas", label: "Charlas" },
  { value: "mentorias", label: "Mentorías" },
  { value: "live_coding", label: "Live coding" },
  { value: "office_hours", label: "Office hours" },
] as const;

export const COMPETITIONS = [
  { value: "hackathon", label: "Hackathon principal" },
  { value: "mini_challenges", label: "Mini challenges" },
  { value: "design_challenge", label: "Design challenge" },
  { value: "demo_day", label: "Demo day / pitch" },
  { value: "sin_competencia", label: "Prefiero construir sin competencia" },
] as const;

export const MOTIVATIONS = [
  { value: "aprender", label: "Aprender" },
  { value: "construir", label: "Construir un proyecto" },
  { value: "conocer_gente", label: "Conocer gente de tech" },
  { value: "encontrar_equipo", label: "Encontrar equipo" },
  { value: "premios", label: "Premios" },
  { value: "comunidad", label: "Aportar a la comunidad" },
] as const;

export const YEAR_ROUND_EVENTS = [
  { value: "meetups", label: "Meetups" },
  { value: "workshops", label: "Workshops" },
  { value: "hackathons_cortos", label: "Hackathons cortos" },
  { value: "mentorias", label: "Mentorías" },
  { value: "comunidad_online", label: "Comunidad online" },
  { value: "solo_evento", label: "Solo el evento principal" },
] as const;

export const BUILD_LEARN_MIN = 1;
export const BUILD_LEARN_MAX = 5;
export const MAX_FEEDBACK_LENGTH = 1000;
export const SURVEY_TOKEN_PATTERN = /^[a-f0-9]{64}$/;

export type HackathonFormat = (typeof HACKATHON_FORMATS)[number]["value"];
export type ChallengeType = (typeof CHALLENGE_TYPES)[number]["value"];
export type LearningFormat = (typeof LEARNING_FORMATS)[number]["value"];
export type Competition = (typeof COMPETITIONS)[number]["value"];
export type Motivation = (typeof MOTIVATIONS)[number]["value"];
export type YearRoundEvent = (typeof YEAR_ROUND_EVENTS)[number]["value"];

export interface SurveyAnswers {
  hackathonFormat: HackathonFormat;
  challengeType: ChallengeType;
  learningFormats: LearningFormat[];
  buildLearnBalance: number;
  competitions: Competition[];
  motivations: Motivation[];
  yearRoundEvents: YearRoundEvent[];
  feedback: string;
}

/**
 * Normaliza el token de la encuesta a 64 caracteres hexadecimales.
 *
 * @param value - Token crudo recibido por query o body.
 * @returns Token en minúsculas o cadena vacía si el formato no es válido.
 */
export function normalizeSurveyToken(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const token = value.trim().toLowerCase();
  return SURVEY_TOKEN_PATTERN.test(token) ? token : "";
}

/**
 * Lee el token de discovery desde el query string de la página.
 *
 * @param search - `window.location.search`.
 * @returns Token válido o cadena vacía.
 */
export function readSurveyToken(search: string): string {
  return normalizeSurveyToken(new URLSearchParams(search).get("token"));
}

function readAllowedValue<T extends string>(
  value: unknown,
  options: readonly { value: T }[],
): T | null {
  if (typeof value !== "string") {
    return null;
  }

  return options.some((option) => option.value === value) ? (value as T) : null;
}

function readAllowedValues<T extends string>(
  value: unknown,
  options: readonly { value: T }[],
): T[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const uniqueValues = [
    ...new Set(
      value.filter((item): item is string => typeof item === "string"),
    ),
  ];
  const parsed = uniqueValues
    .map((item) => readAllowedValue(item, options))
    .filter((item): item is T => item !== null);

  if (parsed.length === 0 || parsed.length !== uniqueValues.length) {
    return null;
  }

  return parsed;
}

/**
 * Valida el payload de la encuesta en servidor y cliente.
 *
 * @param input - Cuerpo sin confiar todavía en su forma.
 * @returns Respuestas normalizadas o un mensaje de error en español.
 */
export function parseSurveyAnswers(input: unknown): SurveyAnswers | string {
  if (typeof input !== "object" || input === null) {
    return "Completa la encuesta para continuar.";
  }

  const body = input as Record<string, unknown>;
  const hackathonFormat = readAllowedValue(body.hackathonFormat, HACKATHON_FORMATS);
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
    typeof body.feedback === "string" ? body.feedback.trim().slice(0, MAX_FEEDBACK_LENGTH) : "";

  if (!hackathonFormat) {
    return "Elige un formato de hackathon.";
  }

  if (!challengeType) {
    return "Elige un tipo de challenge.";
  }

  if (!learningFormats) {
    return "Elige al menos una forma de aprender.";
  }

  if (
    !Number.isInteger(buildLearnBalance) ||
    buildLearnBalance < BUILD_LEARN_MIN ||
    buildLearnBalance > BUILD_LEARN_MAX
  ) {
    return "Indica el equilibrio entre aprender y construir.";
  }

  if (!competitions) {
    return "Elige al menos un tipo de competencia.";
  }

  if (!motivations) {
    return "Elige al menos una motivación.";
  }

  if (!yearRoundEvents) {
    return "Cuéntanos qué te gustaría durante el año.";
  }

  return {
    hackathonFormat,
    challengeType,
    learningFormats,
    buildLearnBalance,
    competitions,
    motivations,
    yearRoundEvents,
    feedback,
  };
}
