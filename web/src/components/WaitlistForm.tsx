import { useState, type FormEvent, type JSX } from "react";

interface ApiResponse {
  message?: string;
}

const PROFILES = [
  "Frontend",
  "Backend",
  "Full stack",
  "Mobile",
  "Data / AI",
  "DevOps / Cloud",
  "Ciberseguridad",
  "Diseño",
  "Producto",
  "Otro",
] as const;

const INTERESTS = [
  "Hackathons",
  "Workshops",
  "Charlas",
  "Mentorías",
  "Networking",
  "Comunidad",
] as const;

const inputStyles =
  "w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base text-charcoal outline-none transition placeholder:text-charcoal/40 focus-visible:border-violet focus-visible:ring-3 focus-visible:ring-violet/25 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Formulario de la waitlist con validación de cliente y estados de carga,
 * éxito, error y correo duplicado.
 *
 * @returns Formulario accesible de registro a la waitlist.
 */
export default function WaitlistForm(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          country: formData.get("country"),
          profile: formData.get("profile"),
          interests: formData.getAll("interests"),
          feedback: formData.get("feedback"),
          website: formData.get("website"),
        }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        if (response.status === 409) {
          setIsDuplicate(true);
          return;
        }
        throw new Error(data.message ?? "No pudimos guardar tu correo.");
      }

      setIsSubmitted(true);
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

  if (isSubmitted) {
    return (
      <div
        className="rounded-2xl border border-violet/30 bg-violet/5 p-8 text-center"
        role="status"
      >
        <h3 className="m-0 font-display text-3xl font-extrabold tracking-tight text-purple-deep">
          Estás dentro.
        </h3>
        <p className="mt-3 text-charcoal/80">
          Gracias por ayudarnos a construir COMFECO. Te avisaremos cuando
          tengamos novedades.
        </p>
      </div>
    );
  }

  if (isDuplicate) {
    return (
      <div
        className="rounded-2xl border border-gold/50 bg-gold/10 p-8 text-center"
        role="status"
      >
        <h3 className="m-0 font-display text-3xl font-extrabold tracking-tight text-purple-deep">
          Ya estás en la waitlist 💜
        </h3>
      </div>
    );
  }

  return (
    <form className="relative flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-charcoal">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            required
            disabled={isSubmitting}
            placeholder="Tu nombre"
            className={inputStyles}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            required
            disabled={isSubmitting}
            placeholder="tu@email.com"
            className={inputStyles}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className="text-sm font-medium text-charcoal">
            País
          </label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            maxLength={80}
            required
            disabled={isSubmitting}
            placeholder="Ej: Chile"
            className={inputStyles}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile" className="text-sm font-medium text-charcoal">
            Perfil
          </label>
          <select
            id="profile"
            name="profile"
            required
            disabled={isSubmitting}
            defaultValue=""
            className={`${inputStyles} appearance-none`}
          >
            <option value="" disabled>
              Elige tu perfil
            </option>
            {PROFILES.map((profile) => (
              <option key={profile} value={profile}>
                {profile}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-charcoal">
          ¿Qué te interesa?
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <label
              key={interest}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-charcoal/20 bg-white px-4 py-2 text-sm text-charcoal transition has-checked:border-violet has-checked:bg-violet/10 has-checked:text-purple-deep has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-violet/25"
            >
              <input
                type="checkbox"
                name="interests"
                value={interest}
                disabled={isSubmitting}
                className="sr-only"
              />
              {interest}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="feedback" className="text-sm font-medium text-charcoal">
          ¿Qué te gustaría encontrar en COMFECO?
        </label>
        <textarea
          id="feedback"
          name="feedback"
          rows={3}
          maxLength={1000}
          disabled={isSubmitting}
          placeholder="Cuéntanos qué haría que realmente quieras participar."
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
        className="mt-1 inline-flex min-h-13 cursor-pointer items-center justify-center rounded-xl border border-gold bg-gold px-8 py-3.5 font-display text-2xl font-bold tracking-wide text-charcoal outline-none transition hover:-translate-y-0.5 hover:bg-yellow focus-visible:ring-3 focus-visible:ring-violet disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Entrando a la waitlist..." : "Quiero estar en COMFECO"}
      </button>

      {errorMessage && (
        <p className="m-0 text-sm font-medium text-magenta" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
