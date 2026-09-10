import { useEffect, useMemo, useState, type FormEvent, type JSX } from "react";

import SimpleLayout from "../components/SimpleLayout";
import {
  CHALLENGE_TYPES,
  COMPETITIONS,
  HACKATHON_FORMATS,
  LEARNING_FORMATS,
  MOTIVATIONS,
  YEAR_ROUND_EVENTS,
} from "../data/survey";

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
  learning_formats: Record<string, number> | null;
  competitions: Record<string, number> | null;
  motivations: Record<string, number> | null;
  year_round_events: Record<string, number> | null;
  recent_feedback: Array<{ feedback: string; created_at: string }> | null;
}

export interface SurveyResponseDetails {
  id?: string;
  waitlist_id?: string;
  hackathon_format?: string;
  country?: string | null;
  challenge_type?: string;
  learning_formats?: string[];
  build_learn_balance?: number;
  competitions?: string[];
  motivations?: string[];
  year_round_events?: string[];
  feedback?: string | null;
  created_at?: string;
}

export interface RegistrationItem {
  id: string;
  email: string;
  created_at: string;
  survey_sent_at: string | null;
  survey_completed_at: string | null;
  response: SurveyResponseDetails | null;
}

interface PulseResponse {
  message?: string;
  summary?: WaitlistSummary;
  survey?: SurveySummary | null;
  registrations?: RegistrationItem[];
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

const CHALLENGE_LABELS: Record<string, string> = Object.fromEntries(
  CHALLENGE_TYPES.map((c) => [c.value, c.label]),
);
const COMPETITION_LABELS: Record<string, string> = Object.fromEntries(
  COMPETITIONS.map((c) => [c.value, c.label]),
);
const FORMAT_LABELS: Record<string, string> = Object.fromEntries(
  HACKATHON_FORMATS.map((f) => [f.value, f.label]),
);
const LEARNING_LABELS: Record<string, string> = Object.fromEntries(
  LEARNING_FORMATS.map((l) => [l.value, l.label]),
);
const MOTIVATION_LABELS: Record<string, string> = Object.fromEntries(
  MOTIVATIONS.map((m) => [m.value, m.label]),
);
const YEAR_ROUND_LABELS: Record<string, string> = Object.fromEntries(
  YEAR_ROUND_EVENTS.map((y) => [y.value, y.label]),
);

const METRICS: { key: keyof WaitlistSummary; label: string; suffix?: string }[] = [
  { key: "waitlist", label: "Waitlist total" },
  { key: "today", label: "Nuevos hoy" },
  { key: "last_7_days", label: "Últimos 7 días" },
  { key: "survey_sent", label: "Encuestas enviadas" },
  { key: "survey_completed", label: "Encuestas respondidas" },
  { key: "response_rate", label: "Tasa de respuesta", suffix: "%" },
];

const inputStyles =
  "w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base text-charcoal outline-none transition placeholder:text-charcoal/40 focus-visible:border-violet focus-visible:ring-3 focus-visible:ring-violet/25 disabled:cursor-not-allowed disabled:opacity-60";

async function fetchPulse(
  password?: string,
): Promise<PulseResponse & { ok: boolean; status: number }> {
  const response = await fetch("/api/pulse", {
    method: password ? "POST" : "GET",
    headers: password ? { "Content-Type": "application/json" } : undefined,
    body: password ? JSON.stringify({ password }) : undefined,
  });
  const data = (await response.json()) as PulseResponse;
  return { ...data, ok: response.ok, status: response.status };
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

interface BreakdownItem {
  key: string;
  label: string;
  count: number;
  percentage: number;
  flag?: string;
}

function buildBreakdown(
  data: Record<string, number> | null | undefined,
  labelMap?: Record<string, string>,
  flagMap?: Record<string, string>,
): BreakdownItem[] {
  if (!data) return [];
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  if (total === 0) return [];

  return Object.entries(data)
    .map(([key, count]) => ({
      key,
      label: labelMap?.[key] ?? key,
      count,
      percentage: Math.round((count / total) * 100),
      flag: flagMap?.[key],
    }))
    .sort((a, b) => b.count - a.count);
}

function BreakdownCard({
  title,
  subtitle,
  items,
  badgeText,
  gradient = "from-violet to-purple-deep",
}: {
  title: string;
  subtitle: string;
  items: BreakdownItem[];
  badgeText?: string;
  gradient?: string;
}): JSX.Element {
  const totalCount = items.reduce((acc, i) => acc + i.count, 0);

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-1 border-b border-charcoal/10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-charcoal">{title}</h3>
            {badgeText ? (
              <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-xs font-semibold text-violet">
                {badgeText}
              </span>
            ) : null}
          </div>
          <span className="font-mono text-xs font-bold text-charcoal/50">
            {totalCount} {totalCount === 1 ? "voto" : "votos"}
          </span>
        </div>
        <p className="text-xs text-charcoal/60">{subtitle}</p>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-charcoal/50">
          Aún no hay respuestas registradas para esta pregunta.
        </p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-charcoal/5">
          {items.map((item, idx) => (
            <div key={item.key} className="py-2.5 group">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-xs font-bold text-charcoal/30 text-right">
                    #{idx + 1}
                  </span>
                  {item.flag ? (
                    <span className="text-base leading-none" role="img" aria-label={item.label}>
                      {item.flag}
                    </span>
                  ) : null}
                  <span className="font-medium text-charcoal group-hover:text-purple-deep transition-colors">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-charcoal/50">
                    {item.count} {item.count === 1 ? "persona" : "personas"}
                  </span>
                  <span className="w-10 text-right font-mono text-xs font-bold text-charcoal">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                  style={{ width: `${Math.max(item.percentage, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PulsePage(): JSX.Element {
  const [summary, setSummary] = useState<WaitlistSummary | null>(null);
  const [survey, setSurvey] = useState<SurveySummary | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "sent" | "pending">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    document.title = "Pulse — COMFECO";
  }, []);

  useEffect(() => {
    const loadPulse = async () => {
      try {
        const data = await fetchPulse();
        if (data.ok && data.summary) {
          setSummary(data.summary);
          setSurvey(data.survey ?? null);
          setRegistrations(data.registrations ?? []);
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
      setRegistrations(data.registrations ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No pudimos abrir Pulse.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch = reg.email.toLowerCase().includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;

      if (statusFilter === "completed") {
        return !!reg.survey_completed_at;
      }
      if (statusFilter === "sent") {
        return !!reg.survey_sent_at && !reg.survey_completed_at;
      }
      if (statusFilter === "pending") {
        return !reg.survey_sent_at && !reg.survey_completed_at;
      }
      return true;
    });
  }, [registrations, searchQuery, statusFilter]);

  const handleCopyEmails = () => {
    const emails = filteredRegistrations.map((r) => r.email).join(", ");
    void navigator.clipboard.writeText(emails);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleExportCsv = () => {
    const headers = [
      "Email",
      "Fecha Registro",
      "Encuesta Enviada",
      "Encuesta Respondida",
      "País",
      "Modalidad Hackathon",
      "Tipo Challenge",
      "Balance Aprender/Construir",
      "Formas de Aprender",
      "Competencias",
      "Motivaciones",
      "Eventos Durante Año",
      "Feedback",
    ];

    const rows = registrations.map((r) => [
      `"${r.email}"`,
      `"${r.created_at}"`,
      `"${r.survey_sent_at ?? ""}"`,
      `"${r.survey_completed_at ?? ""}"`,
      `"${r.response?.country ?? ""}"`,
      `"${FORMAT_LABELS[r.response?.hackathon_format ?? ""] ?? r.response?.hackathon_format ?? ""}"`,
      `"${CHALLENGE_LABELS[r.response?.challenge_type ?? ""] ?? r.response?.challenge_type ?? ""}"`,
      `"${r.response?.build_learn_balance ?? ""}"`,
      `"${(r.response?.learning_formats ?? []).map((f) => LEARNING_LABELS[f] ?? f).join("; ")}"`,
      `"${(r.response?.competitions ?? []).map((c) => COMPETITION_LABELS[c] ?? c).join("; ")}"`,
      `"${(r.response?.motivations ?? []).map((m) => MOTIVATION_LABELS[m] ?? m).join("; ")}"`,
      `"${(r.response?.year_round_events ?? []).map((y) => YEAR_ROUND_LABELS[y] ?? y).join("; ")}"`,
      `"${(r.response?.feedback ?? "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `comfeco-pulse-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <SimpleLayout title="Pulse">
        <p className="m-0 text-charcoal/80" role="status">
          Cargando métricas de Pulse...
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

  // Desglose de cada métrica
  const countryList = buildBreakdown(survey?.countries, undefined, COUNTRY_FLAGS);
  const formatList = buildBreakdown(survey?.hackathon_formats, FORMAT_LABELS);
  const challengeList = buildBreakdown(survey?.challenge_types, CHALLENGE_LABELS);
  const learningList = buildBreakdown(survey?.learning_formats, LEARNING_LABELS);
  const competitionList = buildBreakdown(survey?.competitions, COMPETITION_LABELS);
  const motivationList = buildBreakdown(survey?.motivations, MOTIVATION_LABELS);
  const yearRoundList = buildBreakdown(survey?.year_round_events, YEAR_ROUND_LABELS);
  const recentFeedback = survey?.recent_feedback ?? [];

  const avgBalance = survey?.avg_build_learn_balance ?? 3;
  // Convert balance 1..5 to percentage: 1 -> 0%, 3 -> 50%, 5 -> 100%
  const balancePercentage = Math.round(((avgBalance - 1) / 4) * 100);

  return (
    <SimpleLayout
      title="Pulse"
      description="Tablero completo de métricas, respuestas de la comunidad y waitlist en tiempo real."
      maxWidth="max-w-6xl"
    >
      {/* 1. KPIs Generales */}
      <section aria-labelledby="kpis-heading">
        <h2 id="kpis-heading" className="sr-only">Métricas Generales</h2>
        <dl className="m-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map((metric) => (
            <div
              key={metric.key}
              className="rounded-2xl border border-charcoal/10 bg-violet/5 px-5 py-4 transition hover:border-violet/30"
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
      </section>

      {/* 2. Visualizador de Balance Aprender vs Construir */}
      <section className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-1 border-b border-charcoal/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-charcoal">
                Balance Aprender vs Construir
              </h2>
              <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-charcoal">
                Promedio: {avgBalance} / 5.0
              </span>
            </div>
            <p className="text-xs text-charcoal/60 mt-1">
              Preferencia de los encuestados entre absorber contenido vs programar proyectos prácticos.
            </p>
          </div>
          <div className="font-mono text-sm font-bold text-purple-deep">
            {balancePercentage > 50
              ? "Sesgo hacia Construir"
              : balancePercentage < 50
              ? "Sesgo hacia Aprender"
              : "50/50 Equilibrado"}
          </div>
        </div>

        <div className="mt-6 px-2">
          <div className="relative h-4 w-full rounded-full bg-charcoal/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet via-gold to-yellow transition-all duration-500"
              style={{ width: `${Math.max(balancePercentage, 5)}%` }}
            />
            {/* Indicador de posición */}
            <div
              className="absolute -top-1.5 -ml-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-purple-deep shadow-md transition-all duration-500"
              style={{ left: `${balancePercentage}%` }}
              title={`Promedio: ${avgBalance}`}
            >
              <span className="text-[10px] font-extrabold text-white">
                {avgBalance}
              </span>
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs font-medium text-charcoal/60">
            <span>🎓 1: 100% Charlas / Aprender</span>
            <span>⚖️ 3: Mitad y Mitad</span>
            <span>⚡ 5: 100% Hackathon / Construir</span>
          </div>
        </div>
      </section>

      {/* 3. Grid de Resultados de Discovery */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="font-display text-2xl font-bold text-charcoal">
            Resultados de la Encuesta de Discovery
          </h2>
          <p className="text-sm text-charcoal/60">
            Total de participantes que completaron el formulario:{" "}
            <strong className="text-purple-deep">{survey?.responses ?? 0}</strong>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Audiencia por País */}
          <BreakdownCard
            title="Audiencia por país"
            subtitle="Distribución geográfica de participantes según respuestas."
            items={countryList}
            badgeText="Geografía"
            gradient="from-violet to-purple-deep"
          />

          {/* Modalidad de Hackathon */}
          <BreakdownCard
            title="Modalidad preferida"
            subtitle="Online, presencial o híbrido."
            items={formatList}
            badgeText="Modalidad"
            gradient="from-gold to-yellow"
          />

          {/* Tipos de Challenge */}
          <BreakdownCard
            title="Tipo de reto preferido"
            subtitle="Categorías de proyectos que más motivan a los devs."
            items={challengeList}
            badgeText="Challenges"
            gradient="from-violet to-magenta"
          />

          {/* Formas de Aprender */}
          <BreakdownCard
            title="Formas de aprendizaje"
            subtitle="Cómo prefieren interactuar con speakers y mentores."
            items={learningList}
            badgeText="Educación"
            gradient="from-purple-deep to-violet"
          />

          {/* Formatos de Competencia */}
          <BreakdownCard
            title="Formatos de competencia"
            subtitle="Hackathons principales, mini-retos, demo days, etc."
            items={competitionList}
            badgeText="Competencia"
            gradient="from-gold to-yellow"
          />

          {/* Motivaciones */}
          <BreakdownCard
            title="Motivaciones principales"
            subtitle="Razones por las que deciden sumarse a COMFECO."
            items={motivationList}
            badgeText="Motivación"
            gradient="from-magenta to-violet"
          />

          {/* Eventos durante el año */}
          <div className="md:col-span-2">
            <BreakdownCard
              title="Actividades durante el año"
              subtitle="Qué tipo de dinámica continua les interesa entre eventos principales."
              items={yearRoundList}
              badgeText="Comunidad Anual"
              gradient="from-violet to-gold"
            />
          </div>
        </div>
      </section>

      {/* 4. Feedback & Sugerencias */}
      <section className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-xs">
        <div className="border-b border-charcoal/10 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-charcoal">
              Feedback y comentarios de la comunidad
            </h2>
            <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-xs font-semibold text-violet">
              {recentFeedback.length} {recentFeedback.length === 1 ? "mensaje" : "mensajes"}
            </span>
          </div>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Sugerencias, ideas y mensajes que los participantes dejaron en el campo abierto de la encuesta.
          </p>
        </div>

        {recentFeedback.length === 0 ? (
          <div className="py-8 text-center text-sm text-charcoal/50">
            Aún no se han enviado comentarios adicionales en las encuestas respondidas.
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {recentFeedback.map((item, idx) => (
              <blockquote
                key={idx}
                className="rounded-xl border-l-4 border-violet bg-violet/5 p-4 text-sm text-charcoal"
              >
                <p className="italic leading-relaxed">"{item.feedback}"</p>
                <cite className="mt-2 block text-xs not-italic text-charcoal/50">
                  {formatDate(item.created_at)}
                </cite>
              </blockquote>
            ))}
          </div>
        )}
      </section>

      {/* 5. Tabla Completa de Registrados en Waitlist */}
      <section className="mt-10 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-charcoal/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-charcoal">
                Registrados en Waitlist
              </h2>
              <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-xs font-semibold text-violet">
                {filteredRegistrations.length} de {registrations.length}
              </span>
            </div>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Listado completo de correos registrados, estado del envío de encuesta y respuestas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyEmails}
              disabled={filteredRegistrations.length === 0}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-xs font-semibold text-charcoal shadow-xs transition hover:bg-charcoal/5 disabled:opacity-50"
            >
              📋 {copiedSuccess ? "¡Copiados!" : "Copiar correos"}
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={registrations.length === 0}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gold bg-gold px-3.5 py-2 text-xs font-bold text-charcoal shadow-xs transition hover:bg-yellow disabled:opacity-50"
            >
              📥 Exportar CSV
            </button>
          </div>
        </div>

        {/* Filtros y Buscador */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Buscar por email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-charcoal/20 bg-white px-3.5 py-2 text-sm text-charcoal outline-none placeholder:text-charcoal/40 focus-visible:border-violet focus-visible:ring-2 focus-visible:ring-violet/20"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-charcoal/40 hover:text-charcoal"
              >
                ✕
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "all", label: "Todos" },
              { key: "completed", label: "Respondieron" },
              { key: "sent", label: "Enviados" },
              { key: "pending", label: "Pendientes" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === tab.key
                    ? "bg-purple-deep text-white"
                    : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Registro</th>
                <th className="py-3 px-2">Estado Encuesta</th>
                <th className="py-3 px-2">Detalle / Respuestas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-charcoal/50">
                    No se encontraron registros con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const hasResponse = !!item.response;

                  return (
                    <tr key={item.id} className="group hover:bg-violet/5 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs font-medium text-charcoal">
                        {item.email}
                      </td>
                      <td className="py-3 px-2 text-xs text-charcoal/60 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {item.survey_completed_at ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            🎯 Respondida
                          </span>
                        ) : item.survey_sent_at ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2.5 py-0.5 text-xs font-semibold text-violet">
                            ✉️ Enviada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/10 px-2.5 py-0.5 text-xs font-semibold text-charcoal/70">
                            ⏳ Pendiente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {hasResponse ? (
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-violet hover:text-purple-deep hover:underline"
                          >
                            {isExpanded ? "Ocultar respuestas ▲" : "Ver respuestas ▼"}
                          </button>
                        ) : (
                          <span className="text-xs text-charcoal/40">Sin respuestas</span>
                        )}

                        {isExpanded && item.response ? (
                          <div className="mt-3 rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm text-xs text-charcoal">
                            <h4 className="font-bold text-purple-deep mb-2">Respuestas de {item.email}:</h4>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <div>
                                <span className="font-semibold text-charcoal/70">País:</span>{" "}
                                {item.response.country ? (
                                  <>
                                    {COUNTRY_FLAGS[item.response.country] ?? ""}{" "}
                                    {item.response.country}
                                  </>
                                ) : (
                                  "No especificado"
                                )}
                              </div>
                              <div>
                                <span className="font-semibold text-charcoal/70">Modalidad:</span>{" "}
                                {FORMAT_LABELS[item.response.hackathon_format ?? ""] ??
                                  item.response.hackathon_format}
                              </div>
                              <div>
                                <span className="font-semibold text-charcoal/70">Tipo de reto:</span>{" "}
                                {CHALLENGE_LABELS[item.response.challenge_type ?? ""] ??
                                  item.response.challenge_type}
                              </div>
                              <div>
                                <span className="font-semibold text-charcoal/70">Balance:</span>{" "}
                                {item.response.build_learn_balance} / 5
                              </div>
                              <div className="sm:col-span-2">
                                <span className="font-semibold text-charcoal/70">Formas de aprender:</span>{" "}
                                {(item.response.learning_formats ?? [])
                                  .map((f) => LEARNING_LABELS[f] ?? f)
                                  .join(", ") || "-"}
                              </div>
                              <div className="sm:col-span-2">
                                <span className="font-semibold text-charcoal/70">Competencias:</span>{" "}
                                {(item.response.competitions ?? [])
                                  .map((c) => COMPETITION_LABELS[c] ?? c)
                                  .join(", ") || "-"}
                              </div>
                              <div className="sm:col-span-2">
                                <span className="font-semibold text-charcoal/70">Motivaciones:</span>{" "}
                                {(item.response.motivations ?? [])
                                  .map((m) => MOTIVATION_LABELS[m] ?? m)
                                  .join(", ") || "-"}
                              </div>
                              <div className="sm:col-span-2">
                                <span className="font-semibold text-charcoal/70">Eventos en el año:</span>{" "}
                                {(item.response.year_round_events ?? [])
                                  .map((y) => YEAR_ROUND_LABELS[y] ?? y)
                                  .join(", ") || "-"}
                              </div>
                              {item.response.feedback ? (
                                <div className="sm:col-span-2 mt-1 rounded bg-violet/5 p-2 italic">
                                  "{item.response.feedback}"
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </SimpleLayout>
  );
}
