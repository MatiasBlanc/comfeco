"use client";

import { useState, type FormEvent, type JSX } from "react";

interface ApiResponse {
  message?: string;
}

/**
 * Registra un correo en la waitlist y muestra el resultado de la operación.
 *
 * @returns Formulario de correo o mensaje de confirmación.
 */
export function WaitlistForm(): JSX.Element {
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

  if (isSubmitted) {
    return (
      <p className="success-message" role="status">
        Listo. Te avisaremos cuando haya novedades.
      </p>
    );
  }

  return (
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
  );
}
