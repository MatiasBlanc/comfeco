import { useState, type FormEvent, type JSX } from "react";

interface ApiResponse {
  message?: string;
}

const inputStyles =
  "w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base text-charcoal outline-none transition placeholder:text-charcoal/40 focus-visible:border-violet focus-visible:ring-3 focus-visible:ring-violet/25 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Recoge el interés de empresas, comunidades y organizaciones para
 * conversar sobre partnerships.
 *
 * @returns Formulario accesible de contacto para sponsors.
 */
export default function SponsorForm(): JSX.Element {
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
      const response = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          organization: formData.get("organization"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        if (response.status === 409) {
          setIsDuplicate(true);
          return;
        }
        throw new Error(data.message ?? "No pudimos enviar tu mensaje.");
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
        className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center"
        role="status"
      >
        <h3 className="m-0 font-display text-3xl font-extrabold tracking-tight text-white">
          Recibimos tu mensaje.
        </h3>
        <p className="mt-3 text-white/80">
          Gracias por querer construir COMFECO con nosotros. Te contactaremos.
        </p>
      </div>
    );
  }

  if (isDuplicate) {
    return (
      <div
        className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center"
        role="status"
      >
        <h3 className="m-0 font-display text-3xl font-extrabold tracking-tight text-white">
          Ya recibimos un mensaje con este email.
        </h3>
      </div>
    );
  }

  return (
    <form className="relative flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sponsor-name" className="text-sm font-medium text-white">
            Nombre
          </label>
          <input
            id="sponsor-name"
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
          <label htmlFor="sponsor-email" className="text-sm font-medium text-white">
            Email
          </label>
          <input
            id="sponsor-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            required
            disabled={isSubmitting}
            placeholder="tu@empresa.com"
            className={inputStyles}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="organization" className="text-sm font-medium text-white">
          Organización
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
          maxLength={160}
          required
          disabled={isSubmitting}
          placeholder="Empresa, comunidad u organización"
          className={inputStyles}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-white">
          ¿Cómo te gustaría apoyar COMFECO?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={1000}
          required
          disabled={isSubmitting}
          placeholder="Cuéntanos cómo te gustaría participar."
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
        className="mt-1 inline-flex min-h-13 cursor-pointer items-center justify-center rounded-xl border border-gold bg-gold px-8 py-3.5 font-display text-2xl font-bold tracking-wide text-charcoal outline-none transition hover:-translate-y-0.5 hover:bg-yellow focus-visible:ring-3 focus-visible:ring-gold/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Hablar sobre partnerships"}
      </button>

      {errorMessage && (
        <p className="m-0 text-sm font-medium text-yellow" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
