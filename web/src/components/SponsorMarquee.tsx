import type { JSX } from "react";

import { currentSponsors } from "../data/sponsors";

const CONVERSATION_CHIPS = [
  "Empresas",
  "Comunidades",
  "Organizaciones",
] as const;

/**
 * Franja con desplazamiento infinito. Si hay sponsors confirmados muestra
 * sus logos; si no, recuerda que las conversaciones están abiertas.
 *
 * @returns Marquee accesible, pausado al pasar el cursor o con reduced motion.
 */
export default function SponsorMarquee(): JSX.Element {
  const hasConfirmedSponsors = currentSponsors.length > 0;
  const sequence = hasConfirmedSponsors
    ? currentSponsors
    : CONVERSATION_CHIPS.map((label) => ({ name: label, logoSrc: "" }));
  const loop = [...sequence, ...sequence, ...sequence, ...sequence];

  return (
    <div
      className="overflow-hidden border-y border-white/10 py-5"
      aria-label={
        hasConfirmedSponsors
          ? "Sponsors actuales"
          : "Estamos conversando con empresas, comunidades y organizaciones"
      }
    >
      <div className="sponsor-marquee-track flex w-max items-center gap-10 px-5" aria-hidden="true">
        {loop.map((item, index) =>
          item.logoSrc ? (
            <img
              key={`${item.name}-${index}`}
              src={item.logoSrc}
              alt={item.name}
              className="h-10 w-auto max-w-36 object-contain opacity-80"
            />
          ) : (
            <span
              key={`${item.name}-${index}`}
              className="font-display text-3xl font-bold tracking-wide text-white/70"
              aria-hidden={index >= sequence.length}
            >
              {item.name}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
