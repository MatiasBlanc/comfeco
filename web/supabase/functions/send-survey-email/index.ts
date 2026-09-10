import { assertSendSecret, handleCors } from "../_shared/auth.ts";
import { sendSurveyEmail } from "../_shared/sendSurveyEmail.ts";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Envía la encuesta de discovery a una sola persona de la waitlist.
 *
 * Body: `{ "waitlist_id": "<uuid>" }`
 */
Deno.serve(async (request) => {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Método no permitido." }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const unauthorized = assertSendSecret(request);
  if (unauthorized) {
    return unauthorized;
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ message: "JSON inválido." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const waitlistId =
    typeof body.waitlist_id === "string" ? body.waitlist_id.trim() : "";
  if (!UUID_PATTERN.test(waitlistId)) {
    return new Response(JSON.stringify({ message: "waitlist_id inválido." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const result = await sendSurveyEmail(waitlistId);

  if (result.skipped === "already_sent" || result.skipped === "already_completed") {
    return new Response(
      JSON.stringify({
        message: "Ya se envió o ya se respondió esta encuesta.",
        result,
      }),
      { status: 409, headers: jsonHeaders },
    );
  }

  if (!result.sent) {
    return new Response(
      JSON.stringify({
        message: result.error ?? "No pudimos enviar el correo.",
        result,
      }),
      { status: 500, headers: jsonHeaders },
    );
  }

  return new Response(JSON.stringify({ ok: true, result }), {
    status: 200,
    headers: jsonHeaders,
  });
});
