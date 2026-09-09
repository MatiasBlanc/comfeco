import { useState, type FormEvent, type JSX } from "react";

interface ApiResponse {
  message?: string;
}

/**
 * Renderiza la waitlist y registra correos mediante la función de Vercel.
 *
 * @returns Página completa de la waitlist.
 */
export default function App(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
          email: formData.get("email"),
          website: formData.get("website"),
        }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
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

  return (
    <main className="waitlist">
      <div className="particles" aria-hidden="true">
        <span className="particle square particle-1" />
        <span className="particle diamond particle-2" />
        <span className="particle cross particle-3" />
        <span className="particle triangle particle-4" />
        <span className="particle ring particle-5" />
        <span className="particle square particle-6" />
        <span className="particle triangle particle-7" />
        <span className="particle cross particle-8" />
      </div>

      <div className="page-shell">
        <img
          src="/comfeco-imagotipo.png"
          alt="COMFECO — Community Fest and Code"
          width="284"
          height="76"
          className="brand"
        />

        <section className="content" aria-labelledby="waitlist-title">
          <p className="eyebrow">Community Fest and Code</p>
          <h1 id="waitlist-title">
            La comunidad tech de LATAM se vuelve a encontrar.
          </h1>
          <p className="description">
            COMFECO es el punto de encuentro para aprender, crear y conectar
            con developers de toda Latinoamérica a través de conferencias,
            workshops y hackathons.
          </p>

          {isSubmitted ? (
            <p className="success-message" role="status">
              Listo. Te avisaremos cuando haya novedades.
            </p>
          ) : (
            <form className="email-form" onSubmit={handleSubmit}>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
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
              />
              <input
                className="honeypot"
                name="website"
                type="text"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando…" : "Quiero enterarme"}
              </button>
              {errorMessage && (
                <p className="error-message" role="alert">
                  {errorMessage}
                </p>
              )}
            </form>
          )}
        </section>

        <p className="footer-copy">
          Sé de los primeros en enterarte de la próxima edición.
        </p>
      </div>
    </main>
  );
}
