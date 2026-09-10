import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.99.1";

export interface WaitlistEmailRow {
  id: string;
  email: string;
  survey_token: string | null;
  survey_sent_at: string | null;
  survey_completed_at: string | null;
}

export interface SendSurveyResult {
  waitlistId: string;
  email?: string;
  sent: boolean;
  skipped?: string;
  error?: string;
}

interface SurveyEmailContent {
  subject: string;
  html: string;
  text: string;
}

/**
 * Crea el cliente de servicio para leer waitlist y marcar envíos.
 *
 * @returns Cliente de Supabase con service role.
 * @throws Si faltan las variables inyectadas por Supabase.
 */
export function createServiceClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Faltan credenciales de Supabase.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Genera un token hexadecimal de 32 bytes para la encuesta.
 *
 * @returns Token opaco de 64 caracteres.
 */
export function createSurveyToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

/**
 * Construye el correo simple de discovery de COMFECO.
 *
 * @param surveyUrl - URL absoluta `/survey?token=...`.
 * @returns Asunto, HTML y texto plano.
 */
export function buildSurveyEmail(surveyUrl: string): SurveyEmailContent {
  const subject = "COMFECO está volviendo — ¿Cómo te gustaría participar?";
  const text = [
    "COMFECO está volviendo.",
    "",
    "Queremos diseñar esta nueva etapa junto a la comunidad.",
    "",
    "¿En qué formato te gustaría participar en la próxima hackathon?",
    `- 100% Online: ${surveyUrl}&format=online`,
    `- Presencial: ${surveyUrl}&format=presencial`,
    `- Híbrido: ${surveyUrl}&format=hibrido`,
    "",
    `O abre la encuesta completa: ${surveyUrl}`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:0;background:#F7F5F8;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 12px;color:#F0B500;font-size:12px;font-weight:bold;letter-spacing:0.2em;">COMMUNITY FEST AND CODE</p>
                <h1 style="margin:0 0 16px;color:#46146F;font-size:26px;line-height:1.2;">COMFECO está volviendo.</h1>
                <p style="margin:0 0 16px;color:#2F2F33;font-size:16px;line-height:1.5;">Queremos diseñar esta nueva etapa junto a la comunidad. Ayúdanos respondiendo la primera pregunta con 1 clic:</p>
                <p style="margin:0 0 14px;color:#46146F;font-size:17px;font-weight:bold;">¿En qué formato te gustaría participar en la hackathon?</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="padding:5px 0;">
                      <a href="${surveyUrl}&format=online" style="display:block;background:#F7F5F8;border:2px solid #5E239E;color:#2F2F33;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:bold;font-size:15px;text-align:left;">
                        🌐 &nbsp; 100% Online
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;">
                      <a href="${surveyUrl}&format=presencial" style="display:block;background:#F7F5F8;border:2px solid #5E239E;color:#2F2F33;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:bold;font-size:15px;text-align:left;">
                        📍 &nbsp; Presencial
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;">
                      <a href="${surveyUrl}&format=hibrido" style="display:block;background:#F7F5F8;border:2px solid #5E239E;color:#2F2F33;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:bold;font-size:15px;text-align:left;">
                        🔀 &nbsp; Híbrido (charlas online + cierre presencial)
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0;color:#666666;font-size:13px;line-height:1.4;">Al hacer clic se registrará tu preferencia y podrás responder 2 o 3 preguntas breves más para afinar los detalles.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}

/**
 * Envía la encuesta de discovery a una persona de la waitlist y solo marca
 * `survey_sent_at` si Resend confirma el envío.
 *
 * @param waitlistId - UUID de la fila en `waitlist`.
 * @returns Resultado del intento, sin lanzar en fallos de negocio.
 */
export async function sendSurveyEmail(waitlistId: string): Promise<SendSurveyResult> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendFrom = Deno.env.get("RESEND_FROM");
  const siteUrl = (Deno.env.get("SITE_URL") ?? "").replace(/\/+$/, "");

  if (!resendApiKey || !resendFrom || !siteUrl) {
    return {
      waitlistId,
      sent: false,
      error: "Faltan RESEND_API_KEY, RESEND_FROM o SITE_URL.",
    };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("id, email, survey_token, survey_sent_at, survey_completed_at")
    .eq("id", waitlistId)
    .maybeSingle();

  if (error) {
    console.error(JSON.stringify({ waitlistId, error: error.message }));
    return { waitlistId, sent: false, error: "No pudimos leer la waitlist." };
  }

  const row = data as WaitlistEmailRow | null;
  if (!row) {
    return { waitlistId, sent: false, error: "No encontramos a esa persona." };
  }

  if (row.survey_completed_at) {
    return {
      waitlistId,
      email: row.email,
      sent: false,
      skipped: "already_completed",
    };
  }

  if (row.survey_sent_at) {
    return {
      waitlistId,
      email: row.email,
      sent: false,
      skipped: "already_sent",
    };
  }

  let surveyToken = row.survey_token;
  if (!surveyToken) {
    surveyToken = createSurveyToken();
    const { error: tokenError } = await supabase
      .from("waitlist")
      .update({ survey_token: surveyToken })
      .eq("id", row.id);

    if (tokenError) {
      console.error(JSON.stringify({ waitlistId, error: tokenError.message }));
      return {
        waitlistId,
        email: row.email,
        sent: false,
        error: "No pudimos generar el token de la encuesta.",
      };
    }
  }

  const surveyUrl = `${siteUrl}/survey?token=${surveyToken}`;
  const email = buildSurveyEmail(surveyUrl);
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [row.email],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();
    console.error(
      JSON.stringify({
        waitlistId,
        email: row.email,
        status: resendResponse.status,
        error: resendError,
      }),
    );
    return {
      waitlistId,
      email: row.email,
      sent: false,
      error: `Resend no pudo enviar el correo (${resendResponse.status}).`,
    };
  }

  const sentAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("waitlist")
    .update({ survey_sent_at: sentAt })
    .eq("id", row.id)
    .is("survey_sent_at", null);

  if (updateError) {
    console.error(JSON.stringify({ waitlistId, error: updateError.message }));
    return {
      waitlistId,
      email: row.email,
      sent: false,
      error: "El correo salió, pero no pudimos marcar el envío.",
    };
  }

  return { waitlistId, email: row.email, sent: true };
}
