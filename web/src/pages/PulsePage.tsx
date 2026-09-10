import { useEffect, useState, type FormEvent, type JSX } from "react";

import SimpleLayout from "../components/SimpleLayout";

interface WaitlistSummary {
  waitlist: number;
  today: number;
  last_7_days: number;
  survey_sent: number;
  survey_completed: number;
  response_rate: number;
}

interface SurveySummary {
  responses: number;
  avg_build_learn_balance: number;
  hackathon_formats: Record<string, number> | null;
  countries: Record<string, number> | null;
  challenge_types: Record<string, number> | null;
  competitions: Record<string, number> | null;
  motivations: Record<string, number> | null;
  year_round_events: Record<string, number> | null;
  recent_feedback: Array<{ feedback: string; created_at: string }> | null;
}

interface PulseResponse {
  message?: string;
  summary?: WaitlistSummary;
  survey?: SurveySummary | null;
}

const COUNTRY_FLAGS: Record<string, string> = {
  Argentina: "🇦🇷",
  Bolivia: "🇧🇴",
  Chile: "🇨🇱",
  Colombia: "🇨🇴",
  "Costa Rica": "🇨🇷",
  Cuba: "🇨🇺",
  Ecuador: "🇪🇨",
  "El Salvador": "🇸🇻",
  España: "🇪🇸",
  "Estados Unidos": "🇺🇸",
  Guatemala: "🇬🇹",
  Honduras: "🇭🇳",
  México: "🇲🇽",
  Nicaragua: "🇳🇮",
  Panamá: "🇵🇦",
  Paraguay: "🇵🇾",
  Perú: "🇵🇪",
  "Puerto Rico": "🇵🇷",
  "República Dominicana": "🇩🇴",
  Uruguay: "🇺🇾",
  Venezuela: "🇻🇪",
  Otro: "🌎",
  "No especificado": "❓",
};

const METRICS: { key: keyof WaitlistSummary; label: string; suffix?: string }[] = [
  { key: "waitlist", label: "Waitlist total" },
  { key: "today", label: "Nuevos hoy" },
  { key: "last_7_days", label: "Nuevos últimos 7 días" },
  { key: "survey_sent", label: "Encuestas enviadas" },
  { key: "survey_completed", label: "Encuestas respondidas" },
  { key: "response_rate", label: "Response rate", suffix: "%" },
];

const inputStyles =
  "w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base text-charcoal outline-none transition placeholder:text-charcoal/40 focus-visible:border-violet focus-visible:ring-3 focus-visible:ring-violet/25 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Carga el resumen de Pulse. Si hay cookie válida, no pide la contraseña.
 *
 * @param password - Contraseña opcional para el primer acceso.
 * @returns Resumen agregado o un error HTTP.
 */
async function fetchPulse(password?: string): Promise<PulseResponse & { ok: boolean; status: number }> {
  const response = await fetch("/api/pulse", {
    method: password ? "POST" : "GET",
    headers: password ? { "Content-Type": "application/json" } : undefined,
    body: password ? JSON.stringify({ password }) : undefined,
  });
  const data = (await response.json()) as PulseResponse;
  return { ...data, ok: response.ok, status: response.status };
}

/**
 * Página privada `/pulse` con métricas de waitlist y demografía de audiencia estilo Twitter.
 *
 * @returns Gate de contraseña o el tablero de métricas.
 */
export default function PulsePage(): JSX.Element {
  const [summary, setSummary] = useState<WaitlistSummary | null>(null);
  const [survey, setSurvey] = useState<SurveySummary | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Pulse COMFECO";
  }, []);

  useEffect(() => {
    const loadPulse = async () => {
      try {
        const data = await fetchPulse();
        if (data.ok && data.summary) {
          setSummary(data.summary);
          setSurvey(data.survey ?? null);
          return;
        }

        if (data.status !== 401) {
          setErrorMessage(data.message ?? "No pudimos cargar Pulse.");
        }
      } catch {
        setErrorMessage("No pudimos cargar Pulse.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPulse();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await fetchPulse(password);
      if (!data.ok || !data.summary) {
        throw new Error(data.message ?? "Contraseña incorrecta.");
      }

      setSummary(data.summary);
      setSurvey(data.survey ?? null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No pudimos abrir Pulse.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SimpleLayout title="Pulse">
        <p className="m-0 text-charcoal/80" role="status">
          Cargando Pulse...
        </p>
      </SimpleLayout>
    );
  }

  if (!summary) {
    return (
      <SimpleLayout
        title="Pulse"
        description="Métricas internas de waitlist y discovery."
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pulse-password" className="text-sm font-medium text-charcoal">
              Contraseña
            </label>
            <input
              id="pulse-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isSubmitting}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputStyles}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-13 cursor-pointer items-center justify-center rounded-xl border border-gold bg-gold px-8 py-3.5 font-display text-2xl font-bold tracking-wide text-charcoal outline-none transition hover:-translate-y-0.5 hover:bg-yellow focus-visible:ring-3 focus-visible:ring-gold/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
          {errorMessage ? (
            <p className="m-0 text-sm font-medium text-magenta" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </SimpleLayout>
    );
  }

  const countries = survey?.countries ?? {};
  const totalCountryResponses = Object.values(countries).reduce((acc, n) => acc + n, 0);
  const countryList = Object.entries(countries)
    .map(([country, count]) => {
      const percentage =
        totalCountryResponses > 0
          ? Math.round((count / totalCountryResponses) * 100)
          : 0;
      return { country, count, percentage };
    })
    .sort((a, b) => b.count - a.count);

  const formats = survey?.hackathon_formats ?? {};
  const totalFormatResponses = Object.values(formats).reduce((acc, n) => acc + n, 0);
  const formatList = Object.entries(formats)
    .map(([format, count]) => {
      const percentage =
        totalFormatResponses > 0
          ? Math.round((count / totalFormatResponses) * 100)
          : 0;
      return { format, count, percentage };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <SimpleLayout title="Pulse" description="Estado actual de la waitlist y la encuesta de discovery.">
      <dl className="m-0 grid gap-4 sm:grid-cols-2">
        {METRICS.map((metric) => (
          <div
            key={metric.key}
            className="rounded-2xl border border-charcoal/10 bg-violet/5 px-5 py-4"
          >
            <dt className="text-sm font-medium text-charcoal/70">{metric.label}</dt>
            <dd className="mt-2 font-display text-4xl font-extrabold tracking-tight text-purple-deep">
              {metric.suffix
                ? `${summary[metric.key]}${metric.suffix}`
                : summary[metric.key]}
            </dd>
          </div>
        ))}
      </dl>

      {/* Sección de Demografía / Audiencia por País — Estilo Twitter Analytics */}
      <section className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-charcoal/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-charcoal">
                Audiencia por país
              </h2>
              <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-xs font-semibold text-violet">
                Demografía Twitter-style
              </span>
            </div>
            <p className="text-sm text-charcoal/60 mt-0.5">
              Distribución geográfica de participantes basada en las respuestas de la encuesta.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">
              Total respuestas
            </span>
            <p className="font-display text-2xl font-extrabold text-purple-deep leading-none">
              {totalCountryResponses}
            </p>
          </div>
        </div>

        {countryList.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-2xl">
              🌎
            </div>
            <p className="font-medium text-charcoal">Aún no hay respuestas de países registradas</p>
            <p className="text-sm text-charcoal/60 mt-1 max-w-md mx-auto">
              Las estadísticas demográficas por país se actualizarán automáticamente a medida que los participantes respondan la encuesta.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col divide-y divide-charcoal/5">
            <div className="flex items-center justify-between pb-2 text-xs font-semibold uppercase tracking-wider text-charcoal/40">
              <span>Ranking / País</span>
              <span>Porcentaje y cantidad</span>
            </div>
            {countryList.map((item, index) => (
              <div key={item.country} className="py-3 group">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-xs font-bold text-charcoal/40 text-right">
                      #{index + 1}
                    </span>
                    <span className="text-lg leading-none" role="img" aria-label={item.country}>
                      {COUNTRY_FLAGS[item.country] ?? "🌐"}
                    </span>
                    <span className="font-semibold text-charcoal group-hover:text-purple-deep transition-colors">
                      {item.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-charcoal/60 font-medium">
                      {item.count} {item.count === 1 ? "persona" : "personas"}
                    </span>
                    <span className="w-12 text-right font-mono text-sm font-bold text-charcoal">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                {/* Barra de porcentaje estilo Twitter Analytics */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet to-purple-deep transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(item.percentage, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modalidad preferida */}
      {formatList.length > 0 ? (
        <section className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-xs">
          <div className="border-b border-charcoal/10 pb-4">
            <h2 className="font-display text-xl font-bold text-charcoal">
              Modalidad de hackathon preferida
            </h2>
            <p className="text-sm text-charcoal/60 mt-0.5">
              Online, presencial o híbrido según respuestas de la encuesta.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {formatList.map((item) => (
              <div key={item.format} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold capitalize text-charcoal">{item.format}</span>
                  <span className="font-mono text-sm font-bold text-charcoal">
                    {item.percentage}% ({item.count})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/5">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(item.percentage, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </SimpleLayout>
  );
}
