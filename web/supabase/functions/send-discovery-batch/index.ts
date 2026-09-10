import { assertSendSecret, handleCors } from "../_shared/auth.ts";
import {
  createServiceClient,
  sendSurveyEmail,
  type SendSurveyResult,
  type WaitlistEmailRow,
} from "../_shared/sendSurveyEmail.ts";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const DEFAULT_BATCH_SIZE = 20;
const MAX_BATCH_SIZE = 50;

/**
 * Envía un lote pequeño de encuestas pendientes. Se ejecuta a mano.
 *
 * Body opcional: `{ "limit": 10 }`
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

  let limit = DEFAULT_BATCH_SIZE;
  if (request.headers.get("content-type")?.includes("application/json")) {
    try {
      const body = (await request.json()) as Record<string, unknown>;
      if (typeof body.limit === "number" && Number.isInteger(body.limit)) {
        limit = Math.min(Math.max(body.limit, 1), MAX_BATCH_SIZE);
      }
    } catch {
      return new Response(JSON.stringify({ message: "JSON inválido." }), {
        status: 400,
        headers: jsonHeaders,
      });
    }
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("id, email, survey_token, survey_sent_at, survey_completed_at")
    .is("survey_sent_at", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error(JSON.stringify({ error: error.message }));
    return new Response(
      JSON.stringify({ message: "No pudimos leer la waitlist." }),
      { status: 500, headers: jsonHeaders },
    );
  }

  const pending = (data ?? []) as WaitlistEmailRow[];
  const results: SendSurveyResult[] = [];
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of pending) {
    const result = await sendSurveyEmail(row.id);
    results.push(result);

    if (result.sent) {
      sent += 1;
      continue;
    }

    if (result.skipped) {
      skipped += 1;
      continue;
    }

    failed += 1;

    if (result.error?.includes("(429)")) {
      break;
    }
  }

  return new Response(
    JSON.stringify({
      ok: failed === 0,
      scanned: pending.length,
      sent,
      skipped,
      failed,
      results,
    }),
    { status: failed === 0 ? 200 : 207, headers: jsonHeaders },
  );
});
