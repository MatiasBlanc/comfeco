interface WaitlistPayload {
  email: string;
  website: string;
}

export type ValidationResult =
  | { isValid: true; data: WaitlistPayload }
  | { isValid: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normaliza y valida el correo enviado desde la waitlist pública.
 *
 * @param input - JSON sin confianza recibido por la API.
 * @returns Correo normalizado o un mensaje de validación seguro.
 */
export function validateWaitlistPayload(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { isValid: false, message: "No pudimos leer el formulario." };
  }

  const body = input as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) {
    return { isValid: true, data: { email: "", website } };
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { isValid: false, message: "Escribe un email válido." };
  }

  return { isValid: true, data: { email, website } };
}
