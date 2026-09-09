import Link from "next/link";
import { ArrowDown, ArrowRight, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const terminalLines = [
  { key: "status", label: "status", value: "explorando" },
  { key: "region", label: "region", value: "LATAM" },
  { key: "built_with", label: "built_with", value: "comunidad" },
] as const;

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden border-b border-white/[0.06]"
    >
      <div className="hero-grid absolute inset-0 -z-20 opacity-35" />
      <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-cyan-400/[0.055] blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-16 px-5 py-20 sm:px-6 lg:grid-cols-[1.18fr_0.82fr] lg:py-24">
        <div className="max-w-3xl animate-enter">
          <Badge className="mb-7 border-cyan-300/20 bg-cyan-300/[0.06] font-mono text-xs uppercase tracking-[0.14em] text-cyan-200">
            Community Fest and Code
          </Badge>

          <h1 className="text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
            COMFECO podría volver.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-xl leading-8 text-zinc-300 sm:text-2xl">
            Y esta vez queremos construirlo junto a la comunidad.
          </p>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-zinc-500 sm:text-lg">
            Hackathon, conferencias, workshops, mentorías, networking y
            developers de toda LATAM. Todavía estamos diseñándolo. Si quieres
            estar desde el principio, únete y cuéntanos qué evento te gustaría
            vivir.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#waitlist"
              data-analytics-event="hero_waitlist_click"
              className={buttonVariants({ size: "lg" })}
            >
              Quiero estar ahí
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#historia"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Conocí COMFECO 2021
              <ArrowDown className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 font-mono text-xs text-zinc-600">
            Early access · Sin spam · Ayúdanos a diseñar COMFECO V2
          </p>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md animate-enter-delayed lg:block" aria-hidden="true">
          <div className="absolute -inset-8 rounded-full bg-cyan-300/[0.05] blur-3xl" />
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0e13] shadow-2xl shadow-black/40">
            <div className="flex h-11 items-center gap-2 border-b border-white/[0.08] px-4">
              <Circle className="size-2.5 fill-red-400/70 text-red-400/70" />
              <Circle className="size-2.5 fill-amber-300/70 text-amber-300/70" />
              <Circle className="size-2.5 fill-emerald-400/70 text-emerald-400/70" />
              <span className="ml-2 font-mono text-[11px] text-zinc-600">
                comfeco.config.ts
              </span>
            </div>
            <div className="p-6 font-mono text-sm leading-7">
              <p className="text-zinc-500">
                <span className="text-fuchsia-300">const</span>{" "}
                <span className="text-cyan-200">comfecoV2</span> = {"{"}
              </p>
              {terminalLines.map((line) => (
                <p key={line.key} className="pl-5 text-zinc-500">
                  {line.label}:{" "}
                  <span className="text-amber-200">&quot;{line.value}&quot;</span>,
                </p>
              ))}
              <p className="pl-5 text-zinc-500">
                confirmed: <span className="text-fuchsia-300">false</span>,
              </p>
              <p className="text-zinc-500">{"};"}</p>
              <p className="mt-5 text-zinc-600">
                <span className="text-cyan-300">$</span> build --with community
              </p>
              <p className="mt-1 text-zinc-300">
                Esperando tu input
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-cyan-300 align-middle" />
              </p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/[0.08] p-4">
              {[
                "hackathon",
                "talks",
                "workshops",
                "mentoring",
                "people",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-zinc-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
