import { useEffect, useState, type JSX } from "react";

import SimpleLayout from "../components/SimpleLayout";
import SurveyForm from "../components/SurveyForm";
import { readSurveyToken } from "../data/survey";

type SurveyStatus = "loading" | "ready" | "completed" | "invalid" | "error";

interface SurveyLookupResponse {
  status?: SurveyStatus;
  message?: string;
}

/**
 * Página pública `/survey` que valida el token en servidor y no vuelve a
 * pedir el email.
 *
 * @returns Estados de carga, error, éxito o el formulario de discovery.
 */
export default function SurveyPage(): JSX.Element {
  const token = readSurveyToken(window.location.search);
  const [status, setStatus] = useState<SurveyStatus>(token ? "ready" : "invalid");
  const [errorMessage, setErrorMessage] = useState(
    "Este enlace no es válido. Pide uno nuevo al equipo de COMFECO.",
  );

  useEffect(() => {
    document.title = "Encuesta COMFECO";
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const controller = new AbortController();

    const loadSurvey = async () => {
      try {
        const response = await fetch(`/api/survey?token=${encodeURIComponent(token)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as SurveyLookupResponse;

        if (response.status === 409 || data.status === "completed") {
          setStatus("completed");
          return;
        }

        if (!response.ok || data.status !== "ready") {
          setStatus("invalid");
          setErrorMessage(
            data.message ?? "Este enlace no es válido. Pide uno nuevo al equipo de COMFECO.",
          );
          return;
        }

        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No pudimos abrir la encuesta. Inténtalo de nuevo.",
        );
      }
    };

    void loadSurvey();

    return () => controller.abort();
  }, [token]);

  if (status === "loading") {
    return (
      <SimpleLayout title={<>Ayúdanos a construir <span className="text-[#FFD400]">COMFECO</span></>}>
        <p className="m-0 text-charcoal/80" role="status">
          Cargando la encuesta...
        </p>
      </SimpleLayout>
    );
  }

  if (status === "completed") {
    return (
      <SimpleLayout title={<>Ayúdanos a construir <span className="text-[#FFD400]">COMFECO</span></>}>
        <div role="status">
          <h2 className="m-0 font-display text-3xl font-extrabold tracking-tight text-purple-deep">
            Gracias por responder.
          </h2>
          <p className="mt-3 text-charcoal/80">
            Tus respuestas ya están con nosotros. Te avisaremos cuando tengamos novedades.
          </p>
        </div>
      </SimpleLayout>
    );
  }

  if (status === "invalid" || status === "error") {
    return (
      <SimpleLayout title="No pudimos abrir la encuesta">
        <p className="m-0 text-charcoal/80" role="alert">
          {errorMessage}
        </p>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout
      title={<>Ayúdanos a construir <span className="text-[#FFD400]">COMFECO</span></>}
    >
      <SurveyForm token={token} onSuccess={() => setStatus("completed")} />
    </SimpleLayout>
  );
}
