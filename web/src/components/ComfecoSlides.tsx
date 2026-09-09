import { useState, type JSX, type KeyboardEvent } from "react";

const SLIDES = [
  {
    kicker: "01 / 03",
    title: "Construir",
    description:
      "Hackathons y proyectos reales creados junto a otras personas.",
  },
  {
    kicker: "02 / 03",
    title: "Aprender",
    description:
      "Charlas, workshops y mentorías para seguir creciendo en comunidad.",
  },
  {
    kicker: "03 / 03",
    title: "Conectar",
    description:
      "Developers, comunidades y empresas de toda Latinoamérica.",
  },
] as const;

/**
 * Presenta los tres pilares de COMFECO como slides con navegación
 * por botones, indicadores y teclado.
 *
 * @returns Carrusel accesible de una diapositiva a la vez.
 */
export default function ComfecoSlides(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = SLIDES[activeIndex];

  const goTo = (index: number) => {
    const lastIndex = SLIDES.length - 1;
    if (index < 0) {
      setActiveIndex(lastIndex);
      return;
    }
    if (index > lastIndex) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  return (
    <div
      className="mt-10 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="carrusel"
      aria-label="Qué es COMFECO"
    >
      <article
        className="relative overflow-hidden rounded-3xl bg-charcoal px-6 py-12 text-white shadow-[0_1.5rem_4rem_rgba(70,20,111,0.18)] sm:px-12 sm:py-16"
        aria-live="polite"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-purple/70 blur-[110px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-10 size-64 rounded-full bg-gold/25 blur-[110px]"
          aria-hidden="true"
        />

        <div className="relative min-h-56 transition duration-300 sm:min-h-64">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
            {slide.kicker}
          </p>
          <h3 className="mt-4 font-display text-[clamp(3.5rem,12vw,7rem)] font-extrabold leading-[0.9] tracking-tight">
            {slide.title}
          </h3>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
            {slide.description}
          </p>
        </div>
      </article>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-2" role="tablist" aria-label="Diapositivas">
          {SLIDES.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ver ${item.title}`}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full outline-none transition focus-visible:ring-3 focus-visible:ring-violet/40 ${
                index === activeIndex
                  ? "w-8 bg-purple-deep"
                  : "w-2.5 bg-charcoal/25 hover:bg-charcoal/40"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-charcoal/15 bg-white text-lg font-semibold text-charcoal outline-none transition hover:border-purple hover:text-purple focus-visible:ring-3 focus-visible:ring-violet/40"
            aria-label="Diapositiva anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-charcoal/15 bg-white text-lg font-semibold text-charcoal outline-none transition hover:border-purple hover:text-purple focus-visible:ring-3 focus-visible:ring-violet/40"
            aria-label="Diapositiva siguiente"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
