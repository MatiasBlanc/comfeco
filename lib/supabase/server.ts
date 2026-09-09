import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Crea un cliente de Supabase exclusivamente para escritura desde el servidor.
 *
 * @returns Cliente autenticado con la service role.
 * @throws Error cuando faltan variables de entorno obligatorias.
 */
export function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Falta configurar la conexión privada con Supabase.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
