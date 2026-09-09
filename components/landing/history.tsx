import { ArrowRight } from "lucide-react";

export function History() {
  return (
    <section id="historia" className="section-shell scroll-mt-20">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0e13] px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="history-grid absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="font-mono">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Del archivo de la comunidad
            </p>
            <div className="mt-5 flex items-center gap-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              <span>2021</span>
              <ArrowRight className="size-8 text-cyan-300" aria-hidden="true" />
              <span className="text-cyan-200">¿V2?</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              COMFECO ya pasó una vez.
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg">
              En 2021, developers de la comunidad se reunieron para aprender,
              construir y competir.
            </p>
            <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg">
              Ahora estamos viendo si vale la pena traerlo de vuelta… pero más
              grande y diseñado entre todos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
