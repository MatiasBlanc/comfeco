import { useState, type FormEvent, type JSX } from "react";

import {
  BUILD_LEARN_MAX,
  BUILD_LEARN_MIN,
  CHALLENGE_TYPES,
  COMPETITIONS,
  HACKATHON_FORMATS,
  LEARNING_FORMATS,
  MAX_FEEDBACK_LENGTH,
  MOTIVATIONS,
  YEAR_ROUND_EVENTS,
  parseSurveyAnswers,
} from "../data/survey";

interface SurveyFormProps {
  token: string;
  onSuccess: () => void;
}

const inputStyles =
  "w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base text-charcoal outline-none transition placeholder:text-charcoal/40 focus-visible:border-violet focus-visible:ring-3 focus-visible:ring-violet/25 disabled:cursor-not-allowed disabled:opacity-60";

const optionStyles =
  "flex cursor-pointer items-start gap-3 rounded-xl border border-charcoal/15 px-4 py-3 text-charcoal transition hover:border-violet/40 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-violet/25 has-[:checked]:border-violet has-[:checked]:bg-violet/5";

interface ApiResponse {
  message?: string;
}

/**
 * Alterna un valor dentro de un grupo de checkboxes.
 *
 * @param values - Selección actual.
 * @param value - Valor pulsado.
 * @returns Nueva selección sin duplicados.
 */
function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

/**
 * Formulario de discovery con las 8 preguntas, validación de cliente y
 * estados de carga y error.
 *
 * @param token - Token opaco ya validado en servidor.
 * @param onSuccess - Callback al guardar las respuestas.
 * @returns Formulario accesible mobile-first.
 */
export default function SurveyForm({
  token,
  onSuccess,
}: SurveyFormProps): JSX.Element {
  const [hackathonFormat, setHackathonFormat] = useState("");
  const [challengeType, setChallengeType] = useState("");
  const [learningFormats, setLearningFormats] = useState<string[]>([]);
  const [buildLearnBalance, setBuildLearnBalance] = useState(3);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [motivations, setMotivations] = useState<string[]>([]);
  const [yearRoundEvents, setYearRoundEvents] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const parsed = parseSurveyAnswers({
      hackathonFormat,
      challengeType,
      learningFormats,
      buildLearnBalance,
      competitions,
      motivations,
      yearRoundEvents,
      feedback,
    });

    if (typeof parsed === "string") {
      setErrorMessage(parsed);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          website: formData.get("website"),
          ...parsed,
        }),
      });
      const data = (await response.json()) as ApiResponse;

      if (response.status === 409) {
        onSuccess();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos guardar tus respuestas.");
      }

      onSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Algo salió mal. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="relative flex flex-col gap-8" onSubmit={handleSubmit}>
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-base font-semibold text-charcoal">
          ¿Qué formato te convence más para la hackathon?
        </legend>
        {HACKATHON_FORMATS.map((option) => (
          <label key={option.value} className={optionStyles}>
            <input
              type="radio"
              name="hackathonFormat"
              value={option.value}
              checked={hackathonFormat === option.value}
              onChange={() => setHackathonFormat(option.value)}
              required
              disabled={isSubmitting}
              className="mt-1"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-base font-semibold text-charcoal">
          ¿Qué tipo de challenge te gustaría enfrentar?
        </legend>
        {CHALLENGE_TYPES.map((option) => (
          <label key={option.value} className={optionStyles}>
            <input
              type="radio"
              name="challengeType"
              value={option.value}
              checked={challengeType === option.value}
              onChange={() => setChallengeType(option.value)}
              required
              disabled={isSubmitting}
              className="mt-1"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-base font-semibold text-charcoal">
          ¿Cómo te gusta aprender en un evento como COMFECO?
        </legend>
        {LEARNING_FORMATS.map((option) => (
          <label key={option.value} className={optionStyles}>
            <input
              type="checkbox"
              name="learningFormats"
              value={option.value}
              checked={learningFormats.includes(option.value)}
              onChange={() =>
                setLearningFormats((current) => toggleValue(current, option.value))
              }
              disabled={isSubmitting}
              className="mt-1"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-base font-semibold text-charcoal">
          En el equilibrio entre aprender y construir, ¿dónde te gustaría que esté COMFECO?
        </legend>
        <label htmlFor="buildLearnBalance" className="text-sm text-charcoal/70">
          1 es más aprender, 5 es más construir.
        </label>
        <input
          id="buildLearnBalance"
          name="buildLearnBalance"
          type="range"
          min={BUILD_LEARN_MIN}
          max={BUILD_LEARN_MAX}
          step={1}
          value={buildLearnBalance}
          onChange={(event) => setBuildLearnBalance(Number(event.target.value))}
          disabled={isSubmitting}
          className="w-full accent-[#8F3FD1]"
        />
        <div className="flex justify-between text-sm text-charcoal/70">
          <span>Aprender</span>
          <span className="font-medium text-purple-deep">{buildLearnBalance}</span>
          <span>Construir</span>
        </div>
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-base font-semibold text-charcoal">
          ¿Qué tipo de competencias te motivan?
        </legend>
        {COMPETITIONS.map((option) => (
          <label key={option.value} className={optionStyles}>
            <input
              type="checkbox"
              name="competitions"
              value={option.value}
              checked={competitions.includes(option.value)}
              onChange={() =>
                setCompetitions((current) => toggleValue(current, option.value))
              }
              disabled={isSubmitting}
              className="mt-1"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-base font-semibold text-charcoal">
          ¿Por qué participarías en COMFECO?
        </legend>
        {MOTIVATIONS.map((option) => (
          <label key={option.value} className={optionStyles}>
            <input
              type="checkbox"
              name="motivations"
              value={option.value}
              checked={motivations.includes(option.value)}
              onChange={() =>
                setMotivations((current) => toggleValue(current, option.value))
              }
              disabled={isSubmitting}
              className="mt-1"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-base font-semibold text-charcoal">
          Además del evento principal, ¿qué te gustaría que existiera durante el año?
        </legend>
        {YEAR_ROUND_EVENTS.map((option) => (
          <label key={option.value} className={optionStyles}>
            <input
              type="checkbox"
              name="yearRoundEvents"
              value={option.value}
              checked={yearRoundEvents.includes(option.value)}
              onChange={() =>
                setYearRoundEvents((current) => toggleValue(current, option.value))
              }
              disabled={isSubmitting}
              className="mt-1"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="feedback" className="text-base font-semibold text-charcoal">
          ¿Algo más que debamos tener en cuenta?
        </label>
        <textarea
          id="feedback"
          name="feedback"
          rows={4}
          maxLength={MAX_FEEDBACK_LENGTH}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          disabled={isSubmitting}
          placeholder="Opcional. Cuéntanos lo que quieras."
          className={`${inputStyles} resize-y`}
        />
      </div>

      <input
        className="absolute -left-[10000px]"
        name="website"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-13 cursor-pointer items-center justify-center rounded-xl border border-gold bg-gold px-8 py-3.5 font-display text-2xl font-bold tracking-wide text-charcoal outline-none transition hover:-translate-y-0.5 hover:bg-yellow focus-visible:ring-3 focus-visible:ring-gold/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar respuestas"}
      </button>

      {errorMessage ? (
        <p className="m-0 text-sm font-medium text-magenta" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
