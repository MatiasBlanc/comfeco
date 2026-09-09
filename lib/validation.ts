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
  email: string;
  website: string;
}

export type ValidationResult =
  | { isValid: true; data: WaitlistPayload }
  | { isValid: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Normaliza y valida el correo enviado desde la waitlist pública.
 *
 * @param input - JSON sin confianza recibido por el route handler.
 * @returns Resultado discriminado con el correo normalizado o un mensaje seguro.
 */
export function validateWaitlistPayload(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { isValid: false, message: "No pudimos leer el formulario." };
  }

  const body = input as Record<string, unknown>;
  const email = getTrimmedString(body.email).toLowerCase();
  const website = getTrimmedString(body.website);

  if (website) {
    return { isValid: true, data: { email: "", website } };
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { isValid: false, message: "Escribe un email válido." };
  }

  return { isValid: true, data: { email, website } };
}
