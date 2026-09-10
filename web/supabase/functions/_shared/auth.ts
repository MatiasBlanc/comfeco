const jsonHeaders = {
  "Content-Type": "application/json",
};

/**
 * Exige el secreto compartido para invocar las funciones de envío.
 *
 * @param request - Petición HTTP de la Edge Function.
 * @returns Respuesta 401/503 o null si la petición está autorizada.
 */
export function assertSendSecret(request: Request): Response | null {
  const secret = Deno.env.get("DISCOVERY_SEND_SECRET");
  if (!secret) {
    return new Response(
      JSON.stringify({ message: "Falta DISCOVERY_SEND_SECRET." }),
      { status: 503, headers: jsonHeaders },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token || token !== secret) {
    return new Response(JSON.stringify({ message: "No autorizado." }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  return null;
}

/**
 * Responde el preflight CORS de las funciones de envío.
 *
 * @param request - Petición HTTP recibida.
 * @returns Respuesta OPTIONS o null si no aplica.
 */
export function handleCors(request: Request): Response | null {
  if (request.method !== "OPTIONS") {
    return null;
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}
