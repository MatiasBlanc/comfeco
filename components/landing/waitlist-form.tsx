"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

interface ApiResponse {
  ok?: boolean;
  message?: string;
}

/**
 * Muestra el formulario mínimo para registrar un correo en la waitlist.
 *
 * @returns Formulario de correo o confirmación del registro completado.
 */
export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    if (hasStarted) {
      return;
    }

    setHasStarted(true);
    trackEvent(ANALYTICS_EVENTS.waitlistStarted);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email"),
      website: formData.get("website"),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos guardar tu correo.");
      }

      trackEvent(ANALYTICS_EVENTS.waitlistSubmitted);
      setIsSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Algo salió mal. Inténtalo de nuevo.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl border border-[#F4C53A]/40 bg-[#46146F]/55 px-5 py-4 text-[#F3F1F4] backdrop-blur-md"
        role="status"
      >
        <CheckCircle2 className="size-5 shrink-0 text-[#F4C53A]" aria-hidden="true" />
        <p className="font-medium">Listo. Te avisaremos cuando haya novedades.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={handleStart}
      aria-label="Formulario para unirse a la waitlist de COMFECO"
      className="rounded-2xl border border-[#D9D2DD]/30 bg-[#2F2F33]/55 p-2 shadow-2xl shadow-[#46146F]/30 backdrop-blur-md sm:flex"
    >
      <label htmlFor="email" className="sr-only">
        Correo electrónico
      </label>
      <Input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        maxLength={254}
        required
        disabled={isSubmitting}
        placeholder="tu@email.com"
        className="h-12 flex-1 border-transparent bg-transparent px-4 hover:border-transparent focus-visible:border-transparent focus-visible:ring-0 sm:h-13"
      />

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input
          id="website"
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-2 w-full sm:mt-0 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Enviando
          </>
        ) : (
          <>
            Quiero enterarme
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
