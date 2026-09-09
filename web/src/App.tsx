import type { JSX } from "react";

import ComfecoSlides from "./components/ComfecoSlides";
import SponsorForm from "./components/SponsorForm";
import SponsorMarquee from "./components/SponsorMarquee";
import WaitlistForm from "./components/WaitlistForm";

/**
 * Renderiza la landing pública de COMFECO con hero, propuesta de valor,
 * comunidad, waitlist y sección de sponsors.
 *
 * @returns Página completa de la landing.
 */
export default function App(): JSX.Element {
  return (
    <main className="min-h-svh bg-background font-sans text-charcoal antialiased">
      <header className="sticky top-0 z-10 border-b border-charcoal/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" aria-label="COMFECO — ir al inicio" className="outline-none transition focus-visible:ring-3 focus-visible:ring-violet/40 rounded-lg">
            <img
              src="/brand/logo-horizontal.png"
              alt="COMFECO — Community Fest and Code"
              width="356"
              height="95"
              className="h-9 w-auto"
            />
          </a>
          <nav aria-label="Navegación principal" className="hidden items-center gap-6 text-sm font-medium sm:flex">
            <a href="#comfeco" className="rounded-md outline-none transition hover:text-purple focus-visible:ring-3 focus-visible:ring-violet/40">
              COMFECO
            </a>
            <a href="#comunidad" className="rounded-md outline-none transition hover:text-purple focus-visible:ring-3 focus-visible:ring-violet/40">
              Community
            </a>
            <a href="#waitlist" className="rounded-md outline-none transition hover:text-purple focus-visible:ring-3 focus-visible:ring-violet/40">
              Waitlist
            </a>
          </nav>
          <a
            href="#waitlist"
            className="rounded-xl bg-purple-deep px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-purple focus-visible:ring-3 focus-visible:ring-violet/40"
          >
            Unirme
          </a>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden bg-charcoal text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-purple/60 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-1/3 size-80 rounded-full bg-magenta/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-gold/25 blur-[120px]" aria-hidden="true" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start px-5 py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            Community Fest and Code
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(3rem,9vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight">
            Donde la comunidad tech de LATAM vuelve a encontrarse.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            COMFECO reúne a developers de toda Latinoamérica para{" "}
            <strong className="font-semibold text-white">aprender, construir y conectar</strong>{" "}
            a través de hackathons, workshops, charlas y comunidad.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#waitlist"
              className="inline-flex min-h-13 items-center justify-center rounded-xl bg-gold px-8 py-3 font-display text-2xl font-bold tracking-wide text-charcoal outline-none transition hover:-translate-y-0.5 hover:bg-yellow focus-visible:ring-3 focus-visible:ring-gold/50"
            >
              Quiero estar en COMFECO
            </a>
            <a
              href="#comfeco"
              className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/30 px-8 py-3 font-display text-2xl font-bold tracking-wide text-white outline-none transition hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/40"
            >
              Conocer más
            </a>
          </div>
        </div>
      </section>

      <section id="comfeco" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-5xl px-5 py-20">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-purple-deep sm:text-5xl">
            ¿Qué es COMFECO?
          </h2>
          <ComfecoSlides />
        </div>
      </section>

      <section id="comunidad" className="scroll-mt-20 bg-purple-deep/5">
        <div className="mx-auto w-full max-w-5xl px-5 py-20">
          <h2 className="max-w-2xl font-display text-4xl font-extrabold tracking-tight text-purple-deep sm:text-5xl">
            No queremos diseñar COMFECO solos.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-charcoal/80">
            Queremos saber qué debería tener para que realmente quieras participar.
          </p>
          <a
            href="#waitlist"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-purple-deep px-6 py-3 font-semibold text-white outline-none transition hover:bg-purple focus-visible:ring-3 focus-visible:ring-violet/40"
          >
            Cuéntanos qué esperas
          </a>
        </div>
      </section>

      <section id="waitlist" className="scroll-mt-20">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-purple-deep sm:text-5xl">
              Sé parte de lo que viene.
            </h2>
            <p className="mt-4 text-lg text-charcoal/80">
              Estamos preparando el regreso de COMFECO y queremos construirlo
              junto a la comunidad. Déjanos tus datos y cuéntanos qué te
              gustaría encontrar.
            </p>
          </div>
          <div className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-[0_1.5rem_4rem_rgba(70,20,111,0.08)] sm:p-8">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <section id="sponsors" className="bg-charcoal text-white">
        <SponsorMarquee />
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              ¿Quieres construir COMFECO con nosotros?
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-white/80">
              Estamos comenzando a conversar con empresas, comunidades y
              organizaciones interesadas en apoyar COMFECO.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <SponsorForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-charcoal/10">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <img
            src="/brand/logo-horizontal.png"
            alt="COMFECO"
            width="356"
            height="95"
            className="h-8 w-auto"
            loading="lazy"
          />
          <p className="m-0 text-sm text-charcoal/60">Community Fest and Code</p>
        </div>
      </footer>
    </main>
  );
}
