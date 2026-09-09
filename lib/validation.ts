export const PROFILE_OPTIONS = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "AI / ML",
  "Data",
  "DevOps / Cloud",
  "Cybersecurity",
  "Game Dev",
  "Design",
  "Product",
  "Estudiante",
  "Otro",
] as const;

export const INTEREST_OPTIONS = [
  "Competir en una hackathon",
  "Conferencias",
  "Workshops",
  "Mentorías",
  "Networking",
  "Comunidad",
  "Ser speaker",
  "Ser mentor",
  "Ser jurado",
  "Ayudar como voluntario",
] as const;

export const TEAM_OPTIONS = [
  "Ya tengo equipo",
  "Buscaría equipo",
  "Participaría solo",
  "No sé todavía",
  "No competiría",
] as const;

export const SOURCE_OPTIONS = [
  "X / Twitter",
  "Discord",
  "LinkedIn",
  "Instagram",
  "Comunidad",
  "Amigo",
  "COMFECO anterior",
  "Otro",
] as const;

export const COUNTRY_OPTIONS = [
  "Argentina",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
  "Otro",
] as const;

interface WaitlistPayload {
  name: string;
  email: string;
  country: string;
  profiles: string[];
  interests: string[];
  teamPreference: string | null;
  source: string | null;
  wishlist: string;
  wantsUpdates: boolean;
  website: string;
  startedAt: number;
}

export type ValidationResult =
  | { isValid: true; data: WaitlistPayload }
  | { isValid: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item): item is string => typeof item === "string"))];
}

function isAllowed(value: string, options: readonly string[]): boolean {
  return options.includes(value);
}

function areAllowed(values: string[], options: readonly string[]): boolean {
  return values.every((value) => isAllowed(value, options));
}

/**
 * Normaliza y valida la carga pública de la waitlist antes de persistirla.
 *
 * @param input - JSON sin confianza recibido por el route handler.
 * @returns Resultado discriminado con datos limpios o un mensaje seguro.
 */
export function validateWaitlistPayload(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { isValid: false, message: "No pudimos leer el formulario." };
  }

  const body = input as Record<string, unknown>;
  const name = getTrimmedString(body.name);
  const email = getTrimmedString(body.email).toLowerCase();
  const country = getTrimmedString(body.country);
  const profiles = getStringArray(body.profiles);
  const interests = getStringArray(body.interests);
  const teamPreference = getTrimmedString(body.teamPreference) || null;
  const source = getTrimmedString(body.source) || null;
  const wishlist = getTrimmedString(body.wishlist);
  const website = getTrimmedString(body.website);
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  const elapsedTime = Date.now() - startedAt;

  if (website) {
    return {
      isValid: true,
      data: {
        name: "",
        email: "",
        country: "",
        profiles: [],
        interests: [],
        teamPreference: null,
        source: null,
        wishlist: "",
        wantsUpdates: false,
        website,
        startedAt,
      },
    };
  }

  if (elapsedTime < 500 || elapsedTime > 86_400_000) {
    return { isValid: false, message: "Actualiza la página e inténtalo otra vez." };
  }

  if (name.length < 2 || name.length > 100) {
    return { isValid: false, message: "Escribe un nombre válido (máximo 100 caracteres)." };
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { isValid: false, message: "Escribe un email válido." };
  }

  if (!isAllowed(country, COUNTRY_OPTIONS)) {
    return { isValid: false, message: "Selecciona tu país." };
  }

  if (profiles.length === 0 || !areAllowed(profiles, PROFILE_OPTIONS)) {
    return { isValid: false, message: "Selecciona al menos un perfil tech." };
  }

  if (interests.length === 0 || !areAllowed(interests, INTEREST_OPTIONS)) {
    return { isValid: false, message: "Cuéntanos qué te interesa de COMFECO." };
  }

  if (wishlist.length < 10 || wishlist.length > 1_000) {
    return {
      isValid: false,
      message: "Cuéntanos un poco más (entre 10 y 1.000 caracteres).",
    };
  }

  if (teamPreference && !isAllowed(teamPreference, TEAM_OPTIONS)) {
    return { isValid: false, message: "La preferencia de equipo no es válida." };
  }

  if (source && !isAllowed(source, SOURCE_OPTIONS)) {
    return { isValid: false, message: "La fuente seleccionada no es válida." };
  }

  return {
    isValid: true,
    data: {
      name,
      email,
      country,
      profiles,
      interests,
      teamPreference,
      source,
      wishlist,
      wantsUpdates: body.wantsUpdates === true,
      website,
      startedAt,
    },
  };
}
