import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

function loadEnv() {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
    }
  }
  return env;
}

const env = { ...loadEnv(), ...process.env };
const supabaseUrl = env.SUPABASE_URL;
const sendSecret = env.DISCOVERY_SEND_SECRET;

if (!supabaseUrl || !sendSecret) {
  console.error("❌ Faltan SUPABASE_URL o DISCOVERY_SEND_SECRET en el archivo .env");
  process.exit(1);
}

async function run() {
  console.log(`[${new Date().toISOString()}] Iniciando envío de encuestas a registrados pendientes...`);

  const endpoint = `${supabaseUrl.replace(/\/+$/, "")}/functions/v1/send-discovery-batch`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit: 50 }),
    });

    const data = await response.json();
    console.log(`Estado HTTP: ${response.status}`);
    console.log("Resultado del lote:", JSON.stringify(data, null, 2));

    if (!response.ok && response.status !== 207) {
      console.error("❌ Ocurrió un error en la ejecución del lote.");
      process.exit(1);
    }

    console.log(`✅ Proceso finalizado: ${data.sent ?? 0} enviados, ${data.skipped ?? 0} omitidos, ${data.failed ?? 0} fallidos.`);
  } catch (error) {
    console.error("❌ Error conectando a la función:", error);
    process.exit(1);
  }
}

run();
