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

interface PulseResponse {
  message?: string;
  summary?: WaitlistSummary;
}

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
 * Página privada `/pulse` con métricas básicas de waitlist y discovery.
 *
 * @returns Gate de contraseña o el tablero de métricas.
 */
export default function PulsePage(): JSX.Element {
  const [summary, setSummary] = useState<WaitlistSummary | null>(null);
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
    </SimpleLayout>
  );
}
